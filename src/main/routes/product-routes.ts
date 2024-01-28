import express, { Router } from "express";
import { DataSource } from "typeorm";
import { ProductController } from "../controllers/product-controller";
import { ProductOperationsImpl } from "../../application/use-cases/product-operations-impl";
import {
  TypeOrmProduct,
  TypeOrmSale,
  TypeOrmSupplier,
} from "../../infra/typeorm/entities";
import { TypeOrmProductsRepository } from "../../infra/typeorm/repositories/typeorm-products-repository";
import { TypeOrmSuppliersRepository } from "../../infra/typeorm/repositories/typeorm-suppliers-repository";
import { TypeOrmSalesRepository } from "../../infra/typeorm/repositories/typeorm-sales-repository";
import {
  deleteValidator,
  getOneValidator,
  patchValidator,
  updateValidator,
} from "../middlewares/validators";

export function productRouter(conn: DataSource): Router {
  const productRepo = new TypeOrmProductsRepository(
    conn.getRepository(TypeOrmProduct),
  );
  const supplierRepo = new TypeOrmSuppliersRepository(
    conn.getRepository(TypeOrmSupplier),
  );
  const salesRepo = new TypeOrmSalesRepository(conn.getRepository(TypeOrmSale));

  const operations = new ProductOperationsImpl(
    productRepo,
    supplierRepo,
    salesRepo,
  );
  const controller = new ProductController(operations);

  const productRouter = express.Router();
  productRouter.post("/products", controller.create.bind(controller));
  productRouter.get("/products", controller.getAll.bind(controller));
  productRouter.get(
    "/products/:id",
    getOneValidator,
    controller.getOne.bind(controller),
  );
  productRouter.patch(
    "/products/:id",
    patchValidator,
    controller.patch.bind(controller),
  );
  productRouter.put(
    "/products/:id",
    updateValidator,
    controller.update.bind(controller),
  );

  productRouter.delete(
    "/products/:id",
    deleteValidator,
    controller.delete.bind(controller),
  );

  return productRouter;
}
