import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

interface Props extends React.Props<Image> {
  src: string;
  alt?: string;
  className?: string;
  fixed?: boolean;
  user?: any;
  onError?: any;
  onClick?: any;
  style?: any;
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
  constructor(props: Props) {
    super(props);

    this.state = {
      smallLoaded: false,
      largeLoaded: false,
      width: 16,
      height: 9
    };
  }

  async componentDidMount() {
    this._mounted = true;
    if (this.props.user && Object.keys(this.props.user).length !== 0) {
      this.setState(prevState => ({
        ...prevState,
        smallImg:
          "/img/users/" + encodeURIComponent(this.props.user.small_image),
        image: "/img/users/" + encodeURIComponent(this.props.user.image)
      }));

      const img = document.createElement("img");
      img.src = this.state.smallImg;
      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true
        }));
      };

      const imgLarge = document.createElement("img");
      if (!this.props.fixed) {
        imgLarge.src = this.props.src;
      } else {
        imgLarge.src =
          "/img" +
          this.props.src.replace(/[^\/]*$/, "") +
          encodeURIComponent(this.props.src.replace(/.*(?=\/)\//, ""));
      }
      imgLarge.onload = () => {
        if (!this.props.fixed) {
          imgLarge.classList.add("loaded");
          this.setState(prevState => ({
            ...prevState,
            width: imgLarge.width,
            height: imgLarge.height
          }));
        } else {
          this.setState(prevState => ({
            ...prevState,
            largeLoaded: true,
            width: imgLarge.width,
            height: imgLarge.height
          }));
        }
      };
      if (!this.props.fixed) {
        findDOMNode(this.placeholder).appendChild(imgLarge);
      } else {
        findDOMNode(this.placeholder).style.backgroundImage = `url(${"/img" +
          imgLarge.src.replace(/[^\/]*$/, "") +
          encodeURIComponent(imgLarge.src.replace(/.*(?=\/)\//, ""))})`;
      }
    } else {
      const img = document.createElement("img");
      img.src =
        this.props.src.replace(/\.[^.]*$/, "") +
        "_small" +
        this.props.src.replace(/.*(?=\.)/, "");
      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true
        }));
      };

      const imgLarge = document.createElement("img");
      if (!this.props.fixed) {
        imgLarge.src = this.props.src;
      } else {
        imgLarge.src =
          "/img" +
          this.props.src.replace(/[^\/]*$/, "") +
          encodeURIComponent(this.props.src.replace(/.*(?=\/)\//, ""));
      }
      imgLarge.onload = () => {
        if (!this.props.fixed) {
          imgLarge.classList.add("loaded");
        }
        this.setState(prevState => ({
          ...prevState,
          largeLoaded: true,
          width: imgLarge.width,
          height: imgLarge.height
        }));
      };
      if (!this.props.fixed) {
        findDOMNode(this.placeholder).appendChild(imgLarge);
      } else {
        findDOMNode(this.placeholder).style.backgroundImage = `url(${
          imgLarge.src
        })`;
      }
    }
    this.src = this.props.src;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.src !== this.props.src && this._mounted) {
      const img = document.createElement("img");
      img.src =
        this.props.user && Object.keys(this.props.user).length !== 0
          ? this.state.smallImg
          : this.props.src.replace(/\.[^.]*$/, "") +
            "_small" +
            this.props.src.replace(/.*(?=\.)/, "");
      img.onload = () => {
        this.setState(prevState => ({
          ...prevState,
          smallLoaded: true
        }));
      };

      const imgLarge = document.createElement("img");
      if (!this.props.fixed) {
        imgLarge.src = nextProps.src;
      } else {
        imgLarge.src =
          "/img" +
          nextProps.src.replace(/[^\/]*$/, "") +
          encodeURIComponent(nextProps.src.replace(/.*(?=\/)\//, ""));
      }
      imgLarge.onload = () => {
        if (!this.props.fixed) {
          imgLarge.classList.add("loaded");
        }
        this.setState(prevState => ({
          ...prevState,
          largeLoaded: true,
          width: imgLarge.width,
          height: imgLarge.height
        }));
      };
      if (!this.props.fixed) {
        findDOMNode(this.placeholder).appendChild(imgLarge);
      } else {
        findDOMNode(this.placeholder).style.backgroundImage = `url(${
          imgLarge.src
        })`;
      }
      this.src = nextProps.src;
    }
  }

  render() {
    if (!this.props.fixed) {
      return (
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
            className={"img-small" + (this.state.smallLoaded ? " loaded" : "")}
            src={
              this.props.user && Object.keys(this.props.user).length !== 0
                ? this.state.smallImg
                : this.props.src.replace(/\.[^.]*$/, "") +
                  "_small" +
                  this.props.src.replace(/.*(?=\.)/, "")
            }
            alt=""
            ref={img => (this.small = img)}
          />
          {/* <div
            style={{
              paddingBottom: `calc(100% * ${this.state.height}.0 / ${this.state.width}.0)`
            }}
          /> */}
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
                ? this.state.smallImg
                : this.props.src.replace(/\.[^.]*$/, "") +
                  "_small" +
                  this.props.src.replace(/.*(?=\.)/, ""),
            filter: this.state.largeLoaded ? "none" : "blur(20px)",
            backgroundAttachment: this.state.largeLoaded ? "fixed" : "unset"
          }}
          onClick={this.props.onClick}
          ref={div => (this.placeholder = div)}
        >
          <div
            style={{
              paddingBottom: `calc(100% * ${this.state.height}.0 / ${
                this.state.width
              }.0)`
            }}
          />
          <style jsx>{`
            .image.placeholder {
              position: relative;
              background-color: #f6f6f6;
              background-size: cover;
              background-repeat: no-repeat;
              overflow: hidden;
            }
          `}</style>
        </div>
      );
    }
  }
}

export default Image;
