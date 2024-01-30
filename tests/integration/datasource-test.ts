import { DataSource } from "typeorm";
import { TypeOrmConnection } from "../../src/infra/typeorm/typeorm-connection";

const conn = TypeOrmConnection.getInstance().getDataSource({
  database: process.env.TEST_DB_NAME,
});

export async function initializeTestDataSource(): Promise<DataSource> {
  await conn.initialize();
  await conn.runMigrations();

  return conn;
}

export async function destroyTestDatabase(): Promise<void> {
  await conn.query(`
       DROP TABLE IF EXISTS "sales", "products", "suppliers", "users", "migrations", "typeorm_metadata" CASCADE;
  `);

  await conn.destroy();
}
