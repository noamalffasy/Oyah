import * as React from "react";
import { Component } from "react";

import Article from "./Article";

interface Props {
  articles: any;
}

class Other extends Component<Props> {
  render() {
    return (
      <div className="Other">
        {this.props.articles.slice(3, 8) && this.props.articles.slice(3, 8).map((elem: any, i: any) => {
            return (
              <Article
                title={elem.title}
                id={elem.id}
                alt={elem.alt}
                loading={false}
                key={i}
              />
            );
          })
        }
      </div>
    );
  }
}

export default Other;
