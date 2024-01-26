export class ProductNotFound extends Error {
  constructor(id: number) {
    const msg = `Product with id: "${id}" not found`;
    super(msg);
  }
}
