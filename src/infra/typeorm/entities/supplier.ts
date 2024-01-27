import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Supplier } from "../../../domain/entities";
import { TypeOrmProduct } from "./product";

@Entity({ name: "suppliers" })
export class TypeOrmSupplier implements Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(
    () => TypeOrmProduct,
    (product: TypeOrmProduct) => product.supplier,
  )
  products!: TypeOrmProduct[];
}
