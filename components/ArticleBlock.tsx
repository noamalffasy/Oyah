import * as React from "react";
import { Component } from "react";

import ReactPlaceholder from "react-placeholder";
import { RectShape } from "react-placeholder/lib/placeholders";

import Link from "next/link";

import Image from "./Image";
import Verification from "./Verification";

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

interface Props {
  id: any;
  path: any;
  dominantColor: any;
  title: any;
  alt: any;
  official: boolean;
  loading: any;
  main?: boolean;
}

class ArticleBlock extends Component<Props> {
  text: HTMLDivElement = null;
  backgroundBlur: HTMLCanvasElement = null;

  componentDidMount() {
    const StackBlur = require("stackblur-canvas");
    const image = document.createElement("img");
    image.onload = () => {
      StackBlur.image(image, this.backgroundBlur, 180);
    };
    if (this.props.path.match(/http:\/\/|https:\/\//)) {
      image.setAttribute("crossorigin", "anonymous");
    }
    image.src = this.props.path;
  }

  getCorrectColor() {
    const rgb = this.props.dominantColor
      .replace("rgb(", "")
      .replace(")", "")
      .split(", ");

    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 125
      ? "#000"
      : "#fff";
  }

  render() {
    return (
      <ReactPlaceholder
        customPlaceholder={<Placeholder />}
        ready={!this.props.loading}
      >
        <Link
          href={"/article?id=" + this.props.id}
          as={"/articles/" + this.props.id}
        >
          <a className={this.props.main ? "Article main" : "Article"}>
            <div className="article-inner">
              <canvas ref={canvas => (this.backgroundBlur = canvas)} />
              <Image
                src={this.props.path}
                alt={this.props.alt || ""}
                onError={(e: any) => {
                  e.target.src = "";
                  e.target.style.backgroundColor = "#c3c3c3";
                  this.text.style.background = "rgba(0,0,0,.4)";
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
                <div className="bottom">
                  <h2>{this.props.title}</h2>
                  {this.props.official && (
                    <Verification
                      isArticle={true}
                      style={{ fontSize: "2rem", marginLeft: ".5rem" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </a>
        </Link>
        <style jsx>{`
          .Article {
            display: flex;
            position: relative;
            border-radius: 8px;
            -webkit-mask-image: -webkit-radial-gradient(white, black);
            opacity: 1;
            overflow: hidden;
            transition: all 0.3s;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
          }

          .Article:hover {
            transform: scale(1.04);
          }

          .Article .article-inner {
            position: relative;
            display: flex;
            width: 100%;
            height: 100%;
            background-color: ${this.props.dominantColor};
            /* background: url(${this.props.path}) no-repeat center center;
            background-size: cover; */
            flex-direction: column;
            overflow: hidden;
          }

          .Article canvas {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            width: 100% !important;
            height: 100% !important;
            filter: blur(30px);
          }

          .Article .text {
            display: block;
            position: relative;
            /* width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0; */
            /* background: -webkit-linear-gradient(
              rgba(0, 0, 0, 0.3) 0,
              rgba(0, 0, 0, 0.9) 100%
            ); */
            /* background: -webkit-linear-gradient(
              top,
              rgba(0, 0, 0, 0.3) 0,
              rgba(0, 0, 0, 0.3) 60%,
              #000 100%
            ); */
            text-align: center;
            z-index: 1;
            color: ${this.getCorrectColor()};
            /* border-radius: 8px; */
            user-select: text;
            cursor: pointer;
            transition: all 0.3s;
          }

          /* .Article .text::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            background: url(${this.props.path}) no-repeat bottom center;
            background-size: cover;
            filter: blur(15px);
            width: 100%;
            height: 100%;
            transform: scale(1.3);
            z-index: -1;
          } */


          .Article .text .bottom {
            /* position: absolute; */
            display: flex;
            /* left: 0;
            right: 0;
            bottom: 0; */
            max-width: 90%;
            margin: 0 auto;
            justify-content: center;
          }

          .Article .text .bottom h2 {
            /* position: absolute;
            text-align: center;
            left: 0;
            right: 0;
            bottom: 0; */

            /* flex: 1 1 0; */

            margin: ${
              this.props.official ? "0.5rem 0 0.5rem 0.5rem" : "0.5rem 0"
            };

            font-size: 2rem;
            /* max-height: 17vw;
            max-width: 90%; */
            /* white-space: nowrap;

            text-overflow: ellipsis; */
            overflow: hidden;

            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            backface-visibility: hidden;
          }

          .Article .text .bottom span {
            font-size: 2rem;
            -webkit-text-fill-color: transparent;
            background: -webkit-linear-gradient(#000,#f00);
            background-clip: text;
            border-radius: 50%;
            margin: auto 0 .2rem;
          }
          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Article .text h2 {
              font-size: 1.5rem;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Article .text h2 {
                font-size: 2rem;
              }
            }
          }
          @media (min-width: 1200px),
            @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
            .Article .text h2 {
              font-size: 2.5rem;
            }
          }
        `}</style>
        <style jsx global>{`
          .Article .image {
            /* opacity: 0; */
            width: 100%;
            height: 100%;
            /* min-height: 20rem; */
            user-select: none;
            cursor: pointer;
            z-index: 2;
            transition: all 0.3s;
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Article .image {
              height: 100%;
              /* min-height: 100%; */
            }
          }
        `}</style>
      </ReactPlaceholder>
    );
  }
}

export default ArticleBlock;
