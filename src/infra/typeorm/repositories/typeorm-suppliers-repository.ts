import { Repository } from "typeorm";
import { SupplierRepository } from "../../../application/protocols/database/supplier-repository";
import { Supplier } from "../../../domain/entities";
import { TypeOrmSupplier } from "../entities";
import { TypeOrmConnection } from "../typeorm-connection";

export class TypeOrmSuppliersRepository implements SupplierRepository {
  private readonly supplierRepository: Repository<TypeOrmSupplier>;

  constructor() {
    this.supplierRepository = TypeOrmConnection.getInstance()
      .getDataSource()
      .getRepository(TypeOrmSupplier);
  }

  async byId(id: number): Promise<Supplier | null> {
    return await this.supplierRepository.findOneById(id);
  }
}
