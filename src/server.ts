import initApp from "./app";
import http from "http";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Socket, Server as SocketServer } from "socket.io";
import { verifyToken } from "./middlewares/auth.middleware";
import { isUserPartOfConversation } from "./middlewares/conversation_guard.middleware";
import { sendMessageToConversation } from "./services/chat.service";

initApp().then((app) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Advanced Application development 2025 REST API",
        version: "1.0.1",
        description:
          "REST server including authentication using JWT and refresh token"
      },
      servers: [{ url: "http://localhost:3000" }]
    },
    apis: ["./src/routes/*.ts"]
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  const port = process.env.PORT || 3000;

  let server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  const io = new SocketServer({ cors: { origin: "*" } }).listen(server);

  async function addUserToSocketDataIfAuthenticated(
    socket: Socket,
    next: (err?: Error) => void
  ) {
    const token = socket.handshake.auth.token;
    verifyToken(token, (err, user) => {
      if (!err) {
        socket.data = { ...socket.data, userId: user._id };
        next();
      }
    });
  }

  io.use(addUserToSocketDataIfAuthenticated);

  io.on("connection", async (socket) => {
    console.log("user connected to socket stream");

    socket.on("joinRoom", async (conversationId) => {
      const canJoinRoom = await isUserPartOfConversation(
        conversationId,
        socket.data.userId
      );

      if (canJoinRoom) {
        console.log(`user has connected to room ${conversationId}`);
        socket.join(conversationId);
      } else {
        console.log(`user cannot connect to room ${conversationId}`);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { conversationId, content } = data;
      console.log(`user sent message to room ${conversationId}`);

      try {
        const newMessage = await sendMessageToConversation(
          conversationId,
          socket.data.userId,
          content
        );
        io.to(conversationId).emit("receiveMessage", {
          conversationId,
          id: newMessage.id,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
          senderId: socket.data.userId
        });
      } catch (err) {
        console.log(`failed to send message to room ${conversationId}`);
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      console.log("user has disconnected");
    });
  });
});
