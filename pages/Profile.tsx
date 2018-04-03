import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Head from "next/head";
import Error from "./_error";

import * as userActionCreators from "../actions/user";

import App from "../components/App";

import Image from "../components/Image";
import Article from "../components/Article";
import Verification from "../components/Verification";

import withData from "../lib/withData";

import { graphql } from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  data?: any;
  profileUser?: any;
  articles: any;
  getArticlesByUser?: any;
  dispatch?: any;
  user?: any;
  signInModal?: any;
  error?: any;
  url?: any;
}

interface State {
  articles: any;
  user: any;
}

class Profile extends Component<Props, State> {
  state = { articles: [1, 2, 3], user: {} };

  static async getInitialProps(
    { query: { nametag } }: any,
    apolloClient: any,
    user: any
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
                mutation getArticlesByUser($authorID: ID) {
                  getArticlesByUser(authorID: $authorID) {
                    id
                    title
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
                error: err
              };
            });
        })
        .catch((err: Error) => {
          return {
            error: err
          };
        });
    } else {
      if (user !== undefined && user.id !== null && user.id !== undefined) {
        return await apolloClient
          .mutate({
            mutation: gql`
              mutation getArticlesByUser($authorID: ID) {
                getArticlesByUser(authorID: $authorID) {
                  id
                  title
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
              error: err
            };
          });
      } else {
        return {
          error: "Not logged in"
        };
      }
    }
  }

  componentDidMount() {
    const { profileUser, articles } = this.props;
    this.setState(prevState => ({
      ...prevState,
      user: profileUser,
      articles: articles
    }));
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   if (nextProps.url.query.nametag === undefined) {
  //     const { dispatch, user } = nextProps;
  //     const login = bindActionCreators(userActionCreators.login, dispatch);
  //     if (
  //       nextProps.data &&
  //       !nextProps.data.loading &&
  //       nextProps.data.currentUser &&
  //       nextProps.data.currentUser.user !== null &&
  //       (Object.keys(this.state.user).length === 0 ||
  //         nextProps.data.currentUser.user !== this.props.data.currentUser.user)
  //     ) {
  //       const data = nextProps.data.currentUser;
  //       if (data.error) {
  //         if (
  //           data.error[0].message !==
  //           "User is not logged in (or authenticated)."
  //         ) {
  //           console.error(data.error);
  //         }
  //       } else {
  //         login({
  //           ...user,
  //           ...data.user,
  //           mains: data.user.mains !== null ? data.user.mains.split(", ") : null
  //         });

  //         this.setState(prevState => ({
  //           ...prevState,
  //           user: {
  //             ...user,
  //             ...data.user,
  //             mains:
  //               data.user.mains !== null ? data.user.mains.split(", ") : null
  //           }
  //         }));

  //         this.props
  //           .getArticlesByUser({
  //             variables: {
  //               authorID: data.user.id
  //             }
  //           })
  //           .then((res: any) => {
  //             this.setState(prevState => ({
  //               ...prevState,
  //               articles: res.data.getArticlesByUser
  //             }));
  //           });
  //       }
  //     }
  //   }
  // }

  render() {
    if (Object.keys(this.props.profileUser).length !== 0) {
      return (
        <App {...this.props}>
          <div className="Profile Content">
            <Head>
              <title>{this.props.profileUser.nametag + " | Oyah"}</title>
              <meta
                name="description"
                content={this.props.profileUser.nametag + " profile"}
              />
            </Head>
            <div className="user">
              <div className="info">
                <Image
                  src={
                    this.props.profileUser.image !== null
                      ? "/static/img/users/" +
                        encodeURIComponent(this.props.profileUser.image)
                      : "/static/img/User.png"
                  }
                  alt={this.props.profileUser.nametag}
                />
                <h2>
                  {this.props.profileUser.nametag}
                  {this.props.profileUser.is_team && (
                    <Verification
                      isArticle={false}
                      style={{ marginLeft: ".5rem" }}
                    />
                  )}
                </h2>
              </div>
              {this.props.profileUser.bio !== null && (
                <p>{this.props.profileUser.bio}</p>
              )}
            </div>
            <table className="other-info">
              <tbody>
                {this.props.profileUser.name !== null &&
                  this.props.profileUser.name !== "" && (
                    <tr>
                      <td>Full Name</td>
                      <td>{this.props.profileUser.name}</td>
                    </tr>
                  )}
                {this.props.profileUser.mains !== null &&
                  this.props.profileUser.mains !== "" && (
                    <tr>
                      <td>Mains</td>
                      <td>{this.props.profileUser.mains.join(", ")}</td>
                    </tr>
                  )}
                {this.props.profileUser.reddit !== null &&
                  this.props.profileUser.reddit !== "" && (
                    <tr>
                      <td>Reddit</td>
                      <td>
                        <a
                          href={
                            "https://reddit.com/u/" +
                            this.props.profileUser.reddit
                          }
                        >
                          <b>u/</b>
                          {this.props.profileUser.reddit}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.props.profileUser.twitter !== null &&
                  this.props.profileUser.twitter !== "" && (
                    <tr>
                      <td>Twitter</td>
                      <td>
                        <a
                          href={
                            "https://twitter.com/" +
                            this.props.profileUser.twitter
                          }
                        >
                          <b>@</b>
                          {this.props.profileUser.twitter}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.props.profileUser.name === null &&
                  this.props.profileUser.mains === null &&
                  this.props.profileUser.reddit === null &&
                  this.props.profileUser.twitter === null && (
                    <tr>
                      <td>No info has been provided yet by the user</td>
                    </tr>
                  )}
              </tbody>
            </table>
            <div className="articles">
              {this.props.articles.map((elem: any, i: any) => {
                return (
                  <Article
                    id={elem.id}
                    title={elem.title}
                    alt={elem.title}
                    official={this.props.profileUser.is_team}
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
            }

            .Profile .articles {
              margin: 0;
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }

            .Profile .articles .Article {
              /* flex: 1 1; */
              /* margin: 0 0.5rem; */
              /* margin: 0.5rem; */
              /* margin: 0 0.5rem 0.5rem 0; */
              margin: 0 auto 0.7rem;
              width: calc(100% - 1.25rem);
              /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
              /* width: calc(1/2*100% - 1/2*2.5rem); */
            }

            .Profile .articles .Article .image {
              min-height: 15rem;
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
              .Profile .articles .Article .image {
                min-height: 10rem;
              }
            }
            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .articles .Article {
                width: calc(1 / 2 * 100% - 1 / 2 * 2.5rem);
              }
              .Profile .articles .Article .image {
                min-height: 15rem;
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .articles .Article {
                width: calc(1 / 3 * 100% - (1 - 1 / 3) * 1rem);
                height: 15rem;
                overflow: hidden;
              }
            }
          `}</style>
        </App>
      );
    } else {
      if (this.props.url.query.nametag !== undefined) {
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

export default withData(connect(mapStateToProps, null)(Profile));
