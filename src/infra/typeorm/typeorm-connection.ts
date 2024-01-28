import { DataSource, DataSourceOptions } from "typeorm";

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
      let defaults: DataSourceOptions = {
        type: "postgres",
        database: "aima",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        entities: [__dirname + "/entities/*.{js,ts}"],
        migrations: [__dirname + "/migrations/*.{js,ts}"],
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
