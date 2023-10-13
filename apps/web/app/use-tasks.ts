import { useEffect, useState } from "react";
import type { Task } from "./task.type";
import { useSocket } from "./use-socket";

export interface UseTasks {
  empty: boolean;
  loading: boolean;
  tasks: {
    todo: Task[];
    "in-progress": Task[];
    done: Task[];
  };
}

export const useTasks = (): UseTasks => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket === null) {
      return;
    }
    socket.emit("get:tasks");
    socket.on("get:tasks", (_tasks: Task[]) => {
      setTasks(_tasks);
    });
    socket.on("create:task", (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });
    socket.on("update-status:task", (task: Task) => {
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === task.id);
        if (index === -1) {
          return prev;
        }
        const next = [...prev];
        next[index] = task;
        return next;
      });
    });
    socket.on("delete:task", (id: Task["id"]) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    });
    return () => {
      socket.off("get:tasks");
      socket.off("create:task");
      socket.off("update-status:task");
      socket.off("delete:task");
    };
  }, [socket]);

  const groupedTasks = tasks.reduce(
    (acc, task) => {
      acc[task.state as keyof typeof acc].push(task);
      return acc;
    },
    {
      todo: [] as Task[],
      "in-progress": [] as Task[],
      done: [] as Task[],
    }
  );

  const sortTasks = (a: Task, b: Task): -1 | 0 | 1 => {
    // eslint-disable-next-line no-nested-ternary -- It's fine
    return a.priority < b.priority ? 1 : a.priority === b.priority ? 0 : -1;
  };
  groupedTasks.done.sort(sortTasks);
  groupedTasks.todo.sort(sortTasks);
  groupedTasks["in-progress"].sort(sortTasks);

  return {
    loading: socket === null,
    tasks: groupedTasks,
    empty: tasks.length === 0,
  };
};
