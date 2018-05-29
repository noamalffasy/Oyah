import * as React from "react";
import { Component } from "react";

interface Props {
  className?: any;
  onClick?: any;
}

class MoreSvg extends Component<Props> {
  render() {
    return (
      <svg
        className={this.props.className ? this.props.className : ""}
        width="124"
        height="28"
        viewBox="0 0 124 28"
        xmlns="http://www.w3.org/2000/svg"
        onClick={this.props.onClick ? this.props.onClick : ""}
      >
        <g id="Symbols" fill="none" fillRule="evenodd">
          <g id="More" fill="#C00">
            <circle id="Oval-2" cx="14" cy="14" r="14" />
            <circle id="Oval-2" cx="62" cy="14" r="14" />
            <circle id="Oval-2" cx="110" cy="14" r="14" />
          </g>
        </g>
      </svg>
    );
  }
}

export default MoreSvg;
