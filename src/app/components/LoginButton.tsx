import * as React from "react";
import { Component } from "react";
import Loading from "./Loading";

interface Props {
  text: string;
  icon: any;
  style?: object;
  onClick: any;
  loading: boolean;
}

class LoginButton extends Component<Props> {
  handleClick = () => {
    this.props.onClick();
  };

  render() {
    const { text, icon: Icon, style, loading } = this.props;

    return (
      <div
        className="LoginButton"
        style={style ? style : {}}
        onClick={this.handleClick}
      >
        <div className="LoginButton-inner">
          {!loading ? (
            <React.Fragment>
              <div className="icon-outer">
                <Icon style={{ width: "100%", height: "100%" }} />
              </div>
              <div className="divider" />
              <div className="text">{text}</div>
            </React.Fragment>
          ) : (
            <Loading />
          )}
        </div>
        <style jsx>{`
          .LoginButton {
            color: #757575;
            background: #fff;
            height: 40px;
            margin: 5px;
            padding: 0 10px;
            border-radius: 3px;
            box-shadow: rgba(0, 0, 0, 0.15) 0 1px 4px;
            overflow: hidden;
            user-select: none;
            cursor: pointer;
          }

          .LoginButton .LoginButton-inner {
            display: flex;
            height: 100%;
            align-items: center;
          }

          .LoginButton .LoginButton-inner .icon-outer {
            display: flex;
            width: 18px;
            height: 18px;
            justify-content: center;
          }

          .LoginButton .divider {
            width: 10px;
          }
        `}</style>
      </div>
    );
  }
}

export default LoginButton;
