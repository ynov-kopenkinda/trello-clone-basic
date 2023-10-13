"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Card } from "./card/card";
import styles from "./page.module.css";
import type { Task } from "./task.type";
import { useTasks } from "./use-tasks";

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

export function TaskListSkeleton(): JSX.Element {
  return <div className={styles.column} data-skeleton />;
}

export function PageInner(): JSX.Element {
  const [todoListRef] = useAutoAnimate();
  const [inProgressRef] = useAutoAnimate();
  const [doneRef] = useAutoAnimate();
  const { tasks, empty, loading } = useTasks();

  if (loading || empty) {
    return (
      <div className={styles.columns}>
        {!loading && empty ? (
          <div className={styles.empty}>Create the first task</div>
        ) : null}
        <TaskListSkeleton />
        <TaskListSkeleton />
        <TaskListSkeleton />
      </div>
    );
  }

  return (
    <div className={styles.columns}>
      <div className={styles.column} ref={todoListRef}>
        <ColumnHeader amount={tasks.todo.length} text="To do" />
        <TaskList tasks={tasks.todo} />
      </div>
      <div className={styles.column} ref={inProgressRef}>
        <ColumnHeader amount={tasks["in-progress"].length} text="In progress" />
        <TaskList tasks={tasks["in-progress"]} />
      </div>
      <div className={styles.column} ref={doneRef}>
        <ColumnHeader amount={tasks.done.length} text="Done" />
        <TaskList tasks={tasks.done} />
      </div>
    </div>
  );
}
