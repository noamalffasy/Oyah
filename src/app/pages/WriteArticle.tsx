import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as errorActionCreators from "../actions/error";

import Textarea from "react-textarea-autosize";
import * as MarkdownIt from "markdown-it";
import Editor from "../components/Editor";
import ActionButtons from "../components/ActionButtons";
import Modal from "../components/Modal";
import SwitchToggle from "../components/SwitchToggle";
// import * as Editor from "react-simplemde-editor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as uuid from "uuid/v4";

// import "react-simplemde-editor/dist/simplemde.min.css";
// import { prototype } from "react-markdown";

import Head from "next/head";
import Router, { withRouter, SingletonRouter } from "next/router";

import App from "../components/App";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";
import { ArticleModel } from "../lib/db/models";

interface Props {
  uploadFile?: any;
  createArticle?: any;
  updateArticle?: any;
  newArticle: any;
  notAuthorized?: any;
  router: SingletonRouter;
  user: any;
  signInModal: any;
  error: any;
  dispatch: any;
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
  prePublishModalOpen: boolean;
  isTimeBased: boolean;
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
      $authorID: String!
      $theme: String
      $isTimeBased: Boolean!
    ) {
      createArticle(
        id: $id
        title: $title
        content: $content
        authorID: $authorID
        theme: $theme
        isTimeBased: $isTimeBased
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
    mutation updateArticle(
      $id: String!
      $title: String!
      $path: String
      $content: String!
      $theme: String
      $isTimeBased: Boolean!
    ) {
      updateArticle(id: $id, title: $title, path: $path, content: $content, theme: $theme, isTimeBased: $isTimeBased) {
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
@withRouter
class WriteArticle extends Component<Props, State> {
  state = {
    id: null,
    notAuthorized: false,
    output: "",
    focus: false,
    title: "",
    image: null,
    scaleRatio: "33.3%",
    content: undefined,
    edit: false,
    isTimeBased: false,
    prePublishModalOpen: false,
    theme: null
  };

  setImageScaleRatio = this._setImageScaleRatio.bind(this);

  md = new MarkdownIt();

  articleImage: HTMLDivElement = null;
  editor: Editor;
  imageDialog: HTMLInputElement;
  title: HTMLTextAreaElement;
  ActionButtons: ActionButtons;

  static async getInitialProps(
    { query: { id: _id, theme } }: any,
    _,
    user: any
  ) {
    const id = _id
      ? _id.indexOf("_small.jpeg") > -1
        ? _id.replace("_small.jpeg", "")
        : _id
      : null;
    if (!id) {
      return {
        newArticle: { id, theme }
      };
    }

    if (user !== undefined) {
      return await ArticleModel.get({ id })
        .then(article => {
          if (article.id) {
            if (user.id === article.author.id && article.content) {
              return {
                newArticle: {
                  id,
                  theme,
                  edit: true,
                  title: article.title,
                  image: article.path,
                  content: article.content
                },
                user
              };
            } else if (article.content !== null) {
              return {
                newArticle: {
                  id,
                  theme,
                  authorID: article.author.id
                },
                notAuthorized: true,
                user
              };
            } else {
              return {
                newArticle: {
                  id,
                  theme,
                  edit: true
                },
                user
              };
            }
          } else {
            return {
              newArticle: {
                id,
                theme
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
                id,
                theme
              },
              user
            };
          }
          return {
            error: err
          };
        });
    } else {
      return {
        newArticle: {
          id,
          theme
        },
        notAuthorized: true
      };
    }
  }

  componentDidMount() {
    const id = Router.query.id;

    if (!id) {
      const id = uuid();

      this.props.router.push(
        { pathname: "/WriteArticle", query: { ...Router.query, id } },
        { pathname: `/articles/new/${id}/`, query: Router.query }
      );
    }

    if (
      this.props.newArticle !== undefined &&
      this.props.newArticle.title !== undefined
    ) {
      this.setState(
        prevState => ({
          ...prevState,
          id,
          theme: Router.query.theme,
          title: this.props.newArticle.title
            ? this.props.newArticle.title
            : null,
          image: this.props.newArticle.image,
          content: this.props.newArticle.content,
          edit: this.props.newArticle.edit ? true : false
        }),
        () => {
          this.setImageScaleRatio();
        }
      );

      if (localStorage.getItem("article_" + id) !== null) {
        const saved = JSON.parse(localStorage.getItem("article_" + id));
        this.setState(
          (prevState: any) => ({
            ...prevState,
            title: saved.title
              ? saved.title
              : this.state.title
                ? this.state.title
                : this.props.newArticle.title,
            image: saved.image,
            content: saved.content,
            theme: saved.theme ? saved.theme : null
          }),
          () => {
            this.setImageScaleRatio();
          }
        );
      }

      setInterval(() => {
        if (
          Object.keys(this.props.user).length !== 0 &&
          Router.pathname === "/WriteArticle"
        ) {
          let seen: any = [];

          localStorage.setItem(
            "article_" + id,
            JSON.stringify(
              {
                title: this.state.title,
                image: this.state.image ? this.state.image : null,
                content: this.editor.text() || this.editor.props.value || "",
                theme: this.state.theme ? this.state.theme : null
              },
              (_, val) => {
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

  async componentWillReceiveProps(nextProps) {
    if (
      nextProps.user.id !== this.props.user.id &&
      nextProps.user !== this.props.user
    ) {
      if (nextProps.user && !nextProps.user.loading) {
        const { id, theme } = Router.query;
        const user = nextProps.user;

        await ArticleModel.get({ id }).then(article => {
          if (article.id) {
            if (user.id === article.author.id && article.content) {
              this.setState(
                prevState => ({
                  ...prevState,
                  id,
                  theme,
                  title: article.title,
                  image: article.path,
                  content: article.content,
                  edit: true,
                  notAuthorized: false
                }),
                () => {
                  this.setImageScaleRatio();
                }
              );
            } else if (article.content !== null) {
              this.setState(
                prevState => ({
                  ...prevState,
                  id,
                  theme,
                  authorID: article.author.id,
                  title: this.state.title ? this.state.title : null,
                  image: this.state.image,
                  content: this.state.content,
                  edit: this.state.edit ? true : false,
                  notAuthorized: true
                }),
                () => {
                  this.setImageScaleRatio();
                }
              );
            } else {
              this.setState(
                prevState => ({
                  ...prevState,
                  id,
                  theme,
                  title: this.state.title ? this.state.title : null,
                  image: this.state.image,
                  content: this.state.content,
                  edit: this.state.edit ? true : false,
                  notAuthorized: false
                }),
                () => {
                  this.setImageScaleRatio();
                }
              );
            }
          }
        });

        if (localStorage.getItem("article_" + id) !== null) {
          const saved = JSON.parse(localStorage.getItem("article_" + id));
          this.setState(
            (prevState: any) => ({
              ...prevState,
              title: saved.title
                ? saved.title
                : this.state.title
                  ? this.state.title
                  : this.props.newArticle.title,
              image: saved.image,
              content: saved.content,
              theme: saved.theme ? saved.theme : null
            }),
            () => {
              this.setImageScaleRatio();
            }
          );
        }

        setInterval(() => {
          if (
            Object.keys(this.props.user).length !== 0 &&
            Router.pathname === "/WriteArticle"
          ) {
            let seen: any = [];

            localStorage.setItem(
              "article_" + id,
              JSON.stringify(
                {
                  title: this.state.title,
                  image: this.state.image ? this.state.image : null,
                  content: this.editor.text() || this.editor.props.value || "",
                  theme: this.state.theme ? this.state.theme : null
                },
                (_, val) => {
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
      } else if (!this.state.notAuthorized) {
        this.setState(prevState => ({
          ...prevState,
          notAuthorized: true
        }));
      }
    }
  }

  getDimensionsOfImage = imageURL => {
    return new Promise<{ width: number; height: number }>((resolve, _) => {
      const image = new Image();
      image.onload = () => {
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };
      image.src = imageURL;
    });
  };

  async _setImageScaleRatio() {
    const imgURL = this.state.image || this.props.newArticle.image;
    const { width, height } = await this.getDimensionsOfImage(imgURL);
    const scaleRatio = `${(100 * height) / width}%`;

    this.setState(prevState => ({
      ...prevState,
      scaleRatio
    }));
  }

  renderToPreview = () => {
    const output = this.md.render(this.editor.text());

    this.setState((prevState: any) => ({
      ...prevState,
      output
    }));
  };

  uploadImage = () => {
    const imageDialog = this.imageDialog;
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
  };

  getFile = () => {
    const imageDialog = this.imageDialog;
    const fr = new FileReader();
    fr.onload = () => {
      this.setState((prevState: any) => ({
        ...prevState,
        image: fr.result
      }));
    };
    fr.readAsDataURL(imageDialog.files[0]);
  };

  publish = (_, triggerLoading: any) => {
    const title = this.title.value || this.state.title || "";
    const image = this.state.image
      ? this.imageDialog.files.length > 0
        ? this.imageDialog.files[0]
        : this.state.image
      : null;
    const content = this.editor.text() || this.editor.props.value || "";

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
                    path: res.data.uploadFile.path,
                    content,
                    authorID: this.props.user.id,
                    theme: this.state.theme,
                    isTimeBased: this.state.isTimeBased
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
                    Router.push("/articles/" + res.data.createArticle.id);
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
                    path: res.data.uploadFile.path,
                    content,
                    theme: this.state.theme,
                    isTimeBased: this.state.isTimeBased
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
            // file: image,
            where: "article",
            articleID: this.props.newArticle.id,
            main: true,
            image: this.state.image
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
                    path: res.data.uploadFile.path,
                    content,
                    authorID: this.props.user.id,
                    theme: this.state.theme,
                    isTimeBased: this.state.isTimeBased
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
                    Router.push("/articles/" + res.data.createArticle.id);
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
                    path: res.data.uploadFile.path,
                    content,
                    theme: this.state.theme,
                    isTimeBased: this.state.isTimeBased
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
              authorID: this.props.user.id,
              theme: this.state.theme,
              isTimeBased: this.state.isTimeBased
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
              Router.push("/articles/" + res.data.createArticle.id);
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
              content,
              theme: this.state.theme,
              isTimeBased: this.state.isTimeBased
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
  };

  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    if (!this.state.notAuthorized) {
      return (
        <App {...this.props}>
          <div className="WriteArticle">
            <Head>
              <title>Write a new article | Oyah</title>
              <meta name="description" content="Write a new article in Oyah" />

              <link rel="stylesheet" href="/_next/static/style.css" />
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
                  inputRef={input => {
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
              ref={div => (this.articleImage = div)}
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
                      ? this.state.content ||
                        this.props.newArticle.content ||
                        ""
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
                  ref={editor => (this.editor = editor)}
                />
                <ActionButtons
                  primaryText="Publish"
                  primaryAction={() =>
                    this.setState(prevState => ({
                      ...prevState,
                      prePublishModalOpen: true
                    }))
                  }
                  style={{
                    margin: "1rem 0"
                  }}
                  ref={btns => (this.ActionButtons = btns)}
                />
              </div>
            </div>
            <Modal
              title="Is your article time based?"
              primaryText="Publish"
              primaryAction={this.publish}
              secondaryText="Cancel"
              isOpen={this.state.prePublishModalOpen}
              onToggle={isOpen => {
                this.setState(prevState => ({
                  ...prevState,
                  prePublishModalOpen: isOpen
                }));
              }}
            >
              <p>
                If your article won't be relevant in some time then it is time
                based.
                {`
                `}If it is time based, enable the switch below:
              </p>
              <SwitchToggle
                toggled={isTimeBased => {
                  this.setState(prevState => ({ ...prevState, isTimeBased }));
                }}
              />
            </Modal>
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
              /* background-attachment: fixed; */
              background-color: #c3c3c3;
              z-index: 1;
              width: 100%;
              margin-bottom: 2rem;
              cursor: pointer;
              transition: all 0.3s;
              /* animation: imageLoad 1s infinite; */
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
            <Head>
              <title>Not authorized | Oyah</title>
              <meta name="description" content="Not authorized" />
              {/* <base href="http://localhost:8081/" /> */}
            </Head>
            <h2>Not Authorized</h2>
            <p>You must login in order to access this page</p>
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

export default withData(
  connect(
    mapStateToProps,
    null
  )(WriteArticle)
);
