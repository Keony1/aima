import express, { json, Express } from "express";
import { productRouter } from "../routes/product-routes";
import { reportRouter } from "../routes/report-routes";
import { DataSource } from "typeorm";

function createApp(dataSource: DataSource): Express {
  const router = express.Router();
  router.use(productRouter(dataSource));
  router.use(reportRouter(dataSource));

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createApp };
