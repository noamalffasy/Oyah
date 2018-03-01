import * as React from "react";
import { Component } from "react";

import { validate } from "email-validator";

import Router from "next/router";
import Link from "next/link";

import Input from "./Input";

// GraphQL
import graphql from "../utils/graphql";
import { compose } from "react-apollo";
import gql from "graphql-tag";

interface Props {
  signInModal: any;
  closeSignInModal: any;
  login: any;
  url: any;
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
  error?: any;
}

@graphql(
  gql`
    mutation signinUser($email: AUTH_PROVIDER_EMAIL) {
      signinUser(email: $email) {
        token
        user {
          id
          name
          nametag
          email
          editor
          small_image
          image
        }
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
      $nametag: String
      $authProvider: AuthProviderSignupData
    ) {
      createUser(nametag: $nametag, authProvider: $authProvider) {
        token
        user {
          id
          name
          nametag
          email
          editor
          small_image
          image
        }
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
      error: false
    };

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.sendMail = this.sendMail.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.signInModal.state !== this.props.signInModal.state) {
      this.setState(prevState => ({
        ...prevState,
        open: nextProps.signInModal.state === "open" ? true : false,
        login: nextProps.signInModal.whatToOpen === "login"
      }));

      if (nextProps.signInModal.state === "open") {
        const url =
          this.props.url.pathname +
          Object.keys(this.props.url.query)
            .map((key: any, i: number) => {
              if (i === 0) {
                return `?${key}=${this.props.url.query[key]}`;
              }
              return `${key}=${this.props.url.query[key]}`;
            })
            .join("&");

        this.setState(prevState => ({
          ...prevState,
          urlAs: this.props.url.asPath,
          url
        }));

        Router.push(
          nextProps.signInModal.whatToOpen === "login"
            ? nextProps.url.pathname + "?login"
            : nextProps.url.pathname + "?signup",
          nextProps.signInModal.whatToOpen === "login" ? "/login" : "/signup"
        );
      }
    }
  }

  login() {
    if (
      this.signin.email.input.value !== "" &&
      this.signin.password.input.value !== ""
    ) {
      if (validate(this.signin.email.input.value)) {
        this.props
          .signinUser({
            variables: {
              email: {
                email: this.signin.email.input.value,
                password: this.signin.password.input.value
              }
            }
          })
          .then((res: any) => {
            if (res.errors) {
              let errors: any[] = [];
              res.errors.forEach((error: Error) => {
                errors.push(error.message);
                console.error(error);
              });
              this.setState(prevState => ({
                ...prevState,
                error: errors.join("\n\u2022 ")
              }));
            } else {
              const data = res.data.signinUser;
              if (this.signin.remember.isChecked()) {
                // TODO: Set cookies
              }

              this.props.login({ ...data.user, token: data.token });

              this.signin.email.reset();
              this.signin.password.reset();
              this.signin.remember.reset();

              Router.push(this.state.url + "?", this.state.urlAs);
              this.props.closeSignInModal();

              this.setState(prevState => ({
                ...prevState,
                error: false
              }));
            }
          })
          .catch((err: any) => {
            this.setState(prevState => ({
              ...prevState,
              error: err.graphQLErrors[0].message
            }));
          });
      } else {
        this.setState(prevState => ({
          ...prevState,
          error: "Email isn't valid"
        }));
      }
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: "You must fill all the fields"
      }));
    }
  }

  signup() {
    if (
      this.createAccount.nametag.input.value !== "" &&
      this.createAccount.email.input.value !== "" &&
      this.createAccount.password.input.value !== ""
    ) {
      if (validate(this.createAccount.email.input.value)) {
        if (
          this.createAccount.password.input.value ===
          this.createAccount.confirmPassword.input.value
        ) {
          if (this.createAccount.age.isChecked()) {
            if (this.createAccount.terms.isChecked()) {
              this.props
                .createUser({
                  variables: {
                    nametag: this.createAccount.nametag.input.value,
                    authProvider: {
                      email: {
                        email: this.createAccount.email.input.value,
                        password: this.createAccount.password.input.value
                      }
                    }
                  }
                })
                .then((res: any) => {
                  if (res.errors) {
                    let errors: any[] = [];
                    res.errors.forEach((error: Error) => {
                      errors.push(error.message);
                      console.error(error);
                    });
                    this.setState(prevState => ({
                      ...prevState,
                      error: errors.join("\n\u2022 ")
                    }));
                  } else {
                    const data = res.data.createUser;
                    // this.props.cookies.set("token", data.token);
                    this.props.login({ ...data.user, token: data.token });

                    this.createAccount.nametag.reset();
                    this.createAccount.email.reset();
                    this.createAccount.password.reset();
                    this.createAccount.confirmPassword.reset();

                    Router.push(this.state.url + "?", this.state.urlAs);
                    this.props.closeSignInModal();

                    this.setState(prevState => ({
                      ...prevState,
                      error: false
                    }));
                  }
                })
                .catch((err: any) => {
                  this.setState(prevState => ({
                    ...prevState,
                    error: err.graphQLErrors[0].message
                  }));
                });
            } else {
              this.setState(prevState => ({
                ...prevState,
                error: "You must agree to the terms"
              }));
            }
          } else {
            this.setState(prevState => ({
              ...prevState,
              error: "You must be 13 or over to create an account"
            }));
          }
        } else {
          this.setState(prevState => ({
            ...prevState,
            error: "Passwords don't match"
          }));
        }
      } else {
        this.setState(prevState => ({
          ...prevState,
          error: "Email isn't valid"
        }));
      }
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: "You must fill all the fields"
      }));
    }
  }

  sendMail(e: any) {
    if (e) {
      e.preventDefault();
    }

    if (this.forgotPassword.email.input.value !== "") {
      if (validate(this.forgotPassword.email.input.value)) {
        this.props
          .forgetPassword({
            variables: { email: this.forgotPassword.email.input.value }
          })
          .then((res: any) => {
            this.setState(prevState => ({
              ...prevState,
              resetStatus: res.data.forgetPassword.status
            }));
          })
          .catch((err: any) => {
            this.setState(prevState => ({
              ...prevState,
              error: err.graphQLErrors[0].message
            }));
          });
      } else {
        this.setState(prevState => ({
          ...prevState,
          error: "Email isn't valid"
        }));
      }
    } else {
      this.setState(prevState => ({
        ...prevState,
        error: "You must fill all the fields"
      }));
    }
  }

  closeDialog(e: any) {
    if (!this.popup.contains(e.target)) {
      Router.push(this.state.url + "?", this.state.urlAs);
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
          onKeyPress={e => {
            if (e.key === "Enter") {
              this.state.login ? this.login() : this.signup();
            }
          }}
          ref={div => {
            this.popup = div;
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {!this.state.reset
                  ? this.state.login ? "Sign in" : "Create an account"
                  : "Forgot password"}
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.closeSignInModal}
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
            >
              <strong>An error occured!</strong> {this.state.error}
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
              style={
                !this.state.login || this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {}
              }
              ref={div => (this.signin = div)}
            />
            <CreateAccount
              style={
                this.state.login || this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {}
              }
              ref={div => (this.createAccount = div)}
            />
            <ForgotPassword
              status={this.state.resetStatus}
              style={
                !this.state.reset
                  ? {
                      opacity: 0,
                      display: "none"
                    }
                  : {}
              }
              ref={div => (this.forgotPassword = div)}
            />
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={
                  !this.state.reset
                    ? this.state.login ? this.login : this.signup
                    : this.sendMail
                }
              >
                {!this.state.reset
                  ? this.state.login ? "Login" : "Create an account"
                  : "Continue"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={e => {
                  e.preventDefault();

                  Router.push(
                    !this.state.reset
                      ? !this.state.login
                        ? this.props.url.pathname + "?login"
                        : this.props.url.pathname + "?signup"
                      : this.state.login
                        ? this.props.url.pathname + "?login"
                        : this.props.url.pathname + "?signup",
                    !this.state.reset
                      ? !this.state.login ? "/login" : "/signup"
                      : this.state.login ? "/login" : "/signup"
                  );

                  this.setState(prevState => ({
                    ...prevState,
                    login: !this.state.reset
                      ? !this.state.login
                      : this.state.login,
                    reset: false,
                    error: false
                  }));
                }}
              >
                {!this.state.reset
                  ? this.state.login
                    ? "Create an account"
                    : "Already have an account?"
                  : "Remember the password?"}
              </button>
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
            background: rgba(0, 0, 0, 0.6);
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

          .LoginPopup .modal-content .modal-header button.close {
            outline: 0;
          }

          .LoginPopup .modal-content .modal-footer {
            padding-top: 0;
            flex-flow: wrap;
            justify-content: center;
            flex-flow: column;
          }

          .LoginPopup .modal-content .modal-footer button {
            border: 0;
            background: none;
            cursor: pointer;
            box-shadow: none;
            outline: 0;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .LoginPopup .modal-content .modal-footer button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .LoginPopup .modal-content .modal-footer button:focus {
            box-shadow: none;
            outline: 0;
            background: none;
          }

          .LoginPopup .modal-content .modal-footer button:active {
            border: 0;
            background: none;
            box-shadow: none;
          }

          .LoginPopup .modal-content .modal-footer button.btn-primary {
            color: #cc0017;
            order: 1;
            font-weight: 600;
          }

          .LoginPopup .modal-content .modal-footer button.btn-secondary {
            color: #7f7f7f;
            font-weight: 400;
          }
          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .LoginPopup .modal-content .modal-footer {
              justify-content: flex-end;
              flex-flow: row;
            }
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

          .LoginPopup .modal-content .modal-body p.Input.half::last-child {
            margin-bottom: 1.5rem;
          }

          .LoginPopup .modal-content .modal-body .age-checkbox,
          .LoginPopup .modal-content .modal-body .terms-checkbox {
            margin-bottom: 1rem;
          }

          .LoginPopup
            .modal-content
            .modal-body
            .remember-checkbox
            p.Input.checkbox,
          .LoginPopup .modal-content .modal-body .remember-checkbox label,
          .LoginPopup .modal-content .modal-body .age-checkbox p.Input.checkbox,
          .LoginPopup .modal-content .modal-body .age-checkbox label,
          .LoginPopup
            .modal-content
            .modal-body
            .terms-checkbox
            p.Input.checkbox,
          .LoginPopup .modal-content .modal-body .terms-checkbox label {
            vertical-align: middle;
          }

          .LoginPopup
            .modal-content
            .modal-body
            .remember-checkbox
            p.Input.checkbox,
          .LoginPopup .modal-content .modal-body .age-checkbox p.Input.checkbox,
          .LoginPopup
            .modal-content
            .modal-body
            .terms-checkbox
            p.Input.checkbox {
            margin: 0 0.5rem 0 0;
          }

          .LoginPopup .modal-content .modal-body .remember-checkbox label,
          .LoginPopup .modal-content .modal-body .age-checkbox label,
          .LoginPopup .modal-content .modal-body .terms-checkbox label {
            margin: 0;
          }

          .LoginPopup .modal-content .modal-body label[for="remember"],
          .LoginPopup .modal-content .modal-body label[for="age"],
          .LoginPopup .modal-content .modal-body label[for="terms"] {
            color: #161616;
          }

          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .LoginPopup .modal-content .modal-body p.Input.half {
              margin-bottom: 1.5rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

interface LoginProps {
  forgotPassword: any;
  style?: any;
}

class Login extends Component<LoginProps> {
  render() {
    return (
      <div className="modal-body" style={this.props.style}>
        <Input
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
            marginBottom: "1rem"
          }}
          onClick={this.props.forgotPassword}
        >
          Forgot password?
        </a>
        <div className="remember-checkbox" style={{ marginBottom: ".5rem" }}>
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
        </div>
      </div>
    );
  }
}

interface CreateAccountProps {
  style?: any;
}

class CreateAccount extends Component<CreateAccountProps> {
  render() {
    return (
      <div className="modal-body" style={this.props.style}>
        <Input
          label="Nametag"
          type="text"
          autocomplete="off"
          ref={input => {
            this.nametag = input;
          }}
        />
        <Input
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
          half={true}
          autocomplete="password"
          ref={input => {
            this.password = input;
          }}
        />
        <Input
          label="Confirm Password"
          type="password"
          half={true}
          autocomplete="password"
          ref={input => {
            this.confirmPassword = input;
          }}
        />
        <div className="age-checkbox" style={{ marginBottom: "1rem" }}>
          <Input
            id="age"
            type="checkbox"
            label=""
            ref={checkbox => (this.age = checkbox)}
          />
          <label
            htmlFor="terms"
            onClick={e => {
              this.age.check();
            }}
          >
            I confirm that I'm 13 or over
          </label>
        </div>
        <div className="terms-checkbox" style={{ marginBottom: ".5rem" }}>
          <Input
            id="terms"
            type="checkbox"
            label=""
            ref={checkbox => (this.terms = checkbox)}
          />
          <label
            htmlFor="terms"
            onClick={e => {
              this.terms.check();
            }}
          >
            I agree to the{" "}
            <Link href="/policy?name=terms" as="/policies/terms">
              <a>terms of use</a>
            </Link>
          </label>
        </div>
      </div>
    );
  }
}

interface ForgotPasswordProps {
  status: any;
  style?: any;
}

class ForgotPassword extends Component<ForgotPasswordProps> {
  render() {
    if (this.props.status === undefined) {
      return (
        <div className="modal-body" style={this.props.style}>
          <Input
            label="Your account's email"
            type="email"
            autocomplete="email"
            ref={input => {
              this.email = input;
            }}
          />
        </div>
      );
    } else if (this.props.status === true) {
      return (
        <div className="modal-body" style={this.props.style}>
          <h5>The mail has been sent</h5>
          <p>Open the mail we have sent you and follow the instructions</p>
        </div>
      );
    } else {
      return (
        <div className="modal-body" style={this.props.style}>
          <h5>An error occured</h5>
          <p>Please try again later</p>
        </div>
      );
    }
  }
}

export default LoginPopup;
