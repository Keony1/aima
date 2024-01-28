import { Request, Response } from "express";
import { ProductOperations } from "../../domain/use-cases";
import {
  ProductExistsError,
  ProductNotFound,
  ProductWithSales,
  SupplierNotFound,
} from "../../application/errors";

export class ProductController {
  constructor(private readonly ops: ProductOperations) {}

  async create(req: Request, res: Response) {
    try {
      const { body } = req;
      const product = await this.ops.create(body);
      return res.status(201).send({
        message: "Resource created succesfully",
        data: product,
      });
    } catch (err) {
      if (err instanceof ProductExistsError) {
        return res.status(409).json({
          error: "conflict",
          message: err.message,
        });
      }

      if (err instanceof SupplierNotFound) {
        return res.status(404).json({
          error: "Not found",
          message: err.message,
        });
      }

      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const products = await this.ops.retrieveList();
      return res.status(200).json({
        data: products,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const product = await this.ops.retrieveOne(Number(id));

      if (!product) {
        return res.status(404).json({
          error: "Not found",
          message: `The requested product with ID ${id} was not found`,
        });
      }

      res.status(200).json({
        data: product,
      });
    } catch (err) {
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { body } = req;

      await this.ops.update(Number(id), body);

      return res.status(204).send();
    } catch (err) {
      if (err instanceof SupplierNotFound || err instanceof ProductNotFound) {
        return res.status(404).json({
          error: "Not Found",
          message: err.message,
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async patch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { body } = req;

      await this.ops.updatePartially(Number(id), body);

      res.status(204).send();
    } catch (err) {
      if (err instanceof SupplierNotFound || err instanceof ProductNotFound) {
        return res.status(404).json({
          error: "Not Found",
          message: err.message,
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await this.ops.delete(Number(id));

      res.status(200).send();
    } catch (err) {
      if (err instanceof ProductNotFound) {
        return res.status(404).json({
          error: "Not Found",
          message: err.message,
        });
      }

      if (err instanceof ProductWithSales) {
        return res.status(400).json({
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
