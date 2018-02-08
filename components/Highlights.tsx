import * as React from "react";
import { Component } from "react";

import ReactPlaceholder from "react-placeholder";
import { RectShape } from "react-placeholder/lib/placeholders";

import Article from "./Article";

import graphql from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  url: any;
  allArticles?: any;
}

interface State {
  articles: any[];
  loading: boolean;
}

@graphql(
  gql`
    {
      allArticles {
        id
        title
      }
    }
  `,
  {
    name: "allArticles"
  }
)
class Highlights extends Component<Props, State> {
  async getInitialProps() {
    return {
      allArticles: {
        loading: true
      }
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.allArticles.loading !== this.state.loading) {
      this.setState((prevState: any) => ({
        ...prevState,
        loading: nextProps.allArticles.loading
      }));
    }
    if (nextProps.allArticles && nextProps.allArticles.allArticles) {
      if (nextProps.allArticles.error) {
        console.error(nextProps.allArticles.error.message);
      } else {
        this.setState((prevState: any) => ({
          ...prevState,
          articles: nextProps.allArticles.allArticles
        }));
      }
    }
  }

  state = {
    articles: [],
    loading: true
  };

  render() {
    return (
      <div className="Highlights">
        <Article
          title={
            !this.state.loading ? this.state.articles[0].title : ""
          }
          image={
            !this.state.loading
              ? process.env.PUBLIC_URL + this.state.articles[0].image
              : ""
          }
          id={!this.state.loading ? this.state.articles[0].id : ""}
          alt={
            !this.state.loading ? this.state.articles[0].alt : ""
          }
          loading={this.state.loading}
          url={this.props.url}
        />
        <div className="other">
          {!this.state.loading
            ? this.state.articles.slice(1, 3).map((elem: any, i: number) => {
              return (
                <Article
                  title={!this.state.loading ? elem.title : ""}
                  image={
                    !this.state.loading
                      ? process.env.PUBLIC_URL + elem.image
                      : ""
                  }
                  alt={!this.state.loading ? elem.alt : ""}
                  id={!this.state.loading ? elem.id : ""}
                  loading={this.state.loading}
                  url={this.props.url}
                  style={{ order: i }}
                  key={i}
                />
              );
            })
            : [0, 1].map((elem: any, i) => {
              return (
                <Article
                  title={!this.state.loading ? elem.title : ""}
                  image={
                    !this.state.loading
                      ? process.env.PUBLIC_URL + elem.image
                      : ""
                  }
                  alt={!this.state.loading ? elem.alt : ""}
                  id={!this.state.loading ? elem.id : ""}
                  loading={this.state.loading}
                  url={this.props.url}
                  style={{ order: i }}
                  key={i}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default Highlights;
