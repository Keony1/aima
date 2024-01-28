export interface ProductReport {
  productId: number;
  productName: string;
  currentStock: number;
  minimumStock: number;
  averageDailySales: number;
  avgMonthlySales: number;
  totalSalesLastMonth: number;
  restockingNeeds: RestockingNeeds;
}

export enum RestockingNeeds {
  High = "High Demand",
  Normal = "Normal Demand",
  Low = "Low Demand",
}
