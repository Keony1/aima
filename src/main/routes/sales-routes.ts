import express, { Router } from "express";
import { SalesController } from "../controllers";
import { SalesRegistratorImpl } from "../../application/use-cases/sales-registrator-impl";
import { TypeOrmProductsRepository } from "../../infra/typeorm/repositories/typeorm-products-repository";
import { TypeOrmSalesRepository } from "../../infra/typeorm/repositories/typeorm-sales-repository";
import { auth } from "../middlewares/auth";

export default function (): Router {
  const saleRepo = new TypeOrmSalesRepository();
  const productRepo = new TypeOrmProductsRepository();
  const registrator = new SalesRegistratorImpl(saleRepo, productRepo);
  const controller = new SalesController(registrator);

  const router = express.Router();
  router.post("/sales", auth, controller.post.bind(controller));

  return router;
}
