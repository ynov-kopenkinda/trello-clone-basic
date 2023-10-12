import styles from "./card.module.css";

export interface CardProps {
  title: string;
  description: string | null;
  state: string;
  priority: number;
}

export function Card(props: CardProps): JSX.Element {
  return (
    <div className={styles.card}>
      <b className={styles.title}>{props.title}</b>
      {props.description !== null && (
        <p className={styles.description}>{props.description}</p>
      )}
      <div className={styles.footer}>
        <span className={styles.state}>{props.state}</span>
        <span className={styles.prioritiy}>{props.priority}</span>
      </div>
    </div>
  );
}
