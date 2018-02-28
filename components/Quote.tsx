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
        <style jsx>{`
          .Quote .blockquote {
            max-width: 100%%;
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Quote .blockquote {
              max-width: 75%;
            }
          }

          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Quote .blockquote {
              max-width: 50%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Quote;
