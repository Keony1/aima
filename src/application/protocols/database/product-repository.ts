import { Product } from "../../../domain/entities";

export interface ProductRepository {
  create: (data: Product) => Promise<void>;
  byName: (name: string) => Promise<Product | undefined>;
}
