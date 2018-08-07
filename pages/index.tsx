import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

// <Head> component for setting the page title/meta tags
import Head from "next/head";
import Link from "next/link";

import * as moment from "moment";

import App from "../components/App";

import Highlights from "../components/Highlights";
import Other from "../components/Other";
import Quote from "../components/Quote";

import withData from "../lib/withData";

import { HomeModel, QuoteModel, ThemeModel } from "../lib/db/models";

interface Props {
  quote: any;
  articles: any;
  theme: any;
  user: any;
  signInModal: any;
  error: any;
  dispatch: any;
}

class Index extends Component<Props> {
  static async getInitialProps(_, __, user: any) {
    return await HomeModel.get({ id: moment().format("MM-DD-YYYY") })
      .then(async articles => {
        return await QuoteModel.getRandom()
          .then(async quote => {
            return await ThemeModel.get({
              id: moment()
                .startOf("week")
                .format("MM-DD-YYYY")
            })
              .then(theme => {
                return {
                  articles,
                  quote,
                  theme,
                  user
                };
              })
              .catch((err: Error) => ({ _error: err, user }));
          })
          .catch((err: Error) => ({ _error: err, user }));
      })
      .catch((err: Error) => ({ _error: err, user }));
  }

  render() {
    const {
      quote: { quote, author },
      articles,
      theme
    } = this.props;

    return (
      <App {...this.props}>
        <div className="Home Content">
          <Head>
            <title>Home | Oyah</title>
            <meta name="keywords" content="Home,Oyah,Melee,News,Gaming" />
            <meta name="description" content="Homepage of Oyah" />
          </Head>
          <Theme theme={theme} />
          {articles.length > 0 && (
            <React.Fragment>
              <Highlights articles={articles} />
              <Other articles={articles} />
            </React.Fragment>
          )}
          <Quote author={author} quote={quote} />
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
            /* max-height: 40rem; */
            flex-direction: column;
          }

          .Home .Highlights > .Article {
            flex: 2.1 1;
            width: 100%;
            /* max-height: 15rem; */
            min-height: 15rem;
            margin: 0;
            margin-bottom: 1rem;
          }

          /* .Home .Highlights > .Article .image {
            min-height: 15rem;
          } */

          .Home .Highlights .other {
            flex: 1 1;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            align-content: flex-start;

            /* flex-direction: row; */
            margin-top: 0.5rem;
          }

          /* .Home .Highlights .other .Article:first-child {
            margin: 0 0.5rem 0.5rem 0;
          } */

          .Home .Highlights .other .Article {
            margin: 0 0.5rem 1.5rem 0;
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
            margin: 2rem 0 4rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .Home .Other .Article {
            /* margin: 0.5rem; */
            margin: 0 0 1.5rem;
            /* width: calc(1/3*100% - (1 - 1/3)*1.5rem);
            /* width: calc(1 / 2 * 100% - 1 / 2 * 0.5rem); 
            height: 7rem; */
            width: 100%;
          }

          .Home .Article {
            /* flex: 1 1; */
            margin: 0 0.5rem;
          }

          @media (min-width: 480px),
            @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
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
              margin: 0 1rem 1.5rem 0;
            }
            /* .Home .Other .Article {
              height: 10rem;
            } */
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Home {
              width: 85%;
            }
            .Home .Highlights {
              /* flex-direction: row; */
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
              /* margin: 0 0 0 1rem;
              flex-direction: column; */
              margin: 1.5rem 0 0;
            }
            .Home .Highlights .other .Article:first-child {
              margin: 0 0 1.5rem 0;
            }
            .Home .Other {
              margin: 1rem 0 4rem;
            }
            /* .Home .Other .Article {
               height: 7rem;
              width: calc(1 / 3 * 100% - 0.7rem);
              margin: 0 1rem 0.5rem 0; 
            } 
            .Home .Other .Article:nth-child(2) {
              margin: 0 1rem 0.5rem 0;
            }
            .Home .Other .Article:nth-child(3) {
              margin: 0 0 0.5rem;
            } */
          }

          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Home .Highlights {
              margin: 0 0 1rem;
            }
            /* .Home .Highlights > .Article {
              max-height: 20rem;
              height: 20rem; 
            } */
            .Home .Highlights .other {
              flex-direction: row;
            }
            .Home .Highlights .Article:first-child {
              margin: 0 1rem 0 0;
            }
            .Home .Highlights .other .Article:first-child {
              margin: 0 1rem 0 0;
            }
            .Home .Other {
              margin: 1.2rem 0 4rem 0;
            }
            .Home .Other .Article {
              /* height: 10rem; */
              margin: 0 1rem 1rem 0;
              width: calc(1 / 2 * 100% - (1 / 2 * 1rem));
            }
            .Home .Other .Article:nth-child(2n) {
              margin: 0 0 1rem;
            }
          }

          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            /*. Home .Highlights:not(.two) > .Article {
              max-height: 30rem;
              height: 30rem; 
            } */
            .Home .Highlights {
              flex-direction: row;
            }
            .Home .Highlights > .Article .text h2 {
              font-size: 3rem;
            }
            .Home .Highlights .other {
              flex-direction: column;
              margin: 0;
            }
            .Home .Highlights .other .Article:first-child {
              margin: 0 0 0.5rem 0;
            }
            .Home .Other {
              margin: 1.4rem 0 4rem 0;
            }
            .Home .Other .Article {
              /* height: 15rem; */
              width: calc(1 / 3 * 100% - (1 / 3 * 2rem));
              margin: 0 1rem 1rem 0;
            }
            .Home .Other .Article:nth-child(2n) {
              margin: 0 1rem 1rem 0;
            }
            .Home .Other .Article:nth-child(3n) {
              margin: 0 0 1rem;
            }
          }
        `}</style>
      </App>
    );
  }
}

interface ThemeProps {
  theme: any;
}

class Theme extends Component<ThemeProps> {
  render() {
    const { theme } = this.props;
    return (
      <div className="Theme">
        <span>This week's theme</span>
        <div className="bottom">
          <h2>{theme.title}</h2>
          <Link href={`/theme?tag=${theme.tag}`} as={`/theme/${theme.tag}`}>
            <a>Read articles</a>
          </Link>
          <Link
            href={`/WriteArticle?theme=${theme.tag}`}
            as={`/articles/new/?theme=${theme.tag}`}
          >
            <a className="button">Take part</a>
          </Link>
        </div>
        <style jsx>{`
          .Theme {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .Theme span {
            color: #adadad;
            font-size: 0.8rem;
            text-transform: uppercase;
          }

          .Theme .bottom {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .Theme .bottom h2 {
            text-align: center;
            margin: 0;
          }

          .Theme .bottom a {
            text-align: center;
          }

          .Theme .bottom a:first-of-type {
            font-weight: 500;
            margin: 1rem 0 0.7rem;
          }

          .Theme .bottom a.button {
            font-weight: 400;
            padding: 0.3rem 1rem;
            border: 1px solid #cc0000;
            border-radius: 4px;
            opacity: 0.7;
            transition: all 0.3s;
          }

          .Theme .bottom .button:hover {
            opacity: 1;
          }
          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Theme {
              display: block;
            }
            .Theme .bottom {
              flex-direction: row;
              margin-left: auto;
            }
            .Theme .bottom h2 {
              text-align: left;
            }
            .Theme .bottom a:first-of-type {
              margin: 0 1rem 0 auto;
            }
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(
  connect(
    mapStateToProps,
    null
  )(Index)
);
