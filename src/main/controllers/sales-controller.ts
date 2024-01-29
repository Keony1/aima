import { Request, Response } from "express";
import { SalesRegistrator } from "../../domain/use-cases";
import {
  ProductNotFound,
  RegulatoryCompliance,
} from "../../application/errors";

export class SalesController {
  constructor(private readonly registrator: SalesRegistrator) {}

  async post(req: Request, res: Response) {
    try {
      const { body } = req;
      const sale = await this.registrator.registerSale(body);

      res.json({
        message: "Sale registered",
        data: sale,
      });
    } catch (err) {
      if (err instanceof ProductNotFound) {
        return res.status(404).json({
          error: "Not Found",
          message: err.message,
        });
      }

      if (err instanceof RegulatoryCompliance) {
        return res.status(401).json({
          error: "Bad Request",
          message: err.message,
        });
      }

      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }
}
