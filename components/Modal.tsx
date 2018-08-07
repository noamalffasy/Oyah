import * as React from "react";
import { Component } from "react";

import ActionButtons from "./ActionButtons";

interface Props {
  title: string;
  primaryText: string;
  primaryAction: any;
  secondaryText: string;
  isOpen: any;
  onToggle: any;
}

interface State {
  popup: boolean;
}

class Modal extends Component<Props, State> {
  state = { popup: false };

  ActionButtons: ActionButtons = null;
  popup: HTMLDivElement = null;

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.isOpen !== this.props.isOpen && nextProps.isOpen !== false) {
      this.setState((prevState: any) => ({
        ...prevState,
        ...nextProps.isOpen,
        popup: true
      }));
    }
  }

  componentDidUpdate(_, prevState) {
    if (this.state.popup !== prevState.popup) {
      this.props.onToggle(this.state.popup);
    }
  }

  render() {
    return (
      <div
        className="modal"
        role="dialog"
        style={{
          visibility: this.state.popup ? "visible" : "collapse",
          opacity: this.state.popup ? 1 : 0
        }}
        onClick={(e: any) => {
          if (!this.popup.contains(e.target)) {
            this.setState(prevState => ({
              ...prevState,
              popup: false
            }));
          }
        }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={!this.state.popup ? { marginTop: "-10rem" } : {}}
          ref={div => {
            this.popup = div;
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.props.title}</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState((prevState: any) => ({
                    ...prevState,
                    popup: false
                  }));
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{this.props.children}</div>
            <div className="modal-footer">
              <ActionButtons
                primaryText={this.props.primaryText}
                primaryAction={this.props.primaryAction}
                secondaryText={this.props.secondaryText}
                secondaryAction={e => {
                  e.preventDefault();
                  this.setState(prevState => ({
                    ...prevState,
                    popup: false
                  }));
                }}
                ref={btns => (this.ActionButtons = btns)}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .modal {
            display: block !important;
            opacity: 0;
            background: rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
          }

          .modal .modal-dialog {
            transition: all 0.3s;
          }

          .modal .modal-content,
          .modal .modal-content .modal-header,
          .modal .modal-content .modal-footer {
            border: 0;
          }

          .modal .modal-content {
            border-radius: 0;
            box-shadow: 0 0.3125rem 1rem 0 rgba(0, 0, 0, 0.24);
          }

          .modal .modal-content .modal-header button.close {
            outline: 0;
          }

          .modal .modal-content .modal-body {
            width: 90%;
            margin: 0 auto;
            padding-bottom: 0;
            max-height: 20rem;
            transition: all 0.3s;
          }

          .modal .modal-content .modal-body {
            padding: 15px;
          }
        `}</style>
      </div>
    );
  }
}

export default Modal;
