import { TypeOrmDataSource } from "../infra/typeorm/typeorm-datasource";

TypeOrmDataSource.initialize()
  .then(async () => {
    const { app } = await import("./config/app");
    app.listen(3000, () =>
      console.log(`Server running at http://localhost:3000`),
    );
  })
  .catch(console.error);
