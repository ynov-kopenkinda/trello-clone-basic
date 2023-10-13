"use client";

import {
  IconCheck,
  IconFileArrowLeft,
  IconFileArrowRight,
} from "@tabler/icons-react";
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
  if (props.state === "done") {
    return <div />;
  }
  return (
    <div className={styles.actions}>
      {props.state === "in-progress" && (
        <>
          <button
            className={styles.action}
            onClick={() => {
              socket.emit("update-status:task", {
                id: props.id,
                state: "todo",
              });
            }}
            title='Mark as "To Do"'
            type="button"
          >
            <IconFileArrowLeft size={12} />
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
            title="Mark as done"
            type="button"
          >
            <IconCheck size={12} />
          </button>
        </>
      )}
      {props.state === "todo" && (
        <button
          className={styles.action}
          onClick={() => {
            socket.emit("update-status:task", {
              id: props.id,
              state: "in-progress",
            });
          }}
          title='Mark as "In Progress"'
          type="button"
        >
          <IconFileArrowRight size={12} />
        </button>
      )}
    </div>
  );
}