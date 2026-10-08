import { Ticket } from './ticket.js';

export class TicketFactory {
  static createTicket(ticketType, event, attendee) {
    if (!ticketType.isAvailable()) {
      throw new Error(`Ticket type "${ticketType.getTypeName()}" is sold out.`);
    }
    if (!ticketType.issueOne()) {
      throw new Error(`Failed to issue ticket of type "${ticketType.getTypeName()}".`);
    }
    return new Ticket(ticketType, event, attendee);
  }
}