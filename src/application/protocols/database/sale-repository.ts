import { Sale } from "../../../domain/entities";

export interface SaleRepository {
  byProduct: (productId: number) => Promise<Sale[]>;
  registerSale: (sale: Sale) => Promise<Sale>;
}
