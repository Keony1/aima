import express, { json } from "express";
import { DataSource } from "typeorm";
import { reportRouter } from "../../src/main/routes/report-routes";
import { loginRouter } from "../../src/main/routes/login-routes";

function createTestApp(conn: DataSource) {
  const router = express.Router();
  const reportRoutes = reportRouter(conn);
  router.use(reportRoutes);
  router.use(loginRouter(conn));

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createTestApp };
