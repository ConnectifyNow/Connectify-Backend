import initApp from "./app";
import http, { Server } from "http";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Socket, Server as SocketServer } from "socket.io";
import { verifyToken } from "./middlewares/auth.middleware";
import { isUserPartOfConversation } from "./middlewares/conversation_guard.middleware";
import { sendMessageToConversation } from "./services/chat.service";
import https from "https";
import fs from "fs";

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
      servers: [
        {
          url:
            process.env.NODE_ENV === "production"
              ? "https://node30.cs.colman.ac.il"
              : "http://localhost:" + process.env.PORT
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    },

    apis: ["./src/routes/*.ts"]
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  let server: Server;
  let port: string;
  if (process.env.NODE_ENV !== "production") {
    console.log("development");
    port = process.env.PORT;
    server = http.createServer(app);
  } else {
    console.log("production");
    port = process.env.HTTPS_PORT;
    const options = {
      key: fs.readFileSync("./client-key.pem"),
      cert: fs.readFileSync("./client-cert.pem")
    };
    server = https.createServer(options, app);
  }

  server = server
    .listen(port, () => {
      if (process.env.NODE_ENV !== "production")
        console.log(`Server running on http://localhost:${port}`);
      else console.log(`Server running on https://localhost:${port}`);
    })
    .on("error", (err) => {
      console.error("Error creating server:", err.message);
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
          sender: newMessage.sender
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
