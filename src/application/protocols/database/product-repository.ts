import { Product } from "../../../domain/entities";

export interface ProductRepository {
  create: (data: Product) => Promise<Product>;
  byName: (name: string) => Promise<Product | null>;
  byId: (id: number) => Promise<Product | null>;
  findAll: () => Promise<Product[]>;
  update: (id: number, data: Product) => Promise<void>;
  updatePartially: (id: number, data: Partial<Product>) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
