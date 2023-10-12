import { prisma } from ".";

import type { Column } from "@prisma/client";

const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Column 1",
    column: "todo",
    description: "Column 1 description",
    priority: 1,
    state: "active",
  },
] satisfies Column[];

(async () => {
  try {
    await Promise.all(
      DEFAULT_TASKS.map((task) =>
        prisma.column.upsert({
          where: {
            id: task.id,
          },
          update: {
            ...task,
          },
          create: {
            ...task,
            id: undefined,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
