import express, { json, Express } from "express";
import swaggerUi from "swagger-ui-express";

import productRoutes from "../routes/product-routes";
import reportRoutes from "../routes/report-routes";
import loginRoutes from "../routes/login-routes";
import salesRoutes from "../routes/sales-routes";
import swaggerDocs from "./swagger-docs.json";

function createApp(): Express {
  const router = express.Router();
  router.use(loginRoutes());
  router.use(productRoutes());
  router.use(reportRoutes());
  router.use(salesRoutes());
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createApp };
