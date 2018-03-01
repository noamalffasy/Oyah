import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import Head from "next/head";

import App from "../components/App";

import withData from "../lib/withData";

interface Props {
  statusCode: number;
  signInModal?: any;
  user?: any;
  error?: any;
}

class Error extends Component<Props, any> {
  static getInitialProps({ res, err }: any) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    return (
      <App {...this.props}>
        <Head>
          <title>Not Found | Oyah</title>
        </Head>
        {this.props.statusCode === 404 && (
          <div className="NotFound Content">
            <h2>Page not found</h2>
            <p>The page you were looking for doesn't exist</p>
          </div>
        )}
        {this.props.statusCode !== 404 && (
          <div className="NotFound Content">
            <h2>An error {this.props.statusCode} occured on server</h2>
            <p>Please try again later</p>
          </div>
        )}
        <style jsx>{`
          .NotFound {
            text-align: center;
          }

          .NotFound > h2 {
            font-size: 4rem;
            color: #cc0000;
          }

          .NotFound > p {
            font-size: 2rem;
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

export default withData(connect(mapStateToProps, null)(Error));
