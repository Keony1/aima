import { Product } from "../../domain/entities";
import { ProductOperations } from "../../domain/use-cases";
import { ProductNotFound } from "../errors";
import { ProductRepository } from "../protocols/database/product-repository";

export class ProductOperationsImpl implements ProductOperations {
  constructor(private readonly repository: ProductRepository) {}

  async create(product: Product): Promise<void> {
    const exists = await this.repository.byName(product.name);

    if (exists) {
      throw new Error(`Product exists with id ${exists.id}`);
    }

    await this.repository.create(product);
  }

  async retrieveOne(id: number): Promise<Product | undefined> {
    return await this.repository.byId(id);
  }

  async retrieveList(): Promise<Product[]> {
    return await this.repository.findAll();
  }

  async update(id: number, data: Product): Promise<void> {
    const exists = await this.repository.byId(id);

    if (!exists) {
      throw new ProductNotFound(id);
    }

    return await this.repository.update(id, data);
  }

  async updatePartially(id: number, data: Partial<Product>): Promise<void> {
    const exists = await this.repository.byId(id);

    if (!exists) {
      throw new ProductNotFound(id);
    }

    return await this.repository.updatePartially(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.byId(id);

    if (!exists) {
      throw new ProductNotFound(id);
    }

    return await this.repository.delete(id);
  }
}
