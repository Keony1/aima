import express, { json } from "express";
import { reportRouter } from "../../src/main/routes/report-routes";
import { loginRouter } from "../../src/main/routes/login-routes";

function createTestApp() {
  const router = express.Router();
  const reportRoutes = reportRouter();
  router.use(reportRoutes);
  router.use(loginRouter());

  const app = express();
  app.use(json());
  app.use("/api", router);
  return app;
}

export { createTestApp };
