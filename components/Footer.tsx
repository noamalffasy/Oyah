import * as React from "react";
import { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <p className="small">
          Oyah is not a registered company yet.<br />
          All articles and content in Oyah's website is owned by{" "}
          <a href="https://perolize.com">Perolize</a>
        </p>
        <style jsx>{`
          .Footer {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            padding: 0 1rem;
          }

          .Footer p {
            text-align: center;
            /* white-space: pre; */
            font-size: 0.8rem;
          }
        `}</style>
      </div>
    );
  }
}

export default Footer;
