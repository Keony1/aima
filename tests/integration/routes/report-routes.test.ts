import request from "supertest";
import { DataSource, Repository } from "typeorm";
import {
  initializeTestDataSource,
  destroyTestDatabase,
} from "../datasource-test";
import { createTestApp } from "../app-test";
import {
  TypeOrmProduct,
  TypeOrmSale,
  TypeOrmSupplier,
} from "../../../src/infra/typeorm/entities";
import { Express } from "express";
import authHelper from "../auth-helper";

let app: Express;
let token: string;
describe("API /report", () => {
  let dataSource: DataSource;
  let productsRepository: Repository<TypeOrmProduct>;
  let salesRepository: Repository<TypeOrmSale>;
  let suppliersRepository: Repository<TypeOrmSupplier>;

  beforeAll(async () => {
    dataSource = await initializeTestDataSource();
    app = createTestApp();
    token = await authHelper(app);

    productsRepository = dataSource.getRepository(TypeOrmProduct);
    salesRepository = dataSource.getRepository(TypeOrmSale);
    suppliersRepository = dataSource.getRepository(TypeOrmSupplier);

    await suppliersRepository.save({ name: "some_supplier" });
    await productsRepository.save([
      { name: "prod1", quantityInStock: 100, minimumStock: 50, supplierId: 1 },
      { name: "prod2", quantityInStock: 200, minimumStock: 100, supplierId: 1 },
      { name: "prod3", quantityInStock: 150, minimumStock: 75, supplierId: 1 },
      { name: "prod4", quantityInStock: 150, minimumStock: 20, supplierId: 1 },
    ]);

    await salesRepository.insert([
      {
        productId: 1,
        quantitySold: 20,
        saleDate: new Date(),
      },
      {
        productId: 1,
        quantitySold: 30,
        saleDate: new Date(),
      },
      { productId: 2, quantitySold: 50, saleDate: new Date() },
      { productId: 2, quantitySold: 70, saleDate: new Date() },
      { productId: 3, quantitySold: 25, saleDate: new Date() },
      { productId: 3, quantitySold: 40, saleDate: new Date() },
      { productId: 4, quantitySold: 5, saleDate: new Date() },
    ]);
  });

  afterAll(async () => {
    await destroyTestDatabase();
  });

  it("should return high demand products", async () => {
    const res = await request(app)
      .get("/api/report")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      data: [
        {
          averageDailySales: "25.0000000000000000",
          avgMonthlySales: "50.0000000000000000",
          currentStock: 100,
          minimumStock: 50,
          productId: 1,
          productName: "prod1",
          restockingNeeds: "High Demand",
          totalSalesLastMonth: "50",
        },
        {
          averageDailySales: "60.0000000000000000",
          avgMonthlySales: "120.0000000000000000",
          currentStock: 200,
          minimumStock: 100,
          productId: 2,
          productName: "prod2",
          restockingNeeds: "High Demand",
          totalSalesLastMonth: "120",
        },
        {
          averageDailySales: "32.5000000000000000",
          avgMonthlySales: "65.0000000000000000",
          currentStock: 150,
          minimumStock: 75,
          productId: 3,
          productName: "prod3",
          restockingNeeds: "High Demand",
          totalSalesLastMonth: "65",
        },
      ],
    });
  });
});
