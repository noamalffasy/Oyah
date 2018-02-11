import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import Head from "next/head";

import App from "../components/App";
import Article from "../components/Article";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  searchArticle?: any;
  url?: any;
}
interface State {
  articles: any[];
}

@graphql(
  gql`
    mutation searchArticle($searchTerm: String!) {
      searchArticle(searchTerm: $searchTerm) {
        id
        title
      }
    }
  `,
  {
    name: "searchArticle"
  }
)
class Search extends Component<Props, State> {
  componentWillMount() {
    this.props
      .searchArticle({
        variables: {
          searchTerm: this.props.url.query.q
        }
      })
      .then((res: any) => {
        if (res.error) {
          console.error(res.error);
        } else {
          const articles = res.data.searchArticle;

          this.setState(prevState => ({
            ...prevState,
            articles
          }));
        }
      });
  }

  render() {
    if (this.state && this.state.articles) {
      if (this.state.articles.length > 0) {
        return (
          <App {...this.props}>
            <div className="Search Content">
              <Head>
                <title>Search '{this.props.url.query.q}' | Oyah</title>
                <meta
                  name="description"
                  content={`Searching '${this.props.url.q}' on Oyah`}
                />
              </Head>
              {this.state.articles.map((elem: any, i: any) => {
                return (
                  <Article
                    title={elem.title}
                    image={process.env.PUBLIC_URL + elem.image}
                    alt={elem.alt}
                    id={elem.id}
                    style={{ order: i }}
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
              @media (min-width: 576px) {
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
              @media (min-width: 768px) {
                .Search .Article {
                  width: calc(1/2*100% - 1/2*2.5rem);
                }
              }
              @media (min-width: 992px) {
                .Search .Article {
                  width: calc(1/3*100% - (1 - 1/3)*1rem);
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
              <p>
                Your search '{this.props.url.query.q}' didn't match any article
              </p>
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
      return (
        <App {...this.props}>
          <div className="Search Content">
            <Head>
              <title>Search '{this.props.url.query.q}' | Oyah</title>
              <meta
                name="description"
                content={`Searching '${this.props.url.q}' on Oyah`}
              />
            </Head>
            {[0, 1, 2].map((elem: any, i: any) => {
              return (
                <Article
                  title={elem.title}
                  image={process.env.PUBLIC_URL + elem.image}
                  alt={elem.alt}
                  id={elem.id}
                  loading={true}
                  style={{ order: i }}
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
            @media (min-width: 576px) {
              .Search {
                width: 85%;
                margin: 0 auto;
              }
            }
          `}</style>
          <style jsx global>{`
            .Search .Article {
              display: flex;
              /* flex: 1 1; */
              position: relative;
              /* margin: 0 0.5rem; */
              /* margin: 0.5rem; */
              /* margin: 0 0.5rem 0.5rem 0; */
              margin: 0 auto 0.7rem;
              /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
              /* width: calc(1/2*100% - 1/2*2.5rem); */
              border-radius: 8px;
              transition: all 0.3s;
            }

            @media (min-width: 768px) {
              .Search .Article {
                width: calc(1/2*100% - 1/2*2.5rem);
              }
            }
            @media (min-width: 992px) {
              .Search .Article {
                width: calc(1/3*100% - (1 - 1/3)*1rem);
                height: 15rem;
                overflow: hidden;
              }
            }
          `}</style>
        </App>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(connect(mapStateToProps, null)(Search));
