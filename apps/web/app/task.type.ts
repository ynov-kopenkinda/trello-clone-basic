import type { CardProps } from "./card/card";

export type Task = CardProps & { column: string; id: number };
