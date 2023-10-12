import { db } from "./db";
import { createServer, createWSServer } from "./server";
import { createServer as createHttpServer } from "node:http";

const port = process.env.PORT || 5001;
const server = createServer();
const httpServer = createHttpServer(server);
const io = createWSServer(httpServer);

// Can be put into a separate file, can't be bothered too :)
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("get:tasks", async () => {
    const tasks = await db.column.findMany();
    return socket.emit("get:tasks", tasks);
  });
  socket.on("create:task", async (task) => {
    await db.column.create({
      data: {
        column: "todo",
        priority: 1,
        state: "todo",
        title: Math.random() + "",
      },
    });
    const tasks = await db.column.findMany();
    return socket.emit("get:tasks", tasks);
  });
});

httpServer.listen(port, () => {
  console.log(`api running on ${port}`);
});
