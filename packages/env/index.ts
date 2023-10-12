// @ts-check
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config } from "dotenv";
import path from "path";

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

const envPath = path.resolve(process.cwd() + "../../../.env");

config({ path: envPath });

export const env = getEnv();
