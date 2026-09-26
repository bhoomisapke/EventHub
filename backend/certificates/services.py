import os
import uuid
from io import BytesIO

from django.conf import settings

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    Image = None
    ImageDraw = None
    ImageFont = None

from .models import Certificate


# ============================================================
# EVENTHUB CERTIFICATE DESIGN
#
# The supplied certificate image is used as the visual template.
# This is intentional: it keeps the generated PDF visually the
# same as the approved design instead of trying to redraw a
# screenshot with approximate ReportLab shapes.
#
# Put the supplied image in the SAME folder as services.py and
# name it:
#
#     certificate_template.png
#
# The generator then covers only the variable placeholder text
# and writes the real student's/event's data over the template.
# ============================================================

PAGE_W, PAGE_H = landscape(A4)
TEMPLATE_W = 1491.0
TEMPLATE_H = 1055.0

NAVY = colors.HexColor("#123A68")
DARK_NAVY = colors.HexColor("#0B2F5B")
GOLD = colors.HexColor("#C69A3A")
WHITE = colors.white
TEMPLATE_BG = colors.HexColor("#F7F7F5")


# ============================================================
# CERTIFICATE NUMBER
# ============================================================

def generate_certificate_number():
    while True:
        number = f"EVH-CERT-{uuid.uuid4().hex[:8].upper()}"

        if not Certificate.objects.filter(
            certificate_number=number
        ).exists():
            return number


# ============================================================
# TEMPLATE LOCATION
# ============================================================

def _template_candidates():
    """Return possible locations for the supplied certificate image."""

    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = str(getattr(settings, "BASE_DIR", ""))
    media_root = str(getattr(settings, "MEDIA_ROOT", ""))

    return [
        os.path.join(current_dir, "certificate_template.png"),
        os.path.join(current_dir, "cert event.png"),
        os.path.join(base_dir, "certificate_template.png"),
        os.path.join(base_dir, "cert event.png"),
        os.path.join(media_root, "certificate_template.png"),
        os.path.join(media_root, "cert event.png"),
    ]


def _get_template_path():
    for path in _template_candidates():
        if path and os.path.isfile(path):
            return path

    raise FileNotFoundError(
        "Certificate template image was not found. "
        "Copy the supplied certificate image to the certificates app "
        "folder and name it 'certificate_template.png'."
    )


# ============================================================
# SCRIPT FONT
# ============================================================

def _get_script_font_path():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(
            current_dir,
            "certificate_fonts",
            "LobsterTwo-Regular.otf",
        ),
        os.path.join(
            current_dir,
            "LobsterTwo-Regular.otf",
        ),
    ]

    for path in candidates:
        if os.path.isfile(path):
            return path

    return None


SCRIPT_FONT_PATH = _get_script_font_path()


# ============================================================
# BASIC DRAWING HELPERS
# ============================================================

def _pdf_x(image_x):
    return image_x * PAGE_W / TEMPLATE_W


def _pdf_y_from_top(image_y):
    return PAGE_H - (image_y * PAGE_H / TEMPLATE_H)


def _rect_from_image_coords(x1, y1, x2, y2):
    """Convert top-left image coordinates to PDF coordinates."""

    left = _pdf_x(x1)
    right = _pdf_x(x2)
    top = _pdf_y_from_top(y1)
    bottom = _pdf_y_from_top(y2)

    return left, bottom, right - left, top - bottom


def _cover(pdf, x1, y1, x2, y2):
    """Cover template placeholder text with the template's white background."""

    x, y, width, height = _rect_from_image_coords(
        x1, y1, x2, y2
    )

    pdf.saveState()
    pdf.setFillColor(TEMPLATE_BG)
    pdf.setStrokeColor(TEMPLATE_BG)
    pdf.rect(
        x,
        y,
        width,
        height,
        fill=1,
        stroke=0,
    )
    pdf.restoreState()


def _center_text(
    pdf,
    text,
    image_y,
    font="Helvetica",
    size=10,
    color=NAVY,
):
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    pdf.drawCentredString(
        PAGE_W / 2,
        _pdf_y_from_top(image_y),
        str(text),
    )


def _center_text_at_image_x(
    pdf,
    text,
    image_x,
    image_y,
    font="Helvetica",
    size=10,
    color=NAVY,
):
    pdf.setFont(font, size)
    pdf.setFillColor(color)
    pdf.drawCentredString(
        _pdf_x(image_x),
        _pdf_y_from_top(image_y),
        str(text),
    )


def _draw_mixed_centered(pdf, parts, image_y):
    """
    Draw a centered line made of several differently styled pieces.

    parts: [(text, font, size, color), ...]
    """

    widths = [
        pdf.stringWidth(str(text), font, size)
        for text, font, size, color in parts
    ]

    total_width = sum(widths)
    cursor = PAGE_W / 2 - total_width / 2
    y = _pdf_y_from_top(image_y)

    for (text, font, size, color), width in zip(parts, widths):
        pdf.setFont(font, size)
        pdf.setFillColor(color)
        pdf.drawString(cursor, y, str(text))
        cursor += width


def _fit_font_size(
    pdf,
    text,
    font,
    start_size,
    min_size,
    max_width,
):
    size = start_size

    while size > min_size:
        if pdf.stringWidth(str(text), font, size) <= max_width:
            break
        size -= 0.5

    return max(size, min_size)


# ============================================================
# EVENT DATA HELPERS
# ============================================================

def _get_event_date(certificate):
    event = getattr(certificate, "event", None)
    value = getattr(event, "date", None)

    if not value:
        return "—"

    try:
        return value.strftime("%d %B %Y")
    except Exception:
        return str(value)


def _get_event_venue(certificate):
    event = getattr(certificate, "event", None)
    value = getattr(event, "venue", None)
    return str(value or "Seminar Hall")


def _get_event_type(certificate):
    event = getattr(certificate, "event", None)

    value = (
        getattr(event, "category", None)
        or getattr(event, "event_type", None)
        or "Cultural"
    )

    if hasattr(value, "name"):
        value = value.name

    return str(value)


# ============================================================
# MAIN CERTIFICATE GENERATOR
# ============================================================

def generate_certificate_pdf(certificate):
    """
    Generate one certificate PDF using the supplied EventHub
    certificate design as the exact visual background.

    This function works for every Certificate object, so the same
    design is automatically used for every eligible student.
    """

    width, height = PAGE_W, PAGE_H

    template_path = _get_template_path()

    file_name = f"{certificate.certificate_number}.pdf"

    file_path = os.path.join(
        settings.MEDIA_ROOT,
        "certificates",
        file_name,
    )

    os.makedirs(
        os.path.dirname(file_path),
        exist_ok=True,
    )

    pdf = canvas.Canvas(
        file_path,
        pagesize=(width, height),
    )

    # --------------------------------------------------------
    # 1. DRAW THE ORIGINAL DESIGN
    # --------------------------------------------------------

    pdf.drawImage(
        ImageReader(template_path),
        0,
        0,
        width=width,
        height=height,
        preserveAspectRatio=False,
        mask="auto",
    )

    # --------------------------------------------------------
    # 2. STUDENT NAME
    # --------------------------------------------------------
    # Reference placeholder occupies approximately this area.
    # The gold underline is redrawn after the name is replaced.

    _cover(
        pdf,
        350,
        390,
        1140,
        525,
    )

    student_name = (
        getattr(certificate, "student_name", None)
        or "Student Name"
    )

    student_name = str(student_name).strip()

    name_font_size = _fit_font_size(
        pdf,
        student_name,
        "Times-Italic",
        start_size=38,
        min_size=22,
        max_width=_pdf_x(590),
    )

    _center_text(
        pdf,
        student_name,
        489,
        font="Times-Italic",
        size=name_font_size,
        color=NAVY,
    )

    # Recreate the gold underline and center diamond from the template.
    line_y = _pdf_y_from_top(512)
    pdf.setStrokeColor(GOLD)
    pdf.setLineWidth(0.8)
    pdf.line(_pdf_x(378), line_y, _pdf_x(1110), line_y)

    diamond_x = PAGE_W / 2
    diamond_size = 3.7
    path = pdf.beginPath()
    path.moveTo(diamond_x, line_y + diamond_size)
    path.lineTo(diamond_x + diamond_size, line_y)
    path.lineTo(diamond_x, line_y - diamond_size)
    path.lineTo(diamond_x - diamond_size, line_y)
    path.close()
    pdf.setFillColor(GOLD)
    pdf.drawPath(path, fill=1, stroke=0)

    # --------------------------------------------------------
    # 3. EVENT TITLE
    # --------------------------------------------------------
    # Replace only the dynamic first statement while keeping the
    # original second line and the rest of the approved design.

    _cover(
        pdf,
        300,
        530,
        1190,
        635,
    )

    event_title = (
        getattr(certificate, "event_title", None)
        or "Event Title"
    )
    event_title = str(event_title).strip()

    first_part = "for actively participating in the event “"
    last_part = "”"

    title_font = "Helvetica-Bold"
    normal_font = "Helvetica"

    max_title_width = _pdf_x(700)

    # First try the complete sentence at 9.4 pt.
    title_size = 9.4

    while title_size > 6.5:
        total = (
            pdf.stringWidth(first_part, normal_font, title_size)
            + pdf.stringWidth(event_title, title_font, title_size)
            + pdf.stringWidth(last_part, title_font, title_size)
        )

        if total <= max_title_width:
            break

        title_size -= 0.25

    _draw_mixed_centered(
        pdf,
        [
            (first_part, normal_font, title_size, NAVY),
            (event_title, title_font, title_size, NAVY),
            (last_part, title_font, title_size, NAVY),
        ],
        565,
    )

    # Keep the exact approved second line.
    _center_text(
        pdf,
        "organized by EventHub, College Events.",
        594,
        font="Helvetica",
        size=9.0,
        color=NAVY,
    )

    # --------------------------------------------------------
    # 4. EVENT DETAILS
    # --------------------------------------------------------
    # Mask only the values, leaving the original icons, labels,
    # separators and surrounding design untouched.

    _cover(pdf, 410, 705, 620, 775)
    _cover(pdf, 680, 705, 820, 775)
    _cover(pdf, 960, 705, 1080, 775)

    _center_text_at_image_x(
        pdf, "Date", 474, 718, font="Helvetica-Bold", size=7.2, color=NAVY
    )
    _center_text_at_image_x(
        pdf, "Venue", 752, 718, font="Helvetica-Bold", size=7.2, color=NAVY
    )
    _center_text_at_image_x(
        pdf, "Event Type", 1005, 718, font="Helvetica-Bold", size=7.2, color=NAVY
    )

    event_date = _get_event_date(certificate)
    event_venue = _get_event_venue(certificate)
    event_type = _get_event_type(certificate)

    # Date
    date_size = _fit_font_size(
        pdf,
        event_date,
        "Helvetica",
        7.4,
        6.0,
        _pdf_x(138),
    )

    _center_text_at_image_x(
        pdf,
        event_date,
        476,
        746,
        font="Helvetica",
        size=date_size,
        color=NAVY,
    )

    # Venue
    venue_size = _fit_font_size(
        pdf,
        event_venue,
        "Helvetica",
        7.4,
        5.7,
        _pdf_x(112),
    )

    # Venue is not page-centered; it is centered in its original
    # template column.
    pdf.setFont("Helvetica", venue_size)
    pdf.setFillColor(NAVY)
    pdf.drawCentredString(
        _pdf_x(752),
        _pdf_y_from_top(746),
        event_venue,
    )

    # Event type
    type_size = _fit_font_size(
        pdf,
        event_type,
        "Helvetica",
        7.4,
        5.7,
        _pdf_x(105),
    )

    pdf.setFont("Helvetica", type_size)
    pdf.setFillColor(NAVY)
    pdf.drawCentredString(
        _pdf_x(1005),
        _pdf_y_from_top(746),
        event_type,
    )

    # --------------------------------------------------------
    # 5. FINALIZE PDF
    # --------------------------------------------------------

    pdf.showPage()
    pdf.save()

    # --------------------------------------------------------
    # 6. SAVE FILE PATH TO MODEL
    # --------------------------------------------------------

    relative_path = os.path.join(
        "certificates",
        file_name,
    )

    certificate.certificate_file.name = (
        relative_path.replace("\\", "/")
    )

    certificate.save(
        update_fields=["certificate_file"]
    )

    return certificate.certificate_file.url
