"use client";

import { useState } from "react";
import { useSocket } from "../use-socket";
import styles from "./create-task.module.css";

export function CreateTask(): JSX.Element {
  const [open, setOpen] = useState(false);
  const socket = useSocket();
  return (
    <div className={styles.group}>
      <button
        className={styles.button}
        onClick={() => {
          setOpen((prev) => !prev);
          socket?.emit('create:task')
        }}
        type="button"
      >
        Create a task {!open ? "+" : "-"}
      </button>
      {open ? (
        <div className={styles.modal}>
          <input className={styles.input} type="text" />
        </div>
      ) : null}
    </div>
  );
}
