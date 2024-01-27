import { Sale } from "../../../domain/entities";

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TypeOrmProduct } from ".";

@Entity({ name: "sales" })
export class TypeOrmSale implements Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "quantity_sold" })
  quantitySold!: number;

  @Column({ name: "sale_date" })
  saleDate!: Date;

  @Column({ name: "product_id" })
  productId!: number;

  @ManyToOne(() => TypeOrmProduct, (product: TypeOrmProduct) => product.sales)
  @JoinColumn({ name: "product_id" })
  product!: TypeOrmProduct;
}
