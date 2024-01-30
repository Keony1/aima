import express, { Router } from "express";
import { LoginController } from "../controllers";
import { Authenticator } from "../../infra/cryptography/auth-adapter";
import { loginValidator } from "../middlewares/validators/login-validators";

export default function (): Router {
  const authenticator = new Authenticator();
  const controller = new LoginController(authenticator);

  const router = express.Router();
  router.post("/login", loginValidator, controller.login.bind(controller));

  return router;
}
