import initApp from "./app";
import https from "https";
import http, { Server } from "http";
import fs from "fs";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { Socket, Server as SocketServer } from "socket.io";

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
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
  });
});
