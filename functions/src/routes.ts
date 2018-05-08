import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import {
  graphqlExpress as graphql,
  graphiqlExpress as graphiql
} from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";
import * as uuid from "uuid/v4";

import schema from "./graphql/schema";

export default (app: express.Application, nextApp, handle) => {
  nextApp.prepare().then(() => {
    const dev = process.env.NODE_ENV !== "production";

    app.use(compression());

    app.use(
      cors({
        origin:
          // dev
          // ?
          // "http://localhost:5000",
        "https://oyah.xyz",
        // : "https://oyah.xyz",
        credentials: true
      })
    );

    app.use((req, res, next) => {
      const authHeader =
        req.headers.authorization === "" || req.headers.authorization === "null"
          ? // ? req.cookies.session || parseCookie(req.headers.cookie).session
            null
          : req.headers.authorization;

      if (authHeader) {
        res.locals.jwt = authHeader;
      }
      return next();
    });

    app.use((req, res, next) => {
      if (req.url === "/sw.js") {
        nextApp.serveStatic(req, res, path.resolve("../public/sw.js"));
      }
      return next();
    });

    app.use(express.static(path.join(__dirname, "../public")));

    app.post(
      "/graphql",
      bodyParser.json(),
      apolloUploadExpress(),
      graphql((req, res) => ({
        context: { req, res },
        schema
      }))
    );

    if (dev) {
      app.get("/graphql", graphiql({ endpointURL: "/graphql" }));
    }

    app.get("/", (req, res) => {
      return nextApp.render(req, res, "/index", req.query);
    });

    app.get("/articles", (req, res) => {
      return nextApp.render(req, res, "/Articles", req.query);
    });

    app.get("/articles/new/:id?", (req, res) => {
      if (req.params.id !== undefined) {
        return nextApp.render(req, res, "/WriteArticle", {
          ...req.query,
          id: req.params.id ? req.params.id : null
        });
      } else {
        res.redirect("/articles/new/" + uuid());
      }
    });

    app.get("/articles/:id", (req, res) => {
      return nextApp.render(req, res, "/article", {
        ...req.query,
        id: req.params.id
      });
    });

    app.get("/contact", (req, res) => {
      return nextApp.render(req, res, "/Contact", req.query);
    });

    app.get("/search", (req, res) => {
      return nextApp.render(req, res, "/Search", req.query);
    });

    app.get("/reset", (req, res) => {
      return nextApp.render(req, res, "/reset", req.query);
    });

    app.get("/signup", (req, res) => {
      return nextApp.render(req, res, "/signup", req.query);
    });

    app.get("/login", (req, res) => {
      return nextApp.render(req, res, "/login", req.query);
    });

    app.get("/logout", (req, res) => {
      return nextApp.render(req, res, "/logout", req.query);
    });

    app.get("/profile", (req, res) => {
      return nextApp.render(req, res, "/Profile", req.query);
    });

    app.get("/settings", (req, res) => {
      return nextApp.render(req, res, "/Settings", req.query);
    });

    app.get("/signout", (req, res) => {
      res.clearCookie("session");
      if (req.query.redirect_to) {
        res.redirect(decodeURIComponent(req.query.redirect_to));
      } else {
        res.redirect("/");
      }
    });

    app.get("/policies/:name", (req, res) => {
      return nextApp.render(req, res, "/policy", {
        ...req.query,
        name: req.params.name
      });
    });

    app.get("/users/:nametag", (req, res) => {
      return nextApp.render(req, res, "/Profile", {
        ...req.query,
        nametag: req.params.nametag
      });
    });

    app.get("*", (req, res) => {
      return handle(req, res);
    });

    app.use(async (_, res, next) => {
      res.statusCode = 200;
      return next();
    });
  });
};
