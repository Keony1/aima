# Product Report SQL

The query starts creating a [Materialized View](https://www.postgresql.org/docs/current/rules-materializedviews.html)

```sql
CREATE MATERIALIZED VIEW product_report_view
```

---

This [Common Table Expression](https://www.postgresql.org/docs/current/queries-with.html) (CTE) calculates the total quantity sold for each product on a monthly basis. It uses the sales table, truncates the sale dates to the month, and sums the quantity sold for each product-month combination.

```sql
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
```

---

This CTE calculates the average monthly sales for each product. It calculates the average quantity sold per month for each product.

```sql
average_monthly_sales AS (
SELECT
    product_id,
    AVG(monthly_quantity_sold) AS avg_monthly_sales
FROM
    monthly_sales
GROUP BY
    product_id
)
```

---

The main query retrieves information about product sales and restocking needs by joining data from the products table with two subqueries:

- The first subquery `(ss)` calculates the average daily sales and the total sales of the last month for each product.

- The second subquery `(ams)` retrieves the average monthly sales for each product.

The main query selects columns such as product ID, product name, current stock, minimum stock, average daily sales, total sales of the last month, average monthly sales, and restocking needs.

It categorizes the restocking needs as 'Low Demand', 'Normal Demand', or 'High Demand' based on the comparison of average monthly sales and the minimum stock level.

```sql
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
```

To check the entire query, please click [here](../src/infra/typeorm/migrations/1706375071951-ReportView.ts)

---

### Updating Materialized View

In this project, I utilize materialized views to store precomputed results for efficient querying. However, since materialized views do not update automatically like regular views, I had need to implement a mechanism to refresh them when underlying data changes.

My options were TypeORM and Triggers, I sticked with Triggers to don't rely any further with a library.

I employ triggers to automatically refresh the materialized view whenever there is an `insert`, `update` or `delete` operation on `products` or `sales` tables.

```sql
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
```
