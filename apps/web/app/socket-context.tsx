"use client";
import { useUser } from "@clerk/nextjs";
import type { PropsWithChildren } from "react";
import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

type DefaultSocket = ReturnType<typeof io>;

export type SocketContext =
  | {
      connected: true;
      connection: DefaultSocket;
    }
  | {
      connected: false;
      connection: DefaultSocket;
      reconnect: () => void;
    }
  | {
      connected: false;
      connection: null;
    };

const defaultSocketContext: SocketContext = {
  connected: false,
  connection: null,
};

export const socketContext = createContext<SocketContext>(defaultSocketContext);

export function SocketProvider({ children }: PropsWithChildren): JSX.Element {
  const socket = useRef<DefaultSocket | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }
    const newSocket = io("ws://localhost:5001", {
      auth: {
        token: user.id,
      },
    });
    socket.current = newSocket;
    newSocket.on("connect", () => {
      setLoaded(true);
    });
    newSocket.on("disconnect", () => {
      setLoaded(false);
      newSocket.connect();
    });
    return () => {
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.close();
      socket.current = null;
      setLoaded(false);
    };
  }, [user]);

  let contextValue: SocketContext = defaultSocketContext;

  if (loaded) {
    if (socket.current?.connected) {
      contextValue = {
        connected: true,
        connection: socket.current,
      };
    } else {
      contextValue = {
        connected: false,
        connection: socket.current,
        reconnect() {
          socket.current?.connect();
        },
      };
    }
  }

  return (
    <socketContext.Provider value={contextValue}>
      {children}
    </socketContext.Provider>
  );
}
