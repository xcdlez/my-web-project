import { Person } from './person.js';
import { TicketFactory } from './ticketFactory.js';

export class Attendee extends Person {
  #registeredTickets = [];

  constructor(id, name, email) {
    super(id, name, email);
  }

  getRegisteredTickets() {
    return [...this.#registeredTickets];
  }

  register(event, ticketType) {
    if (event.getAvailableSeats() <= 0) {
      throw new Error('Event is at full capacity. Registration closed.');
    }
    if (!ticketType.isAvailable()) {
      throw new Error(`Ticket type "${ticketType.getTypeName()}" is sold out.`);
    }

    const ticket = TicketFactory.createTicket(ticketType, event, this);
    this.#registeredTickets.push(ticket);
    event.recordRegistration(ticket);
    return ticket;
  }

  viewMyTickets() {
    return this.#registeredTickets.map(t => t.toJSON());
  }

  cancelTicket(ticketId) {
    const ticket = this.#registeredTickets.find(t => t.getTicketId() === ticketId);
    if (!ticket) throw new Error('Ticket not found for this attendee.');
    ticket.cancel();
    return true;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      registeredTickets: this.#registeredTickets.map(t => t.getTicketId())
    };
  }
}