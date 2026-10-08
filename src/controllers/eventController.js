import { Organizer } from '../models/organizer.js';
import { Attendee } from '../models/attendee.js';
import { CheckInManager } from '../models/checkInManager.js';
import { createId } from '../utils/idGenerator.js';

export class EventController {
  #organizer;
  #attendees = new Map();
  #checkInManager;
  #events = [];

  constructor() {
    this.#organizer = new Organizer(
      'ORG-001',
      'Jamie Watson',
      'jamie@eventpass.demo',
      'EventPass Events Co.'
    );
    this.#checkInManager = new CheckInManager();
  }

  getEvents() { return [...this.#events]; }

  createEvent({ title, date, venue, capacity }) {
    if (!title?.trim() || !date || !capacity || capacity <= 0) {
      throw new Error('Title, date and a positive capacity are required.');
    }
    const event = this.#organizer.createEvent({
      title: title.trim(),
      date,
      venue: venue?.trim() || 'TBA',
      capacity
    });
    this.#events.push(event);
    return event;
  }

  addTicketType(eventId, typeName, price, quota) {
    const event = this.#findEvent(eventId);
    if (!event) throw new Error('Event not found.');
    if (!typeName?.trim() || price < 0 || quota <= 0) {
      throw new Error('Valid type name, non-negative price and positive quota required.');
    }
    return this.#organizer.addTicketTypeToEvent(event, typeName.trim(), price, quota);
  }

  getOrCreateAttendee(name, email) {
    const normalised = email.toLowerCase();
    let attendee = [...this.#attendees.values()].find(
      a => a.getEmail().toLowerCase() === normalised
    );
    if (!attendee) {
      attendee = new Attendee(createId('ATT'), name, email);
      this.#attendees.set(attendee.getId(), attendee);
    }
    return attendee;
  }

  registerAttendee(eventId, ticketTypeName, attendeeName, attendeeEmail) {
    const event = this.#findEvent(eventId);
    if (!event) throw new Error('Event not found.');

    const ticketType = event.findTicketType(ticketTypeName);
    if (!ticketType) {
      throw new Error(`Ticket type "${ticketTypeName}" does not exist for this event.`);
    }

    const attendee = this.getOrCreateAttendee(attendeeName, attendeeEmail);
    const ticket = attendee.register(event, ticketType);
    this.#checkInManager.registerTicket(ticket);
    return ticket;
  }

  checkIn(code) {
    return this.#checkInManager.scanTicket(code);
  }

  getAttendanceCount() {
    return this.#checkInManager.getAttendanceCount();
  }

  getCheckInList() {
    return this.#checkInManager.getCheckInList();
  }

  getEventReport(eventId) {
    const event = this.#findEvent(eventId);
    if (!event) throw new Error('Event not found.');
    return this.#organizer.viewReports(event);
  }

  getDashboardData() {
    return {
      organizer: this.#organizer.toJSON(),
      events: this.#events.map(e => e.toJSON()),
      attendanceCount: this.getAttendanceCount(),
      checkIns: this.getCheckInList()
    };
  }

  #findEvent(eventId) {
    return this.#events.find(e => e.getEventId() === eventId);
  }
}