import { json, urlencoded } from "body-parser";
import type { Server as HttpServer } from "http";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";

export const createWSServer = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  return io;
};

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });
  return app;
};
