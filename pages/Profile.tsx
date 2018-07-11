import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Head from "next/head";
import { withRouter, SingletonRouter } from "next/router";

import Error from "./_error";

// import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import App from "../components/App";

import Image from "../components/Image";
import Article from "../components/ArticleBlock";
import Verification from "../components/Verification";

import withData from "../lib/withData";

import * as UserModel from "../lib/db/models/User";
import * as ArticleModel from "../lib/db/models/Article";

import { graphql } from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  data?: any;
  profileUser?: UserModel.Interface;
  articles: ArticleModel.Interface[];
  _error?: any;
  getArticlesByUser?: any;
  router: SingletonRouter;
  user: UserModel.Interface;
  signInModal: any;
  error: any;
  dispatch: any;
}

interface State {
  articles: ArticleModel.Interface[];
  user: UserModel.Interface;
}

@graphql(
  gql`
    mutation getArticlesByUser($authorID: ID) {
      getArticlesByUser(authorID: $authorID) {
        id
        title
      }
    }
  `,
  {
    name: "getArticlesByUser"
  }
)
@withRouter
class Profile extends Component<Props, State> {
  state = { articles: [], user: null };

  static async getInitialProps(
    { query: { nametag } }: any,
    apolloClient: any,
    _user: any
  ) {
    if (nametag !== undefined) {
      return await apolloClient
        .mutate({
          mutation: gql`
            mutation getUser($nametag: String) {
              getUser(nametag: $nametag) {
                id
                small_image
                image
                nametag
                name
                email
                bio
                mains
                reddit
                twitter
                is_team
              }
            }
          `,
          variables: {
            nametag
          }
        })
        .then(async (getUser: any) => {
          return await apolloClient
            .mutate({
              mutation: gql`
                mutation getArticlesByUser($authorID: String) {
                  getArticlesByUser(authorID: $authorID) {
                    id
                    title
                    path
                    dominantColor
                  }
                }
              `,
              variables: { authorID: getUser.data.getUser.id }
            })
            .then((getArticlesByUser: any) => {
              return {
                profileUser: {
                  ...getUser.data.getUser,
                  mains:
                    getUser.data.getUser.mains !== null
                      ? getUser.data.getUser.mains.split(", ")
                      : null
                },
                articles: getArticlesByUser.data.getArticlesByUser
              };
            })
            .catch((err: Error) => {
              return {
                _error: err
              };
            });
        })
        .catch((err: Error) => {
          return {
            _error: err
          };
        });
    } else {
      const user =
        _user === undefined
          ? await apolloClient
              .query({
                query: gql`
                  {
                    currentUser {
                      user {
                        id
                        nametag
                        email
                        small_image
                        image
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
                `
              })
              .then(res => {
                if (
                  !res.errors &&
                  res.data.currentUser &&
                  res.data.currentUser.user
                ) {
                  return {
                    ...res.data.currentUser.user,
                    mains:
                      typeof res.data.currentUser.user.mains === "string"
                        ? res.data.currentUser.user.mains.split(", ")
                        : typeof res.data.currentUser.user.mains === "object"
                          ? res.data.currentUser.user.mains
                          : null
                  };
                } else {
                  return undefined;
                }
              })
              .catch(() => {
                return undefined;
              })
          : _user;

      if (user !== undefined) {
        return await apolloClient
          .mutate({
            mutation: gql`
              mutation getArticlesByUser($authorID: ID) {
                getArticlesByUser(authorID: $authorID) {
                  id
                  title
                  path
                  dominantColor
                }
              }
            `,
            variables: { authorID: user.id }
          })
          .then((getArticlesByUser: any) => {
            return {
              profileUser: user,
              articles: getArticlesByUser.data.getArticlesByUser
            };
          })
          .catch((err: Error) => {
            return {
              _error: err
            };
          });
      } else {
        return {
          _error: "Not logged in"
        };
      }
    }
  }

  componentDidMount() {
    const { profileUser, articles, _error: error } = this.props;

    if (!error) {
      this.setState(prevState => ({
        ...prevState,
        user: profileUser.id ? profileUser : null,
        articles
      }));
    } else {
      console.log("Fetch error", error);

      if (error !== "Not logged in") {
        this.setError(error);
      }
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.user !== this.props.user &&
      !nextProps.user.loading &&
      !nextProps.router.query.nametag
    ) {
      const articles = await this.props
        .getArticlesByUser({
          variables: { authorID: nextProps.user.id }
        })
        .then(
          (getArticlesByUser: any) => getArticlesByUser.data.getArticlesByUser
        );

      this.setState(prevState => ({
        ...prevState,
        articles,
        user: {
          ...nextProps.user,
          mains:
            typeof nextProps.user.mains === "string"
              ? nextProps.user.mains.split(", ")
              : typeof nextProps.user.mains === "object"
                ? nextProps.user.mains
                : null
        }
      }));
    }
  }

  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    if (this.state.user && Object.keys(this.state.user).length !== 0) {
      return (
        <App {...this.props}>
          <div className="Profile Content">
            <Head>
              <title>{this.state.user.nametag + " | Oyah"}</title>
              <meta
                name="description"
                content={this.state.user.nametag + " profile"}
              />
            </Head>
            <div className="user">
              <div className="info">
                <Image
                  src={
                    this.state.user.image
                      ? this.state.user.image.startsWith("http")
                        ? this.state.user.image
                        : "/img/users/" +
                          encodeURIComponent(this.state.user.image)
                      : "https://storage.googleapis.com/oyah.xyz/assets/img/User.png"
                  }
                  alt={this.state.user.nametag}
                />
                <h2>
                  {this.state.user.nametag}
                  {this.state.user.is_team && (
                    <Verification
                      isArticle={false}
                      style={{ marginLeft: ".5rem" }}
                    />
                  )}
                </h2>
              </div>
              {this.state.user.bio !== null && <p>{this.state.user.bio}</p>}
            </div>
            <table className="other-info">
              <tbody>
                {this.state.user.name !== null &&
                  this.state.user.name !== "" && (
                    <tr>
                      <td>Full Name</td>
                      <td>{this.state.user.name}</td>
                    </tr>
                  )}
                {this.state.user.mains !== null &&
                  this.state.user.mains !== "" && (
                    <tr>
                      <td>Mains</td>
                      <td>{this.state.user.mains.join(", ")}</td>
                    </tr>
                  )}
                {this.state.user.reddit !== null &&
                  this.state.user.reddit !== "" && (
                    <tr>
                      <td>Reddit</td>
                      <td>
                        <a
                          href={
                            "https://reddit.com/u/" + this.state.user.reddit
                          }
                        >
                          <b>u/</b>
                          {this.state.user.reddit}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.state.user.twitter !== null &&
                  this.state.user.twitter !== "" && (
                    <tr>
                      <td>Twitter</td>
                      <td>
                        <a
                          href={
                            "https://twitter.com/" + this.state.user.twitter
                          }
                        >
                          <b>@</b>
                          {this.state.user.twitter}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.state.user.name === null &&
                  this.state.user.mains === null &&
                  this.state.user.reddit === null &&
                  this.state.user.twitter === null && (
                    <tr>
                      <td>No info has been provided yet by the user</td>
                    </tr>
                  )}
              </tbody>
            </table>
            <div className="articles">
              {this.state.articles.map((elem: any, i: any) => {
                return (
                  <Article
                    id={elem.id}
                    title={elem.title}
                    alt={elem.title}
                    path={elem.path}
                    dominantColor={elem.dominantColor}
                    official={this.state.user.is_team}
                    loading={elem.id === undefined}
                    key={i}
                  />
                );
              })}
            </div>
          </div>
          <style jsx>{`
            .Profile .user {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-flow: column;
            }

            .Profile .user .info {
              display: flex;
              flex-flow: column;
              align-items: center;
              justify-content: center;
            }

            .Profile .user .info h2,
            .Profile .user .info p {
              text-align: center;
            }

            .Profile .user .info h2 {
              font-weight: 400;
              margin: 1rem 0 1.5rem;
              font-size: 2.1rem;
            }

            .Profile .user p {
              margin: 0 1.5rem;
            }

            .Profile .other-info {
              text-align: center;
              margin: 0 auto 2rem;
              padding: 0 0 1rem;
            }

            .Profile .other-info td {
              padding: 0.2rem 0.5rem;
            }

            .Profile .other-info td:nth-child(odd) {
              color: #969696;
            }

            .Profile .other-info td:nth-child(even) {
              font-weight: 400;
            }

            .Profile .other-info td {
              display: table-cell;
              vertical-align: middle;
              padding: 0.2rem 0.5rem 2rem;
            }

            .Profile .other-info td {
              padding: 0.5rem 2rem;
            }
            @media (min-width: 480px),
              @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .user .bio {
                max-width: 70%;
              }
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile {
                padding-bottom: 4.5rem;
              }
              .Profile .user .bio {
                max-width: 60%;
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .user {
                flex-flow: row;
              }
              .Profile .user .bio {
                max-width: 40%;
              }
            }
          `}</style>
          <style jsx global>{`
            .Profile .user .info .image {
              display: block;
              margin: 0 auto;
              width: 10rem;
              height: 10rem;
              border-radius: 50%;
              overflow: hidden;
            }

            .Profile .articles {
              margin: 0;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }

            .Profile .articles .Article {
              margin: 0 auto 0.7rem;
              width: calc(100% - 1.25rem);
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .articles {
                width: 85%;
                margin: 0 auto;
              }
              .Profile .articles .Article {
                width: calc(50% - 1.25rem);
              }
            }
            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .articles .Article {
                width: calc(1 / 2 * 100% - 1 / 2 * 2.5rem);
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .articles .Article {
                width: calc(1 / 3 * 100% - (1 - 1 / 3) * 1rem);
              }
            }
          `}</style>
        </App>
      );
    } else {
      if (this.props.router.query.nametag !== undefined) {
        return <Error {...this.props} statusCode={404} />;
      } else {
        return (
          <App {...this.props}>
            <div className="NotLoggedIn Content">
              <Head>
                <title>{"Not logged in | Oyah"}</title>
                <meta name="description" content="Not logged in, Oyah" />
              </Head>
              <h2>Not Logged In</h2>
              <p>You need to login in order to view this page</p>
            </div>
            <style jsx>{`
              .NotLoggedIn {
                text-align: center;
              }

              .NotLoggedIn > h2 {
                font-size: 4rem;
                color: #cc0000;
              }

              .NotLoggedIn > p {
                font-size: 2rem;
              }
            `}</style>
          </App>
        );
      }
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(
  connect(
    mapStateToProps,
    null
  )(Profile)
);
