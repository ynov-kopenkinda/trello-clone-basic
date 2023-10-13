"use client";

import {
  IconCheck,
  IconFileArrowLeft,
  IconFileArrowRight,
  IconTrash,
} from "@tabler/icons-react";
import type { Task } from "../task.type";
import { useSocket } from "../use-socket";
import styles from "./card.module.css";

export function CardActions(props: {
  id: Task["id"];
  state: Task["state"];
}): JSX.Element {
  const socket = useSocket();
  if (!socket.connected) {
    return <div />;
  }
  if (props.state === "done") {
    return <div />;
  }
  return (
    <div className={styles.actions}>
      {props.state === "in-progress" && (
        <button
          className={styles.action}
          onClick={() => {
            socket.connection.emit("update-status:task", {
              id: props.id,
              state: "todo",
            });
          }}
          title='Mark as "To Do"'
          type="button"
        >
          <IconFileArrowLeft size={12} />
        </button>
      )}
      {props.state === "in-progress" && (
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
            socket.connection.emit("update-status:task", {
              id: props.id,
              state: "done",
            });
          }}
          title="Mark as done"
          type="button"
        >
          <IconCheck size={12} />
        </button>
      )}
      {props.state === "todo" && (
        <button
          className={styles.action}
          onClick={() => {
            socket.connection.emit("update-status:task", {
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
      <button
        className={styles.action}
        data-danger
        onClick={() => {
          // eslint-disable-next-line no-alert -- No modal/alert component yet
          const sure = window.confirm(
            "Are you sure you want to delete this task? This action is irreversible."
          );
          if (!sure) {
            return;
          }
          socket.connection.emit("delete:task", {
            id: props.id,
          });
        }}
        title="Delete task"
        type="button"
      >
        <IconTrash size={12} />
      </button>
    </div>
  );
}
