import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const getClientEnv = () => {
  return createEnv({
    runtimeEnv: {
      NEXT_PUBLIC_API_PORT: process.env.NEXT_PUBLIC_API_PORT,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
      NEXT_PUBLIC_API_URL: z.string(),
      NEXT_PUBLIC_API_PORT: z.coerce.number(),
    },
  });
};

export const clientEnv = getClientEnv();
