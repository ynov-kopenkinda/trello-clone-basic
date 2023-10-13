import { clientEnv } from "env/client";
import { useEffect, useState } from "react";

export const useAvatar = (
  userId: string | undefined,
  load = false
): string | null => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = (): void => {
      fetch(`${clientEnv.NEXT_PUBLIC_API_URL}/api/avatar/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Not found");
          }
          return response.json() as Promise<{ url: string }>;
        })
        .then((data) => {
          setAvatar(data.url);
        })
        .catch(() => {
          setAvatar(null);
        });
    };
    if (load && userId !== undefined) {
      fetchAvatar();
    }
  }, [userId, load]);

  return avatar;
};
