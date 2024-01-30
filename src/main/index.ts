import { TypeOrmConnection } from "../infra/typeorm/typeorm-connection";
import { runSeeder } from "typeorm-extension";
import InitialSeed from "../infra/typeorm/seeds/initial-seeder";

TypeOrmConnection.getInstance()
  .getDataSource()
  .initialize()
  .then(async (ds) => {
    await ds.runMigrations();
    await runSeeder(ds, InitialSeed);

    const { createApp } = await import("./config/app");
    const app = createApp();
    app.listen(3000, () =>
      console.log(`Server running at http://localhost:3000`),
    );
  })
  .catch(console.error);
