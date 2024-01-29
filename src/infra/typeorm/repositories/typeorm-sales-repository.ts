import { Repository } from "typeorm";
import { SaleRepository } from "../../../application/protocols/database/sale-repository";
import { Sale } from "../../../domain/entities";
import { TypeOrmSale } from "../entities";

export class TypeOrmSalesRepository implements SaleRepository {
  constructor(private readonly salesRepository: Repository<TypeOrmSale>) {}

  async byProduct(productId: number): Promise<Sale[]> {
    return this.salesRepository.findBy({
      productId,
    });
  }

  async registerSale(sale: Sale): Promise<Sale> {
    return this.salesRepository.save(sale);
  }
}
