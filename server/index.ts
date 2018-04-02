import * as Koa from "koa";
import * as next from "next";
import * as Router from "koa-router";
import * as koaBody from "koa-bodyparser";
import * as koaConnect from "koa-connect";
import * as serve from "koa-static";
import * as compression from "compression";
import { graphqlKoa, graphiqlKoa } from "apollo-server-koa";
import { apolloUploadKoa } from "apollo-upload-server";
import * as uuid from "uuid/v4";

import schema from "./graphql/schema";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  require("./db/relationships");

  server.use(koaConnect(compression()));
  server.use(serve("static"));

  server.use(async (ctx, next) => {
    const authHeader =
      ctx.get("authorization") === "" || ctx.get("authorization") === "null"
        ? ctx.cookies.get("token")
        : ctx.get("authorization");
    if (authHeader) {
      ctx.state.jwt = authHeader;
    }
    return next();
  });

  router.post(
    "/graphql",
    koaBody(),
    apolloUploadKoa(),
    graphqlKoa(context => ({ context, schema }))
  );

  if (dev) {
    router.get("/graphql", graphiqlKoa({ endpointURL: "/graphql" }));
  }

  router.get("/", async ctx => {
    await app.render(ctx.req, ctx.res, "/index", ctx.query);
    ctx.respond = false;
  });

  router.get("/articles", async ctx => {
    await app.render(ctx.req, ctx.res, "/Articles", ctx.query);
    ctx.respond = false;
  });

  router.get("/articles/new/:id?", async ctx => {
    if (ctx.params.id !== undefined) {
      await app.render(ctx.req, ctx.res, "/WriteArticle", {
        ...ctx.query,
        id: ctx.params.id ? ctx.params.id : null
      });
      ctx.respond = false;
    } else {
      ctx.redirect("/articles/new/" + uuid());
    }
  });

  router.get("/articles/:id", async ctx => {
    await app.render(ctx.req, ctx.res, "/article", {
      ...ctx.query,
      id: ctx.params.id
    });
    ctx.respond = false;
  });

  router.get("/contact", async ctx => {
    await app.render(ctx.req, ctx.res, "/Contact", ctx.query);
    ctx.respond = false;
  });

  router.get("/search", async ctx => {
    await app.render(ctx.req, ctx.res, "/Search", ctx.query);
    ctx.respond = false;
  });

  router.get("/reset", async ctx => {
    await app.render(ctx.req, ctx.res, "/reset", ctx.query);
    ctx.respond = false;
  });

  router.get("/signup", async ctx => {
    await app.render(ctx.req, ctx.res, "/signup", ctx.query);
    ctx.respond = false;
  });

  router.get("/login", async ctx => {
    await app.render(ctx.req, ctx.res, "/login", ctx.query);
    ctx.respond = false;
  });

  router.get("/logout", async ctx => {
    await app.render(ctx.req, ctx.res, "/logout", ctx.query);
    ctx.respond = false;
  });

  router.get("/profile", async ctx => {
    await app.render(ctx.req, ctx.res, "/Profile", ctx.query);
    ctx.respond = false;
  });

  router.get("/settings", async ctx => {
    await app.render(ctx.req, ctx.res, "/Settings", ctx.query);
    ctx.respond = false;
  });

  router.get("/signout", async ctx => {
    ctx.cookies.set("token", "");
    if (ctx.query.redirect_to) {
      ctx.redirect(decodeURIComponent(ctx.query.redirect_to));
    } else {
      ctx.redirect("/");
    }
  });

  router.get("/policies/:name", async ctx => {
    await app.render(ctx.req, ctx.res, "/policy", {
      ...ctx.query,
      name: ctx.params.name
    });
    ctx.respond = false;
  });

  router.get("/users/:nametag", async ctx => {
    await app.render(ctx.req, ctx.res, "/Profile", {
      ...ctx.query,
      nametag: ctx.params.nametag
    });
    ctx.respond = false;
  });

  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.use(router.routes());
  server.use(router.allowedMethods());
  server.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
