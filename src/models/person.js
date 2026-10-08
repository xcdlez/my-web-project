export class Person {
  #id;
  #name;
  #email;

  constructor(id, name, email) {
    if (new.target === Person) {
      throw new Error('Person is abstract and cannot be instantiated directly.');
    }
    this.#id = id;
    this.#name = name;
    this.#email = email;
  }

  getId() { return this.#id; }
  getName() { return this.#name; }
  getEmail() { return this.#email; }
  getContactInfo() { return this.#email; }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      type: this.constructor.name
    };
  }
}