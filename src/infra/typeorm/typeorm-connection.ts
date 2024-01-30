import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";

export class TypeOrmConnection {
  private static instance?: TypeOrmConnection;
  private datasource?: DataSource;

  private constructor() {}

  static getInstance(): TypeOrmConnection {
    if (TypeOrmConnection.instance === undefined)
      TypeOrmConnection.instance = new TypeOrmConnection();
    return TypeOrmConnection.instance;
  }

  getDataSource(opts?: Partial<DataSourceOptions>): DataSource {
    if (this.datasource) return this.datasource;
    try {
      let defaults: DataSourceOptions & SeederOptions = {
        type: "postgres",
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        entities: [__dirname + "/entities/*.{js,ts}"],
        migrations: [__dirname + "/migrations/*.{js,ts}"],
        seeds: [__dirname + "/seeds/*-seeder.{js,ts}"],
        logging: true,
      };

      if (opts) {
        defaults = { ...defaults, ...opts } as DataSourceOptions;
      }

      this.datasource = new DataSource(defaults);

      return this.datasource;
    } catch (err: any) {
      throw new Error(`Failed to connect to the database: ${err.message}`);
    }
  }
}
