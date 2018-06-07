import * as React from "react";
import * as PropTypes from "prop-types";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import { Provider as ReduxProvider } from "react-redux";
import { bindActionCreators } from "redux";
import Head from "next/head";

import * as userActionCreators from "../actions/user";

import initApollo from "./initApollo";
import initRedux from "./initRedux";

// import firebase, { app } from "./firebase";
// import { parse as parseCookie } from "../utils/cookie";

import gql from "graphql-tag";

const currentUserQuery = gql`
  {
    currentUser {
      user {
        id
        nametag
        email
        small_image
        image
        likes
        comment_likes
        bio
        name
        mains
        reddit
        twitter
        editor
        is_team
      }
    }
  }
`;

// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component: any) {
  return Component.displayName || Component.name || "Unknown";
}

export default (ComposedComponent: any) => {
  return class WithData extends React.Component {
    static displayName = `WithData(${getComponentDisplayName(
      ComposedComponent
    )})`;
    static propTypes = {
      stateApollo: PropTypes.object.isRequired
    };

    static async getInitialProps(ctx: any) {
      // Initial stateApollo with apollo (empty)
      let stateApollo = {
        apollo: {
          data: {}
        }
      };
      // Initial stateRedux with apollo (empty)
      let stateRedux = {};

      // Setup a server-side one-time-use apollo client for initial props and
      // rendering (on server)
      const apollo = initApollo(stateRedux, ctx);
      const redux = initRedux(stateRedux);

      // const user = app.auth().currentUser
      //   ? apollo

      const currentUser = await apollo
        .query({
          query: currentUserQuery
        })
        .then(res => res.data.currentUser)
        .catch(() => null);
      // : null;

      const user =
        currentUser && currentUser.user
          ? {
              ...currentUser.user,
              mains:
                typeof currentUser.user.mains === "string"
                  ? currentUser.user.mains.split(", ")
                  : typeof currentUser.user.mains === "object"
                    ? currentUser.user.mains
                    : null
            }
          : null;

      // apollo.writeQuery({ query: currentUserQuery, data: { currentUser } });

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = user
          ? await ComposedComponent.getInitialProps(ctx, apollo, user)
          : await ComposedComponent.getInitialProps(ctx, apollo);
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <ApolloProvider client={apollo}>
            <ComposedComponent {...composedInitialProps} />
          </ApolloProvider>,
          {
            router: {
              asPath: ctx.asPath,
              pathname: ctx.pathname,
              query: ctx.query
            }
          }
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
      }

      if (!process.browser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Redux store
      stateRedux = user ? { ...redux.getState(), user } : redux.getState();

      // Extract query data from the Apollo store
      stateApollo = {
        apollo: {
          data: apollo.cache.extract()
        }
      };

      return {
        stateApollo,
        stateRedux,
        ...composedInitialProps
      };
    }

    constructor(props: any) {
      super(props);
      this.apollo = initApollo(props.stateApollo.apollo.data);
      this.redux = initRedux(props.stateRedux);

      const { dispatch } = this.redux;

      const login = bindActionCreators(userActionCreators.login, dispatch);
      if (Object.keys(props.stateRedux.user).length > 0) {
        if (props.stateRedux.user.mains !== undefined) {
          login({
            ...props.stateRedux.user,
            mains:
              typeof props.stateRedux.user.mains === "string"
                ? props.stateRedux.user.mains.split(", ")
                : typeof props.stateRedux.user.mains === "object"
                  ? props.stateRedux.user.mains
                  : null
          });
        }
      } else if (props.stateRedux.user === undefined) {
        // const user = app.auth().currentUser;
        // if (user) {
        this.apollo
          .query({
            query: currentUserQuery
          })
          .then(res => {
            console.log(res);

            if (res.data.currentUser.user) {
              login({
                ...res.data.currentUser.user,
                mains:
                  typeof res.data.currentUser.user.mains === "string"
                    ? res.data.currentUser.user.mains.split(", ")
                    : typeof res.data.currentUser.user.mains === "object"
                      ? res.data.currentUser.user.mains
                      : null
              });
            }
          })
          .catch(() => null);
        // }
      }
    }

    render() {
      return (
        <ReduxProvider store={this.redux}>
          <ApolloProvider client={this.apollo}>
            <ComposedComponent {...this.props} />
          </ApolloProvider>
        </ReduxProvider>
      );
    }
  };
};
