import express from "express";
import { ProductController } from "../controllers/product-controller";
import { ProductOperationsImpl } from "../../application/use-cases/product-operations-impl";
import { TypeOrmDataSource } from "../../infra/typeorm/typeorm-datasource";
import {
  TypeOrmProduct,
  TypeOrmSale,
  TypeOrmSupplier,
} from "../../infra/typeorm/entities";
import { TypeOrmProductsRepository } from "../../infra/typeorm/repositories/typeorm-products-repository";
import { TypeOrmSuppliersRepository } from "../../infra/typeorm/repositories/typeorm-suppliers-repository";
import {
  deleteValidator,
  getOneValidator,
  patchValidator,
  updateValidator,
} from "../middlewares/validators";
import { TypeOrmSalesRepository } from "../../infra/typeorm/repositories/typeorm-sales-repository";

const productRepo = new TypeOrmProductsRepository(
  TypeOrmDataSource.getRepository(TypeOrmProduct),
);
const supplierRepo = new TypeOrmSuppliersRepository(
  TypeOrmDataSource.getRepository(TypeOrmSupplier),
);
const salesRepo = new TypeOrmSalesRepository(
  TypeOrmDataSource.getRepository(TypeOrmSale),
);

const operations = new ProductOperationsImpl(
  productRepo,
  supplierRepo,
  salesRepo,
);
const controller = new ProductController(operations);

export const productRouter = express.Router();
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
