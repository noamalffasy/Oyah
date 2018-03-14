import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import Router from "next/router";
import Head from "next/head";

import * as Hashids from "hashids";

import App from "../components/App";
import Input from "../components/Input";
import ActionButtons from "../components/ActionButtons";

import withData from "../lib/withData";

import graphql from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  getResetEmail?: any;
  resetPassword?: any;
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
    mutation resetPassword($email: String, $password: String) {
      resetPassword(email: $email, password: $password) {
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
    name: "resetPassword"
  }
)
class Reset extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.clickResetPassword = this.clickResetPassword.bind(this);
  }

  static async getInitialProps(
    { query: { id: __id } }: any,
    apolloClient: any
  ) {
    const hashids = new Hashids("oyah.xyz", 8);
    const _id = hashids.decode(__id);
    const id = _id[0];
    return await apolloClient
      .mutate({
        mutation: gql`
          mutation getResetEmail($id: ID) {
            getResetEmail(id: $id) {
              email
            }
          }
        `,
        variables: {
          id
        }
      })
      .then((res: any) => {
        return {
          email: res.data.getResetEmail.email
        };
      })
      .catch((err: Error) => {
        return {
          error: err
        };
      });
  }

  componentDidMount() {
    if (this.props.error) {
      this.setError(this.props.error);
    }
  }

  clickResetPassword(e: any, triggerLoading: any) {
    if (e) {
      e.preventDefault();
    }

    if (
      this.password.input.value !== "" &&
      this.confirmPassword.input.value !== ""
    ) {
      if (this.password.input.value === this.confirmPassword.input.value) {
        triggerLoading();

        this.props
          .resetPassword({
            variables: {
              email: this.state.email,
              password: this.password.input.value
            }
          })
          .then((res: any) => {
            this.ActionButtons.reset();
            
            this.login({
              ...res.data.resetPassword.user,
              token: res.data.resetPassword.token
            });

            Router.push("/");
          })
          .catch((err: Error) => {
            console.error(err);
          });
      } else {
        this.setError("Passwords don't match");
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
        <div className="Reset">
          <Head>
            <title>Reset password | Oyah</title>
            <meta name="description" content="Reset you password on Oyah" />
          </Head>
          <h2 className="title">Reset password</h2>
          <Input
            label="New password"
            type="password"
            ref={input => (this.password = input)}
          />
          <Input
            label="Confirm password"
            type="password"
            ref={input => (this.confirmPassword = input)}
          />
          <ActionButtons
            primaryText="Reset password"
            primaryAction={this.clickResetPassword}
            ref={btns => this.ActionButtons = btns}
          />
        </div>
        <style jsx>{`
          .Reset {
            width: 50%;
            margin: 0 auto;
            text-align: center;
          }

          .Reset h2 {
            margin: 0 0 2rem 0;
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

export default withData(connect(mapStateToProps, null)(Reset));
