import express, { Router } from "express";
import { DataSource } from "typeorm";
import { SalesController } from "../controllers";
import { SalesRegistratorImpl } from "../../application/use-cases/sales-registrator-impl";
import { TypeOrmProductsRepository } from "../../infra/typeorm/repositories/typeorm-products-repository";
import { TypeOrmSalesRepository } from "../../infra/typeorm/repositories/typeorm-sales-repository";
import { TypeOrmProduct, TypeOrmSale } from "../../infra/typeorm/entities";
import { auth } from "../middlewares/auth";

export function salesRouter(conn: DataSource): Router {
  const saleRepo = new TypeOrmSalesRepository(conn.getRepository(TypeOrmSale));
  const productRepo = new TypeOrmProductsRepository(
    conn.getRepository(TypeOrmProduct),
  );
  const registrator = new SalesRegistratorImpl(saleRepo, productRepo);
  const controller = new SalesController(registrator);

  const router = express.Router();
  router.post("/sales", auth, controller.post.bind(controller));

  return router;
}
