import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

// <Head> component for setting the page title/meta tags
import Head from "next/head";

import App from "../components/App";

import Highlights from "../components/Highlights";
import Other from "../components/Other";
import Quote from "../components/Quote";

import withData from "../lib/withData";

interface Props {
  url?: any;
  user?: any;
  signInModal?: any;
}

class Index extends Component<Props> {
  render() {
    return (
      <App {...this.props}>
        <div className="Home Content">
          <Head>
            <title>Home | Oyah</title>
            <meta name="description" content="Homepage of Oyah" />
            {/* <base href="http://localhost:8081/" /> */}
          </Head>
          <Highlights url={this.props.url} />
          <Other />
          <Quote />
        </div>
        <style jsx global>{`
          .Content {
            padding-bottom: 4.5rem;
          }

          .Content::after {
            content: "";
            clear: both;
            display: block;
          }
          
          .Home {
            /* width: 85%; */
            margin: 0 auto 0;
          }

          .Home .Highlights {
            display: flex;
            margin: 0 0 0.5rem;
            flex: 2 1;
            max-height: 40rem;
            flex-direction: column;
          }

          .Home .Highlights > .Article {
            flex: 2.1 1;
            width: 100%;
            max-height: 15rem;
            min-height: 15rem;
            margin: 0;
            margin-bottom: 1rem;
          }

          .Home .Highlights .other {
            flex: 1 1;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: flex-start;

            flex-direction: row;
            margin-top: 0.5rem;
          }

          /* .Home .Highlights .other .Article:first-child {
            margin: 0 0.5rem 0.5rem 0;
          } */

          .Home .Highlights .other .Article {
            margin: 0 0.5rem 0 0;
            flex: 1 1;
            width: 100%;
            min-height: 7rem;
          }

          .Home .Highlights .other .Article:last-child {
            box-sizing: border-box;
            /* height: calc(50% - 0.5rem); */
            margin: 0;
          }

          .Home .Other {
            margin: 0 0 4rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .Home .Other .Article {
            /* margin: 0.5rem; */
            margin: 0 0.5rem 0.5rem 0;
            /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
            width: calc(1/2*100% - 1/2*0.5rem);
            height: 7rem;
          }

          .Home .Other .Article:nth-child(2),
          .Home .Other .Article:nth-child(4) {
            margin: 0 0 0.5rem;
          }

          .Home .Article {
            /* flex: 1 1; */
            margin: 0 0.5rem;
          }

          .Home .blockquote {
            font-size: 2.25rem;
            position: relative;
            max-width: 20rem;
            border: 0;
            margin: 0 auto;
            margin-bottom: 3rem;
          }

          .Home .blockquote::before,
          .Home .blockquote::after {
            display: none;
            font-family: Times;
            font-size: 8rem;
            position: absolute;
            color: #c0c0c0;
          }

          .Home .blockquote::before {
            content: open-quote;
            left: -5rem;
            top: -3.5rem;
          }

          .Home .blockquote::after {
            content: close-quote;
            right: -5rem;
            bottom: -4.5rem;
          }

          @media (min-width: 480px) {
            .Home .Highlights {
              margin: 0 0 1rem;
            }
            .Home .Highlights.two {
              flex-direction: row;
            }
            .Home .Highlights.two > .Article {
              margin: 0 0.5rem 1rem;
            }
            .Home .Highlights .other .Article {
              margin: 0 1rem 0 0;
            }
            .Home .Other .Article {
              height: 10rem;
            }
            .Home .blockquote::before,
            .Home .blockquote::after {
              display: block;
            }
          }

          @media (min-width: 576px) {
            .Home {
              width: 85%;
            }
            .Home .Highlights {
              flex-direction: row;
              margin: 0 0 1rem;
            }
            .Home .Highlights > .Article {
              margin: 0;
            }
            .Home .Highlights.two > .Article,
            .Home .Highlights > .Article:nth-child(2) {
              margin: 0 0 0 1rem;
            }
            .Home .Highlights .other {
              margin: 0 0 0 1rem;
              flex-direction: column;
            }
            .Home .Highlights .other .Article:first-child {
              margin: 0 0 1rem 0;
            }
            .Home .Other {
              margin: 1rem 0 4rem;
            }
            .Home .Other .Article {
              height: 7rem;
              width: calc(1/3*100% - 0.7rem);
              margin: 0 1rem 0.5rem 0;
            }
            .Home .Other .Article:nth-child(2) {
              margin: 0 1rem 0.5rem 0;
            }
            .Home .Other .Article:nth-child(3) {
              margin: 0 0 0.5rem;
            }
          }

          @media (min-width: 768px) {
            .Home .Highlights {
              margin: 0 0 1rem;
            }
            .Home .Highlights > .Article {
              max-height: 20rem;
              height: 20rem;
            }
            .Home .Other {
              margin: 1.2rem 0 4rem 0;
            }
            .Home .Other .Article {
              height: 10rem;
            }
          }

          @media (min-width: 992px) {
            .Home .Highlights:not(.two) > .Article {
              max-height: 30rem;
              height: 30rem;
            }
            .Home .Highlights > .Article .text h2 {
              font-size: 3rem;
            }
            .Home .Highlights .other {
              margin: 0 0 0 1.2rem;
            }
            .Home .Other {
              margin: 1.4rem 0 4rem 0;
            }
            .Home .Other .Article {
              height: 15rem;
            }
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

export default withData(connect(mapStateToProps, null)(Index));
