import { ApolloClient } from "apollo-client";
// import { HttpLink } from "apollo-link-http";
// import { RetryLink } from "apollo-link-retry";
// import { onError } from "apollo-link-error";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import * as fetch from "isomorphic-unfetch";

let apolloClient: any = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

// function parseCookie(cookie: string) {
//   const cookies: any = {};
//   cookie.split("; ").map(cookie => {
//     cookies[cookie.split("=")[0]] = cookie.split("=")[1];
//   });
//   return cookies;
// }

function create(initialState: any, ctx: any = {}, jwt: any = "") {
  const domain =
    // process.env.NODE_ENV === "production"
    //   ? "https://www.oyah.xyz"
    // :
    "https://oyah.xyz";
    // "http://localhost:5000";
  const uri = domain + "/graphql";

  const authMiddleware = new ApolloLink((operation: any, forward: any) => {
    operation.setContext({
      headers: {
        authorization: jwt || null
      }
    });
    return forward(operation);
  });

  return new ApolloClient({
    connectToDevTools:
      process.env.NODE_ENV !== "production" ? process.browser : false,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once),
    link: ApolloLink.from([
      authMiddleware,
      createUploadLink({ uri, credentials: "same-origin", fetch })
      // new HttpLink({ uri, credentials: "include" })
    ]),
    // link: concat(authMiddleware, new HttpLink({ uri, credentials: "include" })),
    // link: new HttpLink({ uri, fetch, credentials: "include" }),
    cache: new InMemoryCache().restore(initialState || {}),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
        errorPolicy: "ignore"
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all"
      }
    }
  });
}

export default function initApollo(
  initialState: any,
  ctx: any = {},
  jwt: any = ""
) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, ctx, jwt);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx, jwt);
  }

  return apolloClient;
}
