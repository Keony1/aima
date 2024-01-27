import { Repository } from "typeorm";
import { SupplierRepository } from "../../../application/protocols/database/supplier-repository";
import { Supplier } from "../../../domain/entities";
import { TypeOrmSupplier } from "../entities";

export class TypeOrmSuppliersRepository implements SupplierRepository {
  constructor(
    private readonly supplierRepository: Repository<TypeOrmSupplier>,
  ) {}

  async byId(id: number): Promise<Supplier | null> {
    return await this.supplierRepository.findOneById(id);
  }
}
