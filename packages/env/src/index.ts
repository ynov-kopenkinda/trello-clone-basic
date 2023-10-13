import { getClientEnv } from "./client";
import { getServerEnv } from "./server";

export const env = {
  ...getServerEnv(),
  ...getClientEnv(),
};

