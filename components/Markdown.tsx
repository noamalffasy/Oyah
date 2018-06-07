import * as React from "react";
import { Fragment, Component } from "react";

import ReactMarkdown from "react-markdown";
import shortcodes from "remark-shortcodes";

import Image from "./Image";

interface Props {
  className?: string;
  value: any;
}

class Markdown extends Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        <ReactMarkdown
          className={this.props.className || "body"}
          source={this.props.value || ""}
          plugins={[shortcodes]}
          renderers={{
            image: ({ src, alt }) => {
              return (
                <Image
                  src={src}
                  alt={alt}
                  key={alt}
                  // onError={e => (e.target.style.animation = "none")}
                />
              );
            },
            shortcode: ({ attributes: { url } }) => {
              return (
                <div className="iframe-wrapper" key={url}>
                  <iframe src={url} />
                </div>
              );
            }
          }}
        />
        <style jsx global>{`
          ${this.props.className || ".body"} {
            font-size: 1.25rem;
            white-space: pre-wrap;
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
          }

          ${this.props.className || ".body"} h1 {
            font-size: 2.5rem;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji",
              "Segoe UI Emoji", "Segoe UI Symbol";
            margin: 1rem 0;
            text-align: left;
          }

          ${this.props.className || ".body"} h1 > strong {
            font-weight: 600;
          }

          ${this.props.className || ".body"} p {
            margin-bottom: 1.5rem;
          }

          ${this.props.className || ".body"} .image {
            display: block;
            /* min-height: 15rem;
            max-height: 15rem; */
            width: 100%;
            font-size: 0rem;
            /* padding-bottom: 56.25%; */
            border-radius: 2px;
            background: #c0c0c0;
            animation: imageLoad 1s infinite;
          }

          ${this.props.className || ".body"} .iframe-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            background: rgba(0, 0, 0, 0.5);
            margin: 0 0 1rem;
            overflow: hidden;
            animation: 1s imageLoad infinite;
          }

          ${this.props.className || ".body"} .iframe-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            border: 0;
          }
        `}</style>
      </Fragment>
    );
  }
}

export default Markdown;
