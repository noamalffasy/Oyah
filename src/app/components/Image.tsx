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
  responsive?: boolean;
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
  imgLarge: HTMLImageElement = null;

  async componentDidMount() {
    this._mounted = true;
    this.loadImages(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.src !== this.props.src && this._mounted) {
      this.loadImages(nextProps);
    }
  }

  loadImages = (props: Props) => {
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

      if (props.responsive) {
        const smallSrc = props.smallSrc
          ? props.smallSrc.replace("_small.jpeg", "")
          : props.src.replace(".jpeg", "");

        img.srcset = `${smallSrc}/1920px_small.jpeg 1920w, ${smallSrc}/1600px_small.jpeg 1600w, ${smallSrc}/1366px_small.jpeg 1366w, ${smallSrc}/1024px_small.jpeg 1024w, ${smallSrc}/768px_small.jpeg 768w, ${smallSrc}/640px_small.jpeg 640w`;
      } else {
        img.src = props.smallSrc ? props.smallSrc : props.src;
      }

      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true
        }));
      };

      const imgLarge = document.createElement("img");

      if (props.responsive) {
        const largeSrc = props.src.replace(".jpeg", "");
        imgLarge.srcset = `${largeSrc}/1920px.jpeg 1920w, ${largeSrc}/1600px.jpeg 1600w, ${largeSrc}/1366px.jpeg 1366w, ${largeSrc}/1024px.jpeg 1024w, ${largeSrc}/768px.jpeg 768w, ${largeSrc}/640px.jpeg 640w`;
      } else {
        imgLarge.src = props.src;
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
              this.imgLarge ? this.imgLarge.remove() : null;
              this.imgLarge = this.placeholder.appendChild(imgLarge);
              this.src = props.responsive
                ? props.src.replace(".jpeg", "")
                : props.src;
            } else {
              this.placeholder.style.backgroundImage = `url(${imgLarge.src})`;
            }
          }
        );
      };
    }
  };

  src = this.props.src;
  smallSrc = this.props.smallSrc
    ? this.props.smallSrc
    : this.props.src.replace(".jpeg", "_small.jpeg");

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
              (!this.state.largeLoaded ? " loading" : "") +
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
                "img-small" + (!this.state.largeLoaded ? " loaded" : "")
              }
              src={
                this.props.user && Object.keys(this.props.user).length !== 0
                  ? this.state.smallImg
                  : this.smallSrc
                    ? this.smallSrc
                    : this.props.smallSrc
                      ? this.props.smallSrc
                      : this.props.src
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
                background-color: #fff;
                opacity: 1;
              }

              .image.placeholder .img-small {
                filter: blur(10px);
                transform: scale(1.1);
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
                background-color: #fff;
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
            filter: this.state.largeLoaded ? "none" : "blur(20px)"
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
