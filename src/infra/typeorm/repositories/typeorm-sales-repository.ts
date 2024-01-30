import { Repository } from "typeorm";
import { SaleRepository } from "../../../application/protocols/database/sale-repository";
import { Sale } from "../../../domain/entities";
import { TypeOrmSale } from "../entities";
import { TypeOrmConnection } from "../typeorm-connection";

export class TypeOrmSalesRepository implements SaleRepository {
  private readonly salesRepository: Repository<TypeOrmSale>;
  constructor() {
    this.salesRepository = TypeOrmConnection.getInstance()
      .getDataSource()
      .getRepository(TypeOrmSale);
  }

  async byProduct(productId: number): Promise<Sale[]> {
    return this.salesRepository.findBy({
      productId,
    });
  }

  async registerSale(sale: Sale): Promise<Sale> {
    return this.salesRepository.save(sale);
  }
}
