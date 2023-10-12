"use client";

import type { Task } from "../task.type";
import { useSocket } from "../use-socket";
import styles from "./card.module.css";

export function CardActions(props: {
  id: Task["id"];
  state: Task["state"];
}): JSX.Element {
  const socket = useSocket();
  if (socket === null) {
    return <div />;
  }
  return (
    <>
      {props.state === "in-progress" && (
        <div className={styles.actions}>
          <button
            className={styles.action}
            onClick={() => {
              socket.emit("update-status:task", {
                id: props.id,
                state: "todo",
              });
            }}
            type="button"
          >
            &lt;
          </button>
          <button
            className={styles.action}
            onClick={() => {
              // eslint-disable-next-line no-alert -- No modal/alert component yet
              const sure = window.confirm(
                "Are you sure you want to mark this task as done? This action is irreversible."
              );
              if (!sure) {
                return;
              }
              socket.emit("update-status:task", {
                id: props.id,
                state: "done",
              });
            }}
            type="button"
          >
            &gt;
          </button>
        </div>
      )}
      {props.state === "todo" && (
        <div className={styles.actions}>
          <button
            className={styles.action}
            onClick={() => {
              socket.emit("update-status:task", {
                id: props.id,
                state: "in-progress",
              });
            }}
            type="button"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}
