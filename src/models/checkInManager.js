export class CheckInManager {
  #checkInList = [];
  #ticketsByCode = new Map();

  registerTicket(ticket) {
    this.#ticketsByCode.set(ticket.getTicketId(), ticket);
    this.#ticketsByCode.set(ticket.getQrCode(), ticket);
  }

  scanTicket(code) {
    const ticket = this.#ticketsByCode.get(code.trim());
    if (!ticket) {
      return {
        success: false,
        message: 'Invalid ticket code. Not recognised by the system.'
      };
    }

    try {
      ticket.checkIn();
      const record = {
        ticketId: ticket.getTicketId(),
        checkedInAt: new Date().toISOString(),
        attendeeName: ticket.getAttendee().getName(),
        eventTitle: ticket.getEvent().getTitle()
      };
      this.#checkInList.push(record);
      return {
        success: true,
        message: `Welcome, ${record.attendeeName}! Checked in successfully.`,
        ticket: ticket.toJSON(),
        record
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  getAttendanceCount() { return this.#checkInList.length; }
  getCheckInList() { return [...this.#checkInList]; }
}