import { Sale } from "../../domain/entities";
import { SalesRegistrator } from "../../domain/use-cases";
import { ProductNotFound, RegulatoryCompliance } from "../errors";
import { ProductRepository, SaleRepository } from "../protocols/database";

export class SalesRegistratorImpl implements SalesRegistrator {
  constructor(
    private readonly salesRepository: SaleRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async registerSale(sale: Sale): Promise<Sale> {
    const product = await this.productRepository.byId(sale.productId);

    if (!product) {
      throw new ProductNotFound(sale.productId);
    }

    if (product.quantityInStock - sale.quantitySold < 0) {
      throw new RegulatoryCompliance();
    }

    const quantityInStock = product.quantityInStock - sale.quantitySold;
    await this.productRepository.updatePartially(product.id as number, {
      quantityInStock,
    });

    return await this.salesRepository.registerSale(sale);
  }
}
