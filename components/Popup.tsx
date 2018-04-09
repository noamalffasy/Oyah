import * as React from "react";
import { Component } from "react";

interface Props {
  open: boolean;
}

interface State {
  open: boolean;
  left: number | string;
  right: number | string;
}

class Popup extends Component<Props, State> {
  state = {
    open: false,
    left: "unset",
    right: "unset"
  };

  ctrls: {
    popupWrapper?: HTMLDivElement;
    popup?: HTMLDivElement;
  } = {};

  calcLeftAndRight(popupWrapper, documentElement) {
    return {
      left: popupWrapper.offsetLeft,
      right:
        documentElement.offsetWidth -
        popupWrapper.offsetLeft -
        popupWrapper.offsetWidth
    };
  }

  componentDidMount() {
    const { left, right } = this.calcLeftAndRight(
      this.ctrls.popupWrapper,
      document.documentElement
    );
    this.setState(prevState => ({
      ...prevState,
      left,
      right
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.open === true && this.state.open !== prevState.open) {
      const { left, right } = this.calcLeftAndRight(
        this.ctrls.popupWrapper,
        document.documentElement
      );
      this.setState(prevState => ({
        ...prevState,
        left,
        right
      }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open !== this.state.open) {
      this.setState(prevState => ({
        ...prevState,
        open: nextProps.open
      }));

      if (nextProps.open === true) {
        this.ctrls.popup.focus();
      }
    }
  }

  open = () => {
    this.setState(prevState => ({
      ...prevState,
      open: true
    }));
  };

  close = () => {
    this.setState(prevState => ({
      ...prevState,
      open: false
    }));
  };

  render() {
    return (
      <div
        className={"popup-wrapper" + (!this.state.open ? " hide" : "")}
        style={
          !this.state.open
            ? {
                left: this.state.left,
                right: this.state.right
              }
            : {}
        }
        ref={div => (this.ctrls.popupWrapper = div)}
      >
        <div
          className="popup"
          tabIndex={0}
          onFocus={this.open}
          onBlur={this.close}
          ref={div => (this.ctrls.popup = div)}
        >
          {this.props.children}
        </div>
        <style jsx>{`
          .popup-wrapper {
            position: absolute;
            width: 100%;
            height: unset;
            /* max-height: calc(
              10.5rem + 0.5rem + (0.5rem * 2) + 2rem + 1.5rem + 0.5rem + 1rem
            ); */
            text-align: center;
            padding: 10.5rem 0 0.5rem;
            margin: 0 auto;
            left: 0;
            right: 0;
            z-index: 1000;
            transform: scale(1);
            overflow: hidden;
            transition: all 0.3s;
          }

          .popup-wrapper.hide {
            margin: unset;
            left: unset;
            right: unset;
            transform: scale(0);
          }

          .popup-wrapper .popup {
            /* position: absolute; */
            display: block;
            width: 90%;
            height: unset;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
              Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
            font-size: 1rem;
            text-align: center;
            padding: 0.5rem 1rem;
            margin: 0 auto;
            /* left: 50%; */
            box-shadow: rgba(0, 0, 0, 0.15) 0 4px 4px;
            z-index: 1000;
            outline: 0;
            /* transform: translate(-50%); */
            transform: scale(1);
            transform-origin: top center;
            transition: all 0.3s;
          }

          .popup-wrapper.hide .popup {
            /* transform: scale(0); */
          }

          .popup-wrapper .popup p {
            margin-bottom: 0.5rem;
          }
          @media (min-width: 480px),
            @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
            .popup-wrapper {
              width: 50%;
              left: unset !important;
              right: unset !important;
            }
          }

          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .popup-wrapper {
              width: 30%;
            }
          }

          @media (min-width: 1200px),
            @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
            .popup-wrapper {
              width: 20%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Popup;
