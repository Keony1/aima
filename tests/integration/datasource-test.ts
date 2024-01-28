import { DataSource } from "typeorm";
import { TypeOrmConnection } from "../../src/infra/typeorm/typeorm-connection";

export async function initializeTestDataSource(): Promise<DataSource> {
  const conn = TypeOrmConnection.getInstance().getDataSource({
    database: "aima-test",
  });

  await conn.initialize();
  await conn.runMigrations();

  return conn;
}

export async function destroyTestDatabase(ds: DataSource): Promise<void> {
  await ds.query(`
       DROP TABLE IF EXISTS "sales", "products", "suppliers", "migrations", "typeorm_metadata" CASCADE;
     `);
  await ds.destroy();
}
