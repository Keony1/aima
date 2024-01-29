import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    body: Joi.object({
      username: Joi.string().required().trim(),
      password: Joi.string().required().trim(),
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
