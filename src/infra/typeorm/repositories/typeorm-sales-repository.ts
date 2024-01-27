import { Repository } from "typeorm";
import { SaleRepository } from "../../../application/protocols/database/sale-repository";
import { Sale } from "../../../domain/entities";
import { TypeOrmSale } from "../entities";

export class TypeOrmSalesRepository implements SaleRepository {
  constructor(private readonly supplierRepository: Repository<TypeOrmSale>) {}

  async byProduct(productId: number): Promise<Sale[]> {
    return this.supplierRepository.findBy({
      productId,
    });
  }
}
