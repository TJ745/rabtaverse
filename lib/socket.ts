import { getSession } from "@/lib/auth"; // your betterAuth helper
import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;

export async function initSocket(userId: string) {
  const session = await getSession();
  const token = session?.session?.token; // Make sure this is where your JWT is stored

  if (!token) {
    console.warn("⚠️ No token found. Socket will not connect.");
    return;
  }

  socket = io("http://192.168.70.115:4000", {
    autoConnect: true,
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => console.log("✅ Socket connected", socket?.id));
  socket.on("disconnect", (reason) =>
    console.log("⚡ Socket disconnected", reason),
  );
  socket.on("connect_error", (err) =>
    console.error("⚡ Socket error:", err.message),
  );

  return socket;
}
