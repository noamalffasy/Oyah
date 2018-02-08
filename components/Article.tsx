import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import ReactPlaceholder from "react-placeholder";

import Link from "next/link";

import Image from "./Image";
import { RectShape } from "react-placeholder/lib/placeholders";

class Placeholder extends Component<any, any> {
  render() {
    return (
      <RectShape
        className="Article"
        color="#e0e0e0"
        style={{
          width: "",
          height: "",
          marginRight: "",
          animation: "loading 1.5s infinite"
        }}
      />
    );
  }
}

class Article extends Component<any, any> {
  render() {
    return (
      <ReactPlaceholder customPlaceholder={<Placeholder />} ready={!this.props.loading}>
        <Link
          href={"/article?id=" + this.props.id}
          as={"/articles/" + this.props.id}
        >
          <div className={this.props.main ? "Article main" : "Article"}>
            <Image
              src={"/img/articles/" + this.props.id + ".jpeg"}
              alt={this.props.alt || ""}
              onError={(e: any) => {
                e.target.src = "";
                e.target.style.backgroundColor = "#c3c3c3";
                findDOMNode(this.text).style.background = "rgba(0,0,0,.4)";
              }}
            />
            {/* <img
          src={
            this.props.image.indexOf("undefined") === -1
              ? this.props.image
              : process.env.PUBLIC_URL +
                "/articles/img/" +
                this.props.id +
                ".jpeg"
          }
          alt={this.props.alt || ""}
          onError={e => {
            e.target.src = "";
            e.target.style.backgroundColor = "#c3c3c3";
            findDOMNode(this.text).style.background = "rgba(0,0,0,.4)";
          }}
        /> */}
            <div className="text" ref={div => (this.text = div)}>
              <h2>{this.props.title}</h2>
            </div>
          </div>
        </Link>
      </ReactPlaceholder>
    );
  }
}

export default Article;
