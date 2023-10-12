import styles from "./card.module.css";

export interface CardProps {
  title: string;
  description?: string;
  state?: string;
  prioritiy?: number;
}

export function Card(props: CardProps): JSX.Element {
  const withFooter: boolean =
    props.state !== undefined || props.prioritiy !== undefined;
  return (
    <div className={styles.card}>
      <b className={styles.title}>{props.title}</b>
      {props.description !== undefined && (
        <p className={styles.description}>{props.description}</p>
      )}
      {withFooter ? (
        <div className={styles.footer}>
          {props.state !== undefined && (
            <span className={styles.state}>{props.state}</span>
          )}
          <span className={styles.prioritiy}>{props.prioritiy}</span>
        </div>
      ) : null}
    </div>
  );
}
