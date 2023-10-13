import { json, urlencoded } from "body-parser";
import type { Server as HttpServer } from "http";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { prisma } from "database";

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
    .get("/api/avatar/:userId", async (req, res) => {
      const { userId } = req.params;
      const data = await prisma.column.findFirst({
        where: {
          authorId: userId,
        },
        select: { authorImg: true },
      });
      if (data === null || data.authorImg === null) {
        return res.status(404).json({ error: "Not found" });
      }
      return res.json({
        url: data.authorImg,
      });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });
  return app;
};
