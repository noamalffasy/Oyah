import * as React from "react";
import { Component } from "react";

interface Props {
  quote: any;
  author: any;
}

class Quote extends Component<Props> {
  render() {
    return (
      <div className="Quote">
        <blockquote className="blockquote text-center">
          <p className="mb-0">{this.props.quote}</p>
          <footer className="blockquote-footer">
            <cite title="Source Title">{this.props.author}</cite>
          </footer>
        </blockquote>
      </div>
    );
  }
}

export default Quote;
