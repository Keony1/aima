import { ViewColumn, ViewEntity } from "typeorm";
import { ProductReport, RestockingNeeds } from "../../../domain/entities";

@ViewEntity({
  materialized: true,
  name: "product_report_view",
  expression: `
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
  `,
})
export class TypeOrmProductReportView implements ProductReport {
  @ViewColumn({ name: "product_id" })
  productId!: number;

  @ViewColumn({ name: "product_name" })
  productName!: string;

  @ViewColumn({ name: "current_stock" })
  currentStock!: number;

  @ViewColumn({ name: "minimum_stock" })
  minimumStock!: number;

  @ViewColumn({ name: "average_daily_sales" })
  averageDailySales!: number;

  @ViewColumn({ name: "total_sales_last_month" })
  totalSalesLastMonth!: number;

  @ViewColumn({ name: "avg_monthly_sales" })
  avgMonthlySales!: number;

  @ViewColumn({
    name: "restocking_needs",
    transformer: {
      from: (value: string) => {
        switch (value) {
          case RestockingNeeds.High:
            return RestockingNeeds.High;
          case RestockingNeeds.Normal:
            return RestockingNeeds.Normal;
          default:
            return RestockingNeeds.Low;
        }
      },
      to: (value: RestockingNeeds) => value,
    },
  })
  restockingNeeds!: RestockingNeeds;
}
