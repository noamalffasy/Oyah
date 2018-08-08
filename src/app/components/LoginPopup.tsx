import * as React from "react";
import { Component } from "react";

// import Router from "next/router";
import Link from "next/link";

import firebase, { app } from "../lib/firebase";

import LoginButton from "./LoginButton";
import { GoogleLogo, TwitterLogo } from "./svgs";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  signInModal: any;
  closeSignInModal: any;
  login: any;
  user: any;
  signinUser?: any;
  createUser?: any;
  forgetPassword?: any;
}

interface State {
  url?: any;
  urlAs?: any;
  open?: any;
  login?: any;
  reset?: any;
  resetStatus?: any;
  error: any;
  multiErrors: Boolean;
  errorHeight: number;
}

@graphql(
  gql`
    mutation signinUser($authInfo: AuthInfo) {
      signinUser(authInfo: $authInfo) {
        user {
          id
          name
          nametag
          email
          image
          small_image
          bio
          name
          mains
          reddit
          twitter
        }
        cookie
      }
    }
  `,
  {
    name: "signinUser"
  }
)
@graphql(
  gql`
    mutation createUser(
      $email: String
      $name: String
      $nametag: String
      $image: String
      $authInfo: AuthInfo
    ) {
      createUser(
        email: $email
        name: $name
        nametag: $nametag
        image: $image
        authInfo: $authInfo
      ) {
        user {
          id
          name
          nametag
          email
          image
          small_image
        }
        cookie
      }
    }
  `,
  {
    name: "createUser"
  }
)
@graphql(
  gql`
    mutation forgetPassword($email: String) {
      forgetPassword(email: $email) {
        status
      }
    }
  `,
  {
    name: "forgetPassword"
  }
)
class LoginPopup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: false,
      login: true,
      reset: false,
      resetStatus: undefined,
      error: false,
      multiErrors: false,
      errorHeight: 0
    };

    // this.login = this.login.bind(this);
    // this.signup = this.signup.bind(this);
    // this.sendMail = this.sendMail.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  error: HTMLDivElement = null;
  popup: HTMLDivElement = null;
  LoginPopup: HTMLDivElement = null;
  signin: Login = null;
  createAccount: CreateAccount = null;


  unregisterAuthObserver = () => {
    const that = this;
    return app.auth().onAuthStateChanged(async _user => {
      if (_user) {
        const user = {
          email: _user.email,
          // Gets everything before an @ symbol
          nametag: /.+?(?=@)+/g.exec(_user.email)[0],
          name: _user.displayName,
          image: _user.photoURL,
          uid: _user.uid
        };

        const idToken = await _user
          .getIdToken()
          .then(idToken => {
            return idToken;
          })
          .catch(err => {
            console.error(err);

            this.setState(prevState => ({
              ...prevState,
              error: "Was unable to verify the user"
            }));
          });

        if (_user.metadata.creationTime === _user.metadata.lastSignInTime) {
          that.props
            .createUser({
              variables: {
                email: user.email,
                nametag: user.nametag,
                name: user.name,
                image: user.image,
                authInfo: {
                  idToken
                }
              }
            })
            .then(async res => {
              const user = {
                ...res.data.createUser.user,
                mains:
                  typeof res.data.createUser.user.mains === "string"
                    ? res.data.createUser.user.mains.split(", ")
                    : typeof res.data.createUser.user.mains === "object"
                      ? res.data.createUser.user.mains
                      : null
              };

              await fetch(
                `${
                  window.location.hostname !== "localhost"
                    ? "https://oyah.xyz"
                    : `http://${window.location.host}`
                }/login`,
                {
                  body: res.data.createUser.cookie,
                  credentials: "include",
                  method: "POST"
                }
              ).catch(err => {
                console.error(err);
              });

              that.props.login({
                ...user,
                idToken
              });
              that.closeDialog();

              return false;
            })
            .catch(err => {
              console.error(err);

              that.setState(prevState => ({
                ...prevState,
                error: err.message
              }));
            });
        } else {
          that.props.login({ startLoading: true });
          that.props
            .signinUser({
              variables: {
                authInfo: {
                  idToken
                }
              }
            })
            .then(async res => {
              const user = {
                ...res.data.signinUser.user,
                mains:
                  typeof res.data.signinUser.user.mains === "string"
                    ? res.data.signinUser.user.mains.split(", ")
                    : typeof res.data.signinUser.user.mains === "object"
                      ? res.data.signinUser.user.mains
                      : null
              };

              await fetch(
                `${
                  window.location.hostname !== "localhost"
                    ? "https://oyah.xyz"
                    : `http://${window.location.host}`
                }/login`,
                {
                  body: res.data.signinUser.cookie,
                  credentials: "include",
                  method: "POST"
                }
              ).catch(err => {
                console.error(err);
              });

              that.props.login({
                ...user,
                idToken
              });
              that.closeDialog();

              return false;
            })
            .catch(err => {
              console.error(err);

              that.setState(prevState => ({
                ...prevState,
                error: err.message
              }));
            });
        }
      }
    });
  };

  componentWillReceiveProps(nextProps: Props) {
    const { signInModal } = nextProps;

    if (signInModal.state !== this.props.signInModal.state) {
      this.setState(prevState => ({
        ...prevState,
        open: signInModal.state === "open" ? true : false,
        login: signInModal.whatToOpen === "login"
      }));
    }
  }

  componentDidUpdate(_, prevState) {
    if (
      (typeof this.state.error !== "boolean" &&
        typeof prevState.error !== "boolean" &&
        this.state.error.split("\n• ").length !==
          prevState.error.split("\n• ").length) ||
      typeof this.state.error !== typeof prevState.error
    ) {
      const defaultMinHeight = 0;
      const errorHeight = this.state.error
        ? this.error.scrollHeight
        : defaultMinHeight;
      this.setState(prevState => ({
        ...prevState,
        errorHeight,
        multiErrors:
          typeof this.state.error !== "boolean"
            ? this.state.error.split("\n• ").length > 1
            : false
      }));
    }
    if (this.state.open === false && this.state.open !== prevState.open) {
      this.closeDialog();
    }
  }

  closeDialog(e: any = undefined) {
    if ((e && !this.popup.contains(e.target)) || e === undefined) {
      this.setState(prevState => ({
        ...prevState,
        error: false
      }));
      this.props.closeSignInModal();
    }
  }

  render() {
    return (
      <div
        className="LoginPopup modal"
        role="dialog"
        style={{
          visibility: this.state.open ? "visible" : "collapse",
          opacity: this.state.open ? 1 : 0
        }}
        onClick={this.closeDialog}
        ref={div => {
          this.LoginPopup = div;
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={
            this.props.signInModal.state === "close"
              ? { marginTop: "-10rem" }
              : {}
          }
          ref={div => {
            this.popup = div;
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState(prevState => ({
                    ...prevState,
                    error: false
                  }));
                  this.props.closeSignInModal();
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className={
                this.state.error
                  ? "alert alert-danger fade show"
                  : "alert alert-danger alert-dismissible fade hide"
              }
              role="alert"
              style={
                !this.state.error
                  ? {
                      maxHeight: 0,
                      padding: 0,
                      margin: 0
                    }
                  : { maxHeight: "9999rem" }
              }
              ref={div => (this.error = div)}
            >
              <strong>
                {this.state.multiErrors
                  ? "Some errors occured: \n• "
                  : "An error occured!"}
              </strong>{" "}
              {this.state.error}
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={e => {
                  e.preventDefault();
                  this.setState(prevState => ({
                    ...prevState,
                    error: false
                  }));
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <Login
              forgotPassword={(e: any) => {
                e.preventDefault();

                this.setState(prevState => ({
                  ...prevState,
                  reset: true
                }));
              }}
              // uiConfig={this.uiConfig}
              unregisterAuthObserver={this.unregisterAuthObserver}
              user={this.props.user}
              style={
                !this.state.login || this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {
                      marginTop: this.state.errorHeight
                    }
              }
              ref={div => (this.signin = div)}
            />
            <CreateAccount
              // uiConfig={this.uiConfig}
              unregisterAuthObserver={this.unregisterAuthObserver}
              user={this.props.user}
              style={
                this.state.login || this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {
                      marginTop: this.state.errorHeight
                    }
              }
              ref={div => (this.createAccount = div)}
            />
            {/* <ForgotPassword
              status={this.state.resetStatus}
              style={
                !this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {
                      marginTop: this.state.errorHeight
                    }
              }
              ref={div => (this.forgotPassword = div)}
            /> */}
            <div className="modal-footer">
              {this.state.login ? (
                <p>
                  Don't have an account?{" "}
                  <a
                    onClick={() =>
                      this.setState(prevState => ({
                        ...prevState,
                        login: false
                      }))
                    }
                  >
                    Create one
                  </a>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <a
                    onClick={() =>
                      this.setState(prevState => ({
                        ...prevState,
                        login: true
                      }))
                    }
                  >
                    Sign in
                  </a>
                </p>
              )}
              <p className="small-notice">
                By {this.state.login ? "signing in" : "signing up"} you agree to
                the following{" "}
                <Link href="/policies/terms">
                  <a>terms</a>
                </Link>{" "}
                and{" "}
                <Link href="/policies/privacy">
                  <a>privacy</a>
                </Link>{" "}
                policies
              </p>
            </div>
          </div>
        </div>
        <style jsx>{`
          .alert.alert-danger {
            position: absolute;
            border-radius: 0;
            border: 0;
            background-color: rgb(204, 84, 84);
            color: #fff;
            text-align: center;
            white-space: pre-line;
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

          .LoginPopup {
            display: block !important;
            opacity: 0;
            background: rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
          }

          .LoginPopup .modal-dialog {
            transition: all 0.3s;
          }

          .LoginPopup .modal-content,
          .LoginPopup .modal-content .modal-header,
          .LoginPopup .modal-content .modal-footer {
            border: 0;
          }

          .LoginPopup .modal-content {
            border-radius: 0;
            box-shadow: 0 0.3125rem 1rem 0 rgba(0, 0, 0, 0.24);
            overflow: hidden;
          }

          .LoginPopup .modal-content .modal-header button.close {
            outline: 0;
          }

          .LoginPopup .modal-content .modal-footer {
            padding: 1rem 2rem 0.5rem;
            flex-flow: column;
            justify-content: center;
            align-items: center;
          }

          .LoginPopup .modal-content .modal-footer p.small-notice {
            width: 50%;
            text-align: center;
            font-size: 0.85rem;
          }
        `}</style>
        <style jsx global>{`
          .LoginPopup .modal-content .modal-body {
            width: 90%;
            margin: 0 auto;
            padding-bottom: 0;
            max-height: 20rem;
            transition: all 0.3s;
          }
          @media (max-width: 576px),
            @media(max-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .LoginPopup .modal-content .modal-footer {
              margin: 0 auto;
            }
          }
        `}</style>
      </div>
    );
  }
}

interface LoginProps {
  forgotPassword: any;
  // uiConfig: any;
  unregisterAuthObserver: any;
  user: any;
  style?: any;
}

interface LoginState {
  loggingWith: object;
}

class Login extends Component<LoginProps, LoginState> {
  state = {
    loggingWith: null
  };

  unregisterAuthObserver = () => {};

  GoogleProvider = new firebase.auth.GoogleAuthProvider();
  TwitterProvider = new firebase.auth.TwitterAuthProvider();

  main: HTMLDivElement = null;

  componentDidMount() {
    this.unregisterAuthObserver = this.props.unregisterAuthObserver();
  }

  componentWillReceiveProps(nextProps: LoginProps) {
    if (
      !nextProps.user.loading &&
      nextProps.user !== this.props.user
    ) {
      this.setState(prevState => ({
        ...prevState,
        loggingWith: null
      }));
    }
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  loginWith(provider) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    this.setState(prevState => ({
      ...prevState,
      loggingWith: provider
    }));

    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div
        className="modal-body"
        style={this.props.style}
        ref={div => (this.main = div)}
      >
        <h2>Welcome back</h2>
        <p>Sign in to get the full experience</p>
        <div
          className="login-buttons"
          style={{ maxWidth: "220px", margin: "0 auto", fontSize: "14px" }}
        >
          <LoginButton
            text="Sign in with Google"
            icon={GoogleLogo}
            loading={
              this.state.loggingWith === this.GoogleProvider
                ? this.props.user.loading
                : false
            }
            onClick={() => this.loginWith(this.GoogleProvider)}
          />
          <LoginButton
            text="Sign in with Twitter"
            icon={TwitterLogo}
            loading={
              this.state.loggingWith === this.TwitterProvider
                ? this.props.user.loading
                : false
            }
            onClick={() => this.loginWith(this.TwitterProvider)}
          />
        </div>
        {/* <Input
          label="Email"
          type="email"
          autocomplete="email"
          ref={input => {
            this.email = input;
          }}
        />
        <Input
          label="Password"
          type="password"
          autocomplete="password"
          style={{ marginBottom: "1rem" }}
          ref={input => {
            this.password = input;
          }}
        />
        <a
          href="#"
          style={{
            display: "inline-block",
            fontSize: ".9rem",
            textAlign: "center",
            // marginBottom: "1rem"
            marginBottom: ".5rem"
          }}
          onClick={this.props.forgotPassword}
        >
          Forgot password?
        </a> */}
        {/* <div className="remember-checkbox" style={{ marginBottom: ".5rem" }}>
          <Input
            id="remember"
            type="checkbox"
            label=""
            ref={checkbox => (this.remember = checkbox)}
          />
          <label
            htmlFor="remmber"
            onClick={e => {
              this.remember.check();
            }}
          >
            Remember me
          </label>
        </div> */}
        <style jsx>{`
          .modal-body {
            text-align: center;
          }

          .modal-body h2 {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }
}

interface CreateAccountProps {
  // uiConfig: any;
  unregisterAuthObserver: any;
  user: any;
  style?: any;
}

interface CreateAccountState {
  signingUpWith: object;
}

class CreateAccount extends Component<CreateAccountProps, CreateAccountState> {
  state = {
    signingUpWith: null
  };

  unregisterAuthObserver = () => {};

  GoogleProvider = new firebase.auth.GoogleAuthProvider();
  TwitterProvider = new firebase.auth.TwitterAuthProvider();

  main: HTMLDivElement = null;

  componentDidMount() {
    this.unregisterAuthObserver = this.props.unregisterAuthObserver();
  }

  componentWillReceiveProps(nextProps: CreateAccountProps) {
    if (
      !nextProps.user.loading &&
      nextProps.user !== this.props.user
    ) {
      this.setState(prevState => ({
        ...prevState,
        signingUpWith: null
      }));
    }
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  loginWith(provider) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    this.setState(prevState => ({
      ...prevState,
      signingUpWith: provider
    }));

    firebase
      .auth()
      .signInWithPopup(provider)
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div
        className="modal-body"
        style={this.props.style}
        ref={div => (this.main = div)}
      >
        <h2>Welcome to Oyah</h2>
        <p>Create an account to get the full experience</p>
        {/* <StyledFirebaseAuth
          uiConfig={this.props.uiConfig}
          firebaseAuth={app.auth()}
        /> */}
        <div
          className="login-buttons"
          style={{ maxWidth: "220px", margin: "0 auto", fontSize: "14px" }}
        >
          <LoginButton
            text="Sign up with Google"
            icon={GoogleLogo}
            loading={
              this.state.signingUpWith === this.TwitterProvider
                ? this.props.user.loading
                : false
            }
            onClick={() => this.loginWith(this.GoogleProvider)}
          />
          <LoginButton
            text="Sign up with Twitter"
            icon={TwitterLogo}
            loading={
              this.state.signingUpWith === this.TwitterProvider
                ? this.props.user.loading
                : false
            }
            onClick={() => this.loginWith(this.TwitterProvider)}
          />
        </div>
        <style jsx>{`
          .modal-body {
            text-align: center;
          }

          .modal-body h2 {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }
}

export default LoginPopup;
