import { EventController } from './controllers/eventController.js';

const app = new EventController();

// 1. Create event
const event = app.createEvent({
  title: 'Tech Conference 2026',
  date: '2026-11-20',
  venue: 'Melbourne Convention Centre',
  capacity: 100
});

// 2. Add ticket types
app.addTicketType(event.getEventId(), 'General', 45, 70);
app.addTicketType(event.getEventId(), 'VIP', 120, 20);
app.addTicketType(event.getEventId(), 'Early-Bird', 30, 10);

// 3. Register attendee
const ticket = app.registerAttendee(
  event.getEventId(),
  'General',
  'Danny Baldwin',
  'danny@example.com'
);
console.log(ticket.getTicketId());   // e.g. TKT-...
console.log(ticket.getQrCode());     // EVENTPASS|TKT-...|EVT-...|ATT-...

// 4. Check-in
const result = app.checkIn(ticket.getTicketId());
console.log(result.success, result.message);

// 5. Report
console.log(app.getEventReport(event.getEventId()));