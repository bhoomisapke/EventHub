import uuid

from .models import Ticket


def generate_ticket_number():
    while True:
        ticket_number = f"EVT-{uuid.uuid4().hex[:8].upper()}"

        if not Ticket.objects.filter(ticket_number=ticket_number).exists():
            return ticket_number


def create_ticket(registration):
    ticket, created = Ticket.objects.get_or_create(
        registration=registration,
        defaults={
            "ticket_number": generate_ticket_number(),
            "status": "valid",
        },
    )

    return ticket