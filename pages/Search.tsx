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

              .Search .Article:not(.rect-shape):hover {
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
                transform: scale(1.04);
              }

              .Search .Article .image {
                width: 100%;
                height: 100%;
                min-height: 20rem;
                border-radius: 8px;
                user-select: none;
                cursor: pointer;
                transition: all 0.3s;
              }

              .Search .Article .text {
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                /* background: -webkit-linear-gradient(
                rgba(0, 0, 0, 0.3) 0,
                rgba(0, 0, 0, 0.9) 100%
              ); */
                background: -webkit-linear-gradient(
                  top,
                  rgba(0, 0, 0, 0.3) 0,
                  rgba(0, 0, 0, 0.3) 60%,
                  #000 100%
                );
                text-align: center;
                z-index: 1;
                color: #fff;
                border-radius: 8px;
                user-select: text;
                cursor: pointer;
                transition: all 0.3s;
              }

              .Search .Article .text h2 {
                position: absolute;
                text-align: center;
                left: 0;
                right: 0;
                bottom: 0;

                margin: 0.5rem auto;

                font-size: 7vmin;
                max-height: 17vmin;
                max-width: 90%;
                white-space: nowrap;

                text-overflow: ellipsis;
                overflow: hidden;

                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                backface-visibility: hidden;
              }
              @media (min-width: 768px) {
                .Search .Article {
                  width: calc(1/2*100% - 1/2*2.5rem);
                }
                .Search .Article .text h2 {
                  font-size: 4vmin;
                }
              }
              @media (min-width: 992px) {
                .Search .Article {
                  width: calc(1/3*100% - (1 - 1/3)*1rem);
                  height: 15rem;
                  overflow: hidden;
                }
                .Search .Article .image {
                  height: 100%;
                  min-height: 100%;
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
  user: state.user
});

export default withData(connect(mapStateToProps, null)(Search));
