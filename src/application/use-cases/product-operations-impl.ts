import { Product } from "../../domain/entities";
import { ProductOperations } from "../../domain/use-cases";
import {
  ProductExistsError,
  ProductNotFound,
  SupplierNotFound,
  ProductWithSales,
} from "../errors";
import { ProductRepository } from "../protocols/database/product-repository";
import { SaleRepository } from "../protocols/database/sale-repository";
import { SupplierRepository } from "../protocols/database/supplier-repository";

export class ProductOperationsImpl implements ProductOperations {
  constructor(
    private readonly repository: ProductRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly saleRepository: SaleRepository,
  ) {}

  async create(product: Product): Promise<Product> {
    const productExists = await this.repository.byName(product.name);
    if (productExists) {
      throw new ProductExistsError(productExists.name);
    }

    const supplier = await this.supplierRepository.byId(product.supplierId);
    if (!supplier) {
      throw new SupplierNotFound(product.supplierId);
    }

    return await this.repository.create(product);
  }

  async retrieveOne(id: number): Promise<Product | null> {
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

    const supplier = await this.supplierRepository.byId(data.supplierId);
    if (!supplier) {
      throw new SupplierNotFound(data.supplierId);
    }

    return await this.repository.update(id, data);
  }

  async updatePartially(id: number, data: Partial<Product>): Promise<void> {
    const exists = await this.repository.byId(id);
    if (!exists) {
      throw new ProductNotFound(id);
    }

    if (data.supplierId) {
      const supplier = await this.supplierRepository.byId(data.supplierId);
      if (!supplier) {
        throw new SupplierNotFound(data.supplierId);
      }
    }

    return await this.repository.updatePartially(id, data);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.repository.byId(id);

    if (!exists) {
      throw new ProductNotFound(id);
    }

    const sales = await this.saleRepository.byProduct(id);
    if (sales.length > 0) {
      throw new ProductWithSales(id);
    }

    return await this.repository.delete(id);
  }
}
