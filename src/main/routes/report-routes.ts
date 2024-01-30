import express, { Router } from "express";
import { ReportController } from "../controllers/report-controller";
import { ReportImpl } from "../../application/use-cases/report-impl";
import { TypeOrmReportRepository } from "../../infra/typeorm/repositories/typeorm-report-repository";
import { auth } from "../middlewares/auth";

export default function (): Router {
  const typeOrmRepo = new TypeOrmReportRepository();

  const reporter = new ReportImpl(typeOrmRepo);
  const controller = new ReportController(reporter);

  const router = express.Router();
  router.get("/report", auth, controller.getAll.bind(controller));

  return router;
}
