import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as errorActionCreators from "../actions/error";

import Textarea from "react-textarea-autosize";
import * as MarkdownIt from "markdown-it";
import Editor from "../components/Editor";
import ActionButtons from "../components/ActionButtons";
// import * as Editor from "react-simplemde-editor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as uuid from "uuid/v4";

// import "react-simplemde-editor/dist/simplemde.min.css";
import { prototype } from "react-markdown";

import Head from "next/head";
import Router from "next/router";

import App from "../components/App";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  uploadFile?: any;
  createArticle?: any;
  updateArticle?: any;
  newArticle: any;
  notAuthorized?: any;
  user?: any;
  signInModal?: any;
  url?: any;
  dispatch?: any;
}

interface State {
  notAuthorized: boolean;
  output: string;
  focus: boolean;
  id: any;
  authorID?: any;
  title: string;
  image: any;
  scaleRatio: any;
  content: any;
  edit: any;
  value?: any;
}

@graphql(
  gql`
    mutation uploadFile(
      $file: Upload
      $where: String!
      $articleID: String
      $main: Boolean
      $image: String
    ) {
      uploadFile(
        file: $file
        where: $where
        articleID: $articleID
        main: $main
        image: $image
      ) {
        path
      }
    }
  `,
  {
    name: "uploadFile"
  }
)
@graphql(
  gql`
    mutation createArticle(
      $id: String!
      $title: String!
      $content: String!
      $authorID: Int!
    ) {
      createArticle(
        id: $id
        title: $title
        content: $content
        authorID: $authorID
      ) {
        id
        title
        content
      }
    }
  `,
  {
    name: "createArticle"
  }
)
@graphql(
  gql`
    mutation updateArticle($id: String!, $title: String!, $content: String!) {
      updateArticle(id: $id, title: $title, content: $content) {
        id
        title
        content
      }
    }
  `,
  {
    name: "updateArticle"
  }
)
class WriteArticle extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.md = new MarkdownIt();

    this.state = {
      id: null,
      notAuthorized: false,
      output: "",
      focus: false,
      title: "",
      image: null,
      scaleRatio: "33.3%",
      content: undefined,
      edit: false
    };

    this.renderToPreview = this.renderToPreview.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.getFile = this.getFile.bind(this);
    this.publish = this.publish.bind(this);
  }

  ctrls: {
    articleImage?: HTMLDivElement;
  } = {};

  static async getInitialProps(
    { pathname, query: { id: _id } }: any,
    apolloClient: any,
    user: any
  ) {
    if (_id === undefined) {
      const id = uuid();

      Router.push("/articles/new/" + id);

      return {
        newArticle: { id }
      };
    } else {
      const id =
        _id.indexOf("_small.jpeg") > -1 ? _id.replace("_small.jpeg", "") : _id;

      if (user === undefined) {
        const user = await apolloClient
          .query({
            query: gql`
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
            `
          })
          .then(res => {
            return res.currentUser.user;
          });
      }
      if (user !== undefined) {
        return await apolloClient
          .mutate({
            mutation: gql`
              mutation getArticle($id: String!) {
                getArticle(id: $id) {
                  id
                  title
                  content
                  author {
                    id
                  }
                }
              }
            `,
            variables: {
              id
            }
          })
          .then(res => {
            if (res.errors) {
              res.errors.forEach((error: any) => {
                console.error(error);
              });
            } else if (res.data.getArticle.id !== null) {
              if (
                user.id === res.data.getArticle.author.id &&
                res.data.getArticle.content !== null
              ) {
                return {
                  newArticle: {
                    id,
                    edit: true,
                    title: res.data.getArticle.title,
                    image: "/img/articles/" + id + "/main.jpeg",
                    content: res.data.getArticle.content
                  },
                  user
                };
              } else if (res.data.getArticle.content !== null) {
                return {
                  newArticle: {
                    id,
                    authorID: res.data.getArticle.author.id
                  },
                  notAuthorized: true,
                  user
                };
              } else {
                return {
                  newArticle: {
                    id,
                    edit: true
                  },
                  user
                };
              }
            } else {
              return {
                newArticle: {
                  id
                },
                user
              };
            }
          })
          .catch((err: any) => {
            if (
              err.message === "GraphQL error: obj.getAuthor is not a function"
            ) {
              return {
                newArticle: {
                  id
                },
                user
              };
            }
            console.error(err);
            return {
              error: err
            };
          });
      } else {
        return {
          newArticle: {
            id
          },
          notAuthorized: false
        };
      }
    }
  }

  componentDidMount() {
    const id = this.props.url.query.id;

    if (
      this.props.newArticle !== undefined &&
      this.props.newArticle.title !== undefined
    ) {
      this.setState(
        prevState => ({
          ...prevState,
          id,
          title: this.props.newArticle.title,
          image: this.props.newArticle.image,
          content: this.props.newArticle.content,
          edit: this.props.newArticle.edit ? true : false
        }),
        () => {
          this.setImageScaleRatio();
        }
      );
    }

    if (localStorage.getItem("article_" + id) !== null) {
      const saved = JSON.parse(localStorage.getItem("article_" + id));
      this.setState(
        (prevState: any) => ({
          ...prevState,
          title: saved.title
            ? saved.title
            : this.state.title ? this.state.title : this.props.newArticle.title,
          image: saved.image
        }),
        () => {
          this.setImageScaleRatio();
        }
      );
    }

    setInterval(() => {
      if (
        Object.keys(this.props.user).length !== 0 &&
        this.props.url.pathname === "/WriteArticle"
      ) {
        let seen: any = [];

        localStorage.setItem(
          "article_" + id,
          JSON.stringify(
            {
              title: this.state.title,
              image: this.state.image ? this.state.image : null
            },
            (key, val) => {
              if (val !== null && typeof val === "object") {
                if (seen.indexOf(val) >= 0) {
                  return;
                }
                seen.push(val);
              }
              return val;
            }
          )
        );
      }
    }, 10000);
  }

  getDimensionsOfImage(imageURL) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageURL;
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };
    });
  }

  async setImageScaleRatio() {
    const imgURL = this.state.image || this.props.newArticle.image;
    const { width, height } = await this.getDimensionsOfImage(imgURL);
    const scaleRatio = `${100 * height / width}%`;

    console.log(scaleRatio);

    this.setState(prevState => ({
      ...prevState,
      scaleRatio
    }));
  }

  renderToPreview() {
    const output = this.md.render(this.editor.innerHTML);

    this.setState((prevState: any) => ({
      ...prevState,
      output
    }));
  }

  uploadImage() {
    const imageDialog = findDOMNode(this.imageDialog);
    try {
      imageDialog.click();
    } catch (e) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      imageDialog.dispatchEvent(evt);
    }
  }

  getFile() {
    const imageDialog = findDOMNode(this.imageDialog);
    const fr = new FileReader();
    fr.onload = () => {
      this.setState((prevState: any) => ({
        ...prevState,
        image: fr.result
      }));
    };
    fr.readAsDataURL(imageDialog.files[0]);
  }

  publish(e: any, triggerLoading: any) {
    const title = this.title.value || this.state.title || "";
    const image = this.state.image
      ? this.imageDialog.files.length > 0
        ? this.imageDialog.files[0]
        : this.state.image.startsWith("/img/articles/")
          ? this.state.image
          : this.state.image
      : null;
    const content = this.editor.text() || this.editor.props.value || "";
    let imagePath = null;

    triggerLoading();

    if (
      typeof image === "string" &&
      !image.startsWith("//") &&
      !image.startsWith("https://") &&
      !image.startsWith("http://") &&
      !image.startsWith("/img/articles")
    ) {
      this.props
        .uploadFile({
          variables: {
            where: "article",
            articleID: this.props.newArticle.id,
            main: true,
            image
          }
        })
        .then((res: any) => {
          if (res.error) {
            this.ActionButtons.reset();

            this.setError(res.error.graphQLErrors[0].message);
          } else {
            if (!this.state.edit) {
              this.props
                .createArticle({
                  variables: {
                    id: this.props.newArticle.id,
                    title,
                    content,
                    authorID: this.props.user.id
                  }
                })
                .then((res: any) => {
                  this.ActionButtons.reset();

                  if (res.errors) {
                    this.setError(
                      res.errors
                        .map((error: any) => {
                          return error.graphQLErrors[0].message;
                        })
                        .join("\n")
                    );
                  } else {
                    Router.push("/articles/" + this.props.newArticle.id);
                  }
                })
                .catch((err: any) => {
                  this.ActionButtons.reset();

                  this.setError(err.graphQLErrors[0].message);
                });
            } else {
              this.props
                .updateArticle({
                  variables: {
                    id: this.props.newArticle.id,
                    title,
                    content
                  }
                })
                .then((res: any) => {
                  this.ActionButtons.reset();

                  if (res.errors) {
                    this.setError(
                      res.errors
                        .map((error: any) => {
                          return error.graphQLErrors[0].message;
                        })
                        .join("\n")
                    );
                  } else {
                    Router.push("/articles/" + res.data.updateArticle.id);
                  }
                })
                .catch((err: any) => {
                  this.ActionButtons.reset();

                  this.setError(err.graphQLErrors[0].message);
                });
            }
          }
        })
        .catch((err: any) => {
          this.ActionButtons.reset();

          this.setError(err.graphQLErrors[0].message);
        });
    } else if (
      typeof image === "object" &&
      image !== null &&
      this.imageDialog.validity.valid
    ) {
      this.props
        .uploadFile({
          variables: {
            file: image,
            where: "article",
            articleID: this.props.newArticle.id,
            main: true
          }
        })
        .then((res: any) => {
          if (res.error) {
            this.ActionButtons.reset();

            this.setError(res.error.graphQLErrors[0].message);
          } else {
            if (!this.state.edit) {
              this.props
                .createArticle({
                  variables: {
                    id: this.props.newArticle.id,
                    title,
                    content,
                    authorID: this.props.user.id
                  }
                })
                .then((res: any) => {
                  if (res.errors) {
                    this.setError(
                      res.errors
                        .map((error: any) => {
                          return error.graphQLErrors[0].message;
                        })
                        .join("\n")
                    );
                  } else {
                    Router.push("/articles/" + this.props.newArticle.id);
                  }
                })
                .catch((err: any) => {
                  this.ActionButtons.reset();

                  this.setError(err.graphQLErrors[0].message);
                });
            } else {
              this.props
                .updateArticle({
                  variables: {
                    id: this.props.newArticle.id,
                    title,
                    content
                  }
                })
                .then((res: any) => {
                  this.ActionButtons.reset();

                  if (res.errors) {
                    this.setError(
                      res.errors
                        .map((error: any) => {
                          return error.graphQLErrors[0].message;
                        })
                        .join("\n")
                    );
                  } else {
                    Router.push("/articles/" + res.data.updateArticle.id);
                  }
                })
                .catch((err: any) => {
                  this.ActionButtons.reset();

                  this.setError(err.graphQLErrors[0].message);
                });
            }
          }
        })
        .catch((err: any) => {
          this.ActionButtons.reset();

          this.setError(err.graphQLErrors[0].message);
        });
    } else {
      if (!this.state.edit) {
        this.props
          .createArticle({
            variables: {
              id: this.props.newArticle.id,
              title,
              content,
              authorID: this.props.user.id
            }
          })
          .then((res: any) => {
            this.ActionButtons.reset();

            if (res.errors) {
              this.setError(
                res.errors
                  .map((error: any) => {
                    return error.graphQLErrors[0].message;
                  })
                  .join("\n")
              );
            } else {
              Router.push("/articles/" + this.props.newArticle.id);
            }
          })
          .catch((err: any) => {
            this.ActionButtons.reset();

            this.setError(err.graphQLErrors[0].message);
          });
      } else {
        this.props
          .updateArticle({
            variables: {
              id: this.props.newArticle.id,
              title,
              content
            }
          })
          .then((res: any) => {
            this.ActionButtons.reset();

            if (res.errors) {
              this.setError(
                res.errors
                  .map((error: any) => {
                    return error.graphQLErrors[0].message;
                  })
                  .join("\n")
              );
            } else {
              Router.push("/articles/" + this.props.newArticle.id);
            }
          })
          .catch((err: any) => {
            this.ActionButtons.reset();

            this.setError(err.graphQLErrors[0].message);
          });
      }
    }
  }

  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    if (!this.props.notAuthorized) {
      return (
        <App {...this.props}>
          <div className="WriteArticle">
            <Head>
              <title>Write a new article | Oyah</title>
              <meta name="description" content="Write a new article in Oyah" />
              {/* <base href="http://localhost:8081/" /> */}
            </Head>
            <div className="container">
              <div className="Content">
                <Textarea
                  useCacheForDOMMeasurements
                  className="title"
                  placeholder="Title"
                  value={this.state.title || this.props.newArticle.title || ""}
                  onChange={e => {
                    e.persist();
                    this.setState((prevState: any) => ({
                      ...prevState,
                      title: e.target.value
                    }));
                  }}
                  ref={(input: any) => {
                    this.title = input;
                  }}
                />
              </div>
            </div>

            <div
              className="article-image"
              style={
                this.state.image || this.props.newArticle.image
                  ? {
                      backgroundImage: `url("${this.state.image ||
                        this.props.newArticle.image}")`
                    }
                  : {}
              }
              onClick={this.uploadImage}
              ref={div => (this.ctrls.articleImage = div)}
            >
              <div className="background">
                <div className="upload-text">
                  <FontAwesomeIcon icon="arrow-alt-circle-up" />
                  <h2>Upload Image</h2>
                </div>
              </div>
              <div className="scale-ratio" />
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={this.getFile}
              ref={dialog => (this.imageDialog = dialog)}
            />

            <div className="container">
              <div className="Content">
                {/* <Editor
                  className={this.state.focus ? "focus" : ""}
                  value={this.state.content}
                  onChange={(value: any) => {
                    this.setState(prevState => ({
                      ...prevState,
                      value
                    }));
                  }}
                  options={{
                    autosave: {
                      enabled: true,
                      uniqueId: this.props.newArticle.id
                    },
                    status: false,
                    placeholder: "Body",
                    spellChecker: false
                  }}
                  onClick={() => {
                    this.setState(prevState => ({
                      ...prevState,
                      focus: true
                    }));
                  }}
                  ref={(editor: any) => (this.editor = editor)}
                /> */}
                <Editor
                  className={this.state.focus ? "focus" : ""}
                  value={
                    this.state.content || this.props.newArticle
                      ? this.props.newArticle.content || ""
                      : ""
                  }
                  id={this.props.newArticle.id}
                  placeholder="Body"
                  // options={{
                  //   autosave: {
                  //     enabled: true,
                  //     uniqueId: this.props.newArticle.id
                  //   },
                  //   status: false,
                  //   placeholder: "Body",
                  //   spellChecker: false
                  // }}
                  onClick={() => {
                    this.setState(prevState => ({
                      ...prevState,
                      focus: true
                    }));
                  }}
                  ref={(editor: any) => (this.editor = editor)}
                />
                <ActionButtons
                  primaryText="Publish"
                  primaryAction={this.publish}
                  style={{
                    margin: "1rem 0"
                  }}
                  ref={btns => (this.ActionButtons = btns)}
                />
              </div>
            </div>
          </div>
          <style jsx global>{`
            .alert.alert-danger {
              position: absolute;
              border-radius: 0;
              border: 0;
              background-color: rgb(204, 84, 84);
              color: #fff;
              text-align: center;
              top: -4rem;
              width: 100%;
              opacity: 1;
              cursor: default;
              transition: all 0.3s;
            }

            .alert.alert-danger.fade.show {
              top: 0;
            }

            .alert.alert-danger button.close {
              color: #fff;
              font-weight: 400;
              opacity: 1;
              cursor: pointer;
            }

            .Content {
              padding-bottom: 4.5rem;
            }

            .Content::after {
              content: "";
              clear: both;
              display: block;
            }

            .WriteArticle .Content {
              width: 100%;
              margin: 0 auto;
            }

            .WriteArticle .article-image {
              position: relative;
              /* min-height: 20rem;
              max-height: 20rem; */
              background-size: 100% 100%;
              background-repeat: no-repeat;
              background-position: center center;
              /* background-attachment: fixed;
              background-color: #c3c3c3; */
              z-index: 1;
              width: 100%;
              margin-bottom: 2rem;
              cursor: pointer;
              transition: all 0.3s;
              animation: imageLoad 1s infinite;
            }

            .WriteArticle .article-image .scale-ratio {
              padding-bottom: ${this.state.scaleRatio};
            }

            .WriteArticle .article-image .background {
              position: absolute;
              display: block;
              width: 100%;
              height: 100%;
              transition: all 0.3s;
            }

            .WriteArticle .article-image:hover .background {
              background: rgba(0, 0, 0, 0.5);
            }

            .WriteArticle .article-image .background .upload-text {
              position: absolute;
              top: 50%;
              left: 50%;
              color: #fff;
              text-align: center;
              opacity: 0;
              transform: translate(-50%, -50%);
              transition: all 0.3s;
            }

            .WriteArticle .article-image:hover .background .upload-text {
              opacity: 1;
            }

            .WriteArticle .article-image .background .upload-text svg {
              width: 7rem;
              height: 7rem;
              margin: 0.5rem 0;
            }

            .WriteArticle .title {
              border: 0;
              background: 0;
              font-size: 4rem;
              outline: 0;
              text-align: center;
              width: 100%;
              height: 4.5rem;
              margin-bottom: 0.5rem;
              font-weight: 500;
              line-height: 1.2;
              word-wrap: normal;
              overflow: hidden;
              resize: none;
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Content {
                padding-bottom: 3.5rem;
              }
            }

            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .WriteArticle .Content {
                width: 70%;
              }
              .WriteArticle .article-image {
                /* min-height: 25rem;
                max-height: 25rem; */
                background-attachment: fixed;
              }
              .WriteArticle .article-image .scale-ratio {
                padding-bottom: 33.3%;
              }
            }

            @media (min-width: 1200px),
              @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
              /* .WriteArticle .article-image {
                min-height: 30rem;
                max-height: 30rem;
              } */
            }
          `}</style>
        </App>
      );
    } else {
      return (
        <App {...this.props}>
          <div className="NotAuthorized Content">
            <h2>Not Authorized</h2>
            <p>You must be authorized in order to access this page</p>
          </div>
          <style jsx>{`
            .NotAuthorized {
              text-align: center;
            }

            .NotAuthorized > h2 {
              font-size: 4rem;
              color: #cc0000;
            }

            .NotAuthorized > p {
              font-size: 2rem;
            }
          `}</style>
        </App>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(connect(mapStateToProps, null)(WriteArticle));
