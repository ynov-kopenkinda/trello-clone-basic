import { UserButton } from "@clerk/nextjs";
import { CreateTask } from "../create-task/create-task";
import styles from "./header.module.css";

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>Trello by DK</span>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <CreateTask />
        <UserButton />
      </div>
    </header>
  );
}
