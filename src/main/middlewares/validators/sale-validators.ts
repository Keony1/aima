import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const saleRegistratoValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    body: Joi.object({
      productId: Joi.number().min(1),
      quantitySold: Joi.number().min(1),
      saleDate: Joi.date(),
    }),
  });

  const { error } = schema.validate(
    {
      body: req.body,
    },
    { abortEarly: false },
  );

  if (error) return res.status(400).send({ message: error.message });
  next();
};
