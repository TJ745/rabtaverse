import { Server } from "socket.io";

let io: Server | null = null;

export function getIO() {
  if (!io) {
    console.log("⚡ Initializing Socket.IO");

    io = new Server({
      path: "/api/socket_io",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join", (userId: string) => {
        socket.data.userId = userId;
        socket.join(userId);

        io!.emit(
          "online_users",
          Array.from(io!.sockets.sockets.values())
            .map((s) => s.data?.userId)
            .filter(Boolean),
        );
      });

      socket.on("send_message", (payload) => {
        socket.broadcast.emit("receive_message", {
          id: Date.now().toString(),
          conversationId: payload.conversationId,
          fromMe: false,
          text: payload.content,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });

      socket.on("typing", (payload) => {
        socket.broadcast.emit("typing", payload);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  }

  return io;
}
