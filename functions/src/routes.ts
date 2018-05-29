import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as compression from "compression";
import * as cookieSession from "cookie-session";
import * as bodyParser from "body-parser";
import {
  graphqlExpress as graphql,
  graphiqlExpress as graphiql
} from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";
import * as uuid from "uuid/v4";
import * as LRUCache from "lru-cache";

import schema from "./graphql/schema";

import config from "./config";

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 * 24 // 1 Day
});

export default (app: express.Application, nextApp, handle) => {
  nextApp.prepare().then(() => {
    const dev = process.env.NODE_ENV !== "production";

    app.use(compression());

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    app.use(
      cookieSession({
        secret: config.cookieSecret,
        maxAge: expiresIn
        // httpOnly: true
        // secure: true
      })
    );

    app.use(
      cors({
        origin:
          // dev
          // ?
          "http://localhost:5000",
        // "https://oyah.xyz",
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

    app.use((req, res, next) => {
      if (req.url.startsWith("/js")) {
        nextApp.serveStatic(req, res, path.resolve(`../public${req.url}`));
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
      return renderAndCache(req, res, "/index", req.query);
    });

    app.get("/articles", (req, res) => {
      return renderAndCache(req, res, "/Articles", req.query);
    });

    app.get("/articles/new/:id?", (req, res) => {
      if (req.params.id !== undefined) {
        return renderAndCache(req, res, "/WriteArticle", {
          ...req.query,
          id: req.params.id ? req.params.id : null
        });
      } else {
        res.redirect("/articles/new/" + uuid());
      }
    });

    app.get("/articles/:id", (req, res) => {
      return renderAndCache(req, res, "/article", {
        ...req.query,
        id: req.params.id
      });
    });

    app.get("/search", (req, res) => {
      return renderAndCache(req, res, "/Search", req.query);
    });

    app.get("/reset", (req, res) => {
      return renderAndCache(req, res, "/reset", req.query);
    });

    app.get("/signup", (req, res) => {
      return renderAndCache(req, res, "/signup", req.query);
    });

    app.get("/login", (req, res) => {
      return renderAndCache(req, res, "/login", req.query);
    });

    app.get("/logout", (req, res) => {
      return renderAndCache(req, res, "/logout", req.query);
    });

    app.get("/profile", (req, res) => {
      return renderAndCache(req, res, "/Profile", req.query);
    });

    app.get("/settings", (req, res) => {
      return renderAndCache(req, res, "/Settings", req.query);
    });

    app.get("/signout", (req: any, res) => {
      // res.clearCookie("session");
      // req.session = null;
      if (req.query.redirect_to) {
        res.redirect(decodeURIComponent(req.query.redirect_to));
      } else {
        res.redirect("/");
      }
    });

    app.get("/policies/:name", (req, res) => {
      return renderAndCache(req, res, "/policy", {
        ...req.query,
        name: req.params.name
      });
    });

    app.get("/users/:nametag", (req, res) => {
      return renderAndCache(req, res, "/Profile", {
        ...req.query,
        nametag: req.params.nametag
      });
    });

    app.get("*", (req: any, res) => {
      return handle(req, res);
    });

    app.use(async (req: any, res, next) => {
      // console.log(req.headers);
      // console.log(req.cookies.session);

      console.log(req.session);

      res.statusCode = 200;
      return next();
    });
  });

  function getCacheKey(req) {
    return `${req.url}`;
  }

  async function renderAndCache(req, res, pagePath, queryParams) {
    const key = getCacheKey(req);

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
      res.setHeader("x-cache", "HIT");
      res.send(ssrCache.get(key));
      return;
    }

    try {
      // If not let's render the page into HTML
      const html = await nextApp.renderToHTML(req, res, pagePath, queryParams);

      // Something is wrong with the request, let's skip the cache
      if (res.statusCode !== 200) {
        res.send(html);
        return;
      }

      // Let's cache this page
      ssrCache.set(key, html);

      res.setHeader("x-cache", "MISS");
      res.send(html);
    } catch (err) {
      nextApp.renderError(err, req, res, pagePath, queryParams);
    }
  }
};
