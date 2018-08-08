import * as React from "react";
import { Component } from "react";

interface Props {
  toggled: any;
}

interface State {
  checked: boolean;
}

class SwitchToggle extends Component<Props, State> {
  state = {
    checked: null
  };

  toggle = () => {
    this.setState(prevState => ({
      ...prevState,
      checked: prevState.checked ? !prevState.checked : true
    }));

    this.props.toggled(!this.state.checked);
  };

  render() {
    return (
      <div className="SwitchToggle" onClick={this.toggle}>
        <div className={!this.state.checked ? "slider" : "slider checked"}>
          <div className="inner-slider">
            <div className="button" />
            <div className="background" />
          </div>
        </div>
        <style jsx>{`
          .SwitchToggle {
            position: relative;
            display: inline-block;
            height: 1.5rem;
            width: 3.2rem;
            user-select: none;
          }

          .slider {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: #ccc;
            border-radius: 1.2rem;
            transition: all 0.3s;
            overflow: hidden;
            cursor: pointer;
          }

          .slider .inner-slider {
            width: 1.6rem;
            height: 100%;
            transition: all 0.3s;
          }

          .slider.checked .inner-slider {
            width: 100%;
          }

          .slider .inner-slider .button {
            position: absolute;
            display: block;
            z-index: 10;
            top: -0.07rem;
            right: calc(100% - 1.6rem);
            bottom: 0;
            height: 1.65rem;
            width: 1.65rem;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.15);
            transition: all 0.3s;
          }

          .slider.checked .inner-slider .button {
            right: -0.05rem;
          }

          .slider .inner-slider .background {
            height: 100%;
            width: 100%;
            background: #00cc26;
            top: 0;
            left: 0;
            border-top-right-radius: 2rem;
            border-bottom-right-radius: 2rem;
            transition: all 0.3s;
          }
        `}</style>
      </div>
    );
  }
}

export default SwitchToggle;
