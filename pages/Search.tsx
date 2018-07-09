import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";

import Head from "next/head";
import Router from "next/router";
import Error from "./_error";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import App from "../components/App";
import Input from "../components/Input";
import Article from "../components/ArticleBlock";
import Loading from "../components/Loading";

import { AlgoliaBrand } from "../components/svgs";

// GraphQL
import gql from "graphql-tag";
import graphql from "../utils/graphql";

import withData from "../lib/withData";

interface Props {
  searchTerm: any;
  articles: any;
  searchArticle?: any;
  user: any;
  signInModal: any;
  error: any;
  dispatch: any;
}

interface State {
  articles: any[];
  searchTerm: string;
}

@graphql(
  gql`
    mutation searchArticle($searchTerm: String!) {
      searchArticle(searchTerm: $searchTerm) {
        id
        path
        dominantColor
        title
        author {
          id
          is_team
        }
      }
    }
  `,
  {
    name: "searchArticle"
  }
)
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
              path
              dominantColor
              title
              author {
                id
                is_team
              }
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
            searchTerm: decodeURI(searchTerm),
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

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.searchTerm !== this.props.searchTerm) {
      this.props
        .searchArticle({
          variables: {
            searchTerm: nextProps.searchTerm
          }
        })
        .then((res: any) => {
          if (res.errors) {
            res.errors.forEach((error: any) => {
              console.error(error);
            });
          } else {
            const articles = res.data.searchArticle;

            this.setState(prevState => ({
              ...prevState,
              searchTerm: nextProps.searchTerm,
              articles
            }));
          }
        });
    }
  }

  state = {
    searchTerm: this.props.searchTerm,
    articles: this.props.articles,
    loading: false
  };

  search = e => {
    const searchTerm = e.target.value;

    setTimeout(() => {
      searchTerm.length > 0
        ? Router.push(
            `/Search?q=${encodeURI(searchTerm)}`,
            `/search?q=${encodeURI(searchTerm)}`
          )
        : Router.push("/Search", "/search");

      this.setState(prevState => ({
        ...prevState,
        searchTerm
      }));

      if (searchTerm.length > 0) {
        this.setState(prevState => ({
          ...prevState,
          loading: true
        }));

        this.props
          .searchArticle({
            variables: {
              searchTerm
            }
          })
          .then((res: any) => {
            if (res.errors) {
              res.errors.forEach((error: any) => {
                console.error(error);
              });
            } else {
              const articles = res.data.searchArticle;

              this.setState(prevState => ({
                ...prevState,
                articles,
                loading: false
              }));
            }
          });
      }
    }, 1500);
  };

  render() {
    const { searchTerm, articles, loading } = this.state;
    if (articles) {
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
            <div className="searchbox">
              {/* <button className="btn my-2 my-sm-0" type="submit">
                  <FontAwesomeIcon icon="search" />
                </button> */}
              <Input
                label="Search for an article"
                type="search"
                initial_value={searchTerm}
                autocomplete="off"
                onChange={this.search}
                // style={{
                //   flex: "1 1",
                //   margin: "0 1.5rem 0 0.5rem"
                // }}
              />
              <div className="algolia-brand-outer">
                <AlgoliaBrand />
              </div>
            </div>
            {!loading && searchTerm.length > 0 && articles.length > 0 ? (
              <div className="articles">
                {articles.map((elem: any, i: any) => {
                  return (
                    <Article
                      path={elem.path}
                      dominantColor={elem.dominantColor}
                      title={elem.title}
                      alt={elem.alt}
                      id={elem.id}
                      official={elem.author.is_team}
                      loading={false}
                      key={i}
                    />
                  );
                })}
              </div>
            ) : loading ? (
              <div className="articles">
                <Loading />
              </div>
            ) : (
              searchTerm.length > 0 && (
                <div className="NotFound">
                  {/* <h2>No Results</h2> */}
                  {/* <p>Your search '{searchTerm}' didn't match any article</p> */}
                  <p>We couldn't find any matching article</p>
                </div>
              )
            )}
            <style jsx>{`
              .Content {
                padding-bottom: 4.5rem;
              }

              .Content::after {
                content: "";
                clear: both;
                display: block;
              }

              .Search .searchbox {
                width: 100%;
                font-size: 2rem;
                margin-top: 0.5rem;
              }

              .Search .searchbox .algolia-brand-outer {
                width: 15rem;
                margin: 1.5rem 0 0.5rem auto;
              }

              .Search .articles {
                margin: 0 0 4rem;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
              }

              .Search .NotFound {
                text-align: center;
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
              .Search .searchbox .Input {
                margin: 0;
              }

              .Search .searchbox .Input span::after {
                margin: -0.3rem 0 0 0;
              }

              .Search .articles .Article {
                /* flex: 1 1; */
                /* margin: 0 0.5rem; */
                /* margin: 0.5rem; */
                /* margin: 0 0.5rem 0.5rem 0; */
                margin: 0 auto 0.7rem;
                width: 100%;
                /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
                /* width: calc(1/2*100% - 1/2*2.5rem); */
              }

              /* .Search .articles .Article .image {
                min-height: 20rem;
              } */
              @media (min-width: 768px),
                @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .Search .articles .Article {
                  width: calc(1 / 2 * 100% - 1 / 2 * 2.5rem);
                }
              }
              @media (min-width: 992px),
                @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
                .Search .articles .Article {
                  width: calc(1 / 3 * 100% - (1 - 1 / 3) * 1rem);
                  /* height: 15rem; */
                  overflow: hidden;
                }
              }
            `}</style>
          </div>
        </App>
      );
    }
    return <Error {...this.props} statusCode={501} />;
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
  )(Search)
);
