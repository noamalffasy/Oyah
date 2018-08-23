import * as express from "express";
import * as next from "next";

import nextRoutes from "./nextRoutes";

const dev = process.env.NODE_ENV !== "production";
const app = next(
  dev ? { dev, dir: "../app" } : { dev, conf: { distDir: "next" } }
);
const handle = app.getRequestHandler();

const nextServer = express();
nextRoutes(nextServer, app, handle);

nextServer.listen(8080, () => console.log("Oyah is listening on port 8080"))
