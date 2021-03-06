import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import {
  graphqlExpress as graphql,
  graphiqlExpress as graphiql
} from "apollo-server-express";

import schema from "./graphql/schema";

const rememberSession = (_, res, next) => {
  res.set("Cache-Control", "private");
  return next();
};

export default (app: express.Application) => {
  const dev = process.env.NODE_ENV !== "production";

  app.disable("x-powered-by");

  // app.enable("trust proxy");

  app.use(cookieParser());

  app.use(
    cors({
      credentials: true,
      origin: dev ? "http://localhost:3000" : "https://oyah.xyz"
    })
  );

  app.options(
    dev ? "http://localhost:3000" : "https://oyah.xyz",
    cors({
      credentials: true,
      origin: dev ? "http://localhost:3000" : "https://oyah.xyz"
    })
  );

  app.use((req: any, res: any, next) => {
    const authHeader =
      req.headers.authorization &&
      req.headers.authorization !== "" &&
      req.headers.authorization !== "null"
        ? req.headers.authorization
        : null;

    if (authHeader) {
      res.locals.sessCookie = authHeader;
    }
    return next();
  });

  app.use(rememberSession);

  app.post(
    "/",
    bodyParser.json(),
    graphql((req, res) => ({
      context: { req, res },
      schema
    }))
  );

  if (dev) {
    app.get("/", graphiql({ endpointURL: "/" }));
  }
};
