import { Sale } from "../entities";

export interface SalesRegistrator {
  registerSale: (sale: Sale) => Promise<Sale>;
}
