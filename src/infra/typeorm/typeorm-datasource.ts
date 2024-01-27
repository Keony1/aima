import { DataSource } from "typeorm";

export const TypeOrmDataSource = new DataSource({
  type: "postgres",
  database: "aima",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  entities: [__dirname + "/entities/*.{js,ts}"],
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  logging: true,
});
