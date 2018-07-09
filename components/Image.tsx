import * as React from "react";
import { Component } from "react";

import ReactPlaceholder from "react-placeholder";
import { RectShape } from "react-placeholder/lib/placeholders";

interface ImagePlaceholderProps {
  height: number;
  width: number;
}

class ImagePlaceholder extends Component<ImagePlaceholderProps> {
  render() {
    return (
      <div className="image">
        <RectShape
          color="#e0e0e0"
          style={{
            width: "100%",
            height: "100%",
            margin: "0",
            paddingBottom: `calc(100% * ${this.props.height}.0 / ${
              this.props.width
            }.0)`,
            animation: "loading 1.5s infinite"
          }}
        />
      </div>
    );
  }
}

interface Props extends React.Props<Image> {
  src: string;
  smallSrc?: string;
  alt: string;
  className?: string;
  fixed?: boolean;
  user?: any;
  style?: any;
  customPlaceholder?: JSX.Element;
  onError?: any;
  onClick?: any;
}

interface State {
  smallLoaded: boolean;
  largeLoaded: boolean;
  smallImg?: string;
  width?: number;
  height?: number;
  image?: string;
}

class Image extends Component<Props, State> {
  state = {
    smallLoaded: false,
    largeLoaded: false,
    smallImg: "",
    width: 16,
    height: 9,
    image: ""
  };

  _mounted: boolean = false;
  placeholder: HTMLDivElement = null;
  small: HTMLImageElement = null;

  async componentDidMount() {
    this._mounted = true;
    this.loadImages(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.src !== this.props.src && this._mounted) {
      this.loadImages(nextProps);
    }
  }

  loadImages = props => {
    if (props.user && Object.keys(props.user).length !== 0) {
      this.setState(prevState => ({
        ...prevState,
        smallImg: props.user.small_image.startsWith("http")
          ? props.user.small_image
          : "/img/users/" + encodeURIComponent(props.user.small_image),
        image: props.user.image.startsWith("http")
          ? props.user.image
          : "/img/users/" + encodeURIComponent(props.user.image)
      }));

      const img = document.createElement("img");
      img.src = this.state.smallImg;
      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true,
          width: imgLarge.width,
          height: imgLarge.height
        }));
      };

      const imgLarge = document.createElement("img");
      if (!props.fixed) {
        imgLarge.src = this.state.image;
      } else {
        imgLarge.src =
          "/img" +
          props.src.replace(/[^\/]*$/, "") +
          encodeURIComponent(props.src.replace(/.*(?=\/)\//, ""));
      }
      imgLarge.onload = () => {
        if (!props.fixed) {
          imgLarge.classList.add("loaded");
          this.setState(prevState => ({
            ...prevState,
            width: imgLarge.width,
            height: imgLarge.height
          }));
        } else {
          this.setState(
            prevState => ({
              ...prevState,
              largeLoaded: true,
              width: imgLarge.width,
              height: imgLarge.height
            }),
            () => {
              if (!props.fixed) {
                this.placeholder.appendChild(imgLarge);
              } else {
                this.placeholder.style.backgroundImage = `url(${"/img" +
                  imgLarge.src.replace(/[^\/]*$/, "") +
                  encodeURIComponent(imgLarge.src.replace(/.*(?=\/)\//, ""))})`;
              }
            }
          );
        }
      };
    } else {
      const img = document.createElement("img");
      img.src = props.smallSrc
        ? props.smallSrc
        : props.src.startsWith("http")
          ? props.src
          : (props.src.replace(/\.[^.]*$/, "").indexOf("/img") === -1
              ? "/img"
              : "") +
            props.src.replace(/\.[^.]*$/, "") +
            "_small" +
            props.src.replace(/.*(?=\.)/, "");
      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true
        }));
      };

      const imgLarge = document.createElement("img");
      if (!props.fixed) {
        imgLarge.src = props.src;
      } else {
        imgLarge.src = props.src.startsWith("http")
          ? props.src
          : "/img" +
            props.src.replace(/[^\/]*$/, "") +
            encodeURIComponent(props.src.replace(/.*(?=\/)\//, ""));
      }
      const poll = setInterval(() => {
        if (imgLarge.naturalWidth) {
          clearInterval(poll);
          this.setState(prevState => ({
            ...prevState,
            width: imgLarge.naturalWidth,
            height: imgLarge.naturalHeight
          }));
        }
      }, 10);
      imgLarge.onload = () => {
        if (!props.fixed) {
          imgLarge.classList.add("loaded");
        }
        this.setState(
          prevState => ({
            ...prevState,
            largeLoaded: true
            // width: imgLarge.width,
            // height: imgLarge.height
          }),
          () => {
            if (!props.fixed) {
              this.placeholder.appendChild(imgLarge);
            } else {
              this.placeholder.style.backgroundImage = `url(${imgLarge.src})`;
            }
          }
        );
      };
    }
  };

  src = this.props.src;

  render() {
    if (!this.props.fixed) {
      return (
        <ReactPlaceholder
          customPlaceholder={
            this.props.customPlaceholder ? (
              this.props.customPlaceholder
            ) : (
              <ImagePlaceholder
                height={this.state.height}
                width={this.state.width}
              />
            )
          }
          ready={this.state.smallLoaded || this.state.largeLoaded}
        >
          <div
            className={
              "image placeholder" +
              (this.state.smallLoaded ? " loading" : "") +
              (this.props.className ? " " + this.props.className : "")
            }
            data-large={
              this.props.user && Object.keys(this.props.user).length !== 0
                ? this.state.image
                : this.props.src
            }
            style={this.props.style}
            onClick={this.props.onClick}
            ref={div => (this.placeholder = div)}
          >
            <img
              className={
                "img-small" + (this.state.smallLoaded ? " loaded" : "")
              }
              src={
                this.props.user && Object.keys(this.props.user).length !== 0
                  ? this.state.smallImg
                  : this.props.smallSrc
                    ? this.props.smallSrc
                    : this.props.src.replace(/\.[^.]*$/, "") +
                      "_small" +
                      this.props.src.replace(/.*(?=\.)/, "")
              }
              alt=""
              ref={img => (this.small = img)}
            />
            <div className="scale-ratio" />
            <style jsx>{`
              .image.placeholder {
                position: relative;
                overflow: hidden;
              }

              .image.placeholder.loading {
                background-color: #e0e0e0;
                animation: 1.5s infinite;
              }

              .image.placeholder img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.3s linear;
              }

              .image.placeholder img.loaded {
                opacity: 1;
              }

              .image.placeholder .img-small {
                filter: blur(10px);
                transform: scale(1);
              }

              .image.placeholder .scale-ratio {
                padding-bottom: calc(
                  100% * ${this.state.height}.0 / ${this.state.width}.0
                );
              }
            `}</style>
            <style jsx global>{`
              .image.placeholder img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                transition: opacity 0.3s linear;
              }

              .image.placeholder img.loaded {
                opacity: 1;
              }
            `}</style>
          </div>
        </ReactPlaceholder>
      );
    } else {
      return (
        <div
          className={
            "image placeholder" +
            (this.props.className ? " " + this.props.className : "")
          }
          data-large={
            this.props.user && Object.keys(this.props.user).length !== 0
              ? this.state.image
              : this.props.src
          }
          style={{
            ...this.props.style,
            backgroundImage:
              this.props.user && Object.keys(this.props.user).length !== 0
                ? `this.state.smallImg`
                : this.props.smallSrc
                  ? `url(${this.props.smallSrc})`
                  : `url(${this.props.src.replace(/\.[^.]*$/, "") +
                      "_small" +
                      this.props.src.replace(/.*(?=\.)/, "")})`,
            filter: this.state.largeLoaded
              ? "none"
              : this.state.smallLoaded
                ? "blur(20px)"
                : "none"
            // backgroundAttachment: this.state.largeLoaded ? "fixed" : "unset"
          }}
          onClick={this.props.onClick}
          ref={div => (this.placeholder = div)}
        >
          <div
            className="scale-ratio"
            style={
              {
                // paddingBottom: `calc(100% * ${this.state.height}.0 / ${
                //   this.state.width
                // }.0)`
              }
            }
          />
          <style jsx>{`
            .image.placeholder {
              position: relative;
              background-color: #f6f6f6;
              background-size: 100% 100%;
              background-repeat: no-repeat;
              overflow: hidden;
            }

            .image.placeholder .scale-ratio {
              padding-bottom: calc(100% * ${this.state.height}.0 / ${
            this.state.width
          }.0);
            }
            @media(min-width: 768px),
              @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .image.placeholder {
                  background-attachment: fixed;
                }
                .image.placeholder .scale-ratio {
                  padding-bottom: 33.3%;
                }
              }
            }

            /* @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .image.placeholder {
                background-attachment: fixed;
              }
            } */
          `}</style>
        </div>
      );
    }
  }
}

export default Image;
