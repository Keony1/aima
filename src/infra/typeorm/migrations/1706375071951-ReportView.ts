import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportView1706375071951 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW product_report_view AS
      WITH monthly_sales AS (
        SELECT
          product_id,
          DATE_TRUNC('month', sale_date) AS sale_month,
          SUM(quantity_sold) AS monthly_quantity_sold
        FROM
          sales
        GROUP BY
          product_id, DATE_TRUNC('month', sale_date)
      ),
      average_monthly_sales AS (
        SELECT
          product_id,
          AVG(monthly_quantity_sold) AS avg_monthly_sales
        FROM
          monthly_sales
        GROUP BY
          product_id
      )
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.quantity_in_stock AS current_stock,
        p.minimum_stock AS minimum_stock,
        COALESCE(ss.average_daily_sales, 0) AS average_daily_sales,
        COALESCE(ss.total_sales_last_month, 0) AS total_sales_last_month,
        COALESCE(ams.avg_monthly_sales, 0) AS avg_monthly_sales,
        CASE
          WHEN COALESCE(ams.avg_monthly_sales, 0) <= p.minimum_stock * 0.25 THEN 'Low Demand'
          WHEN COALESCE(ams.avg_monthly_sales, 0) <= p.minimum_stock * 0.5 THEN 'Normal Demand'
          ELSE 'High Demand'
        END AS restocking_needs
      FROM
        products p
      LEFT JOIN (
        SELECT
          product_id,
          AVG(quantity_sold) AS average_daily_sales,
          SUM(CASE WHEN sale_date >= CURRENT_DATE - INTERVAL '1 month' THEN quantity_sold ELSE 0 END) AS total_sales_last_month
        FROM
          sales
        GROUP BY
          product_id
      ) ss ON p.id = ss.product_id
      LEFT JOIN
        average_monthly_sales ams ON p.id = ams.product_id;
    `);

    // trigger
    await queryRunner.query(`
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
      DROP MATERIALIZED VIEW IF EXISTS product_report_view;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON products;
      DROP TRIGGER IF EXISTS refresh_product_report_view_mv ON sales;
    `);
  }
}
