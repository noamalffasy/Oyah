import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import {
  graphqlExpress as graphql,
  graphiqlExpress as graphiql
} from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";

import schema from "./graphql/schema";

import config from "./config";

const rememberSession = (req, res, next) => {
  res.set("Cache-Control", "private");
  return next();
};

export default (app: express.Application) => {
  const dev = process.env.NODE_ENV !== "production";

  // app.set("trust proxy", 1);

  app.use(cookieParser());

  app.use(
    cors({
      origin(origin, callback) {
        // console.log(origin);

        // const domains = ["http://localhost:5000", "https://oyah.xyz"];
        // if (domains.indexOf(origin) !== -1) {
        //   callback(null, true);
        // } else {
        //   callback(new Error("Not allowed by CORS"));
        // }
        callback(null, true);
      },
      credentials: true
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
    apolloUploadExpress(),
    graphql((req, res) => ({
      context: { req, res },
      schema
    }))
  );

  if (dev) {
    app.get("/", graphiql({ endpointURL: "/" }));
  }
};
