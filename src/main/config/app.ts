import express, { json, Express } from "express";
import { DataSource } from "typeorm";

import { productRouter } from "../routes/product-routes";
import { reportRouter } from "../routes/report-routes";
import { loginRouter } from "../routes/login-routes";

function createApp(dataSource: DataSource): Express {
  const router = express.Router();
  router.use(productRouter(dataSource));
  router.use(reportRouter(dataSource));
  router.use(loginRouter(dataSource));

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createApp };
