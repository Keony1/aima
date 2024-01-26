export class ProductNotFound extends Error {
  name = "ProductNotFound";
  constructor(id: number) {
    const msg = `Product with id: "${id}" not found`;
    super(msg);
  }
}

export class SupplierNotFound extends Error {
  name = "SupplierNotFound";
  constructor(id: number) {
    const msg = `Supplier with id: "${id}" not found`;
    super(msg);
  }
}
