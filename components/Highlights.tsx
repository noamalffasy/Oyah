import * as React from "react";
import { Component } from "react";

import Article from "./Article";

interface Props {
  articles: any;
}

class Highlights extends Component<Props> {
  render() {
    return (
      <div className="Highlights">
        <Article
          path={this.props.articles[0].path}
          title={this.props.articles[0].title}
          id={this.props.articles[0].id}
          alt={this.props.articles[0].alt}
          official={this.props.articles[0].author.is_team}
          loading={false}
        />
        <div className="other">
          {this.props.articles.slice(1, 3).map((elem: any, i: number) => {
            return (
              <Article
                path={elem.path}
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
