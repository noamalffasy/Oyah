import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as signInModalActionCreators from "../actions/signInModal";
import * as errorActionCreators from "../actions/error";

import * as uuid from "uuid/v4";

import Router from "next/router";
import Head from "next/head";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlaceholder from "react-placeholder";
import { RoundShape, TextRow } from "react-placeholder/lib/placeholders";
import {
  RedditShareButton,
  TwitterShareButton,
  FacebookShareButton
} from "react-share";
import * as moment from "moment";

import App from "../components/App";

import Markdown from "../components/Markdown";
import Verification from "../components/Verification";
import Image from "../components/Image";
import Popup from "../components/Popup";
import Input from "../components/Input";
import ActionButtons from "../components/ActionButtons";
import { More as MoreSvg } from "../components/svgs";

import Error from "./_error";

import withData from "../lib/withData";

import { ArticleModel, CommentModel } from "../lib/db/models";
import { Article } from "../lib/db/models/Article";
import { Comment as CommentInterface } from "../lib/db/models/Comment";

class AuthorImagePlaceholder extends Component {
  render() {
    return (
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
    );
  }
}

class AuthorDatePlaceholder extends Component {
  render() {
    return (
      <TextRow
        className="text"
        color="#e0e0e0"
        style={{
          width: "5rem",
          height: "1rem",
          marginTop: "0.4rem",
          animation: "loading 1.5s infinite"
        }}
      />
    );
  }
}

class AuthorPlaceholder extends Component {
  render() {
    return (
      <div className="author">
        <AuthorImagePlaceholder />
        <div>
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
          <AuthorDatePlaceholder />
        </div>
        <style jsx global>{`
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
  idToken?: string;
  id?: string;
  name?: string;
  nametag?: string;
  email?: string;
  small_image?: string;
  image?: string;
  bio?: string;
  mains?: string;
  reddit?: string;
  twitter?: string;
  editor?: boolean;
  is_team?: boolean;
}

interface Props extends React.Props<ArticlePage> {
  match: any;
  user: User;
  author: User;
  article: Article;
  profile?: User;
  signInModal: any;
  error: any;
  dispatch: any;
}

interface State {
  datePublished: string | undefined;
  titleReady: boolean;
  menuOpen: boolean;
  deletePopup: any;
  removeComments?: string[] | undefined;
  notFound?: boolean;
}

class ArticlePage extends Component<Props, State> {
  state = {
    datePublished: undefined,
    titleReady: false,
    menuOpen: false,
    deletePopup: false,
    removeComments: []
  };

  more: HTMLDivElement = null;
  morePopup: Popup = null;
  title: HTMLHeadingElement = null;
  firstContainer: HTMLDivElement = null;
  deletePopup: DeletePopup = null;

  static async getInitialProps({ query: { id } }: any, _: any, user) {
    return await ArticleModel.get({
      id: id.indexOf("_small.jpeg") > -1 ? id.replace("_small.jpeg", "") : id
    })
      .then(async article => {
        if (!article.id) {
          return {
            error: "Not found"
          };
        }

        if (user) {
          return {
            article,
            profile: user,
            author: article.author
          };
        } else {
          return {
            article,
            author: article.author
          };
        }
      })
      .catch((err: Error) => {
        console.error(err);
        return { error: err };
      });
  }

  // componentDidMount() {
  //   this.props
  //     .getArticle({
  //       variables: { id: this.state.id }
  //     })
  //     .then((getArticle: any) => {
  //       if (getArticle.error) {
  //         if (
  //           getArticle.error[0].message === "Cannot read property 'get' of null"
  //         ) {
  //           this.setState((prevState: any) => ({
  //             ...prevState,
  //             notFound: true,
  //             title: "Not Found"
  //           }));
  //         } else {
  //           console.error(getArticle.error.message);
  //         }
  //       } else if (getArticle.data.getArticle.id !== null) {
  //         this.setState((prevState: any) => ({
  //           ...prevState,
  //           ...getArticle.data.getArticle,
  //           datePublished:
  //             new Date(getArticle.data.getArticle.createdAt).getFullYear() ===
  //             new Date().getFullYear()
  //               ? moment(getArticle.data.getArticle.createdAt).format("MMM D")
  //               : moment(getArticle.data.getArticle.createdAt).format(
  //                   "MMM D, YYYY"
  //                 )
  //         }));

  //         this.props
  //           .getUser({
  //             variables: {
  //               id: getArticle.data.getArticle.authorID
  //             }
  //           })
  //           .then((getUser: any) => {
  //             if (getUser.error) {
  //               console.error(getUser.error.message);
  //             } else {
  //               this.setState((prevState: any) => ({
  //                 ...prevState,
  //                 author: {
  //                   ...getUser.data.getUser,
  //                   image:
  //                     "/img/users/" +
  //                     encodeURIComponent(getUser.data.getUser.image)
  //                 }
  //               }));
  //             }
  //           });
  //       } else {
  //         this.setState((prevState: any) => ({
  //           ...prevState,
  //           notFound: true,
  //           title: "Not Found"
  //         }));
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // }

  componentDidMount() {
    const { error, article } = this.props;
    if (error) {
      if (error !== "User is not logged in (or authenticated).") {
        console.error(error);
      }
    }
    if (article) {
      this.setState(prevState => ({
        ...prevState,
        datePublished:
          new Date(article.createdAt).getFullYear() === new Date().getFullYear()
            ? moment(article.createdAt).format("MMM D")
            : moment(article.createdAt).format("MMM D, YYYY")
      }));
      this.fixVerificationPlacement();
    }
    if (error !== false) {
      if (error === "Not found") {
        this.setState(prevState => ({
          ...prevState,
          notFound: true,
          title: "Not Found"
        }));
      } else {
        this.setError(error);
      }
    }
  }

  // shouldComponentUpdate(nextProps: Props, nextState: State) {
  //   if (
  //     (this.more &&
  //       nextState.menuOpen !== this.morePopup.state.open) ||
  //     (this.deletePopup && nextState.deletePopup !== false) ||
  //     // (this.more && this.more.contains(nextProps.clicked)) ||
  //     !this.props.article ||
  //     !this.props.article.content ||
  //     !this.props.author ||
  //     !this.state.datePublished ||
  //     this.props.user !== nextProps.user ||
  //     this.props.signInModal !== nextProps.signInModal
  //     // (nextProps.clicked === this.props.clicked &&
  //     //   !this.state.menuOpen &&
  //     //   this.state.content &&
  //     //   this.props.author)
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

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

  fixVerificationPlacement() {
    this.setState(
      prevState => ({
        ...prevState,
        titleReady: true
      }),
      () => {
        if (this.props.author.is_team) {
          function checkNumLines(elem: HTMLHeadingElement) {
            const divHeight = elem.offsetHeight;
            const lineHeight = parseInt(
              window
                .getComputedStyle(elem, null)
                .getPropertyValue("line-height")
            );
            return Math.round(divHeight / lineHeight);
          }

          const originalNumLines = checkNumLines(this.title);

          const title = this.title.innerHTML;
          const verificationSymbol = title.substring(title.indexOf("<span"));

          this.title.innerText = title.substring(0, title.indexOf("<span"));

          const numLines = checkNumLines(this.title);

          if (numLines < originalNumLines) {
            let words = title.substring(0, title.indexOf("<span")).split(" ");
            words.splice(words.length - 1, 0, "<br>");
            words.push(verificationSymbol);
            this.title.innerHTML = words.join(" ");
          } else {
            this.title.innerHTML = title;
          }
        }
      }
    );
  }

  openDeletePopup = (what = "article", id = this.props.article.id) => {
    this.setState(prevState => ({
      ...prevState,
      deletePopup: { what, id }
    }));
  };

  deleteArticle = actionButtons => {
    if (this.props.user.id === this.props.author.id) {
      ArticleModel.destroy({ id: this.props.article.id })
        .then((res: any) => {
          actionButtons.reset();

          if (res.error) {
            console.error(res.error.message);
          } else {
            Router.push("/");
          }
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  };

  deleteComment = (id: string) => {
    this.setState(prevState => ({
      ...prevState,
      removeComments: this.state.removeComments.concat([id])
    }));
  };

  openSignInModal = bindActionCreators(
    signInModalActionCreators.open,
    this.props.dispatch
  );

  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    if (this.props.article) {
      return (
        <App {...this.props}>
          <div className="ArticlePage">
            <Head>
              <title>
                {(this.props.article.title || "Article") + ` | Oyah`}
              </title>
              <meta
                name="keywords"
                content={`${this.props.article.title
                  .split(" ")
                  .join(",")},Oyah,Melee,News,Gaming`}
              />
              <meta name="description" content={this.props.article.content} />
              <meta name="author" content={this.props.author.nametag} />
              <meta name="og:image" content={this.props.article.path} />
            </Head>
            <div className="container" ref={div => (this.firstContainer = div)}>
              <div className="Content" style={{ paddingBottom: "2rem" }}>
                <div className="top">
                  <ReactPlaceholder
                    customPlaceholder={<AuthorPlaceholder />}
                    ready={
                      this.props.author !== undefined &&
                      this.state.datePublished !== undefined
                    }
                  >
                    <div className="author">
                      <Link
                        href={`/Profile?nametag=${
                          this.props.author ? this.props.author.nametag : ""
                        }`}
                        as={`/users/${
                          this.props.author ? this.props.author.nametag : ""
                        }`}
                      >
                        <a style={{ opacity: 1 }}>
                          <Image
                            src={
                              this.props.author
                                ? this.props.author.image !== null &&
                                  this.props.author.image !== undefined
                                  ? this.props.author.image.startsWith("http")
                                    ? this.props.author.image
                                    : "/img/users/" +
                                      encodeURIComponent(
                                        this.props.author.image
                                      )
                                  : ""
                                : ""
                            }
                            alt={
                              this.props.author
                                ? this.props.author.nametag
                                : "Loading"
                            }
                            style={{
                              display: "inline-block",
                              width: "4rem",
                              height: "4rem",
                              marginRight: "0.5rem",
                              borderRadius: "50%"
                            }}
                            customPlaceholder={<AuthorImagePlaceholder />}
                          />
                        </a>
                      </Link>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <Link
                          href={`/Profile?nametag=${
                            this.props.author ? this.props.author.nametag : ""
                          }`}
                          as={`/users/${
                            this.props.author ? this.props.author.nametag : ""
                          }`}
                        >
                          <a style={{ opacity: 1 }}>
                            <h3
                              style={{
                                display: "inline-block",
                                color: "#212529",
                                cursor: "pointer"
                              }}
                            >
                              {this.props.author
                                ? this.props.author.nametag
                                : "Loading"}
                            </h3>
                            {this.props.author.is_team && (
                              <Verification
                                isArticle={false}
                                style={{ marginLeft: ".5rem" }}
                              />
                            )}
                          </a>
                        </Link>
                        <span style={{ color: "rgba(0,0,0,.5)" }}>
                          {this.state.datePublished || ""}
                        </span>
                      </div>
                    </div>
                  </ReactPlaceholder>
                  {this.props.user &&
                    (Object.keys(this.props.user).length > 0 ||
                      this.props.profile) &&
                    this.props.author &&
                    this.props.author.id === this.props.user.id && (
                      <div className="more" ref={div => (this.more = div)}>
                        <MoreSvg
                          onClick={e => {
                            e.preventDefault();

                            this.setState(prevState => ({
                              ...prevState,
                              menuOpen: true
                            }));
                          }}
                        />
                        <Popup
                          open={this.state.menuOpen}
                          ref={popup => (this.morePopup = popup)}
                        >
                          <li>
                            <Link
                              href={`/WriteArticle?id=${this.props.article.id}`}
                              as={`/articles/new/${this.props.article.id}`}
                            >
                              <a onClick={() => this.morePopup.open()}>Edit</a>
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
                        </Popup>
                      </div>
                    )}
                </div>
                <ReactPlaceholder
                  className="title"
                  type="text"
                  rows={2}
                  ready={this.state.titleReady}
                  style={{ animation: "loading 1.5s infinite", width: "80%" }}
                >
                  <h1 ref={title => (this.title = title)}>
                    {this.props.article.title}
                    {this.props.author.is_team && (
                      <Verification
                        isArticle={true}
                        style={{ marginLeft: "1rem" }}
                      />
                    )}
                  </h1>
                </ReactPlaceholder>
              </div>
            </div>

            <Image
              className="article-image"
              src={this.props.article.path}
              alt=""
              fixed
            />
            {/* <div
            className="article-image"
            style={{
              backgroundImage: `url("/articles/img/${this.props.article.id}.jpeg")`
            }}
          /> */}

            <div className="ArticlePage">
              <div className="container">
                <div className="Content">
                  <Markdown value={this.props.article.content || ""} />
                  <Bottombar
                    where="article"
                    contentLoaded={this.props.article.content !== undefined}
                    user={this.props.user}
                    id={this.props.article.id}
                    likes={this.props.article.likes}
                    openSignInModal={this.openSignInModal}
                    setError={this.setError}
                  />

                  <Responses
                    user={this.props.user}
                    openSignInModal={this.openSignInModal}
                    articleID={this.props.article.id}
                    author={this.props.author}
                    comments={this.props.article.comments}
                    removeComments={this.state.removeComments}
                    openDeletePopup={this.openDeletePopup}
                    setError={this.setError}
                  />
                </div>
              </div>
            </div>
            <DeletePopup
              user={this.props.user}
              isOpen={this.state.deletePopup}
              deleteArticle={this.deleteArticle}
              deleteCommentFromDOM={this.deleteComment}
              id={this.props.article.id}
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
              margin-bottom: 0.5rem;
            }

            .ArticlePage .top .author {
              display: flex;
              flex-flow: row;
              align-items: center;
              flex: 1 1 0;
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
              display: flex;
              align-items: center;
              justify-content: center;
              outline: 0;
            }

            .ArticlePage h1 {
              text-align: center;
              font-size: 3rem;
              /* margin-bottom: 2rem; */
            }

            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .Content {
                width: 70%;
              }
              .ArticlePage h1 {
                font-size: 3rem;
              }
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage h1 {
                font-size: 4rem;
              }
            }
          `}</style>
          <style jsx global>{`
            .ArticlePage .top .more svg {
              width: 1.7rem;
              margin: 0 2rem 0 0;
              -webkit-user-draq: none;
              user-select: none;
              cursor: pointer;
            }

            .ArticlePage .top .more .popup-wrapper {
              width: 90%;
            }

            .ArticlePage .top .more .popup-wrapper .popup {
              width: 30%;
              /* float: right; */
            }

            .ArticlePage .top .more .popup-wrapper .popup li {
              list-style: none;
              padding: 0.5rem 0;
              text-align: center;
              user-select: none;
            }

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
              position: relative;
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: center center;
              background-color: #c3c3c3;
              z-index: 1;
              width: 100%;
              margin-bottom: 2rem;
              transition: all 0.3s;
              animation: imageLoad 1s infinite;
            }
            /* .ArticlePage .article-image {
              min-height: 20rem;
              max-height: 20rem;
            } */
            @media (min-width: 480px),
              @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .top .more .popup-wrapper {
                width: 60%;
                padding-right: 2rem;
              }
              .ArticlePage .top .more .popup-wrapper .popup {
                float: unset;
              }
            }

            /* @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .body .image {
                min-height: 20rem;
              }
            } */

            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .top .more .popup-wrapper {
                width: 50%;
              }
              /* .ArticlePage .article-image {
                min-height: 25rem;
                max-height: 25rem;
              } */
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .top .more .popup-wrapper {
                width: 40%;
              }
              /* .ArticlePage .body .image {
                min-height: 25rem;
              } */
            }

            @media (min-width: 1200px),
              @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
              .ArticlePage .top .more .popup-wrapper {
                width: 30%;
              }
              /* .ArticlePage .article-image {
                min-height: 30rem;
                max-height: 30rem;
              } */
            }

            /* @media (min-width: 1300px),
              @media (min-width: 1300px) and (-webkit-min-device-pixel-ratio: 1) {
               .ArticlePage .article-image {
                min-height: 35rem;
                max-height: 35rem;
              } 
            } */
          `}</style>
        </App>
      );
    } else {
      return <Error {...this.props} statusCode={404} />;
    }
  }
}

interface BottombarProps {
  where: string;
  id: any;
  articleID?: any;
  user: User;
  likes: any;
  contentLoaded: any;
  openSignInModal: any;
  setError: any;
}

interface BottombarState {
  liked: any;
  likes: any;
  isLiked: boolean;
  showPopup: boolean;
}

class Bottombar extends Component<BottombarProps, BottombarState> {
  constructor(props: any) {
    super(props);

    this.state = {
      liked: this.props.likes,
      likes: Object.keys(this.props.likes).length,
      isLiked: false,
      showPopup: false
    };

    this.toggleLike = this.toggleLike.bind(this);
  }

  componentDidMount() {
    if (
      this.props.user &&
      Object.keys(this.props.user).length > 0 &&
      this.props.user.id
    ) {
      this.setState(prevState => ({
        ...prevState,
        liked: this.props.likes,
        likes: Object.keys(this.props.likes).length,
        isLiked: this.props.likes[this.props.user.id]
      }));
    }
  }

  componentWillReceiveProps(nextProps: BottombarProps) {
    if (
      nextProps.user &&
      Object.keys(nextProps.user).length > 0 &&
      nextProps.user.id &&
      nextProps.user !== this.props.user
    ) {
      this.setState(prevState => ({
        ...prevState,
        liked: nextProps.likes,
        likes: Object.keys(nextProps.likes).length,
        isLiked: nextProps.likes[nextProps.user.id]
      }));
    }
  }

  async toggleLike(e: any) {
    e.preventDefault();

    if (Object.keys(this.props.user).length > 0) {
      const id = this.props.id;
      const articleID = this.props.articleID;
      const liked = this.state.liked;
      const isLiked = liked[this.props.user.id];
      const { [this.props.user.id]: value, ...newLiked } = liked;
      const likes = !isLiked
        ? { ...liked, [this.props.user.id]: true }
        : newLiked;

      this.setState(prevState => ({
        ...prevState,
        liked: likes,
        likes: Object.keys(likes).length,
        isLiked: !isLiked
      }));

      switch (this.props.where) {
        case "comment":
          await CommentModel.get({ id, articleID }).then(
            async (comment: any) => {
              if (comment.likes) {
                const {
                  [this.props.user.id]: value,
                  ...newLiked
                } = comment.likes;

                CommentModel.update({
                  id,
                  articleID,
                  likes: !isLiked
                    ? { ...comment.likes, [this.props.user.id]: true }
                    : newLiked
                }).catch((err: any) => {
                  console.error(err);
                });
              } else {
                CommentModel.update({
                  id,
                  articleID,
                  likes: !isLiked ? { [this.props.user.id]: true } : {}
                }).catch((err: any) => {
                  console.error(err);
                });
              }
            }
          );
          break;
        default:
          await ArticleModel.get({ id }).then(async article => {
            if (article.likes) {
              const {
                [this.props.user.id]: value,
                ...newLiked
              } = article.likes;

              ArticleModel.update({
                id,
                likes: !isLiked
                  ? { ...article.likes, [this.props.user.id]: true }
                  : newLiked
              }).catch((err: any) => {
                console.error(err);
              });
            } else {
              ArticleModel.update({
                id,
                likes: !isLiked ? { [this.props.user.id]: true } : {}
              }).catch((err: any) => {
                console.error(err);
              });
            }
          });
          break;
      }
    } else {
      this.setState(prevState => ({
        ...prevState,
        showPopup: true
      }));
    }
  }

  render() {
    return (
      <div
        className="Bottombar"
        style={this.props.contentLoaded ? { display: "" } : { display: "none" }}
      >
        <div className="like" style={{ width: "unset", margin: 0 }}>
          <span
            className="like-count"
            style={{
              color: "rgba(0, 0, 0, 0.5)",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
              fontSize: "1rem"
            }}
          >
            {this.state.likes}
          </span>
          <button
            className="like"
            onClick={this.toggleLike}
            style={
              this.props.where === "comment"
                ? this.state.isLiked
                  ? {
                      animation: "like .5s forwards"
                    }
                  : {}
                : this.state.isLiked
                  ? {
                      animation: "like .5s forwards"
                    }
                  : {}
            }
          >
            <FontAwesomeIcon
              icon="heart"
              style={
                this.props.where === "comment"
                  ? this.state.isLiked
                    ? { opacity: 1 }
                    : {}
                  : this.state.isLiked
                    ? { opacity: 1 }
                    : {}
              }
            />
            <FontAwesomeIcon
              icon={["far", "heart"]}
              style={
                this.props.where === "comment"
                  ? !this.state.isLiked
                    ? { opacity: 1 }
                    : {}
                  : !this.state.isLiked
                    ? { opacity: 1 }
                    : {}
              }
            />
          </button>
          <Popup open={this.state.showPopup}>
            <p>
              You need an account to like{" "}
              {this.props.where === "comment" ? "a comment" : "an article"}
            </p>
            <a onClick={() => this.props.openSignInModal("signUp")}>Sign up</a>
          </Popup>
        </div>
        {/* <button className="st-custom-button" data-network="reddit">
          <FontAwesomeIcon icon={["fab", "reddit-alien"]} />
        </button>
        <button className="st-custom-button" data-network="twitter">
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </button>
        <button className="st-custom-button" data-network="facebook">
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        </button> */}
        <RedditShareButton
          url={
            this.props.where === "article"
              ? "https://www.oyah.xyz/articles/" + this.props.id
              : "https://www.oyah.xyz/articles/" +
                this.props.articleID +
                "?comment=" +
                this.props.id
          }
        >
          <FontAwesomeIcon icon={["fab", "reddit-alien"]} />
        </RedditShareButton>
        <TwitterShareButton
          url={
            this.props.where === "article"
              ? "https://www.oyah.xyz/articles/" + this.props.id
              : "https://www.oyah.xyz/articles/" +
                this.props.articleID +
                "?comment=" +
                this.props.id
          }
        >
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </TwitterShareButton>
        <FacebookShareButton
          url={
            this.props.where === "article"
              ? "https://www.oyah.xyz/articles/" + this.props.id
              : "https://www.oyah.xyz/articles/" +
                this.props.articleID +
                "?comment=" +
                this.props.id
          }
        >
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        </FacebookShareButton>
        {/* <button>
          <FontAwesomeIcon icon="share-square" style={{ opacity: 1 }} />
        </button> */}
        <style jsx global>{`
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

          .Bottombar div,
          .Bottombar button,
          .Bottombar .SocialMediaShareButton {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 100%;
            margin: 0 0.5rem;
            background: none;
            border: 0;
            outline: 0;
            cursor: pointer;
          }

          .Bottombar button.like {
            position: relative;
          }

          .Bottombar button svg,
          .Bottombar .SocialMediaShareButton svg {
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
  setError: any;
  getUser?: any;
}

interface ResponsesState {
  comments: any[] | undefined;
  menuOpen: boolean;
  edit: boolean;
}

class Responses extends Component<ResponsesProps, ResponsesState> {
  state = { comments: [], menuOpen: false, edit: false };

  input: Input = null;
  inputActionButtons: ActionButtons = null;

  componentDidMount() {
    if (this.props.comments && this.props.comments.length > 0) {
      this.setState(
        prevState => ({
          ...prevState,
          comments: this.props.comments
        }),
        () => {
          if (Router.query.comment) {
            const comment = this["comment_" + Router.query.comment];
            if (comment !== null) {
              comment.scrollIntoView();
            }
          }
        }
      );
    }
  }

  componentWillReceiveProps(nextProps: ResponsesProps) {
    if (nextProps.comments.length > this.state.comments.length) {
      this.setState(
        prevState => ({
          ...prevState,
          comments: nextProps.comments
        }),
        () => {
          if (Router.query.comment) {
            const comment = this["comment_" + Router.query.comment];
            if (comment !== null) {
              comment.scrollIntoView();
            }
          }
        }
      );
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

  sendComment = (_, triggerLoading: any) => {
    if (
      (this.input.input as HTMLTextAreaElement).value &&
      (this.input.input as HTMLTextAreaElement).value.trim() !== ""
    ) {
      triggerLoading();

      CommentModel.create({
        id: uuid(),
        articleID: this.props.articleID,
        message: (this.input.input as HTMLTextAreaElement).value.trim()
      })
        .then(comment => {
          this.inputActionButtons.reset();

          this.input.reset();

          this.setState(prevState => ({
            ...prevState,
            comments: [
              {
                ...comment,
                author: {
                  ...this.props.user,
                  image:
                    this.props.user.image !== null &&
                    this.props.user.image !== undefined
                      ? this.props.user.image
                      : "User.png"
                }
              },
              ...this.state.comments
            ]
          }));
        })
        .catch((err: Error) => {
          console.error(err);
        });
    }
  };

  updateComment(id: string, triggerLoading: any) {
    if (
      this["edit_" + id].input.value.trim() !== "" &&
      this["edit_" + id].input.value
    ) {
      triggerLoading();

      if (this.props.user.id === this.state.comments[id].author.id) {
        CommentModel.update({
          id,
          articleID: this.props.articleID,
          message: this["edit_" + id].input.value.trim()
        })
          .then(_comment => {
            this["edit_" + id + "ActionButtons"].reset();

            this.setState(prevState => {
              let state: any = prevState;
              state.comments = this.state.comments.map(comment => {
                if (comment.id === id) {
                  return { ...comment, ..._comment };
                }
                return comment;
              });
              state["edit_" + id] = false;

              return state;
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }

  render() {
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
                      ? this.props.user.image.startsWith("http")
                        ? this.props.user.image
                        : "/img/users/" +
                          encodeURIComponent(this.props.user.image)
                      : "/img/User.png"
                    : "/img/User.png"
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
            <ActionButtons
              primaryText="Send"
              primaryAction={this.sendComment}
              style={{
                fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                        "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                        "Segoe UI Emoji", "Segoe UI Symbol"`,
                margin: "0.5rem 0 0.5rem auto"
              }}
              ref={btns => (this.inputActionButtons = btns)}
            />
          </div>
        )}
        {Object.keys(this.props.user).length === 0 && (
          <div className="login">
            <p>You need an account to write a response</p>
            <a onClick={() => this.props.openSignInModal("signUp")}>Sign up</a>
          </div>
        )}
        {this.state.comments.map((elem, i) => {
          if (Router.query.comment === elem.id) {
            setTimeout(() => {
              const comment = this["comment_" + elem.id];
              comment.scrollIntoView();
            }, 10);
          }
          return (
            <div
              className="response"
              key={i}
              ref={comment => (this["comment_" + elem.id] = comment)}
            >
              <div className="top">
                <div className="author">
                  <a
                    href={"/users/" + (elem.author ? elem.author.nametag : "")}
                    style={{ opacity: 1 }}
                  >
                    <Image
                      src={
                        elem.author
                          ? elem.author.image !== null &&
                            elem.author.image !== undefined
                            ? elem.author.image.startsWith("http")
                              ? elem.author.image
                              : "/img/users/" +
                                encodeURIComponent(elem.author.image)
                            : "/img/User.png"
                          : "/img/User.png"
                      }
                      alt={elem.author ? elem.author.nametag : "Loading"}
                      customPlaceholder={<AuthorImagePlaceholder />}
                      style={{
                        display: "inline-block",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        margin: "0 0.5rem 0 0",
                        background: "none"
                      }}
                    />
                  </a>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Link
                      href={`/Profile?nametag=${
                        elem.author ? elem.author.nametag : ""
                      }`}
                      as={`/users/${elem.author ? elem.author.nametag : ""}`}
                    >
                      <a style={{ opacity: 1 }}>
                        <h3
                          style={{
                            display: "inline-block",
                            color: "#212529",
                            cursor: "pointer"
                          }}
                        >
                          {elem.author ? elem.author.nametag : "Loading"}
                        </h3>
                        {elem.author.is_team && (
                          <Verification
                            isArticle={false}
                            style={{ marginLeft: ".5rem" }}
                          />
                        )}
                      </a>
                    </Link>
                    <span
                      style={{
                        color: "rgba(0,0,0,.5)",
                        fontFamily:
                          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
                        fontSize: "1rem"
                      }}
                    >
                      {new Date(elem.createdAt).getFullYear() ===
                      new Date().getFullYear()
                        ? moment(elem.createdAt).format("MMM D")
                        : moment(elem.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
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
              <div
                className="message-outer clearfix"
                style={{ padding: "0 0 1rem 0" }}
                key={elem.id}
              >
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

                    <ActionButtons
                      primaryText="Update"
                      primaryAction={(_, triggerLoading: any) =>
                        this.updateComment(elem.id, triggerLoading)
                      }
                      secondaryText="Cancel"
                      secondaryAction={() => {
                        this.setState(prevState => {
                          let state: any = prevState;
                          state["edit_" + elem.id] = false;

                          return state;
                        });
                      }}
                      style={{
                        fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                        "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                        "Segoe UI Emoji", "Segoe UI Symbol"`,
                        margin: ".5rem 0 1rem auto"
                      }}
                      ref={btns =>
                        (this["edit_" + elem.id + "ActionButtons"] = btns)
                      }
                    />
                  </div>
                ) : (
                  <Markdown className="message" value={elem.message} />
                )}
                <Bottombar
                  where="comment"
                  id={elem.id}
                  articleID={this.props.articleID}
                  user={this.props.user}
                  likes={elem.likes}
                  contentLoaded={true}
                  openSignInModal={this.props.openSignInModal}
                  setError={this.props.setError}
                />
              </div>
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
            padding: 0.3rem 0.6rem;
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
            font-weight: 500;
            margin: 0;
            cursor: default;
          }

          .Responses .response .message-outer.clearfix::after {
            height: 0;
          }

          .Responses .response .action-buttons {
            display: flex;
            flex-direction: row-reverse;
            margin: 0 0 1rem 0;
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
          .Responses .input .message .Input label,
          .Responses .response .Input label {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
          }

          .Responses .input .message .Input span::after {
            margin: -0.1rem 0 0 0;
          }

          .Responses .response .message {
            margin: 1rem 0.5rem;
          }
        `}</style>
      </div>
    );
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
      <div className="more" tabIndex={0}>
        <MoreSvg
          onClick={() => {
            this.setState(prevState => ({
              ...prevState,
              menuOpen: true
            }));
          }}
        />
        <Popup open={this.state.menuOpen}>
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
        </Popup>
        <style jsx>{`
          .more {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 0.5rem;
            outline: 0;
          }
        `}</style>
        <style jsx global>{`
          .more svg {
            width: 1.7rem;
            -webkit-user-draq: none;
            user-select: none;
            cursor: pointer;
          }

          .more .popup-wrapper {
            width: 90% !important;
          }

          .more .popup-wrapper .popup {
            width: 30% !important;
            float: right;
          }

          .more .popup-wrapper .popup li {
            list-style: none;
            padding: 0.5rem 0;
            text-align: center;
            user-select: none;
          }

          .more .popup-wrapper .popup li a.disabled {
            opacity: 0.6;
            cursor: default;
          }

          .more .popup-wrapper .popup li a.disabled:hover {
            text-decoration: none !important;
          }
          @media (min-width: 480px),
            @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
            .more .popup-wrapper {
              width: 60% !important;
            }
            .more .popup-wrapper .popup {
              float: unset;
            }
          }

          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .more .popup-wrapper {
              width: 50% !important;
            }
          }

          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .more .popup-wrapper {
              width: 40% !important;
            }
          }

          @media (min-width: 1200px),
            @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
            .more .popup-wrapper {
              width: 30% !important;
            }
          }
        `}</style>
      </div>
    );
  }
}

interface DeletePopupProps {
  id: any;
  user: User;
  isOpen: any;
  deleteArticle: any;
  deleteCommentFromDOM: any;
}

interface DeletePopupState {
  id?: any;
  what?: string;
  popup: boolean;
}

class DeletePopup extends Component<DeletePopupProps, DeletePopupState> {
  state = { popup: false, what: "article", id: null };

  ActionButtons: ActionButtons = null;
  popup: HTMLDivElement = null;

  open = (what = "article", id = this.props.id) => {
    this.setState((prevState: any) => ({
      ...prevState,
      what,
      id,
      popup: true
    }));
  };

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.isOpen !== this.props.isOpen && nextProps.isOpen !== false) {
      this.setState((prevState: any) => ({
        ...prevState,
        ...nextProps.isOpen,
        popup: true
      }));
    }
  }

  delete = (_, triggerLoading: any) => {
    triggerLoading();

    switch (this.state.what) {
      case "article":
        this.props.deleteArticle(this.ActionButtons);
        break;
      case "comment":
        CommentModel.get({ id: this.state.id })
          .then((comment: CommentInterface) => {
            if (this.props.user.id === comment.author.id) {
              CommentModel.destroy({
                id: this.state.id,
                articleID: this.props.id
              })
                .then(() => {
                  this.ActionButtons.reset();
                  this.props.deleteCommentFromDOM(this.state.id);
                })
                .catch((err: any) => {
                  console.error(err);
                });
            }
          })
          .catch(err => {
            console.error(err);
          });

        break;
    }
  };

  render() {
    return (
      <div
        className="deletePopup modal"
        role="dialog"
        style={{
          visibility: this.state.popup ? "visible" : "collapse",
          opacity: this.state.popup ? 1 : 0
        }}
        onClick={(e: any) => {
          if (this.popup.contains(e.target)) {
            this.setState(prevState => ({
              ...prevState,
              popup: false
            }));
          }
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
              <ActionButtons
                primaryText="Delete"
                primaryAction={this.delete}
                secondaryText="Cancel"
                secondaryAction={e => {
                  e.preventDefault();
                  this.setState(prevState => ({
                    ...prevState,
                    popup: false
                  }));
                }}
                ref={btns => (this.ActionButtons = btns)}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .deletePopup {
            display: block !important;
            opacity: 0;
            background: rgba(0, 0, 0, 0.3);
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

          .deletePopup .modal-content {
            border-radius: 0;
            box-shadow: 0 0.3125rem 1rem 0 rgba(0, 0, 0, 0.24);
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
        `}</style>
      </div>
    );
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
  )(ArticlePage)
);
