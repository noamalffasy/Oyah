import * as express from "express";
import * as next from "next";
import * as path from "path";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as uuid from "uuid/v4";
// import * as LRUCache from "lru-cache";

import * as admin from "firebase-admin";

const serviceAccount = require("./serviceAccountKey.json");

const rememberSession = (_, res, next) => {
  res.set("Cache-Control", "private");
  return next();
};

export default (app: express.Application, nextApp: next.Server, handle) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  nextApp.prepare().then(() => {
    // app.set("trust proxy", 1);

    app.use(cookieParser());

    app.use(rememberSession);

    app.use(express.static(path.join(__dirname, "../app/public")));

    app.use(compression());

    app.use((req, res, next) => {
      if (req.url === "/sw.js") {
        nextApp.serveStatic(req, res, path.resolve("../app/public/sw.js"));
      }
      return next();
    });

    app.use((req, res, next) => {
      if (req.url.startsWith("/js")) {
        nextApp.serveStatic(req, res, path.resolve(`../app/public${req.url}`));
      }
      return next();
    });

    app.get("/", (req: any, res) => {
      return nextApp.render(req, res, "/index", req.query);
    });

    app.get("/theme/:title", (req, res) => {
      return nextApp.render(req, res, "/theme", {
        ...req.query,
        title: req.params.title
      });
    });

    // app.get("/articles", (req, res) => {
    //   return nextApp.render(req, res, "/Articles", req.query);
    // });

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

    app.get("/search", (req, res) => {
      return nextApp.render(req, res, "/Search", req.query);
    });

    app.post("/login", (req, res) => {
      const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 Days

      admin
        .auth()
        .createSessionCookie(req.body, { expiresIn })
        .then(cookie => {
          const options: express.CookieOptions = {
            maxAge: expiresIn,
            httpOnly: true,
            // secure: false
            secure: true
          };
          
          res.cookie("__session", cookie, options);
        })
        .catch(err => {
          throw err;
        });

      res.send("Success");
    });
    app.get("/settings", (req, res) => {
      return nextApp.render(req, res, "/Settings", req.query);
    });

    app.get("/signout", (req: any, res) => {
      res.clearCookie("__session");
      // req.session = null;
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

    app.get("*", (req: any, res) => {
      return handle(req, res);
    });
  });
};
