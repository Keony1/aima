import { ProductReport, RestockingNeeds } from "../entities/product-report";

export interface ProductReporter {
  generateReport: (demand?: RestockingNeeds) => Promise<ProductReport[]>;
}
