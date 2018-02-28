import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import * as Markdown from "react-markdown";

import App from "../components/App";

import withData from "../lib/withData";

interface Props {
  policy?: any;
  signInModal?: any;
  user?: any;
  error?: any;
}

class Policy extends Component<Props, any> {
  static async getInitialProps({ query: { name } }: any) {
    const policy = await require(`../static/policies/${name}.md`);

    return {
      policy
    };
  }

  render() {
    return (
      <App {...this.props}>
        <div className="Policy Content">
          <Markdown source={this.props.policy} />
        </div>
        <style jsx>{`
          .Content {
            padding-bottom: 4.5rem;
          }

          .Policy {
            margin: 0 auto;
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Policy {
              width: 80%;
            }
          }
          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Policy {
              width: 70%;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Policy {
              width: 50%;
            }
          }
        `}</style>
        <style jsx global>{`
          .Policy h1, 
          .Policy h2 {
            font-weight: 600;
          }

          .Policy p {
            font-family: Georgia,Cambria,"Times New Roman",Times,serif;
            font-size: 1.25rem;
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

export default withData(connect(mapStateToProps, null)(Policy));
