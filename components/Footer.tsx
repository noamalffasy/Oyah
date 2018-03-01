import * as React from "react";
import { Component } from "react";

import Link from "next/link";

class Footer extends Component {
  render() {
    return (
      <div className="Footer">
        <p className="small">
          <Link href="/policy?name=privacy" as="/policies/privacy">
            <a>Privacy</a>
          </Link>
          <Link href="/">
            <a style={{ opacity: 1 }}>
              <span className="logo">
                O<span className="logo secondLetter">Y</span>
              </span>
            </a>
          </Link>
          <Link href="/policy?name=terms" as="/policies/terms">
            <a>Terms</a>
          </Link>
        </p>
        <style jsx>{`
          .Footer {
            position: absolute;
            width: 100%;
            bottom: 0;
            left: 0;
            padding: 0 1rem 1rem;
          }

          /* .Footer::before {
            content: "";
            display: block;
            background: rgba(0, 0, 0, 0.2);
            width: 10%;
            height: 1px;
            margin: 0 auto 1rem;
          } */

          .Footer p {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            /* white-space: pre; */
            font-size: 0.8rem;
            margin: 0;
          }

          .Footer p > * {
            margin: 0 1rem;
          }

          .Footer p .logo {
            font-family: "Times New Roman", Times, serif;
            font-weight: bold;
            font-size: 2rem;
            text-transform: uppercase;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            background: -webkit-linear-gradient(#000, #f00);
            background-clip: border-box;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .Footer p .logo.secondLetter {
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }
}

export default Footer;
