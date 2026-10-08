import { createId } from '../utils/idGenerator.js';

const STATUS = Object.freeze({
  VALID: 'valid',
  CHECKED_IN: 'checked-in',
  CANCELLED: 'cancelled'
});

export class Ticket {
  #ticketId;
  #qrCode;
  #ticketType;
  #event;
  #attendee;
  #status;
  #createdAt;

  constructor(ticketType, event, attendee) {
    this.#ticketId = createId('TKT');
    this.#ticketType = ticketType;
    this.#event = event;
    this.#attendee = attendee;
    this.#status = STATUS.VALID;
    this.#createdAt = new Date().toISOString();
    this.#qrCode = this.#buildQrPayload();
  }

  #buildQrPayload() {
    return [
      'EVENTPASS',
      this.#ticketId,
      this.#event.getEventId(),
      this.#attendee.getId()
    ].join('|');
  }

  getTicketId() { return this.#ticketId; }
  getQrCode() { return this.#qrCode; }
  getStatus() { return this.#status; }
  getTicketType() { return this.#ticketType; }
  getEvent() { return this.#event; }
  getAttendee() { return this.#attendee; }
  getCreatedAt() { return this.#createdAt; }

  isValidForCheckIn() {
    return this.#status === STATUS.VALID;
  }

  checkIn() {
    if (this.#status === STATUS.CANCELLED) {
      throw new Error('Ticket has been cancelled and cannot be checked in.');
    }
    if (this.#status === STATUS.CHECKED_IN) {
      throw new Error('Ticket has already been used for check-in.');
    }
    this.#status = STATUS.CHECKED_IN;
    return true;
  }

  cancel() {
    if (this.#status === STATUS.CHECKED_IN) {
      throw new Error('Cannot cancel a ticket that has already been checked in.');
    }
    this.#status = STATUS.CANCELLED;
    return true;
  }

  toJSON() {
    return {
      ticketId: this.#ticketId,
      qrCode: this.#qrCode,
      status: this.#status,
      createdAt: this.#createdAt,
      ticketType: this.#ticketType.getTypeName(),
      price: this.#ticketType.getPrice(),
      eventId: this.#event.getEventId(),
      eventTitle: this.#event.getTitle(),
      attendeeId: this.#attendee.getId(),
      attendeeName: this.#attendee.getName()
    };
  }
}