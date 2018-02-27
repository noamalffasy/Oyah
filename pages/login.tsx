import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Router from "next/router";
import Head from "next/head";

import { validate } from "email-validator";

import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import App from "../components/App";
import Input from "../components/Input";

import withData from "../lib/withData";

import graphql from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  signinUser?: any;
  signInModal?: any;
  user?: any;
  error?: any;
  url?: any;
  dispatch?: any;
}

interface State {
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
class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.signin = this.signin.bind(this);
  }

  signin() {
    if (this.email.input.value !== "" && this.password.input.value !== "") {
      if (validate(this.email.input.value)) {
        this.props
          .signinUser({
            variables: {
              email: {
                email: this.email.input.value,
                password: this.password.input.value
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
              if (this.remember.isChecked()) {
                // TODO: Set cookies
              }

              this.login({ ...data.user, token: data.token });

              this.email.reset();
              this.password.reset();
              this.remember.reset();

              Router.push("/");
            }
          });
      } else {
        this.setError("Email isn't valid");
      }
    } else {
      this.setError("You must fill all the fields");
    }
  }

  login = bindActionCreators(userActionCreators.login, this.props.dispatch);
  setError = bindActionCreators(
    errorActionCreators.setError,
    this.props.dispatch
  );

  render() {
    return (
      <App {...this.props}>
        <div className="Login">
          <Head>
            <title>Sign in | Oyah</title>
            <meta name="description" content="Login to your account in Oyah" />
          </Head>
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
            ref={input => {
              this.password = input;
            }}
          />
          <div className="remember-checkbox">
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
          </div>
          <div className="action-buttons">
            <button className="primary" onClick={this.signin}>
              Login
            </button>
          </div>
        </div>
        <style jsx>{`
          .Login {
            width: 50%;
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
            margin: 0 0 1rem 1rem;
            cursor: pointer;
            color: #cc0000;
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
