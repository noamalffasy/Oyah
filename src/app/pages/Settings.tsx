import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import App from "../components/App";

import Image from "../components/Image";
import Input from "../components/Input";
import ActionButtons from "../components/ActionButtons";

import Head from "next/head";
import Router from "next/router";

import { withApollo } from "react-apollo";
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  client: any;
  profile: any;
  error: any;
  _error: any;
  user: any;
  login?: any;
  updateUser?: any;
  updateUserPassword?: any;
  uploadFile?: any;
  signInModal: any;
  dispatch: any;
}

interface State {
  articles: any[];
  userImg?: any;
}

@graphql(
  gql`
    mutation updateUser(
      $nametag: String
      $bio: String
      $name: String
      $image: String
      $mains: [String]
      $reddit: String
      $twitter: String
      $email: String
      $authInfo: AuthInfo
    ) {
      updateUser(
        nametag: $nametag
        bio: $bio
        name: $name
        image: $image
        mains: $mains
        reddit: $reddit
        twitter: $twitter
        email: $email
        authInfo: $authInfo
      ) {
        user {
          id
          nametag
          email
          bio
          name
          mains
          reddit
          twitter
        }
        token
      }
    }
  `,
  {
    name: "updateUser"
  }
)
@graphql(
  gql`
    mutation uploadFile($file: Upload, $where: String!) {
      uploadFile(file: $file, where: $where) {
        path
      }
    }
  `,
  {
    name: "uploadFile"
  }
)
class Settings extends Component<Props, State> {
  state = { articles: [], userImg: null };

  update = this._update.bind(this);

  imageDialog: HTMLInputElement = null;
  image: Image = null;
  nametag: Input = null;
  biography: Input = null;
  fullName: Input = null;
  mains: Input = null;
  twitter: Input = null;
  reddit: Input = null;
  email: Input = null;
  ActionButtons: ActionButtons = null;

  static async getInitialProps(_, __, user: any) {
    if (user === undefined || user.id === null || user.id === undefined) {
      return {
        _error: "Not logged in"
      };
    }
  }

  componentDidMount() {
    const { _error } = this.props;
    if (_error) {
      if (_error === "Not logged in") {
        this.setState((prevState: any) => ({
          ...prevState,
          loggedIn: false
        }));
      } else {
        // console.error(error);
        this.setError(_error);
      }
    }
  }

  login = bindActionCreators(userActionCreators.login, this.props.dispatch);
  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  openImageDialog = () => {
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
        userImg: fr.result
      }));
    };
    fr.readAsDataURL(imageDialog.files[0]);
  };

  async _update(_, triggerLoading: any) {
    const image = this.image.src.startsWith("data:image")
      ? this.imageDialog.files[0]
      : null;
    const nametag = (this.nametag.input as HTMLInputElement).value;
    const bio = (this.biography.input as HTMLTextAreaElement).value;
    const name = (this.fullName.input as HTMLInputElement).value;
    const mains = this.mains.state.selections;
    const reddit = (this.reddit.input as HTMLInputElement).value;
    const twitter = (this.twitter.input as HTMLInputElement).value;
    const email = (this.email.input as HTMLInputElement).value;

    if (image !== null) {
      triggerLoading();

      await this.props
        .uploadFile({
          variables: {
            file: image,
            where: "user"
          }
        })
        .then(async (res: any) => {
          if (res.error) {
            // console.error(res.error);
            this.setError(res.error);
          } else {
            const data = res.data.uploadFile;

            this.login({ ...this.props.user, image: data.path });

            await this.props
              .updateUser({
                variables: {
                  nametag,
                  email,
                  bio,
                  name,
                  image: data.path,
                  mains,
                  reddit,
                  twitter,
                  authInfo: {
                    idToken: this.props.user.idToken
                  }
                }
              })
              .then((res: any) => {
                this.ActionButtons.reset();

                if (res.error) {
                  // console.error(res.error);
                  this.setError(res.error);
                } else {
                  const data = res.data.updateUser;

                  this.props.client.cache.reset().then(() => {
                    this.login({
                      ...data.user,
                      mains:
                        data.user.mains !== null
                          ? data.user.mains.split(", ")
                          : null
                    });

                    Router.push(
                      `/Profile?nametag=${nametag}`,
                      `/users/${nametag}`
                    );
                  });
                }
              });
          }
        });
    } else {
      triggerLoading();

      await this.props
        .updateUser({
          variables: {
            nametag,
            email,
            bio,
            name,
            mains,
            reddit,
            twitter,
            authInfo: {
              idToken: this.props.user.idToken
            }
          }
        })
        .then((res: any) => {
          this.ActionButtons.reset();

          if (res.error) {
            // console.error(res.error);
            this.setError(res.error);
          } else {
            const data = res.data.updateUser;

            this.props.client.cache.reset().then(() => {
              this.login({
                ...data.user,
                mains:
                  data.user.mains !== null ? data.user.mains.split(", ") : null
              });

              Router.push(`/Profile?nametag=${nametag}`, `/users/${nametag}`);
            });
          }
        });
    }
  }

  render() {
    if (Object.keys(this.props.user).length !== 0 && !this.props.user.loading) {
      return (
        <App {...this.props}>
          <div className="Settings Content">
            <Head>
              <title>{this.props.user.nametag + " | Oyah"}</title>
              <meta
                name="description"
                content={this.props.user.nametag + " profile"}
              />
            </Head>
            <div className="user">
              <div className="info">
                <div className="image" onClick={this.openImageDialog}>
                  {/* <img
                  src={
                    this.props.user.image ||
                    this.state.userImg ||
                    "https://storage.googleapis.com/oyah.xyz/assets/img/User.png"
                  }
                  ref={img => (this.image = img)}
                /> */}
                  <Image
                    src={
                      this.state.userImg
                        ? this.state.userImg
                        : this.props.user.image !== null
                          ? this.props.user.image.startsWith("http")
                            ? this.props.user.image
                            : "/img/users/" +
                              encodeURIComponent(this.props.user.image)
                          : "https://storage.googleapis.com/oyah.xyz/assets/img/User.png"
                    }
                    alt={this.props.user.nametag}
                    ref={img => (this.image = img)}
                  />
                  <div className="overlay" />
                  <h2>Change Image</h2>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={this.getFile}
                    ref={dialog => (this.imageDialog = dialog)}
                  />
                </div>
                <Input
                  className="nametag"
                  label="Your nametag"
                  type="text"
                  value={this.props.user.nametag}
                  ref={input => {
                    this.nametag = input;
                  }}
                />
              </div>
              <Input
                className="bio"
                label="Biography"
                type="textarea"
                spellCheck={false}
                value={this.props.user.bio || ""}
                ref={input => {
                  this.biography = input;
                }}
              />
            </div>
            <table className="other-info">
              <tbody>
                <tr>
                  <td>Full Name</td>
                  <td>
                    <Input
                      className="full-name"
                      label="Your real name (Optional)"
                      type="text"
                      value={this.props.user.name || ""}
                      ref={input => {
                        this.fullName = input;
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Mains</td>
                  <td>
                    <Input
                      className="mains"
                      label="Your main characters"
                      type="select-dropdown"
                      selections={this.props.user.mains || []}
                      maxSelections={10000}
                      list={[
                        "Bowser",
                        "Captain Falcon",
                        "Donkey Kong",
                        "Dr. Mario",
                        "Falco",
                        "Fox",
                        "Ganondorf",
                        "Ice Climbers",
                        "Jigglypuff",
                        "Kirby",
                        "Link",
                        "Luigi",
                        "Mario",
                        "Marth",
                        "Mewtwo",
                        "Mr. Game & Watch",
                        "Ness",
                        "Peach",
                        "Pichu",
                        "Pikachu",
                        "Roy",
                        "Samus",
                        "Young Link",
                        "Yoshi",
                        "Zelda"
                      ]}
                      ref={input => {
                        this.mains = input;
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Reddit</td>
                  <td>
                    <b>u/</b>
                    <Input
                      className="reddit withStart"
                      label="Your Reddit username"
                      type="text"
                      value={this.props.user.reddit || ""}
                      ref={input => {
                        this.reddit = input;
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Twitter</td>
                  <td>
                    <b>@</b>
                    <Input
                      className="twitter withStart"
                      label="Your Twitter username"
                      type="text"
                      value={this.props.user.twitter || ""}
                      ref={input => {
                        this.twitter = input;
                      }}
                    />
                  </td>
                </tr>
                {/* <tr>
                  <td style={{ padding: "0 0 2rem" }} />
                </tr> */}
                <tr>
                  <td>Email</td>
                  <td>
                    <Input
                      className="email"
                      label="Your email"
                      type="text"
                      value={this.props.user.email}
                      ref={input => {
                        this.email = input;
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <ActionButtons
              primaryText="Update"
              primaryAction={this.update}
              ref={btns => (this.ActionButtons = btns)}
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

            .Settings {
              width: 100%;
              margin: 0 auto;
            }

            .Settings .user {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-flow: column;
            }

            .Settings .user .info {
              display: flex;
              flex-flow: column;
              align-items: center;
              justify-content: center;
              /* width: 30%; */
              width: 70%;
            }

            .Settings .user .info .image {
              position: relative;
              border-radius: 50%;
              overflow: hidden;
              cursor: pointer;
            }

            .Settings .user .info .image .overlay,
            .Settings .user .info .image h2 {
              transition: all 0.2s;
              opacity: 0;
            }

            .Settings .user .info .image:hover .overlay,
            .Settings .user .info .image:hover h2 {
              opacity: 1;
            }

            .Settings .user .info .image .overlay {
              position: absolute;
              width: 100%;
              height: 100%;
              background: -webkit-linear-gradient(
                rgba(0, 0, 0, 0.3) 0,
                rgba(0, 0, 0, 0.6) 100%
              );
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
            }

            .Settings .user .info .image h2 {
              position: absolute;
              bottom: 0;
              text-align: center;
              font-size: 8vmin;
              color: #fff;
            }

            .Settings .other-info,
            .Settings .login-info {
              text-align: center;
              margin: 0 auto;
              padding: 0 0 1rem;
            }

            .Settings .other-info td,
            .Settings .login-info td {
              padding: 0.2rem 0.5rem;
              cursor: default;
            }

            .Settings .other-info td:nth-child(odd),
            .Settings .login-info td:nth-child(odd) {
              color: #969696;
            }

            .Settings .other-info td:nth-child(odd) {
              display: none;
            }

            .Profile .other-info td:nth-child(even) {
              font-weight: 400;
            }

            .Settings .other-info td,
            .Settings .login-info td {
              display: table-cell;
              vertical-align: middle;
              padding: 0.2rem 0.5rem 2rem;
            }

            .Settings .other-info td:nth-child(even) b,
            .Settings .login-info td:nth-child(even) b {
              margin: 0 0 0.05rem;
              float: left;
            }

            .Settings .action-buttons {
              display: flex;
              flex-direction: row;
              float: right;
            }

            .Settings .action-buttons button {
              background: none;
              border: 0;
              outline: 0;
              box-shadow: none;
              opacity: 0.8;
              transition: all 0.15s;
            }

            .Settings .action-buttons button:hover {
              /* text-decoration: underline; */
              opacity: 1;
            }

            .Settings .action-buttons button.primary {
              margin: 1rem 0 1rem 1rem;
              cursor: pointer;
              color: #cc0000;
            }

            .Settings .action-buttons button.secondary {
              margin: 1rem;
              cursor: pointer;
              color: #7f7f7f;
            }
            @media (min-width: 480px),
              @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .info {
                width: 50%;
              }
              .Settings .other-info td:nth-child(odd) {
                display: table-cell;
              }
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .info .image h2 {
                font-size: 6vmin;
              }
              .Content {
                padding-bottom: 3.5rem;
              }
            }
            @media (min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings {
                width: 70%;
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user {
                flex-flow: row;
              }
              .Settings .user .info {
                width: 30%;
              }
            }
            @media (min-width: 1200px),
              @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .info .image h2 {
                font-size: 3vmin;
              }
            }
          `}</style>
          <style jsx global>{`
            .Settings .user .info .image .image {
              display: block;
              margin: 0 auto;
              width: 10rem;
              height: 10rem;
              border-radius: 50%;
            }
            .Settings .user .info .nametag,
            .Settings .user .info p {
              text-align: center;
              cursor: default;
            }

            .Settings .user .info .nametag {
              margin: 2rem 0;
              font-size: 2rem;
            }

            .Settings .user .info .nametag label {
              font-size: 1.5rem;
              top: 0.5rem;
            }

            .Settings .user .info .nametag span::after {
              margin-top: -0.25rem;
            }

            .Settings .other-info td .Input,
            .Settings .login-info td .Input {
              margin: 0;
              float: right;
            }

            .Settings .other-info td .Input.withStart,
            .Settings .login-info td .Input.withStart {
              width: calc(100% - 1.2rem);
            }
            @media (min-width: 480px),
              @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .bio {
                max-width: 70%;
              }
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .bio {
                max-width: 60%;
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Settings .user .bio {
                max-width: 40%;
              }
            }
          `}</style>
        </App>
      );
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

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(
  connect(
    mapStateToProps,
    null
  )(withApollo(Settings))
);
