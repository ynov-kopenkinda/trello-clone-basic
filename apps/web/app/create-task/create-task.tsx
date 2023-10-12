"use client";

import { useState } from "react";
import { useSocket } from "../use-socket";
import type { Task } from "../task.type";
import styles from "./create-task.module.css";

export function CreateTask(): JSX.Element {
  const [open, setOpen] = useState(false);
  const _socket = useSocket();
  return (
    <div className={styles.group}>
      <button
        className={styles.button}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        type="button"
      >
        Create a task {!open ? "+" : "-"}
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
            const task: Omit<Task, "id"> = {
              title: title === null ? "" : (title as string),
              description: description === null ? "" : (description as string),
              priority: prioritiy === null ? 0 : Number(prioritiy as string),
              state: state === null ? "todo" : (state as string),
            };
            _socket?.emit("create:task", task);
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
