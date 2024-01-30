import { MigrationInterface, QueryRunner } from "typeorm";

export class User1706528617415 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          password VARCHAR(64) NOT NULL);
    `);

    queryRunner.query(`
      INSERT INTO users
         (username, password)
       values
         ('user',
         'c8b2505b76926abdc733523caa9f439142f66aa7293a7baaac0aed41a191eef6');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      DROP TABLE IF EXISTS users;
    `);
  }
}
