import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import Head from "next/head";
import Router from "next/router";

import App from "../components/App";

import Input from "../components/Input";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  error: any;
  setError: any;
}

class ErrorAlert extends Component<Props, any> {
  componentDidMount() {
    Router.onRouteChangeStart = (url: any) => {
      this.props.setError(false);
    };
  }

  render() {
    return (
      <div
        className={
          typeof this.props.error === "string"
            ? "alert alert-danger fade show"
            : "alert alert-danger alert-dismissible fade hide"
        }
        role="alert"
        style={
          typeof this.props.error !== "string"
            ? {
                maxHeight: 0,
                padding: 0,
                margin: 0
              }
            : { maxHeight: "5rem" }
        }
      >
        <strong>An error occured!</strong>
        {typeof this.props.error === "string" ? " " + this.props.error : null}
        <button
          type="button"
          className="close"
          aria-label="Close"
          onClick={e => {
            e.preventDefault();
            this.props.setError(false);
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <style jsx>{`
          .alert.alert-danger {
            position: fixed;
            border-radius: 0;
            border: 0;
            background-color: rgb(204, 84, 84);
            color: #fff;
            text-align: center;
            top: -4rem;
            left: 0;
            right: 0;
            width: 100%;
            opacity: 1;
            z-index: 99999999;
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

          .Contact .alert {
            border: 0;
            padding: 0;
            background: none;
            color: #ec0000;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
    );
  }
}

export default ErrorAlert;
