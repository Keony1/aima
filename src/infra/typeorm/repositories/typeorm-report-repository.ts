import { Repository } from "typeorm";
import { ReportRepository } from "../../../application/protocols/database/report-repository";
import {
  ProductReport,
  RestockingNeeds,
} from "../../../domain/entities/product-report";
import { TypeOrmProductReportView } from "../entities/product-report-view";

export class TypeOrmReportRepository implements ReportRepository {
  constructor(
    private readonly repository: Repository<TypeOrmProductReportView>,
  ) {}
  async summary(demand?: RestockingNeeds): Promise<ProductReport[]> {
    return this.repository.find({ where: { restockingNeeds: demand } });
  }
}
