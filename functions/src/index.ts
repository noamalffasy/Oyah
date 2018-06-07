import * as functions from "firebase-functions";
import * as express from "express";
import * as next from "next";

import nextRoutes from "./nextRoutes";
import apiRoutes from "./apiRoutes";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, conf: { distDir: "next" } });
const handle = app.getRequestHandler();

const nextServer = express();
nextRoutes(nextServer, app, handle);

const apiServer = express();
apiRoutes(apiServer);

exports.next = functions.https.onRequest(nextServer);
exports.api = functions.https.onRequest(apiServer);
