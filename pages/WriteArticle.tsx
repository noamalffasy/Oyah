import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as errorActionCreators from "../actions/error";

import Textarea from "react-textarea-autosize";
import * as MarkdownIt from "markdown-it";
import * as Editor from "react-simplemde-editor";

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
  getArticle?: any;
  uploadFile?: any;
  createArticle?: any;
  updateArticle?: any;
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
  content: any;
  edit: any;
  value?: any;
}

@graphql(
  gql`
    mutation getArticle($id: String!) {
      getArticle(id: $id) {
        id
        title
        content
        authorID
      }
    }
  `,
  {
    name: "getArticle"
  }
)
@graphql(
  gql`
    mutation uploadFile(
      $file: Upload
      $where: String!
      $articleID: String
      $image: String
    ) {
      uploadFile(
        file: $file
        where: $where
        articleID: $articleID
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
      content: undefined,
      edit: false
    };

    this.renderToPreview = this.renderToPreview.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.getFile = this.getFile.bind(this);
    this.publish = this.publish.bind(this);
  }

  componentDidMount() {
    if (this.props.url.query.id === null) {
      const id = uuid();

      Router.push("/articles/new/" + id);

      this.setState((prevState: any) => ({
        ...prevState,
        id
      }));

      setInterval(() => {
        if (Object.keys(this.props.user).length !== 0) {
          let seen: any = [];

          localStorage.setItem(
            "article_" + id,
            JSON.stringify(
              {
                title: this.title.value,
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
    } else {
      const id = this.props.url.query.id;

      this.setState(prevState => ({
        ...prevState,
        id
      }));

      if (localStorage.getItem("article_" + id) !== null) {
        const saved = JSON.parse(localStorage.getItem("article_" + id));
        this.setState((prevState: any) => ({
          ...prevState,
          title: saved.title ? saved.title : this.state.title,
          image: saved.image
        }));
      }

      this.props
        .getArticle({
          variables: {
            id
          }
        })
        .then((res: any) => {
          if (res.errors) {
            res.errors.forEach((error: any) => {
              console.error(error);
            });
          } else if (res.data.getArticle.id !== null) {
            if (
              this.props.user.id === res.data.getArticle.authorID &&
              res.data.getArticle.content !== null
            ) {
              this.setState(prevState => ({
                ...prevState,
                edit: true,
                title: res.data.getArticle.title,
                image: "/img/articles/" + id + ".jpeg",
                content: res.data.getArticle.content
              }));
            } else if (res.data.getArticle.content !== null) {
              this.setState(prevState => ({
                ...prevState,
                notAuthorized: true,
                authorID: res.data.getArticle.authorID
              }));
            } else {
              this.setState(prevState => ({
                ...prevState,
                edit: true
              }));
            }
          }
        })
        .catch((err: any) => {
          console.error(err);
        });

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
  }

  componentWillReceiveProps(nextProps: any) {
    const id = this.props.url.query.id;

    if (nextProps.user !== this.props.user) {
      if (this.state.authorID) {
        this.setState((prevState: any) => ({
          ...prevState,
          notAuthorized: nextProps.user.id !== this.state.authorID
        }));
      }
      if (localStorage.getItem("article_" + id) !== null) {
        const saved = JSON.parse(localStorage.getItem("article_" + id));
        this.setState((prevState: any) => ({
          ...prevState,
          title: saved.title ? saved.title : this.state.title,
          image: saved.image
        }));

        if (this.title !== undefined) {
          findDOMNode(this.title).value = saved.title;
        }
      }
    }
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

  publish() {
    const title = this.title.value || this.state.title;
    const image = this.state.image
      ? this.imageDialog.files.length > 0
        ? this.imageDialog.files[0]
        : this.state.image.startsWith("/img/articles/")
          ? null
          : this.state.image
      : null;
    const content = this.state.value || this.editor.props.value;
    let imagePath = null;

    if (title !== ("" || undefined)) {
      if (!this.state.edit && image === null) {
        this.setError("Image mustn't be empty");
      } else {
        if (content !== ("" || undefined)) {
          if (
            typeof image === "string" &&
            !image.startsWith("//") &&
            !image.startsWith("https://") &&
            !image.startsWith("http://")
          ) {
            this.props
              .uploadFile({
                variables: {
                  where: "article",
                  articleID: this.state.id,
                  image
                }
              })
              .then((res: any) => {
                if (res.error) {
                  console.error(res.error.message);
                } else {
                  if (!this.state.edit) {
                    this.props
                      .createArticle({
                        variables: {
                          id: this.state.id,
                          title,
                          content,
                          authorID: this.props.user.id
                        }
                      })
                      .then((res: any) => {
                        if (res.errors) {
                          res.errors.forEach((error: any) => {
                            console.error(error.message);
                          });
                        } else {
                          Router.push("/articles/" + this.state.id);
                        }
                      })
                      .catch((err: any) => {
                        console.error(err);
                      });
                  } else {
                    this.props
                      .updateArticle({
                        variables: {
                          id: this.state.id,
                          title,
                          content
                        }
                      })
                      .then((res: any) => {
                        if (res.errors) {
                          res.errors.forEach((error: any) => {
                            console.error(error.message);
                          });
                        } else {
                          Router.push("/articles/" + res.data.updateArticle.id);
                        }
                      })
                      .catch((err: any) => {
                        console.error(err);
                      });
                  }
                }
              })
              .catch((err: any) => {
                console.error(err);
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
                  articleID: this.state.id
                }
              })
              .then((res: any) => {
                if (res.error) {
                  console.error(res.error.message);
                } else {
                  if (!this.state.edit) {
                    this.props
                      .createArticle({
                        variables: {
                          id: this.state.id,
                          title,
                          content,
                          authorID: this.props.user.id
                        }
                      })
                      .then((res: any) => {
                        if (res.errors) {
                          res.errors.forEach((error: any) => {
                            console.error(error.message);
                          });
                        } else {
                          Router.push("/articles/" + this.state.id);
                        }
                      })
                      .catch((err: any) => {
                        console.error(err);
                      });
                  } else {
                    this.props
                      .updateArticle({
                        variables: {
                          id: this.state.id,
                          title,
                          content
                        }
                      })
                      .then((res: any) => {
                        if (res.errors) {
                          res.errors.forEach((error: any) => {
                            console.error(error.message);
                          });
                        } else {
                          Router.push("/articles/" + res.data.updateArticle.id);
                        }
                      })
                      .catch((err: any) => {
                        console.error(err);
                      });
                  }
                }
              })
              .catch((err: any) => {
                console.error(err);
              });
          } else {
            if (!this.state.edit) {
              this.props
                .createArticle({
                  variables: {
                    id: this.state.id,
                    title,
                    content,
                    authorID: this.props.user.id
                  }
                })
                .then((res: any) => {
                  if (res.errors) {
                    res.errors.forEach((error: any) => {
                      console.error(error.message);
                    });
                  } else {
                    Router.push("/articles/" + this.state.id);
                  }
                })
                .catch((err: any) => {
                  console.error(err);
                });
            } else {
              this.props
                .updateArticle({
                  variables: {
                    id: this.state.id,
                    title,
                    content
                  }
                })
                .then((res: any) => {
                  if (res.errors) {
                    res.errors.forEach((error: any) => {
                      console.error(error.message);
                    });
                  } else {
                    Router.push("/articles/" + this.state.id);
                  }
                })
                .catch((err: any) => {
                  console.error(err);
                });
            }
          }
        } else {
          this.setError("Content mustn't be empty");
        }
      }
    } else {
      this.setError("Title mustn't be empty");
    }
  }

  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    if (
      Object.keys(this.props.user).length !== 0 &&
      !this.state.notAuthorized
    ) {
      return (
        <App {...this.props}>
          <div className="WriteArticle">
            <Head>
              <title>Write a new article | Oyah</title>
              <meta name="description" content="Write a new article in Oyah" />
              <link rel="stylesheet" href="/css/simplemde.min.css" />
              {/* <base href="http://localhost:8081/" /> */}
            </Head>
            <div className="container">
              <div className="Content">
                <Textarea
                  useCacheForDOMMeasurements
                  className="title"
                  placeholder="Title"
                  value={this.state.title}
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
                this.state.image
                  ? {
                      backgroundImage: `url("${this.state.image}")`
                    }
                  : {}
              }
              onClick={this.uploadImage}
            >
              <div className="background">
                <div className="upload-text">
                  <FontAwesomeIcon icon="arrow-alt-circle-up" />
                  <h2>Upload Image</h2>
                </div>
              </div>
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
                <Editor
                  className={this.state.focus ? "focus" : ""}
                  value={this.state.content}
                  onChange={(value: any) => {
                    this.setState(prevState => ({
                      ...prevState,
                      value
                    }));
                  }}
                  options={{
                    autosave: { enabled: true, uniqueId: this.state.id },
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
                />
                <div className="action-buttons">
                  <button className="primary" onClick={this.publish}>
                    Publish
                  </button>
                </div>
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
              min-height: 20rem;
              max-height: 20rem;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
              background-attachment: fixed;
              background-color: #c3c3c3;
              z-index: 1;
              width: 100%;
              margin-bottom: 2rem;
              transition: all 0.3s;
            }

            .WriteArticle .article-image {
              background-color: #c3c3c3;
              cursor: pointer;
              transition: all 0.3s;
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

            .WriteArticle #simplepostmd-editor-1-wrapper.focus .editor-toolbar {
              height: 46px;
            }

            .WriteArticle .editor-toolbar {
              border: 0;
              opacity: 1;
              height: 0;
              transition: all 0.3s;
              overflow: hidden;
            }

            .WriteArticle .editor-toolbar a {
              color: #cc0000 !important;
              background: none;
              border: 0;
              border-radius: 0;
              opacity: 0.6;
            }

            .WriteArticle .editor-toolbar a:hover {
              opacity: 1;
            }

            .WriteArticle .CodeMirror {
              font-family: Georgia, Cambria, "Times New Roman", Times, serif;
              font-size: 1.25rem;
              min-height: auto;
              border: 0;
              border-bottom: 1px solid #ddd;
              border-radius: 0;
            }

            .WriteArticle .CodeMirror .CodeMirror-code .cm-header-1 {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
                "Segoe UI Emoji", "Segoe UI Symbol";
            }

            .WriteArticle .CodeMirror-vscrollbar {
              overflow: hidden;
            }

            .WriteArticle .CodeMirror-scroll {
              min-height: auto;
              overflow: unset !important;
            }

            .WriteArticle .action-buttons {
              display: flex;
              flex-direction: row;
              float: right;
            }

            .WriteArticle .action-buttons button {
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

            .WriteArticle .action-buttons button:hover {
              /* text-decoration: underline; */
              opacity: 1;
            }

            .WriteArticle .action-buttons button.primary {
              margin: 1rem 0 1rem 1rem;
              cursor: pointer;
              color: #cc0000;
            }

            .WriteArticle .action-buttons button.secondary {
              margin: 1rem;
              cursor: pointer;
              color: #7f7f7f;
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
                min-height: 25rem;
                max-height: 25rem;
              }
            }

            @media (min-width: 1200px),
              @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
              .WriteArticle .article-image {
                min-height: 30rem;
                max-height: 30rem;
              }
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
