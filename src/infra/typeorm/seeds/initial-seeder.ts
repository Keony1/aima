import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { TypeOrmProduct, TypeOrmSupplier } from "../entities";

export default class InitialSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const repository = dataSource.getRepository(TypeOrmSupplier);
    const seeded = await repository.findOne({ where: { id: 1 } });
    if (seeded) return;

    await repository.insert([
      {
        name: "Supplier1",
      },
    ]);

    const productRepository = dataSource.getRepository(TypeOrmProduct);
    await productRepository.insert([
      {
        name: "Product1",
        quantityInStock: 100,
        minimumStock: 50,
        supplierId: 1,
      },
      {
        name: "Product2",
        quantityInStock: 200,
        minimumStock: 100,
        supplierId: 1,
      },
      {
        name: "Product3",
        quantityInStock: 150,
        minimumStock: 75,
        supplierId: 1,
      },
      {
        name: "Product4",
        quantityInStock: 150,
        minimumStock: 20,
        supplierId: 1,
      },
    ]);
  }
}
