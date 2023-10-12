"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSocket } from "./use-socket";
import { Card } from "./card/card";
import type { Task } from "./task.type";

export function ColumnHeader({
  amount,
  text,
}: {
  text: string;
  amount: number;
}): JSX.Element {
  return (
    <span className={styles.title}>
      <span>{text}</span>
      <span className={styles.titleAmount}>{amount}</span>
    </span>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }): JSX.Element {
  return (
    <>
      {tasks.map((task) => (
        <Card
          description={task.description}
          key={task.id}
          priority={task.priority}
          state={task.state}
          title={task.title}
        />
      ))}
    </>
  );
}

export default function Page(): JSX.Element {
  const socket = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);

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
    return () => {
      socket.off("get:tasks");
      socket.off("create:task");
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

  if (socket === null) {
    return <div className={styles.empty}> loading... </div>;
  }
  if (tasks.length <= 0) {
    return <div className={styles.empty}>Create a task first</div>;
  }
  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <ColumnHeader amount={groupedTasks.todo.length} text="To do" />
        <TaskList tasks={groupedTasks.todo} />
      </div>
      <div className={styles.column}>
        <ColumnHeader
          amount={groupedTasks["in-progress"].length}
          text="In progress"
        />
        <TaskList tasks={groupedTasks["in-progress"]} />
      </div>
      <div className={styles.column}>
        <ColumnHeader amount={groupedTasks.done.length} text="Done" />
        <TaskList tasks={groupedTasks.done} />
      </div>
    </div>
  );
}
