import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";

import App from "../components/App";
import Article from "../components/Article";

// <Head> component for setting the page title/meta tags
import Head from "next/head";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  data?: any;
  user?: any;
  signInModal?: any;
}

interface State {
  articles: any[];
}

@graphql(gql`
  {
    allArticles {
      id
      title
    }
  }
`)
class Articles extends Component<Props, State> {
  componentWillReceiveProps(nextProps: Props) {
    const allArticles = nextProps.data;
    if (allArticles.allArticles !== this.state.articles) {
      if (!allArticles.loading) {
        if (allArticles.error) {
          console.error(allArticles.error);
        } else {
          this.setState(prevState => ({
            ...prevState,
            articles: allArticles.allArticles
          }));
        }
      }
    }
  }

  state = { articles: [0, 1, 2, 3, 4, 5] };

  render() {
    return (
      <App {...this.props}>
        <div className="Articles Content">
          <Head>
            <title>Articles | Oyah</title>
            <meta name="description" content="Articles of Oyah" />
          </Head>
          {this.state.articles &&
            this.state.articles.map((elem: any, i) => {
              return (
                <Article
                  title={elem.title}
                  image={process.env.PUBLIC_URL + elem.image}
                  alt={elem.alt}
                  id={elem.id}
                  style={{ order: i }}
                  loading={this.props.data.loading}
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
            margin: 0 0 4rem;
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
            /* width: calc(1/3*100% - (1 - 1/3)*1.5rem); */
            /* width: calc(1/2*100% - 1/2*2.5rem); */
          }
          @media (min-width: 576px) {
            .Articles {
              width: 85%;
              margin: 0 auto;
            }
          }
          @media (min-width: 768px) {
            .Articles .Article {
              width: calc(1/2*100% - 1/2*2.5rem);
            }
          }
          @media (min-width: 992px) {
            .Articles .Article {
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

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user
});

export default withData(connect(mapStateToProps, null)(Articles));
