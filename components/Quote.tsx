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
            font-size: 2.25rem;
            position: relative;
            // max-width: 20rem;
            max-width: 100%;
            border: 0;
            margin: 0 auto;
            margin-bottom: 3rem;
          }

          .Quote .blockquote::before,
          .Quote .blockquote::after {
            display: none;
            font-family: Times;
            font-size: 8rem;
            position: absolute;
            color: #c0c0c0;
          }

          .Quote .blockquote::before {
            content: open-quote;
            left: -5rem;
            top: -3.5rem;
          }

          .Quote .blockquote::after {
            content: close-quote;
            right: -5rem;
            bottom: -4.5rem;
          }
          @media (min-width: 480px),
            @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
            .Quote .blockquote::before,
            .Quote .blockquote::after {
              display: block;
            }
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
