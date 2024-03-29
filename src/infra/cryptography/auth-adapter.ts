import { Repository } from "typeorm";
import crypto from "crypto";

import jwt, { JwtPayload } from "jsonwebtoken";
import { TypeOrmUser } from "../typeorm/entities/user";
import { TypeOrmConnection } from "../typeorm/typeorm-connection";

export class Authenticator {
  private readonly userRepository: Repository<TypeOrmUser>;
  constructor() {
    this.userRepository = TypeOrmConnection.getInstance()
      .getDataSource()
      .getRepository(TypeOrmUser);
  }

  async doAuth(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        username,
        password: this.encode(password),
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign({ user }, process.env.APP_SECRET as string, {
      expiresIn: 3600,
    });

    return token;
  }

  static verify(token: string): string | JwtPayload {
    return jwt.verify(token, process.env.APP_SECRET as string);
  }

  private encode(text: string): string {
    const salt = process.env.APP_SALT;
    const hash = crypto.createHash("sha256");
    hash.update(text + salt);

    const encoded = hash.digest("hex");
    return encoded;
  }
}
