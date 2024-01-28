import { ProductReporter } from "../../domain/use-cases";
import {
  ProductReport,
  RestockingNeeds,
} from "../../domain/entities/product-report";
import { ReportRepository } from "../protocols/database/report-repository";

export class ReportImpl implements ProductReporter {
  constructor(private readonly reportRepository: ReportRepository) {}

  async generateReport(demand?: RestockingNeeds): Promise<ProductReport[]> {
    return this.reportRepository.summary(demand);
  }
}
