import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Router from "next/router";
import Head from "next/head";

import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import App from "../components/App";
import Input from "../components/Input";
import ActionButtons from "../components/ActionButtons";

import withData from "../lib/withData";

import graphql from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  signinUser?: any;
  forgetPassword?: any;
  signInModal?: any;
  user?: any;
  error?: any;
  url?: any;
  dispatch?: any;
}

interface State {
  reset: boolean;
  resetStatus: boolean | undefined;
  email?: any;
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
class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.signin = this.signin.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }

  state = { reset: false, resetStatus: undefined };

  componentWillReceiveProps(nextProps: Props) {
    if (Object.keys(nextProps.user).length > 0) {
      Router.push("/");
    }
  }

  signin(e: any, triggerLoading: any) {
    triggerLoading();

    this.props
      .signinUser({
        variables: {
          email: {
            email: this.email.input.value,
            password: this.password.input.value
          }
          // isRememberChecked: this.remember.isChecked()
        }
      })
      .then((res: any) => {
        if (res.errors) {
          let errors: any[] = [];
          res.errors.forEach((error: Error) => {
            errors.push(error.message);
          });
          this.setError(errors.join("\n\u2022 "));
        } else {
          const data = res.data.signinUser;

          this.login({ ...data.user, token: data.token });

          this.email.reset();
          this.password.reset();
          // this.remember.reset();

          Router.push("/");
        }
      })
      .catch((err: any) => {
        this.ActionButtons.reset();

        this.setError(err.graphQLErrors[0].message);
      });
  }

  login = bindActionCreators(userActionCreators.login, this.props.dispatch);
  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  sendMail(e: any, triggerLoading: any) {
    if (e) {
      e.preventDefault();
    }

    triggerLoading();

    this.props
      .forgetPassword({
        variables: { email: this.forgotPasswordEmail.input.value }
      })
      .then((res: any) => {
        this.ActionButtons.reset();

        this.setState(prevState => ({
          ...prevState,
          resetStatus: res.data.forgetPassword.status
        }));
      })
      .catch((err: any) => {
        this.ActionButtons.reset();

        this.setError(err.graphQLErrors[0].message);
      });
  }

  render() {
    return (
      <App {...this.props}>
        <div className="Login Content clearfix">
          <Head>
            <title>Sign in | Oyah</title>
            <meta name="description" content="Login to your account in Oyah" />
          </Head>
          <div style={this.state.reset ? { opacity: 0, display: "none" } : {}}>
            <h2 className="title">Sign in</h2>
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
                width: "100%",
                textAlign: "left",
                marginBottom: ".5rem"
              }}
              onClick={e => {
                e.preventDefault();

                this.setState(prevState => ({
                  ...prevState,
                  reset: true
                }));
              }}
            >
              Forgot password?
            </a>
            {/* <div className="remember-checkbox">
              <Input
                id="remember"
                type="checkbox"
                label=""
                ref={checkbox => (this.remember = checkbox)}
              />
              <label
                htmlFor="remember"
                onClick={e => {
                  this.remember.check();
                }}
              >
                Remember me
              </label>
            </div> */}
          </div>
          <div style={!this.state.reset ? { opacity: 0, display: "none" } : {}}>
            <h2 className="title">Reset</h2>
            {this.state.resetStatus === undefined && (
              <div className="modal-body">
                <Input
                  label="Your account's email"
                  type="email"
                  autocomplete="email"
                  style={{ marginBottom: "1rem" }}
                  ref={input => {
                    this.forgotPasswordEmail = input;
                  }}
                />
              </div>
            )}
            {this.state.resetStatus === true && (
              <div className="reset">
                <h5>The mail has been sent</h5>
                <p>
                  Open the mail we have sent you and follow the instructions
                </p>
              </div>
            )}
            {this.state.resetStatus === false && (
              <div className="reset">
                <h5>An error occured</h5>
                <p>Please try again later</p>
              </div>
            )}
          </div>
          {this.state.resetStatus === undefined && (
            <ActionButtons
              primaryText={!this.state.reset ? "Login" : "Continue"}
              primaryAction={!this.state.reset ? this.signin : this.sendMail}
              secondaryText="Remember the password?"
              secondaryAction={() =>
                this.setState(prevState => ({ ...prevState, reset: false }))
              }
              secondaryShow={this.state.reset}
              ref={btns => (this.ActionButtons = btns)}
            />
            // <div className="action-buttons">
            //   <button
            //     className="primary"
            //     onClick={!this.state.reset ? this.signin : this.sendMail}
            //   >
            //     {!this.state.reset ? "Login" : "Continue"}
            //   </button>
            //   {this.state.reset && (
            //     <button
            //       className="secondary"
            //       onClick={() =>
            //         this.setState(prevState => ({ ...prevState, reset: false }))
            //       }
            //     >
            //       Remember the password?
            //     </button>
            //   )}
            // </div>
          )}
        </div>
        <style jsx>{`
          .Content {
            padding-bottom: 4.5rem;
          }

          .Login {
            margin: 0 auto;
            text-align: center;
          }

          .Login h2 {
            margin: 0 0 2rem 0;
          }

          .Login .remember-checkbox {
            text-align: left;
          }

          .Login .action-buttons {
            display: flex;
            flex-direction: row;
            float: right;
          }

          .Login .action-buttons button {
            background: none;
            border: 0;
            outline: 0;
            box-shadow: none;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .Login .action-buttons button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .Login .action-buttons button.primary {
            color: #cc0017;
            order: 1;
            font-weight: 600;
          }

          .Login .action-buttons button.secondary {
            color: #7f7f7f;
            font-weight: 400;
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Login {
              width: 80%;
            }
          }
          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Login {
              width: 70%;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Login {
              width: 50%;
            }
          }
        `}</style>
        <style jsx global>{`
          .Login .remember-checkbox p.Input.checkbox,
          .Login .remember-checkbox label {
            vertical-align: middle;
          }

          .Login .remember-checkbox p.Input.checkbox {
            margin: 0 0.5rem 0 0;
          }

          .Login .remember-checkbox label {
            margin: 0;
          }

          .Login label[for="remember"] {
            color: #161616;
          }
        `}</style>
      </App>
    );
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(connect(mapStateToProps, null)(Login));
