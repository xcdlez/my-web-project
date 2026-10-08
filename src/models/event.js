export class Event {
  #eventId;
  #title;
  #date;
  #venue;
  #capacity;
  #ticketTypes = [];
  #registrations = [];

  constructor(eventId, title, date, venue, capacity) {
    this.#eventId = eventId;
    this.#title = title;
    this.#date = date;
    this.#venue = venue;
    this.#capacity = Number(capacity);
  }

  getEventId() { return this.#eventId; }
  getTitle() { return this.#title; }
  getDate() { return this.#date; }
  getVenue() { return this.#venue; }
  getCapacity() { return this.#capacity; }
  getTicketTypes() { return [...this.#ticketTypes]; }
  getRegistrations() { return [...this.#registrations]; }

  getAvailableSeats() {
    const active = this.#registrations.filter(t => t.getStatus() !== 'cancelled').length;
    return Math.max(0, this.#capacity - active);
  }

  addTicketType(ticketType) {
    this.#ticketTypes.push(ticketType);
  }

  findTicketType(typeName) {
    const needle = typeName.toLowerCase();
    return this.#ticketTypes.find(tt => tt.getTypeName().toLowerCase() === needle);
  }

  recordRegistration(ticket) {
    if (this.getAvailableSeats() <= 0) {
      throw new Error('Cannot register: event capacity reached.');
    }
    this.#registrations.push(ticket);
  }

  toJSON() {
    const active = this.#registrations.filter(t => t.getStatus() !== 'cancelled').length;
    return {
      eventId: this.#eventId,
      title: this.#title,
      date: this.#date,
      venue: this.#venue,
      capacity: this.#capacity,
      availableSeats: this.getAvailableSeats(),
      ticketTypes: this.#ticketTypes.map(tt => tt.toJSON()),
      registrationCount: active
    };
  }

  static fromJSON(data) {
    return new Event(data.eventId, data.title, data.date, data.venue, data.capacity);
  }
}