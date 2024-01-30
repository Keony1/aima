import { Repository } from "typeorm";
import { ReportRepository } from "../../../application/protocols/database/report-repository";
import {
  ProductReport,
  RestockingNeeds,
} from "../../../domain/entities/product-report";
import { TypeOrmProductReportView } from "../entities/product-report-view";
import { TypeOrmConnection } from "../typeorm-connection";

export class TypeOrmReportRepository implements ReportRepository {
  private readonly repository: Repository<TypeOrmProductReportView>;

  constructor() {
    this.repository = TypeOrmConnection.getInstance()
      .getDataSource()
      .getRepository(TypeOrmProductReportView);
  }

  async summary(demand?: RestockingNeeds): Promise<ProductReport[]> {
    return this.repository.find({ where: { restockingNeeds: demand } });
  }
}
