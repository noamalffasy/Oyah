import * as React from "react";
import { Component } from "react";

import Loading from "./Loading";

function concatClassNames(...classNames: string[]) {
  let className = "";
  for (let i = 0; i < classNames.length; i++) {
    const arg = classNames[i];
    if (arg !== undefined && arg !== null) {
      if (className === "") {
        className += arg;
      } else {
        className += " " + arg;
      }
    }
  }
  return className;
}

interface Props {
  className?: any;
  primaryText: any;
  primaryAction: any;
  secondaryText?: any;
  secondaryAction?: any;
  secondaryShow?: boolean;
  style?: any;
}

interface State {
  loading: boolean;
}

class ActionButtons extends Component<Props, State> {
  state = { loading: false };

  reset = () => {
    this.setState(prevState => ({
      ...prevState,
      loading: false
    }));
  };

  triggerLoading = () => {
    this.setState(prevState => ({ ...prevState, loading: true }));
  };

  onClick = e => {
    this.props.primaryAction(e, this.triggerLoading);
  };

  render() {
    return (
      <div
        className={concatClassNames(
          "ActionButtons",
          this.props.className,
          this.state.loading ? "loading" : null
        )}
        style={this.props.style}
      >
        <button
          type="button"
          className="btn btn-primary"
          onClick={!this.state.loading ? this.onClick : null}
        >
          {!this.state.loading ? (
            this.props.primaryText
          ) : (
            // <FontAwesomeIcon
            //   icon={faCircleNotch}
            //   spin
            //   style={{ height: "1.3rem", width: "1.3rem" }}
            // />
            <Loading />
          )}
        </button>
        {this.props.secondaryText && (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={this.state.loading}
            style={
              this.props.secondaryShow === undefined ||
              this.props.secondaryShow === true
                ? {}
                : { display: "none" }
            }
            onClick={!this.state.loading ? this.props.secondaryAction : null}
          >
            {this.props.secondaryText}
          </button>
        )}
        <style jsx>{`
          .ActionButtons {
            display: flex;
            padding-top: 0;
            flex-flow: wrap;
            justify-content: center;
            flex-flow: column;
            font-size: inherit;
          }

          .ActionButtons button {
            border: 0;
            background: none;
            cursor: pointer;
            box-shadow: none;
            font-size: inherit;
            outline: 0;
            opacity: 0.8;
            transition: all 0.15s;
          }

          .ActionButtons.loading button {
            cursor: default;
          }

          .ActionButtons:not(.loading) button:hover {
            /* text-decoration: underline; */
            opacity: 1;
          }

          .ActionButtons button:focus {
            box-shadow: none;
            outline: 0;
            background: none;
          }

          .ActionButtons button:active {
            border: 0;
            background: none;
            box-shadow: none;
          }

          .ActionButtons button.btn-primary {
            color: #cc0017;
            order: 1;
            // font-weight: 600;
          }

          .ActionButtons button.btn-secondary {
            color: #7f7f7f;
            // font-weight: 400;
          }
          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .ActionButtons {
              justify-content: flex-end;
              flex-flow: row;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default ActionButtons;
