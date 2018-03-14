import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import Head from "next/head";
import Error from "./_error";

import App from "../components/App";
import Article from "../components/Article";

// GraphQL
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  searchTerm: any;
  articles: any;
  url?: any;
}
interface State {
  articles: any[];
}

class Search extends Component<Props, State> {
  static async getInitialProps(
    { query: { q: searchTerm } }: any,
    apolloCilent: any
  ) {
    return await apolloCilent
      .mutate({
        mutation: gql`
          mutation searchArticle($searchTerm: String!) {
            searchArticle(searchTerm: $searchTerm) {
              id
              title
            }
          }
        `,
        variables: {
          searchTerm
        }
      })
      .then((res: any) => {
        if (res.error) {
          return {
            searchTerm,
            error: res.error
          };
        } else {
          const articles = res.data.searchArticle;

          return {
            searchTerm,
            articles
          };
        }
      })
      .catch((err: Error) => {
        return {
          searchTerm,
          error: err
        };
      });
  }

  render() {
    const { searchTerm, articles } = this.props;
    if (articles) {
      if (articles.length > 0) {
        return (
          <App {...this.props}>
            <div className="Search Content">
              <Head>
                <title>Search '{searchTerm}' | Oyah</title>
                <meta
                  name="description"
                  content={`Searching '${searchTerm}' on Oyah`}
                />
              </Head>
              {this.props.articles.map((elem: any, i: any) => {
                return (
                  <Article
                    title={elem.title}
                    alt={elem.alt}
                    id={elem.id}
                    loading={false}
                    key={i}
                  />
                );
              })}
            </div>
            <style jsx>{`
              .Content {
                padding-bottom: 4.5rem;
              }

              .Content::after {
                content: "";
                clear: both;
                display: block;
              }

              .Search {
                margin: 0 0 4rem;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
              }
              @media (min-width: 576px),
                @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
                .Search {
                  width: 85%;
                  margin: 0 auto;
                }
              }
            `}</style>
            <style jsx global>{`
              .Search .Article {
                /* flex: 1 1; */
                /* margin: 0 0.5rem; */
                /* margin: 0.5rem; */
                /* margin: 0 0.5rem 0.5rem 0; */
                margin: 0 auto 0.7rem;
                /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
                /* width: calc(1/2*100% - 1/2*2.5rem); */
              }
              .Search .Article .image {
                min-height: 20rem;
              }
              @media (min-width: 768px),
                @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .Search .Article {
                  width: calc(1 / 2 * 100% - 1 / 2 * 2.5rem);
                }
              }
              @media (min-width: 992px),
                @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
                .Search .Article {
                  width: calc(1 / 3 * 100% - (1 - 1 / 3) * 1rem);
                  height: 15rem;
                  overflow: hidden;
                }
              }
            `}</style>
          </App>
        );
      } else {
        return (
          <App {...this.props}>
            <div className="NotFound Content">
              <h2>No Results</h2>
              <p>Your search '{searchTerm}' didn't match any article</p>
            </div>
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
    } else {
      return <Error {...this.props} statusCode={501} />;
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(connect(mapStateToProps, null)(Search));
