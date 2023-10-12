// @ts-check
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const getEnv = (runtimeEnv = process.env) => {
  return createEnv({
    runtimeEnv,
    clientPrefix: "NEXT_PUBLIC_",
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    },
    server: {
      CLERK_SECRET_KEY: z.string(),
      DATABASE_URL: z.string(),
    },
  });
};

export const env = getEnv();
