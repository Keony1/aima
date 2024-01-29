import { DataSource } from "typeorm";
import express, { Router } from "express";
import { TypeOrmUser } from "../../infra/typeorm/entities";
import { LoginController } from "../controllers";
import { Authenticator } from "../../infra/cryptography/auth-adapter";
import { loginValidator } from "../middlewares/validators/login-validators";

export function loginRouter(conn: DataSource): Router {
  const authenticator = new Authenticator(conn.getRepository(TypeOrmUser));
  const controller = new LoginController(authenticator);

  const router = express.Router();
  router.post("/login", loginValidator, controller.login.bind(controller));

  return router;
}
