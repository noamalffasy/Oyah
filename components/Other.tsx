import * as React from "react";
import { Component } from "react";

import Article from "./Article";

import graphql from "../utils/graphql";
import gql from "graphql-tag";

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
class Other extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      articles: [],
      loading: true
    };
  }

  componentWillReceiveProps(nextProps: any) {
    const data = nextProps.allArticles;
    if (!data.loading) {
      if (data.error !== undefined) {
        // data.error.forEach(error => {
        //   console.error(error.message);
        // });
        console.error(data.error);
      } else {
        this.setState((prevState: any) => ({
          ...prevState,
          articles: data.allArticles.slice(3) || []
        }));
      }
    }
    if (nextProps.allArticles.loading !== this.state.loading) {
      this.setState((prevState: any) => ({
        ...prevState,
        loading: nextProps.allArticles.loading
      }));
    }
  }

  render() {
    return (
      <div className="Other">
        {!this.state.loading
          ? this.state.articles.slice(0, 4).map((elem: any, i: any) => {
              return (
                <Article
                  title={elem.title}
                  id={elem.id}
                  alt={elem.alt}
                  loading={this.state.loading}
                  style={{ order: i }}
                  key={i}
                />
              );
            })
          : [1, 2, 3].map((elem: any, i: any) => {
              return (
                <Article
                  title={elem.title}
                  id={elem.id}
                  alt={elem.alt}
                  loading={this.state.loading}
                  style={{ order: i }}
                  key={i}
                />
              );
            })}
      </div>
    );
  }
}

export default Other;
