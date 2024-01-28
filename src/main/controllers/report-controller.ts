import { Request, Response } from "express";
import { ProductReporter } from "../../domain/use-cases";
import { RestockingNeeds } from "../../domain/entities";

export class ReportController {
  constructor(private readonly reporter: ProductReporter) {}

  async getAll(req: Request, res: Response) {
    try {
      const report = await this.reporter.generateReport(RestockingNeeds.High);

      res.json({
        data: report,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
