import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export type UseSocket = ReturnType<typeof io> | null;

export const useSocket = (): UseSocket => {
  const [socket, setSocket] = useState<UseSocket>(null);
  useEffect(() => {
    const newSocket = io("ws://localhost:5001");
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);
  return socket;
};
