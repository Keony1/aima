import { Equal, Repository } from "typeorm";
import { TypeOrmProduct } from "../entities";
import { ProductRepository } from "../../../application/protocols/database/product-repository";
import { Product } from "../../../domain/entities";
import { TypeOrmConnection } from "../typeorm-connection";

export class TypeOrmProductsRepository implements ProductRepository {
  private readonly productRepository: Repository<TypeOrmProduct>;
  constructor() {
    this.productRepository = TypeOrmConnection.getInstance()
      .getDataSource()
      .getRepository(TypeOrmProduct);
  }
  async create(data: Product): Promise<Product> {
    return await this.productRepository.save(data);
  }

  async byName(name: string): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: {
        name: Equal(name),
      },
    });
  }

  async byId(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: {
        id: Equal(id),
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async update(id: number, data: Product): Promise<void> {
    data.id = id;
    await this.productRepository.save(data);
  }

  async updatePartially(id: number, data: Partial<Product>): Promise<void> {
    await this.productRepository.update({ id: Equal(id) }, data);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete({ id: Equal(id) });
  }
}
