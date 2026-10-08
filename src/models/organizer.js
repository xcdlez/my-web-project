import { Person } from './person.js';
import { Event } from './event.js';
import { TicketType } from './ticketType.js';
import { createId } from '../utils/idGenerator.js';

export class Organizer extends Person {
  #organization;
  #events = [];

  constructor(id, name, email, organization = '') {
    super(id, name, email);
    this.#organization = organization;
  }

  getOrganization() { return this.#organization; }
  getEvents() { return [...this.#events]; }

  createEvent(data) {
    const event = new Event(
      data.eventId || createId('EVT'),
      data.title,
      data.date,
      data.venue || 'TBA',
      data.capacity
    );
    this.#events.push(event);
    return event;
  }

  addTicketTypeToEvent(event, typeName, price, quota) {
    const ticketType = new TicketType(typeName, price, quota);
    event.addTicketType(ticketType);
    return ticketType;
  }

  cancelEvent(eventId) {
    const index = this.#events.findIndex(e => e.getEventId() === eventId);
    if (index === -1) return false;
    this.#events.splice(index, 1);
    return true;
  }

  viewReports(event) {
    const sold = event.getCapacity() - event.getAvailableSeats();
    return {
      eventId: event.getEventId(),
      title: event.getTitle(),
      capacity: event.getCapacity(),
      available: event.getAvailableSeats(),
      sold,
      ticketTypes: event.getTicketTypes().map(tt => ({
        name: tt.getTypeName(),
        price: tt.getPrice(),
        quota: tt.getQuota(),
        issued: tt.getTicketsIssued(),
        available: tt.getAvailable()
      }))
    };
  }

  toJSON() {
    return {
      ...super.toJSON(),
      organization: this.#organization,
      events: this.#events.map(e => e.toJSON())
    };
  }
}