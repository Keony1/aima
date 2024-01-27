import express, { json } from "express";
import { productRouter } from "../routes/product-routes";

const app = express();

app.use(json());
app.use("/api", productRouter);

export { app };
