import { Product } from "../../../domain/entities";

export interface ProductRepository {
  create: (data: Product) => Promise<void>;
  byName: (name: string) => Promise<Product | undefined>;
  byId: (id: number) => Promise<Product | undefined>;
  findAll: () => Promise<Product[]>;
  update: (id: number, data: Product) => Promise<void>;
  updatePartially: (id: number, data: Partial<Product>) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
