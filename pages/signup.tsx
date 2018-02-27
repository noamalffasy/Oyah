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
  createUser?: any;
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
class Signup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.signup = this.signup.bind(this);
  }

  signup() {
    if (
      this.nametag.input.value !== "" &&
      this.email.input.value !== "" &&
      this.password.input.value !== ""
    ) {
      if (validate(this.email.input.value)) {
        if (this.password.input.value === this.confirmPassword.input.value) {
          this.props
            .createUser({
              variables: {
                nametag: this.nametag.input.value,
                authProvider: {
                  email: {
                    email: this.email.input.value,
                    password: this.password.input.value
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
                this.login({ ...data.user, token: data.token });

                this.nametag.reset();
                this.email.reset();
                this.password.reset();
                this.confirmPassword.reset();

                Router.push("/");
              }
            })
            .catch((err: Error) => {
              console.error(err);
            });
        } else {
          this.setError("Passwords don't match");
        }
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
        <div className="Signup">
          <Head>
            <title>Sign in | Oyah</title>
            <meta name="description" content="Create account on Oyah" />
          </Head>
          <h2 className="title">Create an account</h2>
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
          <div className="action-buttons">
            <button className="primary" onClick={this.signup}>
              Create an account
            </button>
          </div>
        </div>
        <style jsx>{`
          .Signup {
            width: 50%;
            margin: 0 auto;
            text-align: center;
          }

          .Signup h2 {
            margin: 0 0 2rem 0;
          }

          .Signup .action-buttons {
            display: flex;
            flex-direction: row;
            float: right;
          }

          .Signup .action-buttons button {
            background: none;
            border: 0;
            outline: 0;
            box-shadow: none;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .Signup .action-buttons button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .Signup .action-buttons button.primary {
            margin: 0 0 1rem 1rem;
            cursor: pointer;
            color: #cc0000;
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

export default withData(connect(mapStateToProps, null)(Signup));