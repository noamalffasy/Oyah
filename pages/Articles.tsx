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

          .Articles .Article:not(.rect-shape):hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
            transform: scale(1.04);
          }

          .Articles .Article .image {
            width: 100%;
            height: 100%;
            min-height: 20rem;
            border-radius: 8px;
            user-select: none;
            cursor: pointer;
            transition: all 0.3s;
          }

          .Articles .Article .text {
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

          .Articles .Article .text h2 {
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
          @media (min-width: 576px) {
            .Articles {
              width: 85%;
              margin: 0 auto;
            }
            /* .Articles .Article {
              width: calc(1/3*100% - (1 - 1/3)*2rem);
            } */
          }
          @media (min-width: 768px) {
            .Articles .Article {
              width: calc(1/2*100% - 1/2*2.5rem);
            }
            .Articles .Article .text h2 {
              font-size: 4vmin;
            }
          }
          @media (min-width: 992px) {
            .Articles .Article {
              width: calc(1/3*100% - (1 - 1/3)*1rem);
              height: 15rem;
              overflow: hidden;
            }
            .Articles .Article .image {
              height: 100%;
              min-height: 100%;
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
