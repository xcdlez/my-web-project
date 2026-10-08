export class TicketType {
  #typeName;
  #price;
  #quota;
  #ticketsIssued = 0;

  constructor(typeName, price, quota) {
    this.#typeName = typeName;
    this.#price = Number(price);
    this.#quota = Number(quota);
  }

  getTypeName() { return this.#typeName; }
  getPrice() { return this.#price; }
  getQuota() { return this.#quota; }
  getTicketsIssued() { return this.#ticketsIssued; }

  getAvailable() {
    return Math.max(0, this.#quota - this.#ticketsIssued);
  }

  isAvailable() {
    return this.#ticketsIssued < this.#quota;
  }

  issueOne() {
    if (!this.isAvailable()) return false;
    this.#ticketsIssued += 1;
    return true;
  }

  toJSON() {
    return {
      typeName: this.#typeName,
      price: this.#price,
      quota: this.#quota,
      ticketsIssued: this.#ticketsIssued,
      available: this.getAvailable()
    };
  }
}