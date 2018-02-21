import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { RetryLink } from "apollo-link-retry";
import { onError } from "apollo-link-error";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import fetch from "isomorphic-unfetch";

let apolloClient: any = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState: any) {
  const domain =
    process.env.NODE_ENV === "production"
      ? "https://www.oyah.xyz"
      : "http://192.168.1.55:3000";
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

  const errorLink = onError(({ graphQLErrors, networkError }: any) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }: any) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once),
    link: ApolloLink.from([
      errorLink,
      authMiddleware,
      createUploadLink({ uri, credentials: "include" })
      // new HttpLink({ uri, credentials: "include" })
    ]),
    // link: concat(authMiddleware, new HttpLink({ uri, credentials: "include" })),
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
