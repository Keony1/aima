import Joi from "joi";
import { NextFunction, Request, Response } from "express";

export const getOneValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    params: Joi.object({
      id: Joi.number().min(0),
    }),
  });

  const { error } = schema.validate({
    params: req.params,
  });

  if (error) return res.status(400).send({ message: error.message });
  next();
};

export const createValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    body: Joi.object({
      name: Joi.string().min(3).trim(),
      quantityInStock: Joi.number().min(0),
      minimumStock: Joi.number().min(0),
      supplierId: Joi.number().min(0),
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

export const updateValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    params: Joi.object({
      id: Joi.number().min(0),
    }),
    body: Joi.object({
      name: Joi.string().min(3).trim(),
      quantityInStock: Joi.number().min(0),
      minimumStock: Joi.number().min(0),
      supplierId: Joi.number().min(0),
    }),
  });

  const { error } = schema.validate(
    {
      body: req.body,
      params: req.params,
    },
    { abortEarly: false },
  );

  if (error) return res.status(400).send({ message: error.message });
  next();
};

export const patchValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    params: Joi.object({
      id: Joi.number().min(0),
    }),
    body: Joi.object({
      name: Joi.string().min(3).trim().optional(),
      quantityInStock: Joi.number().min(0).optional(),
      minimumStock: Joi.number().min(0).optional(),
    }),
  });

  const { error } = schema.validate(
    {
      body: req.body,
      params: req.params,
    },
    { abortEarly: false },
  );

  if (error) return res.status(400).send({ message: error.message });
  next();
};

export const deleteValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object({
    params: Joi.object({
      id: Joi.number().min(0),
    }),
  });

  const { error } = schema.validate({
    params: req.params,
  });

  if (error) return res.status(400).send({ message: error.message });
  next();
};
