import { useContext } from "react";
import type { SocketContext } from "./socket-context";
import { socketContext } from "./socket-context";

export function useSocket(): SocketContext {
  return useContext(socketContext);
}
