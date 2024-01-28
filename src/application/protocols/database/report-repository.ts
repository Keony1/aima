import {
  ProductReport,
  RestockingNeeds,
} from "../../../domain/entities/product-report";

export interface ReportRepository {
  summary(demand?: RestockingNeeds): Promise<ProductReport[]>;
}
