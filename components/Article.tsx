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
          borderRadius: "8px",
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
        <style jsx>{`
          .Article {
            display: flex;
            position: relative;
            border-radius: 8px;
            transition: all 0.3s;
          }

          .Article:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
            transform: scale(1.04);
          }

          .Article .image {
            width: 100%;
            height: 100%;
            min-height: 20rem;
            border-radius: 8px;
            user-select: none;
            cursor: pointer;
            transition: all 0.3s;
          }

          .Article .text {
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            /* background: -webkit-linear-gradient(
              rgba(0, 0, 0, 0.3) 0,
              rgba(0, 0, 0, 0.9) 100%
            ); */
            background: -webkit-linear-gradient(
              top,
              rgba(0, 0, 0, 0.3) 0,
              rgba(0, 0, 0, 0.3) 60%,
              #000 100%
            );
            text-align: center;
            z-index: 1;
            color: #fff;
            border-radius: 8px;
            user-select: text;
            cursor: pointer;
            transition: all 0.3s;
          }

          .Article .text h2 {
            position: absolute;
            text-align: center;
            left: 0;
            right: 0;
            bottom: 0;

            margin: 0.5rem auto;

            font-size: 7vmin;
            max-height: 17vmin;
            max-width: 90%;
            white-space: nowrap;

            text-overflow: ellipsis;
            overflow: hidden;

            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            backface-visibility: hidden;
          }
          @media (min-width: 768px) {
            .Article .text h2 {
              font-size: 4vmin;
            }
          }
        `}</style>
        <style jsx global>{`
          .Article .image {
            width: 100%;
            height: 100%;
            min-height: 20rem;
            border-radius: 8px;
            user-select: none;
            cursor: pointer;
            transition: all 0.3s;
          }
          @media (min-width: 992px) {
            .Article .image {
              height: 100%;
              min-height: 100%;
            }
          }
        `}</style>
      </ReactPlaceholder>
    );
  }
}

export default Article;
