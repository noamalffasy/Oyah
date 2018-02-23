import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import Router from "next/router";

import * as Hashids from "hashids";

import App from "../components/App";
import Input from "../components/Input";

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
    mutation getResetEmail($id: ID) {
      getResetEmail(id: $id) {
        email
      }
    }
  `,
  {
    name: "getResetEmail"
  }
)
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

  componentDidMount() {
    const hashids = new Hashids("oyah.xyz", 8);
    const _id = hashids.decode(this.props.url.query.id);
    const id = _id[0];
    this.props
      .getResetEmail({
        variables: {
          id
        }
      })
      .then((res: any) => {
        this.setState(prevState => ({
          ...prevState,
          email: res.data.getResetEmail.email
        }));
      })
      .catch((err: Error) => {
        console.error(err);
      });
  }

  clickResetPassword(e: any) {
    if (e) {
      e.preventDefault();
    }

    if (
      this.password.input.value !== "" &&
      this.confirmPassword.input.value !== ""
    ) {
      if (this.password.input.value === this.confirmPassword.input.value) {
        this.props
          .resetPassword({
            variables: {
              email: this.state.email,
              password: this.password.input.value
            }
          })
          .then((res: any) => {
            this.login({ ...res.data.resetPassword.user, token: res.data.resetPassword.token });

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
          <div className="action-buttons">
            <button className="primary" onClick={this.clickResetPassword}>
              Reset password
            </button>
          </div>
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

          .Reset .action-buttons {
            display: flex;
            flex-direction: row;
            float: right;
          }

          .Reset .action-buttons button {
            background: none;
            border: 0;
            outline: 0;
            box-shadow: none;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .Reset .action-buttons button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .Reset .action-buttons button.primary {
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

export default withData(connect(mapStateToProps, null)(Reset));
