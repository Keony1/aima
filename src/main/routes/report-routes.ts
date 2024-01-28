import express, { Router } from "express";
import { DataSource } from "typeorm";
import { ReportController } from "../controllers/report-controller";
import { ReportImpl } from "../../application/use-cases/report-impl";
import { TypeOrmReportRepository } from "../../infra/typeorm/repositories/typeorm-report-repository";
import { TypeOrmProductReportView } from "../../infra/typeorm/entities/product-report-view";

export function reportRouter(conn: DataSource): Router {
  const typeOrmRepo = new TypeOrmReportRepository(
    conn.getRepository(TypeOrmProductReportView),
  );

  const reporter = new ReportImpl(typeOrmRepo);
  const controller = new ReportController(reporter);

  const router = express.Router();
  router.get("/report", controller.getAll.bind(controller));

  return router;
}
