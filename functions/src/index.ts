import * as functions from "firebase-functions";
import * as express from "express";
import * as next from "next";
import routes from "./routes";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

const server = express();
routes(server, app, handle);

exports.next = functions.https.onRequest(server);
