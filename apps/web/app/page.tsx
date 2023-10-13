"use client";

import { PageInner } from "./page-inner";
import { SocketProvider } from "./socket-context";

export default function Page(): JSX.Element {
  return (
    <SocketProvider>
      <PageInner />
    </SocketProvider>
  );
}
