import * as React from "react";
import { Component } from "react";

interface Props {
  className?: any;
  onClick?: any;
}

class Arrow extends Component<Props> {
  render() {
    return (
      <svg
        className={this.props.className ? this.props.className : ""}
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="13"
        viewBox="0 0 22 13"
        onClick={this.props.onClick ? this.props.onClick : () => {}}
      >
        <polygon
          fill="#C31A00"
          points="0 1.33068458 10.9466326 13 22.0176345 1.33068458 20.7902166 0 10.9466326 10.0147463 1.46036815 0"
          id="Arrow"
          fillRule="evenodd"
        />
      </svg>
    );
  }
}

export default Arrow;
