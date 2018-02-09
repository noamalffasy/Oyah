import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as userActionCreators from "../actions/user";

import * as uuid from "uuid/v4";
import Head from "next/head";
import Link from "next/link";
import * as Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlaceholder from "react-placeholder";
import { RoundShape, TextRow } from "react-placeholder/lib/placeholders";

import App from "../components/App";

import Image from "../components/Image";
import Input from "../components/Input";
import NotFound from "next/error";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

class AuthorPlaceholder extends Component {
  render() {
    return (
      <div className="author">
        <RoundShape
          className="image"
          color="#e0e0e0"
          style={{
            display: "inline-block",
            width: "4rem",
            height: "4rem",
            marginRight: "0.5rem",
            borderRadius: "50%",
            animation: "loading 1.5s infinite"
          }}
        />
        <TextRow
          className="text"
          color="#e0e0e0"
          style={{
            width: "10rem",
            height: "1rem",
            marginTop: "",
            animation: "loading 1.5s infinite"
          }}
        />
        <style jsx>{`
          .author {
            display: flex;
            flex-flow: row;
            align-items: center;
            flex: 1 1 0;
            margin-bottom: 0.5rem;
          }

          .author .image {
            display: inline-block;
            width: 4rem;
            height: 4rem;
            margin-right: 0.5rem;
            border-radius: 50%;
          }

          .author h3 {
            display: inline;
            font-size: 1rem;
            margin: 0;
            cursor: default;
          }
        `}</style>
      </div>
    );
  }
}

interface User {
  token?: string;
  id?: string;
  name?: string;
  nametag?: string;
  email?: string;
  small_image?: string;
  image?: string;
  likes?: number;
  bio?: string;
  mains?: string;
  reddit?: string;
  twitter?: string;
  editor?: boolean;
}

interface Props extends React.Props<ArticlePage> {
  match: any;
  user: User;
  openSignInModal: any;
  data?: any;
  getArticle?: any;
  getUser?: any;
  url?: any;
  dispatch?: any;
  deleteArticle?: any;
  signInModal?: any;
}

interface State {
  id: string | any;
  title: string | undefined;
  content: string | undefined;
  comments: object[];
  likes: number;
  menuOpen: boolean;
  deletePopup: any;
  removeComments?: string[] | undefined;
  author?: User;
  notFound?: boolean;
}

@graphql(
  gql`
    {
      currentUser {
        ok
        jwt
        errors {
          field
          message
        }
        user {
          id
          likes
        }
      }
    }
  `
)
@graphql(
  gql`
    mutation getArticle($id: String!) {
      getArticle(id: $id) {
        id
        title
        content
        authorID
        likes
        comments {
          id
          authorID
          message
        }
      }
    }
  `,
  {
    name: "getArticle"
  }
)
@graphql(
  gql`
    mutation getUser($id: ID!) {
      getUser(id: $id) {
        id
        nametag
        image
      }
    }
  `,
  {
    name: "getUser"
  }
)
@graphql(
  gql`
    mutation deleteArticle($id: String!) {
      deleteArticle(id: $id) {
        status
      }
    }
  `,
  {
    name: "deleteArticle"
  }
)
class ArticlePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: props.url.query.id,
      title: undefined,
      content: undefined,
      comments: [],
      likes: 0,
      menuOpen: false,
      deletePopup: false,
      removeComments: []
    };

    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount() {
    this.props
      .getArticle({
        variables: { id: this.state.id }
      })
      .then((getArticle: any) => {
        if (getArticle.error) {
          if (
            getArticle.error[0].message === "Cannot read property 'get' of null"
          ) {
            this.setState((prevState: any) => ({
              ...prevState,
              notFound: true,
              title: "Not Found"
            }));
          } else {
            console.error(getArticle.error.message);
          }
        } else if (getArticle.data.getArticle.id !== null) {
          this.setState((prevState: any) => ({
            ...prevState,
            ...getArticle.data.getArticle
          }));

          this.props
            .getUser({
              variables: {
                id: getArticle.data.getArticle.authorID
              }
            })
            .then((getUser: any) => {
              if (getUser.error) {
                console.error(getUser.error.message);
              } else {
                this.setState((prevState: any) => ({
                  ...prevState,
                  author: {
                    ...getUser.data.getUser,
                    image:
                      "/img/users/" +
                      encodeURIComponent(getUser.data.getUser.image)
                  }
                }));
              }
            });
        } else {
          this.setState((prevState: any) => ({
            ...prevState,
            notFound: true,
            title: "Not Found"
          }));
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { dispatch, user } = nextProps;
    const login = bindActionCreators(userActionCreators.login, dispatch);
    if (
      nextProps.data &&
      !nextProps.data.loading &&
      nextProps.data.currentUser &&
      nextProps.data.currentUser.user !== null &&
      (!this.props.data.currentUser || nextProps.data.currentUser.user !== this.props.data.currentUser.user)
    ) {
      const data = nextProps.data.currentUser;
      if (data.error) {
        if (
          data.error[0].message !== "User is not logged in (or authenticated)."
        ) {
          console.error(data.error);
        }
      } else {
        login({
          ...user,
          ...data.user
        });
      }
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      (this.menu && nextState.menuOpen !== this.state.menuOpen) ||
      (this.deletePopup && nextState.deletePopup !== false) ||
      // (this.more && this.more.contains(nextProps.clicked)) ||
      !this.state.content ||
      !this.state.author ||
      this.props.user !== nextProps.user
      // (nextProps.clicked === this.props.clicked &&
      //   !this.state.menuOpen &&
      //   this.state.content &&
      //   this.state.author)
    ) {
      return true;
    }
    return false;
  }

  // componentWillReceiveProps(nextProps: any) {
  //   if (
  //     this.state.menuOpen &&
  //     !this.menu.contains(nextProps.clicked) &&
  //     this.props.clicked !== nextProps.clicked
  //   ) {
  //     this.setState(prevState => ({
  //       ...prevState,
  //       menuOpen: false
  //     }));
  //   }
  // }

  openDeletePopup(what = "article", id = this.state.id) {
    this.setState(prevState => ({
      ...prevState,
      deletePopup: { what, id }
    }));
  }

  deleteArticle() {
    this.props
      .deleteArticle({
        variables: {
          id: this.state.id
        }
      })
      .then((res: any) => {
        if (res.error) {
          console.error(res.error.message);
        } else {
          this.props.url.push("/");
        }
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }

  deleteComment(id: string) {
    this.setState(prevState => ({
      ...prevState,
      removeComments: this.state.removeComments.concat([id])
    }));
  }

  render() {
    if (!this.state.notFound) {
      return (
        <App {...this.props}>
          <div className="ArticlePage">
            <Head>
              <title>{this.state.title || "Article" + ` | Oyah`}</title>
              <meta name="description" content={this.state.title} />
            </Head>
            <div className="container" ref={div => (this.firstContainer = div)}>
              <div className="Content" style={{ paddingBottom: "2rem" }}>
                <div className="top">
                  <ReactPlaceholder
                    customPlaceholder={<AuthorPlaceholder />}
                    ready={this.state.author !== undefined}
                  >
                    <div className="author">
                      <Image
                        src={
                          this.state.author
                            ? this.state.author.image !== null &&
                              this.state.author.image !== undefined
                              ? this.state.author.image
                              : ""
                            : ""
                        }
                        alt={
                          this.state.author
                            ? this.state.author.nametag
                            : "Loading"
                        }
                        style={{
                          display: "inline-block",
                          width: "4rem",
                          height: "4rem",
                          marginRight: "0.5rem",
                          borderRadius: "50%"
                        }}
                      />
                      <h3>
                        {this.state.author
                          ? this.state.author.nametag
                          : "Loading"}
                      </h3>
                    </div>
                  </ReactPlaceholder>
                  {Object.keys(this.props.user).length > 0 &&
                    this.state.author &&
                    this.state.author.id === this.props.user.id && (
                      <div
                        className="more"
                        tabIndex={0}
                        onBlur={() => {
                          this.setState(prevState => ({
                            ...prevState,
                            menuOpen: false
                          }));
                        }}
                        ref={div => (this.more = div)}
                      >
                        <img
                          src={"../static/img/more.svg"}
                          onClick={() => {
                            this.setState(prevState => ({
                              ...prevState,
                              menuOpen: !this.state.menuOpen
                            }));
                          }}
                        />
                        <div
                          className="menu"
                          style={
                            !this.state.menuOpen
                              ? { maxHeight: 0, boxShadow: "none" }
                              : {
                                  maxHeight:
                                    "calc(2 * (1.5rem + 2 * 0.5rem) + 0.4rem)"
                                }
                          }
                          ref={div => (this.menu = div)}
                        >
                          <li>
                            <Link
                              href={"/WriteArticle?id=" + this.state.id}
                              as={"/articles/new/" + this.state.id}
                            >
                              <a>Edit</a>
                            </Link>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                this.openDeletePopup();
                              }}
                            >
                              Delete
                            </a>
                          </li>
                        </div>
                      </div>
                    )}
                </div>
                <ReactPlaceholder
                  className="title"
                  type="text"
                  rows={2}
                  ready={this.state.title !== undefined}
                  style={{ animation: "loading 1.5s infinite", width: "80%" }}
                >
                  <h1>{this.state.title}</h1>
                </ReactPlaceholder>
              </div>
            </div>

            <Image
              className="article-image"
              src={`/articles/${this.state.id}.jpeg`}
              fixed
              style={{
                position: "relative",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                backgroundAttachment: "fixed",
                backgroundColor: "#c3c3c3",
                zIndex: "1",
                width: "100%",
                marginBottom: "2rem",
                transition: "all 0.3s"
              }}
            />
            {/* <div
            className="article-image"
            style={{
              backgroundImage: `url("/articles/img/${this.state.id}.jpeg")`
            }}
          /> */}

            <div className="ArticlePage">
              <div className="container">
                <div className="Content">
                  <Markdown
                    className="body"
                    source={this.state.content || ""}
                    renderers={{
                      image: ({ src, alt }) => {
                        return (
                          <Image
                            src={src}
                            alt={alt}
                            // onError={e => (e.target.style.animation = "none")}
                          />
                        );
                      }
                    }}
                  />

                  <Bottombar
                    contentLoaded={this.state.content !== undefined}
                    user={this.props.user}
                    articleID={this.state.id}
                    likes={this.state.likes}
                  />

                  <Responses
                    user={this.props.user}
                    openSignInModal={this.props.openSignInModal}
                    articleID={this.state.id}
                    author={this.state.author}
                    comments={this.state.comments}
                    removeComments={this.state.removeComments}
                    openDeletePopup={this.openDeletePopup}
                  />
                </div>
              </div>
            </div>
            <DeletePopup
              isOpen={this.state.deletePopup}
              deleteArticle={this.deleteArticle}
              deleteCommentFromDOM={this.deleteComment}
              id={this.state.id}
              ref={popup => (this.deletePopup = popup)}
            />
          </div>
          <style jsx>{`
            .Content {
              padding-bottom: 4.5rem;
            }

            .Content::after {
              content: "";
              clear: both;
              display: block;
            }

            .ArticlePage .Content {
              width: 100%;
              margin: 0 auto;
            }

            .ArticlePage .top {
              display: flex;
            }

            .ArticlePage .top .author {
              display: flex;
              flex-flow: row;
              align-items: center;
              flex: 1 1 0;
              margin-bottom: 0.5rem;
            }

            .ArticlePage .top .author .image {
              display: inline-block;
              width: 4rem;
              height: 4rem;
              margin-right: 0.5rem;
              border-radius: 50%;
            }

            .ArticlePage .top .author h3 {
              display: inline;
              font-size: 1rem;
              margin: 0;
              cursor: default;
            }

            .ArticlePage .top .more {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              outline: 0;
            }

            .ArticlePage .top .more img {
              width: 1.7rem;
              -webkit-user-draq: none;
              user-select: none;
              cursor: pointer;
            }

            .ArticlePage .top .more .menu {
              position: absolute;
              top: 4rem;
              border-radius: 8px;
              padding: 0.2rem 2rem;
              max-height: calc(2 * (1.5rem + 2 * 0.5rem) + 0.4rem);
              background: #fff;
              box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2);
              overflow: hidden;
              transition: all 0.3s;
            }

            .ArticlePage .top .more .menu li {
              list-style: none;
              padding: 0.5rem 0;
              text-align: center;
              user-select: none;
            }

            .ArticlePage h1 {
              text-align: center;
              font-size: 3rem;
              /* margin-bottom: 2rem; */
            }

            @media (min-width: 768px) {
              .ArticlePage .Content {
                width: 70%;
              }
              .ArticlePage h1 {
                font-size: 3rem;
              }
            }

            @media (min-width: 992px) {
              .ArticlePage h1 {
                font-size: 4rem;
              }
            }
          `}</style>
          <style jsx global>{`
            .ArticlePage .title.text-block {
              width: 80% !important;
              margin: 0 auto;
              margin-bottom: 0.5rem;
            }

            .ArticlePage .title.text-block .text-row {
              margin: 0 auto;
              height: 4rem !important;
            }

            .ArticlePage .title.text-block .text-row:nth-child(2) {
              margin-top: 1.2rem !important;
            }

            .ArticlePage .article-image {
              min-height: 20rem;
              max-height: 20rem;
            }

            .ArticlePage .body {
              font-size: 1.25rem;
              white-space: pre-wrap;
              font-family: Georgia, Cambria, "Times New Roman", Times, serif;
            }

            .ArticlePage .body h1 {
              font-size: 2.5rem;
              font-weight: 600;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
              margin: 1rem 0;
              text-align: left;
            }

            .ArticlePage .body .image {
              display: block;
              min-height: 15rem;
              max-height: 15rem;
              width: 100%;
              font-size: 0rem;
              border-radius: 2px;
              background: #c0c0c0;
              animation: imageLoad 1s infinite;
            }

            @media (min-width: 576px) {
              .ArticlePage .body .image {
                min-height: 20rem;
              }
            }
            @media (min-width: 768px) {
              .ArticlePage .article-image {
                min-height: 25rem;
                max-height: 25rem;
              }
            }

            @media (min-width: 992px) {
              .ArticlePage .body .image {
                min-height: 25rem;
              }
            }

            @media (min-width: 1200px) {
              .ArticlePage .article-image {
                min-height: 30rem;
                max-height: 30rem;
              }
            }
          `}</style>
        </App>
      );
    } else {
      return <NotFound statusCode={404} />;
    }
  }
}

@graphql(
  gql`
    mutation likeArticle($articleID: String!, $liked: Boolean!) {
      likeArticle(articleID: $articleID, liked: $liked) {
        likes
      }
    }
  `,
  {
    name: "likeArticle"
  }
)
class Bottombar extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { likedArticles: [] };

    this.toggleLike = this.toggleLike.bind(this);
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.user !== this.props.user && nextProps.user.likes) {
      this.setState((prevState: any) => ({
        ...prevState,
        likedArticles: nextProps.user.likes.split(", ")
      }));
    }
  }

  async toggleLike(e: any) {
    e.preventDefault();
    const likedArticles = this.state.likedArticles;
    const articleID = this.props.articleID;
    const indexOfArticle = likedArticles.indexOf(articleID);

    this.props
      .likeArticle({
        variables: {
          articleID,
          liked: !likedArticles.includes(articleID)
        }
      })
      .then((res: any) => {
        this.setState((prevState: any) => ({
          ...prevState,
          likedArticles: likedArticles.includes(articleID)
            ? likedArticles
                .slice(0, indexOfArticle)
                .concat(likedArticles.slice(indexOfArticle + 1))
            : [...likedArticles, articleID]
        }));
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }

  render() {
    return (
      <div
        className="Bottombar"
        style={this.props.contentLoaded ? { display: "" } : { display: "none" }}
      >
        <button
          className="like"
          onClick={this.toggleLike}
          style={
            this.state.likedArticles.includes(this.props.articleID)
              ? {
                  animation: "like .5s forwards"
                }
              : {}
          }
        >
          <FontAwesomeIcon
            icon="heart"
            style={
              this.state.likedArticles.includes(this.props.articleID)
                ? { opacity: 1 }
                : {}
            }
          />
          <FontAwesomeIcon
            icon={["far", "heart"]}
            style={
              !this.state.likedArticles.includes(this.props.articleID)
                ? { opacity: 1 }
                : {}
            }
          />
        </button>
        <button className="st-custom-button" data-network="reddit">
          <FontAwesomeIcon icon={["fab", "reddit-alien"]} />
        </button>
        <button className="st-custom-button" data-network="twitter">
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </button>
        <button className="st-custom-button" data-network="facebook">
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        </button>
        {/* <button>
          <FontAwesomeIcon icon="share-square" style={{ opacity: 1 }} />
        </button> */}
        <style jsx>{`
          .Bottombar {
            display: flex;
            align-items: center;
            /* width: 4.5rem;
                height: 4.5rem; */
            height: 2rem;
            /* border: 1px solid #c0c0c0; */
            border-radius: 50%;
            /* padding: 1rem .9rem .8rem 1rem; */
            float: right;
          }

          .Bottombar button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 100%;
            margin: 0 0.5rem;
            background: none;
            border: 0;
            cursor: pointer;
          }

          .Bottombar button.like {
            position: relative;
          }
        `}</style>
        <style jsx global>{`
          .Bottombar button svg {
            /* width: 100%; */
            width: 2rem !important;
            height: 100%;
            color: #c00;
            transition: all 0.15s;
          }

          .Bottombar button.like svg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }
}

interface ResponsesProps {
  user: User;
  openSignInModal: any;
  articleID: any;
  author: User | undefined;
  comments: any[] | undefined;
  removeComments: string[] | undefined;
  openDeletePopup: any;
  getUser?: any;
  sendComment?: any;
  updateComment?: any;
}

interface ResponsesState {
  comments: any[] | undefined;
  menuOpen: boolean;
  edit: boolean;
}

@graphql(
  gql`
    mutation getUser($id: ID!) {
      getUser(id: $id) {
        id
        nametag
        image
      }
    }
  `,
  {
    name: "getUser"
  }
)
@graphql(
  gql`
    mutation sendComment($id: String!, $articleID: String!, $message: String!) {
      sendComment(id: $id, articleID: $articleID, message: $message) {
        id
        articleID
        authorID
        message
      }
    }
  `,
  {
    name: "sendComment"
  }
)
@graphql(
  gql`
    mutation updateComment(
      $id: String!
      $articleID: String!
      $message: String!
    ) {
      updateComment(id: $id, articleID: $articleID, message: $message) {
        id
        articleID
        authorID
        message
      }
    }
  `,
  {
    name: "updateComment"
  }
)
class Responses extends Component<ResponsesProps, ResponsesState> {
  constructor(props: ResponsesProps) {
    super(props);

    this.state = { comments: undefined, menuOpen: false, edit: false };

    this.sendComment = this.sendComment.bind(this);
  }

  componentWillReceiveProps(nextProps: ResponsesProps) {
    if (
      nextProps.comments &&
      (nextProps.comments !== this.props.comments ||
        (nextProps.comments.length > 0 && !this.state.comments))
    ) {
      let comments: any[] = [];
      nextProps.comments.forEach((elem, i) => {
        this.props
          .getUser({
            variables: {
              id: elem.authorID
            }
          })
          .then((res: any) => {
            if (res.errors) {
              res.errors.forEach((error: Error) => {
                console.error(error.message);
              });
            } else {
              const comment = {
                ...elem,
                author: {
                  ...res.data.getUser,
                  image:
                    "/img/users/" + encodeURIComponent(res.data.getUser.image)
                }
              };
              comments.push(comment);
            }
          })
          .catch((err: Error) => {
            console.error(err);
          });
      });

      this.setState((prevState: ResponsesState) => ({
        ...prevState,
        comments
      }));
    }
    if (nextProps.removeComments !== this.props.removeComments) {
      const comments = this.state.comments.filter((comment: any) => {
        if (nextProps.removeComments.indexOf(comment.id) !== -1) {
          return false;
        }
        return true;
      });

      this.setState(prevState => ({
        ...prevState,
        comments
      }));
    }
  }

  sendComment() {
    if (this.input.input.value.trim() !== "" && this.input.input.value) {
      this.props
        .sendComment({
          variables: {
            id: uuid(),
            articleID: this.props.articleID,
            message: this.input.input.value.trim()
          }
        })
        .then((res: any) => {
          if (res.error) {
            console.error(res.error.message);
          } else {
            this.input.reset();
            this.setState(prevState => ({
              ...prevState,
              comments: [
                { ...res.data.sendComment, author: this.props.author },
                ...this.state.comments
              ]
            }));
          }
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  }

  updateComment(id: string, authorID: string) {
    if (
      this["edit_" + id].input.value.trim() !== "" &&
      this["edit_" + id].input.value
    ) {
      this.props
        .updateComment({
          variables: {
            id,
            articleID: this.props.articleID,
            message: this["edit_" + id].input.value.trim()
          }
        })
        .then(res => {
          if (res.error) {
            console.error(res.error.message);
          } else {
            this.setState(prevState => {
              let state: any = prevState;
              let author: any;
              state.comments = this.state.comments
                .filter((comment: any) => {
                  if (comment.id === id) {
                    author = comment.author;
                    return false;
                  }
                  return true;
                })
                .concat([
                  {
                    id,
                    author,
                    message: this["edit_" + id].input.value.trim()
                  }
                ]);
              state["edit_" + id] = false;

              return state;
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  render() {
    if (this.state.comments) {
      return (
        <div className="Responses">
          <h2>Responses</h2>
          {Object.keys(this.props.user).length > 0 && (
            <div className="input">
              <div className="message">
                <Image
                  src={
                    this.props.user
                      ? this.props.user.image !== null &&
                        this.props.user.image !== undefined
                        ? "/img/users/" +
                          encodeURIComponent(this.props.user.image)
                        : ""
                      : ""
                  }
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    background: "none",
                    margin: "1rem 1rem 0 0"
                  }}
                  alt={this.props.user ? this.props.user.nametag : "Loading"}
                />
                <Input
                  label="Message"
                  type="textarea"
                  style={{
                    margin: "1.5rem 0 0",
                    flex: "1 1 0"
                  }}
                  ref={input => (this.input = input)}
                />
              </div>
              <div className="action-buttons">
                <button className="primary" onClick={this.sendComment}>
                  Send
                </button>
              </div>
            </div>
          )}
          {Object.keys(this.props.user).length === 0 && (
            <div className="login">
              <p>You need an account to write a response</p>
              <a onClick={() => this.props.openSignInModal("signUp")}>
                Sign up
              </a>
            </div>
          )}
          {this.state.comments.map((elem, i) => {
            return (
              <div className="response" key={i}>
                <div className="top">
                  <div className="author">
                    <Image
                      src={
                        elem.author
                          ? elem.author.image !== null &&
                            elem.author.image !== undefined
                            ? elem.author.image
                            : ""
                          : ""
                      }
                      alt={elem.author ? elem.author.nametag : "Loading"}
                      style={{
                        display: "inline-block",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        margin: "0 0.5rem 0 0",
                        background: "none"
                      }}
                    />
                    <h3>{elem.author ? elem.author.nametag : "Loading"}</h3>
                  </div>
                  {Object.keys(this.props.user).length > 0 &&
                    elem.author &&
                    elem.author.id === this.props.user.id && (
                      <MoreMenu
                        id={elem.id}
                        edit={this.state["edit_" + elem.id]}
                        updateEdit={() => {
                          this.setState(prevState => {
                            let state: any = prevState;
                            state["edit_" + elem.id] = true;

                            return state;
                          });
                        }}
                        openDeletePopup={this.props.openDeletePopup}
                      />
                    )}
                </div>
                {this.state["edit_" + elem.id] ? (
                  <div>
                    <Input
                      label="Message"
                      type="textarea"
                      value={elem.message}
                      style={{
                        margin: "2rem 0.5rem 0",
                        flex: "1 1 0",
                        whiteSpace: "normal"
                      }}
                      ref={input => (this["edit_" + elem.id] = input)}
                    />
                    <div className="action-buttons">
                      <button
                        className="primary"
                        onClick={() =>
                          this.updateComment(elem.id, elem.author.id)
                        }
                      >
                        Update
                      </button>
                      <button
                        className="secondary"
                        onClick={() => {
                          this.setState(prevState => {
                            let state: any = prevState;
                            state["edit_" + elem.id] = false;

                            return state;
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <Markdown className="message" source={elem.message} />
                )}
              </div>
            );
          })}
          <style jsx>{`
            .Responses {
              margin: 5rem 0 0;
            }

            .Responses h2 {
              color: #cc0000;
              text-align: center;
              margin: 0 0 2rem;
            }

            .Responses .login,
            .Responses .input,
            .Responses .response {
              border-radius: 2px;
              background: #fff;
              font-family: Georgia, Cambria, "Times New Roman", Times, serif;
              font-size: 1.25rem;
              white-space: pre-wrap;
              /* box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2); */
              padding: 0.3rem 0.6rem;
              margin: 1rem 0;
              border: 1px solid rgba(0, 0, 0, 0.2);
            }

            .Responses .login {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                sans-serif;
              text-align: center;
              cursor: default;
            }

            .Responses .input {
              display: flex;
              flex-direction: column;
            }

            .Responses .input .message {
              display: flex;
              align-items: self-start;
              white-space: normal;
            }

            .Responses .input .action-buttons {
              display: flex;
              flex-direction: row;
              float: right;
              margin: 0.5rem 0 0.5rem auto;
            }

            .Responses .input .action-buttons button {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
              background: none;
              border: 0;
              outline: 0;
              opacity: 0.8;
              box-shadow: none;
              transition: all 0.15s;
            }

            .Responses .input .action-buttons button:hover {
              /* text-decoration: underline; */
              opacity: 1;
            }

            .Responses .input .action-buttons button.primary {
              margin: 1rem 0 1rem 1rem;
              cursor: pointer;
              color: #cc0000;
            }

            .Responses .input .action-buttons button.secondary {
              margin: 1rem;
              cursor: pointer;
              color: #7f7f7f;
            }

            .Responses .input .action-buttons button.primary {
              margin: 0;
            }

            .Responses .response .top {
              display: flex;
            }

            .Responses .response .top .author {
              display: flex;
              flex-direction: row;
              flex-flow: row;
              align-items: center;
              flex: 1 1 0;
              margin: 0.5rem 0 0;
            }

            .Responses .response .top .author h3 {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                sans-serif;
              display: inline;
              font-size: 1rem;
              font-weight: 400;
              margin: 0;
              cursor: default;
            }

            .Responses .response .action-buttons {
              display: flex;
              flex-direction: row-reverse;
            }

            .Responses .response .action-buttons button {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
              background: none;
              border: 0;
              outline: 0;
              opacity: 0.8;
              box-shadow: none;
              transition: all 0.15s;
            }

            .Responses .response .action-buttons button:hover {
              /* text-decoration: underline; */
              opacity: 1;
            }

            .Responses .response .action-buttons button.primary {
              margin: 1rem 0 1rem 1rem;
              cursor: pointer;
              color: #cc0000;
            }

            .Responses .response .action-buttons button.secondary {
              margin: 1rem;
              cursor: pointer;
              color: #7f7f7f;
            }

            .Responses .response .action-buttons button.primary {
              margin: 0;
            }

            .Responses .response .action-buttons button.primary {
              margin-left: 0;
            }
          `}</style>
          <style jsx global>{`
            .Responses .input .message p.Input label,
            .Responses .response p.Input label {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
                sans-serif;
            }

            .Responses .response .message {
              margin: 1rem 0.5rem;
            }
          `}</style>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

interface MenuProps {
  id: string | undefined;
  edit: boolean;
  updateEdit: any;
  openDeletePopup: any;
}

interface MenuState {
  menuOpen: boolean;
}

class MoreMenu extends Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);

    this.state = { menuOpen: false };
  }

  render() {
    return (
      <div
        className="more"
        tabIndex={0}
        onBlur={() => {
          this.setState(prevState => ({
            ...prevState,
            menuOpen: false
          }));
        }}
        ref={div => (this.more = div)}
      >
        <img
          src="/img/more.svg"
          onClick={() => {
            this.setState(prevState => ({
              ...prevState,
              menuOpen: !this.state.menuOpen
            }));
          }}
        />
        <div
          className="menu"
          style={
            !this.state.menuOpen
              ? {
                  maxHeight: 0,
                  boxShadow: "none",
                  background: "none"
                }
              : {
                  maxHeight: "calc(2 * (1.5rem + 2 * 0.5rem) + 0.4rem)"
                }
          }
          ref={div => (this.menu = div)}
        >
          <li>
            <a
              className={this.props.edit ? "disabled" : ""}
              onClick={e => {
                e.preventDefault();

                this.props.updateEdit();
                this.setState(prevState => ({
                  ...prevState,
                  menuOpen: false
                }));
              }}
            >
              Edit
            </a>
          </li>
          <li>
            <a
              onClick={e => {
                e.preventDefault();

                this.props.openDeletePopup("comment", this.props.id);
                this.setState(prevState => ({
                  ...prevState,
                  menuOpen: false
                }));
              }}
            >
              Delete
            </a>
          </li>
        </div>
        <style jsx>{`
          .more {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 0.5rem;
            outline: 0;
          }

          .more img {
            width: 1.7rem;
            -webkit-user-draq: none;
            user-select: none;
            cursor: pointer;
          }

          .more .menu {
            position: absolute;
            top: 3rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
            font-size: 1rem;
            border-radius: 8px;
            padding: 0.2rem 2rem;
            max-height: calc(2 * (1.5rem + 2 * 0.5rem) + 0.4rem);
            background: #fff;
            box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            z-index: 1000;
            transition: all 0.3s;
          }

          .more .menu li {
            list-style: none;
            padding: 0.5rem 0;
            text-align: center;
            user-select: none;
          }

          .more .menu li a.disabled {
            opacity: 0.6;
            cursor: default;
          }

          .more .menu li a.disabled:hover {
            text-decoration: none !important;
          }
        `}</style>
      </div>
    );
  }
}

interface DeletePopupProps {
  id: any;
  isOpen: any;
  deleteArticle: any;
  deleteCommentFromDOM: any;
  deleteComment?: any;
}

interface DeletePopupState {
  id?: any;
  what?: string;
  popup: boolean;
}

@graphql(
  gql`
    mutation deleteComment($id: String, $articleID: String) {
      deleteComment(id: $id, articleID: $articleID) {
        status
      }
    }
  `,
  {
    name: "deleteComment"
  }
)
class DeletePopup extends Component<DeletePopupProps, DeletePopupState> {
  constructor(props: any) {
    super(props);

    this.state = { popup: false };

    this.open = this.open.bind(this);
    this.delete = this.delete.bind(this);
  }

  open(what = "article", id = this.props.id) {
    this.setState((prevState: any) => ({
      ...prevState,
      what,
      id,
      popup: true
    }));
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.isOpen !== this.props.isOpen && nextProps.isOpen !== false) {
      this.setState((prevState: any) => ({
        ...prevState,
        ...nextProps.isOpen,
        popup: true
      }));
    }
  }

  delete() {
    switch (this.state.what) {
      case "article":
        this.props.deleteArticle();
      case "comment":
        this.props
          .deleteComment({
            variables: { id: this.state.id, articleID: this.props.id }
          })
          .then((res: any) => {
            this.props.deleteCommentFromDOM(this.state.id);
          })
          .catch((err: any) => {
            console.error(err);
          });
    }
  }

  render() {
    return (
      <div
        className="deletePopup modal"
        role="dialog"
        style={{
          visibility: this.state.popup ? "visible" : "collapse",
          opacity: this.state.popup ? 1 : 0
        }}
        onClick={() => {
          this.setState(prevState => ({
            ...prevState,
            popup: false
          }));
        }}
        ref={div => {
          this.popup = div;
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={!this.state.popup ? { marginTop: "-10rem" } : {}}
          onKeyPress={e => {
            if (e.key === "Enter") {
              this.props.deleteArticle();
            }
          }}
          ref={div => {
            this.popup = div;
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Delete {this.props.isOpen.what || "Article"}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState((prevState: any) => ({
                    ...prevState,
                    popup: false
                  }));
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Are you sure that you want to delete this{" "}
              {this.props.isOpen.what || "article"}?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.delete}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={e => {
                  e.preventDefault();
                  this.setState(prevState => ({
                    ...prevState,
                    popup: false
                  }));
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        <style jsx>{`
          .deletePopup {
            display: block !important;
            opacity: 0;
            background: rgba(0, 0, 0, 0.6);
            transition: all 0.3s;
          }

          .deletePopup .modal-dialog {
            transition: all 0.3s;
          }

          .deletePopup .modal-content,
          .deletePopup .modal-content .modal-header,
          .deletePopup .modal-content .modal-footer {
            border: 0;
          }

          .deletePopup .modal-content .modal-header button.close {
            outline: 0;
          }

          .deletePopup .modal-content .modal-body {
            width: 90%;
            margin: 0 auto;
            padding-bottom: 0;
            max-height: 20rem;
            transition: all 0.3s;
          }

          .deletePopup .modal-content .modal-body {
            padding: 15px;
          }

          .deletePopup .modal-content .modal-footer {
            padding-top: 0;
            flex-flow: wrap;
            justify-content: center;
            flex-flow: column;
          }

          .deletePopup .modal-content .modal-footer button {
            border: 0;
            background: none;
            cursor: pointer;
            box-shadow: none;
            outline: 0;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .deletePopup .modal-content .modal-footer button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .deletePopup .modal-content .modal-footer button:focus {
            box-shadow: none;
            outline: 0;
            background: none;
          }

          .deletePopup .modal-content .modal-footer button:active {
            border: 0;
            background: none;
            box-shadow: none;
          }

          .deletePopup .modal-content .modal-footer button.btn-primary {
            color: #cc0017;
            order: 1;
            font-weight: 600;
          }

          .deletePopup .modal-content .modal-footer button.btn-secondary {
            color: #7f7f7f;
            font-weight: 400;
          }

          @media (min-width: 576px) {
            .deletePopup .modal-content .modal-footer {
              justify-content: flex-end;
              flex-flow: row;
            }
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user
});

export default withData(connect(mapStateToProps, null)(ArticlePage));
