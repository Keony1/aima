import { Express } from "express";
import request from "supertest";

export default async function authHelper(app: Express) {
  const res = await request(app).post("/api/login").send({
    username: "user",
    password: "pass",
  });

  return res.body.accessToken;
}
