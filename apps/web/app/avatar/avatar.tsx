import Image from "next/image";
import styles from "./avatar.module.css";

export function Avatar({ userId }: { userId: string }): JSX.Element {
  return (
    <Image
      alt=""
      className={styles.avatar}
      height={24}
      src={`https://avatars.dicebear.com/api/avataaars/${userId}.svg`}
      width={24}
    />
  );
}
