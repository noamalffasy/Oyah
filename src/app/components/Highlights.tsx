import * as React from "react";
import { Component } from "react";

import ArticleBlock from "./ArticleBlock";

import { Article as ArticleInterface } from "../lib/db/models/Article";

interface Props {
  articles: ArticleInterface[];
}

class Highlights extends Component<Props> {
  render() {
    return (
      <div className="Highlights">
        <ArticleBlock
          path={this.props.articles[0].path}
          dominantColor={this.props.articles[0].dominantColor}
          title={this.props.articles[0].title}
          id={this.props.articles[0].id}
          alt={this.props.articles[0].alt}
          official={this.props.articles[0].author.is_team}
          loading={false}
        />
        <div className="other">
          {this.props.articles.slice(1, 3).map((elem, i) => {
            return (
              <ArticleBlock
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
      </div>
    );
  }
}

export default Highlights;
