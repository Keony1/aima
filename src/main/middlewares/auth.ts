import { NextFunction, Request, Response } from "express";
import { Authenticator } from "../../infra/cryptography/auth-adapter";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const decoded = Authenticator.verify(token);
  console.log(decoded);

  next();

  //  jwt.verify(token, "teste", (err) => {
  //    if (err) {
  //      console.log(token);
  //      return res.status(401).json({
  //        error: "Unauthorized",
  //      });
  //    }
  //
  //    next();
  //  });
};
