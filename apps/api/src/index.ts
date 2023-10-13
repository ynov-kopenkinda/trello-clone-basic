import { type Column, prisma } from "database";
import { createServer, createWSServer } from "./server";
import { createServer as createHttpServer } from "node:http";

const port = process.env.PORT || 5001;
const server = createServer();
const httpServer = createHttpServer(server);
const io = createWSServer(httpServer);

const auth: Record<string, { id: string }> = {};

// Can be put into a separate file, can't be bothered too :)
io.on("connection", (socket) => {
  auth[socket.id] = {
    id: socket.handshake.auth.token,
  };

  const userid = () => auth[socket.id].id;

  const isAuthor = async (id: Column["id"]) => {
    const canUpdate = await prisma.column.findFirst({
      where: {
        id,
        authorId: userid(),
      },
    });
    if (!canUpdate) {
      return false;
    }
    return true;
  };

  console.log("connected", socket.id, userid());

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id, userid());
    delete auth[socket.id];
  });

  socket.on("get:tasks", async () => {
    const tasks = await prisma.column.findMany();
    return socket.emit("get:tasks", tasks);
  });

  socket.on("create:task", async (task: Omit<Column, "id" | "authorId">) => {
    const newTask = await prisma.column.create({
      data: {
        ...task,
        authorId: userid(),
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

  socket.on("delete:task", async ({ id }: { id: Column["id"] }) => {
    const canUpdate = await isAuthor(id);
    if (!canUpdate) {
      return;
    }
    const deletedTask = await prisma.column.delete({
      where: {
        id,
      },
    });
    return io.emit("delete:task", deletedTask.id);
  });
});

httpServer.listen(port, () => {
  console.log(`api running on ${port}`);
});
