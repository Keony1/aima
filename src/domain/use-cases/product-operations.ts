import { Product } from "../entities"

// maybe split it over several tiny use cases?
export interface ProductOperations {
  create: (product: Product) => Promise<void>
  retrieveOne: (id: number) => Promise<Product | null>
  retrieveList: () => Promise<Product[]>
  update: (id: number, data: Product) => Promise<void>
  updatePartially: (id: number, data: Partial<Product>) => Promise<void>
  delete: (id: number) => Promise<void>
}
