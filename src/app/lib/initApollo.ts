import { ApolloClient } from "apollo-client";
// import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { ApolloLink, concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import * as fetch from "isomorphic-unfetch";

import { projectId } from "./config";

let apolloClient: any = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState: any, { req }: any = {}) {
  const domain =
    process.env.NODE_ENV !== "production"
      ? `http://localhost:5001/${projectId}/us-central1/api`
      : `https://us-central1-${projectId}.cloudfunctions.net/api`;
  const uri = domain + "/";

  const authLink = new ApolloLink((operation, forward) => {
    if (req && req.cookies) {
      const token = req.cookies["__session"];

      operation.setContext(({ headers }) => ({
        headers: {
          ...headers,
          authorization: token ? token : ""
        }
      }));
    }

    return forward(operation);
  });

  const httpLink = createHttpLink({ uri, credentials: "include", fetch });

  return new ApolloClient({
    connectToDevTools:
      process.env.NODE_ENV !== "production" ? process.browser : false,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once),
    link: concat(authLink, httpLink),
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

export default function initApollo(initialState: any, ctx: any = {}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, ctx);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx);
  }

  return apolloClient;
}
