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

import { UserModel, ArticleModel } from "../lib/db/models";
import { User as UserInterface } from "../lib/db/models/User";
import { Article as ArticleInterface } from "../lib/db/models/Article";

interface Props {
  data?: any;
  profileUser?: UserInterface;
  articles: ArticleInterface[];
  _error?: any;
  router: SingletonRouter;
  user: UserInterface;
  signInModal: any;
  error: any;
  dispatch: any;
}

interface State {
  articles: ArticleInterface[];
  user: UserInterface;
}

@withRouter
class Profile extends Component<Props, State> {
  state = { articles: [], user: null };

  static async getInitialProps({ query: { nametag } }: any, _, user: any) {
    if (nametag !== undefined) {
      return await UserModel.get({ nametag })
        .then(async (user: UserInterface) => {
          return await ArticleModel.getAll({ authorID: user.id })
            .then(articles => ({
              profileUser: {
                ...user,
                mains: user.mains
                  ? typeof user.mains === "string"
                    ? user.mains.split(", ")
                    : user.mains
                  : null
              },
              articles
            }))
            .catch((err: Error) => ({
              _error: err
            }));
        })
        .catch((err: Error) => ({
          _error: err
        }));
    } else {
      if (user !== undefined) {
        return await ArticleModel.getAll({ authorID: user.id })
          .then(articles => ({
            profileUser: user,
            articles
          }))
          .catch((err: Error) => ({
            _error: err
          }));
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
      const articles = await ArticleModel.getAll({
        authorID: nextProps.user.id
      }).then(getArticlesByUser => getArticlesByUser);

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
    const { user, articles } = this.state;
    if (user && Object.keys(user).length !== 0) {
      return (
        <App {...this.props}>
          <div className="Profile Content">
            <Head>
              <title>{user.nametag + " | Oyah"}</title>
              <meta name="description" content={user.nametag + " profile"} />
            </Head>
            <div className="user">
              <div className="info">
                <Image
                  src={
                    user.image
                      ? user.image.startsWith("http")
                        ? user.image
                        : "/img/users/" + encodeURIComponent(user.image)
                      : "https://storage.googleapis.com/oyah.xyz/assets/img/User.png"
                  }
                  alt={user.nametag}
                />
                <h2>
                  {user.nametag}
                  {user.is_team && (
                    <Verification
                      isArticle={false}
                      style={{ marginLeft: ".5rem" }}
                    />
                  )}
                </h2>
              </div>
              {user.bio && <p>{user.bio}</p>}
            </div>
            <table className="other-info">
              <tbody>
                {user.name &&
                  user.name !== "" && (
                    <tr>
                      <td>Full Name</td>
                      <td>{user.name}</td>
                    </tr>
                  )}
                {user.mains &&
                  user.mains !== "" && (
                    <tr>
                      <td>Mains</td>
                      <td>{user.mains.join(", ")}</td>
                    </tr>
                  )}
                {user.reddit &&
                  user.reddit !== "" && (
                    <tr>
                      <td>Reddit</td>
                      <td>
                        <a href={"https://reddit.com/u/" + user.reddit}>
                          <b>u/</b>
                          {user.reddit}
                        </a>
                      </td>
                    </tr>
                  )}
                {user.twitter &&
                  user.twitter !== "" && (
                    <tr>
                      <td>Twitter</td>
                      <td>
                        <a href={"https://twitter.com/" + user.twitter}>
                          <b>@</b>
                          {user.twitter}
                        </a>
                      </td>
                    </tr>
                  )}
                {!user.name &&
                  !user.mains &&
                  !user.reddit &&
                  !user.twitter && (
                    <tr>
                      <td>No info has been provided yet by the user</td>
                    </tr>
                  )}
              </tbody>
            </table>
            <div className="articles">
              {articles.map((elem: any, i: any) => {
                return (
                  <Article
                    id={elem.id}
                    title={elem.title}
                    alt={elem.title}
                    path={elem.path}
                    dominantColor={elem.dominantColor}
                    official={user.is_team}
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
