"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSocket } from "./use-socket";
import type { CardProps } from "./card/card";

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

export default function Page(): JSX.Element {
  const socket = useSocket();
  const [tasks, setTasks] = useState<CardProps[]>([]);

  useEffect(() => {
    socket?.emit("get:tasks");
    socket?.on("get:tasks", (_tasks: CardProps[]) => {
      setTasks(_tasks);
    });
    return () => {
      socket?.off("get:tasks");
    };
  }, [socket]);

  if (socket === null) {
    return <div> loading... </div>;
  }
  if (tasks.length <= 0) {
    return <div className={styles.empty}>Create a task first</div>;
  }
  return (
    <div className={styles.columns}>
      <div className={styles.column}>
        <ColumnHeader amount={0} text="To do" />
      </div>
      <div className={styles.column}>
        <ColumnHeader amount={0} text="In progress" />
      </div>
      <div className={styles.column}>
        <ColumnHeader amount={0} text="Done" />
      </div>
    </div>
  );
}
