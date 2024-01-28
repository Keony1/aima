import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshTrigger1706445032359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON products;
        DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON sales;

        CREATE OR REPLACE FUNCTION refresh_product_report_view_mv()
        RETURNS TRIGGER AS $$
        BEGIN
            REFRESH MATERIALIZED VIEW product_report_view;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER refresh_product_report_view_mv
        AFTER INSERT OR UPDATE OR DELETE ON products
        FOR EACH STATEMENT
        EXECUTE FUNCTION refresh_product_report_view_mv();

        CREATE TRIGGER refresh_product_report_view_mv
        AFTER INSERT OR UPDATE OR DELETE ON sales
        FOR EACH STATEMENT
        EXECUTE FUNCTION refresh_product_report_view_mv();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON products;
        DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON sales;
      `);
  }
}
