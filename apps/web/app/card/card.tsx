import { Avatar } from "../avatar/avatar";
import type { Task } from "../task.type";
import { CardActions } from "./actions";
import styles from "./card.module.css";

const getStateColor = (state: string): string => {
  const map: Record<string, string | undefined> = {
    "in-progress": "#f0ad4e",
    done: "#5cb85c",
    todo: "#4fa2d9",
  };
  return map[state] ?? "red";
};

export function Card(props: Task): JSX.Element {
  return (
    <div className={styles.card}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <b className={styles.title}>{props.title}</b>
        <Avatar userId={props.authorId} />
      </div>
      {props.description !== null && (
        <p className={styles.description}>{props.description}</p>
      )}
      <div className={styles.footer}>
        <span
          className={styles.state}
          style={{ "--state-color": getStateColor(props.state) }}
        >
          {props.state}
        </span>
        <span className={styles.prioritiy}>#P{props.priority}</span>
        <CardActions id={props.id} state={props.state} />
      </div>
    </div>
  );
}
