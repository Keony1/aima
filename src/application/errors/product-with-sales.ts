export class ProductWithSales extends Error {
  name = "ProductWithSales";
  constructor(id: number) {
    const msg = `Product with id: "${id}" has sales`;
    super(msg);
  }
}
