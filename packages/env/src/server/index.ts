import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const getServerEnv = (runtimeEnv = process.env) => {
  return createEnv({
    runtimeEnv,
    server: {
      CLERK_SECRET_KEY: z.string(),
      DATABASE_URL: z.string(),
    },
  });
};
export const serverEnv = getServerEnv();
