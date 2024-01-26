export class ProductExistsError extends Error {
  name = "ProductExistsError";
  constructor(name?: string) {
    const msg = `Product with name "${name}" already exists.`;
    super(msg);
  }
}
