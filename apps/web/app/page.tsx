"use client";
import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
        <Card key={task.id} {...task} />
      ))}
    </>
  );
}

export default function Page(): JSX.Element {
  const socket = useSocket();
  const [todoListRef] = useAutoAnimate();
  const [inProgressRef] = useAutoAnimate();
  const [doneRef] = useAutoAnimate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (socket === null) {
      return;
    }
    // All of this can be moved to a custom hook btw
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
    return () => {
      socket.off("get:tasks");
      socket.off("create:task");
      socket.off("update-status:task");
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

  if (socket === null) {
    return <div className={styles.empty}> loading... </div>;
  }
  if (tasks.length <= 0) {
    return <div className={styles.empty}>Create a task first</div>;
  }
  return (
    <div className={styles.columns}>
      <div className={styles.column} ref={todoListRef}>
        <ColumnHeader amount={groupedTasks.todo.length} text="To do" />
        <TaskList tasks={groupedTasks.todo} />
      </div>
      <div className={styles.column} ref={inProgressRef}>
        <ColumnHeader
          amount={groupedTasks["in-progress"].length}
          text="In progress"
        />
        <TaskList tasks={groupedTasks["in-progress"]} />
      </div>
      <div className={styles.column} ref={doneRef}>
        <ColumnHeader amount={groupedTasks.done.length} text="Done" />
        <TaskList tasks={groupedTasks.done} />
      </div>
    </div>
  );
}
