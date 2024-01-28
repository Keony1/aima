import { TypeOrmConnection } from "../infra/typeorm/typeorm-connection";

TypeOrmConnection.getInstance()
  .getDataSource()
  .initialize()
  .then(async (ds) => {
    const { createApp } = await import("./config/app");
    const app = createApp(ds);
    app.listen(3000, () =>
      console.log(`Server running at http://localhost:3000`),
    );
  })
  .catch(console.error);
