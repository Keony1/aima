import { Product } from "../../domain/entities";
import { ProductOperations } from "../../domain/use-cases";
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
  async retrieveOne(id: number | undefined): Promise<Product | null> {
    throw new Error("not impl");
  }
  async retrieveList(): Promise<Product[]> {
    throw new Error("not impl");
  }
  async update(
    id: number | undefined,
    data: Omit<Product, "id">,
  ): Promise<void> {
    throw new Error("not impl");
  }
  async updatePartially(
    id: number | undefined,
    data: Partial<Omit<Product, "id">>,
  ): Promise<void> {
    throw new Error("not impl");
  }
  async delete(id: number | undefined): Promise<void> {
    throw new Error("not impl");
  }
}
