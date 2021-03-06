import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";

import App from "../components/App";
import Article from "../components/ArticleBlock";

// <Head> component for setting the page title/meta tags
import Head from "next/head";

// GraphQL
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  articles: any;
  user: any;
  signInModal: any;
  error: any;
  dispatch: any;
}

class Articles extends Component<Props> {
  static async getInitialProps(ctx: any, apolloClient: any) {
    return await apolloClient
      .query({
        query: gql`
          {
            allArticles {
              id
              title
              path
              dominantColor
              author {
                id
                is_team
              }
            }
          }
        `
      })
      .then((res: any) => {
        return {
          articles: res.data.allArticles
        };
      })
      .catch((err: Error) => {
        return { error: err };
      });
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
    return (
      <App {...this.props}>
        <div className="Articles Content">
          <Head>
            <title>Articles | Oyah</title>
            <meta name="description" content="Articles of Oyah" />
          </Head>
          {this.props.articles &&
            this.props.articles.map((elem: any, i) => {
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
            })}
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

          .Articles {
            margin: 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }

          .Articles .Article {
            /* flex: 1 1; */
            /* margin: 0 0.5rem; */
            /* margin: 0.5rem; */
            /* margin: 0 0.5rem 0.5rem 0; */
            margin: 0 auto 0.7rem;
            width: calc(100% - 1.25rem);
            height: 15rem;
            /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
            /* width: calc(1/2*100% - 1/2*2.5rem); */
          }

          .Articles .Article .image {
            min-height: 15rem;
          }
          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles {
              width: 85%;
              margin: 0 auto;
            }
            .Articles .Article {
              width: calc(50% - 1.25rem);
              height: 10rem;
            }
            .Articles .Article .image {
              min-height: 10rem;
            }
          }
          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles .Article {
              width: calc(1 / 2 * 100% - 1 / 2 * 2.5rem);
              height: 15rem;
            }
            .Articles .Article .image {
              min-height: 15rem;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Articles .Article {
              width: calc(1 / 3 * 100% - (1 - 1 / 3) * 1rem);
              overflow: hidden;
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

export default withData(
  connect(
    mapStateToProps,
    null
  )(Articles)
);
