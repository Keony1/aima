import express, { json, Express } from "express";

import productRoutes from "../routes/product-routes";
import reportRoutes from "../routes/report-routes";
import loginRoutes from "../routes/login-routes";
import salesRoutes from "../routes/sales-routes";

function createApp(): Express {
  const router = express.Router();
  router.use(loginRoutes());
  router.use(productRoutes());
  router.use(reportRoutes());
  router.use(salesRoutes());

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createApp };
