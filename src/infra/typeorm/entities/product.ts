import { TypeOrmSale, TypeOrmSupplier } from ".";
import { Product } from "../../../domain/entities";

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "products" })
export class TypeOrmProduct implements Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "quantity_in_stock" })
  quantityInStock!: number;

  @Column({ name: "minimum_stock" })
  minimumStock!: number;

  @Column({ name: "supplier_id" })
  supplierId!: number;

  @ManyToOne(() => TypeOrmSupplier, (supplier) => supplier.products)
  @JoinColumn({ name: "supplier_id" })
  supplier!: TypeOrmSupplier;

  @OneToMany(() => TypeOrmSale, (sale) => sale.product)
  sales!: TypeOrmSale[];
}
