import os
import uuid
from io import BytesIO

from PIL import Image, ImageDraw, ImageFont

from django.conf import settings
from django.core.files.base import ContentFile


# ============================================================
# CERTIFICATE CANVAS
# ============================================================

PAGE_WIDTH = 1536
PAGE_HEIGHT = 1024

NAVY = (17, 55, 100)
GOLD = (196, 145, 35)


# ============================================================
# FONT
# ============================================================

def get_font(size, bold=False, italic=False):

    if bold:
        font_paths = [
            r"C:\Windows\Fonts\georgiab.ttf",
            r"C:\Windows\Fonts\timesbd.ttf",
        ]

    elif italic:
        font_paths = [
            r"C:\Windows\Fonts\georgiai.ttf",
            r"C:\Windows\Fonts\timesi.ttf",
        ]

    else:
        font_paths = [
            r"C:\Windows\Fonts\georgia.ttf",
            r"C:\Windows\Fonts\times.ttf",
        ]

    for path in font_paths:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)

    return ImageFont.load_default()


# ============================================================
# FIT TEXT INSIDE AVAILABLE WIDTH
# ============================================================

def fit_font(
    text,
    max_width,
    starting_size,
    bold=False,
    italic=False
):

    size = starting_size

    while size >= 16:

        font = get_font(
            size,
            bold=bold,
            italic=italic
        )

        bbox = font.getbbox(text)

        width = bbox[2] - bbox[0]

        if width <= max_width:
            return font

        size -= 2

    return get_font(
        16,
        bold=bold,
        italic=italic
    )


# ============================================================
# CENTER TEXT
# ============================================================

def draw_centered_text(
    draw,
    text,
    y,
    font,
    fill=NAVY,
    center_x=PAGE_WIDTH // 2
):

    bbox = draw.textbbox(
        (0, 0),
        text,
        font=font
    )

    text_width = bbox[2] - bbox[0]

    x = center_x - (text_width // 2)

    draw.text(
        (x, y),
        text,
        font=font,
        fill=fill
    )


# ============================================================
# ADD IMAGE WITHOUT DISTORTION
# ============================================================

def add_image_contain(
    base_image,
    image_file,
    x,
    y,
    width,
    height
):

    if not image_file:
        return

    try:

        image_file.open("rb")

        image = Image.open(
            image_file
        ).convert("RGBA")

        image.thumbnail(
            (width, height),
            Image.Resampling.LANCZOS
        )

        px = x + (
            width - image.width
        ) // 2

        py = y + (
            height - image.height
        ) // 2

        base_image.alpha_composite(
            image,
            (px, py)
        )

    except Exception as error:

        print(
            "Certificate image error:",
            error
        )


# ============================================================
# REMOVE WHITE BACKGROUND FROM SIGNATURE
# ============================================================

def make_white_transparent(image):

    image = image.convert("RGBA")

    pixels = image.load()

    for y in range(image.height):

        for x in range(image.width):

            r, g, b, a = pixels[x, y]

            if (
                r > 238
                and g > 238
                and b > 238
            ):
                pixels[x, y] = (
                    r,
                    g,
                    b,
                    0
                )

    return image


# ============================================================
# ADD SIGNATURE
# ============================================================

def add_signature(
    base_image,
    signature_file,
    x,
    y,
    width,
    height
):

    if not signature_file:
        return

    try:

        signature_file.open("rb")

        signature = Image.open(
            signature_file
        ).convert("RGBA")

        signature = make_white_transparent(
            signature
        )

        signature.thumbnail(
            (width, height),
            Image.Resampling.LANCZOS
        )

        px = x + (
            width - signature.width
        ) // 2

        py = y + (
            height - signature.height
        ) // 2

        base_image.alpha_composite(
            signature,
            (px, py)
        )

    except Exception as error:

        print(
            "Signature error:",
            error
        )


# ============================================================
# CERTIFICATE NUMBER
# ============================================================

def generate_certificate_number():

    return (
        "EVH-"
        + uuid.uuid4().hex[:10].upper()
    )


# ============================================================
# GENERATE CERTIFICATE
# ============================================================

def generate_certificate_pdf(certificate):

    event = certificate.event

    # ========================================================
    # CONFIGURATION
    # ========================================================

    try:
        config = event.certificate_configuration

    except Exception:
        config = None

    # ========================================================
    # BACKGROUND
    #
    # This image must contain ONLY the design:
    # borders, ribbons, medal, watermark and decorative lines.
    #
    # It should NOT contain dynamic text.
    # ========================================================

    template_path = os.path.join(
        settings.BASE_DIR,
        "certificates",
        # "assets",
        "certificate_background.png"
    )

    if not os.path.exists(template_path):

        raise FileNotFoundError(
            "Certificate background not found:\n"
            + template_path
        )

    base = Image.open(
        template_path
    ).convert("RGBA")

    base = base.resize(
        (
            PAGE_WIDTH,
            PAGE_HEIGHT
        ),
        Image.Resampling.LANCZOS
    )

    draw = ImageDraw.Draw(base)

    # ========================================================
    # EVENT / CERTIFICATE DATA
    # ========================================================

    institute_name = ""

    # IMPORTANT:
    # No default department.
    department_name = ""

    event_title = event.title

    event_type = event.category or ""

    event_venue = event.venue or ""

    event_date = event.date.strftime(
        "%d %B %Y"
    )

    coordinator_name = ""

    coordinator_designation = (
        "Event Coordinator"
    )

    head_name = ""

    head_designation = (
        "Head of Department"
    )

    # ========================================================
    # LOAD ORGANIZER CUSTOMIZATION
    # ========================================================

    if config:

        institute_name = (
            config.institute_name or ""
        ).strip()

        # ----------------------------------------------------
        # Department comes ONLY from organizer input.
        # ----------------------------------------------------

        department_name = (
            config.department_name or ""
        ).strip()

        event_title = (
            config.event_title
            or event.title
        ).strip()

        event_type = (
            config.event_type
            or event.category
            or ""
        ).strip()

        event_venue = (
            config.event_venue
            or event.venue
            or ""
        ).strip()

        if config.event_date:

            event_date = (
                config.event_date.strftime(
                    "%d %B %Y"
                )
            )

        coordinator_name = (
            config.coordinator_name
            or ""
        ).strip()

        coordinator_designation = (
            config.coordinator_designation
            or "Event Coordinator"
        ).strip()

        head_name = (
            config.head_name
            or ""
        ).strip()

        head_designation = (
            config.head_designation
            or "Head of Department"
        ).strip()

    # ========================================================
    # 1. INSTITUTE NAME
    #
    # Kept slightly above the decorative line in the
    # background so there is visible breathing space.
    # ========================================================

    if institute_name:

        institute_font = fit_font(
            institute_name,
            850,
            44,
            bold=True
        )

        draw_centered_text(
            draw,
            institute_name,
            50,
            institute_font,
            NAVY
        )

    # ========================================================
    # 2. CERTIFICATE HEADING
    # ========================================================

    heading = (
        config.certificate_heading
        if config and config.certificate_heading
        else "CERTIFICATE"
    )

    subheading = (
        config.certificate_subheading
        if config and config.certificate_subheading
        else "OF PARTICIPATION"
    )

    heading_font = fit_font(
        heading.upper(),
        750,
        60,
        bold=True
    )

    draw_centered_text(
        draw,
        heading.upper(),
        135,
        heading_font,
        NAVY
    )

    subheading_font = fit_font(
        subheading.upper(),
        600,
        29,
        bold=True
    )

    draw_centered_text(
        draw,
        subheading.upper(),
        210,
        subheading_font,
        GOLD
    )

    # ========================================================
    # 3. PRESENTED TO
    # ========================================================

    presentation_text = (
        config.presentation_text
        if config and config.presentation_text
        else "THIS CERTIFICATE IS PROUDLY PRESENTED TO"
    )

    presentation_font = fit_font(
        presentation_text.upper(),
        700,
        19
    )

    draw_centered_text(
        draw,
        presentation_text.upper(),
        292,
        presentation_font,
        NAVY
    )

    # ========================================================
    # 4. STUDENT NAME
    #
    # The gold lines are already part of the background.
    # Do NOT draw additional lines here.
    # ========================================================

    student_name = (
        certificate.student_name
        or certificate.student.name
        or ""
    ).strip()

    student_font = fit_font(
        student_name,
        750,
        56,
        italic=True
    )

    # Move the name slightly DOWN so the existing
    # background lines sit correctly underneath it.
    draw_centered_text(
        draw,
        student_name,
        385,
        student_font,
        NAVY
    )

    # ========================================================
    # 5. PARTICIPATION SENTENCE
    # ========================================================

    participation_text = (
        config.participation_text
        if config and config.participation_text
        else "for actively participating in the event"
    )

    participation_text = participation_text.strip()

    event_line = (
        f'{participation_text} "{event_title}"'
    )

    event_font = fit_font(
        event_line,
        950,
        23
    )

    draw_centered_text(
        draw,
        event_line,
        465,
        event_font,
        NAVY
    )
    

    # ========================================================
    # 6. ORGANIZED BY DEPARTMENT
    #
    # IMPORTANT:
    # If department is blank, NOTHING is displayed.
    #
    # There is NO default department.
    # ========================================================
    if department_name:

        organized_text = (
            f"organized by the {department_name}."
        )

        organized_font = fit_font(
            organized_text,
            950,
            23
        )

        draw_centered_text(
            draw,
            organized_text,
            503,
            organized_font,
            NAVY
        )

    # ========================================================
    # 7. APPRECIATION TEXT
    #
    # Position changes depending on whether the department
    # line exists, so there is no awkward empty/overlapping
    # space.
    # ========================================================

    if department_name:

        appreciation_y_1 = 545
        appreciation_y_2 = 578

    else:

        appreciation_y_1 = 515
        appreciation_y_2 = 548

    appreciation_font = get_font(21)

    draw_centered_text(
        draw,
        "Your enthusiasm, commitment and active involvement",
        appreciation_y_1,
        appreciation_font,
        NAVY
    )

    draw_centered_text(
        draw,
        "made the event a great success.",
        appreciation_y_2,
        appreciation_font,
        NAVY
    )

    # ========================================================
    # 8. EVENT INFORMATION
    #
    # No separator lines are drawn by Python.
    # ========================================================

    event_info_y_title = (
        635
        if department_name
        else 605
    )

    event_info_y_value = (
        668
        if department_name
        else 638
    )

    # ---------------- DATE ----------------

    draw.text(
        (385, event_info_y_title),
        "Date",
        font=get_font(
            18,
            bold=True
        ),
        fill=NAVY
    )

    date_font = fit_font(
        event_date,
        220,
        19
    )

    draw.text(
        (385, event_info_y_value),
        event_date,
        font=date_font,
        fill=NAVY
    )

    # ---------------- VENUE ----------------

    draw.text(
        (720, event_info_y_title),
        "Venue",
        font=get_font(
            18,
            bold=True
        ),
        fill=NAVY
    )

    venue_font = fit_font(
        event_venue,
        220,
        19
    )

    draw.text(
        (720, event_info_y_value),
        event_venue,
        font=venue_font,
        fill=NAVY
    )

    # ---------------- EVENT TYPE ----------------

    draw.text(
        (1040, event_info_y_title),
        "Event Type",
        font=get_font(
            18,
            bold=True
        ),
        fill=NAVY
    )

    type_font = fit_font(
        event_type,
        220,
        19
    )

    draw.text(
        (1040, event_info_y_value),
        event_type,
        font=type_font,
        fill=NAVY
    )

    # ========================================================
    # 9. COORDINATOR SIGNATURE
    #
    # The signature is placed ABOVE the existing background
    # line. Python does NOT draw another line.
    # ========================================================

    add_signature(
        base,
        config.coordinator_signature
        if config
        else None,
        250,
        745,
        300,
        85
    )

    # ========================================================
    # COORDINATOR DESIGNATION
    # ========================================================

    coordinator_designation_font = fit_font(
        coordinator_designation,
        300,
        18,
        bold=True
    )

    draw_centered_text(
        draw,
        coordinator_designation,
        865,
        coordinator_designation_font,
        NAVY,
        center_x=400
    )

    if coordinator_name:

        coordinator_name_font = fit_font(
            coordinator_name,
            300,
            16
        )

        draw_centered_text(
            draw,
            coordinator_name,
            898,
            coordinator_name_font,
            NAVY,
            center_x=400
        )

    # ========================================================
    # 10. HEAD SIGNATURE
    # ========================================================

    add_signature(
        base,
        config.head_signature
        if config
        else None,
        990,
        745,
        300,
        85
    )

    # ========================================================
    # HEAD DESIGNATION
    # ========================================================

    head_designation_font = fit_font(
        head_designation,
        300,
        18,
        bold=True
    )

    draw_centered_text(
        draw,
        head_designation,
        865,
        head_designation_font,
        NAVY,
        center_x=1140
    )

    if head_name:

        head_name_font = fit_font(
            head_name,
            300,
            16
        )

        draw_centered_text(
            draw,
            head_name,
            898,
            head_name_font,
            NAVY,
            center_x=1140
        )

    # ========================================================
    # 11. INSTITUTE LOGO
    # ========================================================

    if config and config.institute_logo:

        add_image_contain(
            base,
            config.institute_logo,
            120,
            55,
            190,
            190
        )

    # ========================================================
    # 12. SPONSOR LOGO
    # ========================================================

    if config and config.sponsor_logo:

        add_image_contain(
            base,
            config.sponsor_logo,
            1260,
            65,
            150,
            130
        )

    # ========================================================
    # 13. SAVE PDF
    # ========================================================

    pdf_buffer = BytesIO()

    base.convert("RGB").save(
        pdf_buffer,
        format="PDF",
        resolution=150.0
    )

    pdf_buffer.seek(0)

    filename = (
        f"{certificate.certificate_number}.pdf"
    )

    certificate.certificate_file.save(
        filename,
        ContentFile(
            pdf_buffer.getvalue()
        ),
        save=True
    )

    return certificate