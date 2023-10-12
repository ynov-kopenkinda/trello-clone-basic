import { type Column, prisma } from "database";
import { createServer, createWSServer } from "./server";
import { createServer as createHttpServer } from "node:http";

const port = process.env.PORT || 5001;
const server = createServer();
const httpServer = createHttpServer(server);
const io = createWSServer(httpServer);

// Can be put into a separate file, can't be bothered too :)
io.on("connection", (socket) => {
  socket.on("get:tasks", async () => {
    const tasks = await prisma.column.findMany();
    return socket.emit("get:tasks", tasks);
  });

  socket.on("create:task", async (task: Omit<Column, "id">) => {
    const newTask = await prisma.column.create({
      data: {
        ...task,
      },
    });
    return io.emit("create:task", newTask);
  });

  socket.on(
    "update-status:task",
    async (data: { id: Column["id"]; state: string }) => {
      const updatedTask = await prisma.column.update({
        where: {
          id: data.id,
        },
        data: {
          state: data.state,
        },
      });
      return io.emit("update-status:task", updatedTask);
    }
  );
});

httpServer.listen(port, () => {
  console.log(`api running on ${port}`);
});
