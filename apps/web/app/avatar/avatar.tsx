"use client";

import Image from "next/image";
import styles from "./avatar.module.css";
import { useAvatar } from "./use-avatar";

const cache = new Map<string, string>();

export function Avatar({ userId }: { userId: string }): JSX.Element {
  const cached = cache.get(userId);
  const inCache = cached !== undefined;
  const avatarUrl = useAvatar(userId, !inCache);
  if (!inCache && avatarUrl !== null) {
    cache.set(userId, avatarUrl);
  }
  if (inCache) {
    return (
      <Image
        alt=""
        className={styles.avatar}
        height={24}
        src={cached}
        width={24}
      />
    );
  }

  return (
    <Image
      alt=""
      className={styles.avatar}
      height={24}
      src={avatarUrl ?? "https://api.dicebear.com/avatar.svg"}
      width={24}
    />
  );
}
