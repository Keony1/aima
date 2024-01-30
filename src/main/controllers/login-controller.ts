import { Request, Response } from "express";
import { Authenticator } from "../../infra/cryptography/auth-adapter";

export class LoginController {
  constructor(private readonly authenticator: Authenticator) {}

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const token = await this.authenticator.doAuth(username, password);
      res.json({
        expiresIn: 3600,
        accessToken: token,
      });
    } catch (err: any) {
      res.status(400).json({
        error: "Unauthorized",
        message: err.message,
      });
    }
  }
}
