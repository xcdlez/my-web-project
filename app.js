import { EventController } from './controllers/eventController.js';

const controller = new EventController();

document.getElementById('form-create-event')?.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const event = controller.createEvent({
      title: document.getElementById('evt-title').value,
      date: document.getElementById('evt-date').value,
      venue: document.getElementById('evt-venue').value,
      capacity: Number(document.getElementById('evt-capacity').value)
    });
    alert(`Created: ${event.getTitle()} (${event.getEventId()})`);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('form-register')?.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const ticket = controller.registerAttendee(
      document.getElementById('reg-event').value,
      document.getElementById('reg-ticket-type').value,
      document.getElementById('reg-name').value,
      document.getElementById('reg-email').value
    );
    alert(`Ticket: ${ticket.getTicketId()}\nQR: ${ticket.getQrCode()}`);
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById('form-checkin')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const result = controller.checkIn(document.getElementById('ci-code').value);
  alert(result.message);
});