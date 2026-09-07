import { Server } from "socket.io";

let ioInstance = null;

export function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  ioInstance.on("connection", (socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    // Join specific rooms
    socket.on("join_booking_room", (bookingId) => {
      socket.join(`booking_${bookingId}`);
      console.log(`Socket ${socket.id} joined room booking_${bookingId}`);
    });

    socket.on("join_worker_room", (workerId) => {
      socket.join(`worker_${workerId}`);
      console.log(`Socket ${socket.id} joined room worker_${workerId}`);
    });

    socket.on("join_admin_room", () => {
      socket.join("admin_room");
      console.log(`Socket ${socket.id} joined admin_room`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}
