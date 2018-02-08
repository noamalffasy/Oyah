import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { RetryLink } from "apollo-link-retry";
import { ApolloLink } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import fetch from "node-fetch";

let apolloClient: any = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState: any) {
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://www.oyah.xyz"
      : "http://localhost:3000";
  const uri = domain + "/graphql";

  const authMiddleware = new ApolloLink((operation: any, forward: any) => {
    const jwt = localStorage.getItem("reactQLJWT");
    operation.setContext({
      headers: {
        authorization: jwt || null
      }
    });
    return forward(operation);
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once),
    link: ApolloLink.from([
      new RetryLink(),
      authMiddleware,
      createUploadLink({ uri, fetch, credentials: "include" })
    ]),
    // link: new HttpLink({ uri, fetch, credentials: "include" }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState: any) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
