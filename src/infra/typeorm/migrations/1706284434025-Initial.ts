import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1706284434025 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // suppliers
    await queryRunner.query(`
      CREATE TABLE suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL);

      CREATE INDEX idx_supplier_id ON suppliers(id);
    `);

    // products
    await queryRunner.query(
      `CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            quantity_in_stock INTEGER NOT NULL,
            minimum_stock INTEGER NOT NULL,
            supplier_id INTEGER REFERENCES suppliers(id) NOT NULL);

      CREATE INDEX idx_product_id ON products(id);
    `,
    );

    // sales
    await queryRunner.query(`
      CREATE TABLE sales (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) NOT NULL,
        quantity_sold INTEGER NOT NULL,
        sale_date TIMESTAMP NOT NULL);

      CREATE INDEX idx_sale_id ON sales(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_sale_id;
      DROP TABLE IF EXISTS sales;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_product_id;
      DROP TABLE IF EXISTS products;
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS idx_supplier_id;
      DROP TABLE IF EXISTS suppliers;
    `);
  }
}
