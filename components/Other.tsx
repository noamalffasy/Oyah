import * as React from "react";
import { Component } from "react";

import Article from "./ArticleBlock";

interface Props {
  articles: any;
}

class Other extends Component<Props> {
  render() {
    return (
      <div className="Other">
        {this.props.articles.slice(3, 19) &&
          this.props.articles.slice(3, 19).map((elem: any, i: any) => {
            return (
              <Article
                path={elem.path}
                dominantColor={elem.dominantColor}
                title={elem.title}
                id={elem.id}
                alt={elem.alt}
                official={elem.author.is_team}
                loading={false}
                key={i}
              />
            );
          })}
      </div>
    );
  }
}

export default Other;
