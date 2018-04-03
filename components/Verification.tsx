import * as React from "react";
import { Component } from "react";

interface Props {
  isArticle: boolean;
  style?: object;
}

class Verification extends Component<Props> {
  render() {
    return (
      <span
        className="verification-symbol"
        title={
          this.props.isArticle
            ? "An official article by the Oyah team"
            : "An official Oyah staff member"
        }
        style={this.props.style ? this.props.style : {}}
      >
        ツ
        <style jsx>{`
          .verification-symbol {
            -webkit-text-fill-color: transparent;
            background: -webkit-linear-gradient(#000, #f00);
            background-clip: text;
            font-weight: 500;
            border-radius: 50%;
            margin: auto 0 0.2rem;
            user-select: none;
          }
        `}</style>
      </span>
    );
  }
}

export default Verification;
