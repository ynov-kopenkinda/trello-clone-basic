"use client";

import { useUser } from "@clerk/nextjs";
import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import { SocketProvider } from "../socket-context";
import type { Task } from "../task.type";
import { useSocket } from "../use-socket";
import styles from "./create-task.module.css";

function CreateTaskInner(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const socket = useSocket();
  if (!user || !socket.connected) {
    return <div />;
  }
  return (
    <div className={styles.group}>
      <button
        className={styles.button}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        type="button"
      >
        Create a task
        <IconChevronDown
          size={12}
          style={{
            transform: open
              ? "rotateX(180deg) translateY(1px)"
              : "rotateX(0deg)",
          }}
        />
      </button>
      {open ? (
        <form
          className={styles.modal}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target as HTMLFormElement);
            const title = data.get("task-title");
            const description = data.get("task-description");
            const prioritiy = data.get("task-prioritiy");
            const state = data.get("task-state");
            // No validation, but we can use something like Zod both on the client and server
            const task: Omit<Task, "id" | "authorId" | "authorImg"> = {
              title: title === null ? "" : (title as string),
              description: description === null ? "" : (description as string),
              priority: prioritiy === null ? 0 : Number(prioritiy as string),
              state: state === null ? "todo" : (state as string),
            };
            socket.connection.emit("create:task", task);
            setOpen(false);
          }}
        >
          <div>
            <label htmlFor="task-title">Title</label>
            <input
              className={styles.input}
              id="task-title"
              name="task-title"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="task-description">Description</label>
            <textarea
              className={styles.input}
              id="task-description"
              name="task-description"
              rows={4}
            />
          </div>
          <div>
            <label htmlFor="task-prioritiy">Prioritiy</label>
            <input
              className={styles.input}
              id="task-prioritiy"
              min={0}
              name="task-prioritiy"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="task-state">State</label>
            <select className={styles.input} id="task-state" name="task-state">
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button className={styles.button} type="submit">
            Create
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function CreateTask(): JSX.Element {
  return (
    <SocketProvider>
      <CreateTaskInner />
    </SocketProvider>
  );
}
