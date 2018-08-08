import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";

import App from "../components/App";
import Article from "../components/ArticleBlock";

// <Head> component for setting the page title/meta tags
import Head from "next/head";
import Link from "next/link";

import { ArticleModel, ThemeModel } from "../lib/db/models";

import withData from "../lib/withData";

interface Props {
  articles: any;
  theme: any;
  user: any;
  signInModal: any;
  error: any;
  dispatch: any;
}

class Articles extends Component<Props> {
  static async getInitialProps({ query: { tag } }: any) {
    return await ArticleModel.getAll({ theme: tag })
      .then(async articles => {
        return await ThemeModel.get({ tag })
          .then(theme => {
            return {
              articles,
              theme
            };
          })
          .catch(err => ({ error: err }));
      })
      .catch((err: Error) => ({ error: err }));
  }

  // componentWillReceiveProps(nextProps: Props) {
  //   const allArticles = nextProps.data;
  //   if (allArticles.allArticles !== this.state.articles) {
  //     if (!allArticles.loading) {
  //       if (allArticles.error) {
  //         console.error(allArticles.error);
  //       } else {
  //         this.setState(prevState => ({
  //           ...prevState,
  //           articles: allArticles.allArticles
  //         }));
  //       }
  //     }
  //   }
  // }

  render() {
    const { articles, theme } = this.props;
    return (
      <App {...this.props}>
        <div className="Articles Content">
          <Head>
            <title>{theme.title} | Oyah</title>
            <meta
              name="description"
              content={`${theme.title} articles of Oyah`}
            />
          </Head>
          <Theme theme={theme} />
          <div className="articles">
            {articles && articles.length > 0 ? (
              articles.map((elem: any, i) => {
                return (
                  <Article
                    title={elem.title}
                    alt={elem.alt}
                    id={elem.id}
                    path={elem.path}
                    dominantColor={elem.dominantColor}
                    official={elem.author.is_team}
                    loading={false}
                    key={i}
                  />
                );
              })
            ) : (
              <p className="not-found">
                No articles have been written about this topic yet
              </p>
            )}
          </div>
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

          .Articles .articles {
            margin: 2rem 0 4rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .Articles .articles p.not-found {
            margin: 0 auto;
            color: rgb(150, 150, 150);
            text-align: center;
          }

          .Articles .articles .Article {
            /* margin: 0.5rem; */
            margin: 0 0 1.5rem;
            /* width: calc(1/3*100% - (1 - 1/3)*1.5rem);
            /* width: calc(1 / 2 * 100% - 1 / 2 * 0.5rem); 
            height: 7rem; */
            width: 100%;
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles {
              width: 85%;
              margin: 0 auto;
            }
            .Articles .articles {
              margin: 1rem 0 4rem;
            }
          }
          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles .articles {
              margin: 1.2rem 0 4rem 0;
            }
            .Articles .articles .Article {
              margin: 0 1rem 1rem;
              width: calc(1 / 2 * 100% - (1 / 2 * 1rem));
            }
            .Articles .articles .Article:nth-child(2n) {
              margin: 0 0 1rem;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles .articles {
              margin: 1.4rem 0 4rem 0;
            }
            .Articles .articles .Article {
              /* height: 15rem; */
              width: calc(1 / 3 * 100% - (1 / 3 * 2rem));
              margin: 0 1rem 1rem 0;
            }
            .Articles .articles .Article:nth-child(2n) {
              margin: 0 1rem 1rem 0;
            }
            .Articles .articles .Article:nth-child(3n) {
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
        <span>Articles written on the topic</span>
        <div className="bottom">
          <h2>{theme.title}</h2>
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
  )(Articles)
);
