import * as React from "react";
import { Component } from "react";

import { findDOMNode } from "react-dom";

import Textarea from "react-textarea-autosize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Scrollbars from "react-custom-scrollbars";

interface Props extends React.Props<Input> {
  label: string;
  name?: string;
  type: string;
  onChange?: any;
  onKeyPress?: any;
  half?: boolean;
  className?: string;
  value?: string;
  initial_value?: string;
  selections?: string[];
  maxSelections?: number;
  checked?: boolean;
  list?: string[];
  autocomplete?: string;
  spellCheck?: boolean;
  disabled?: boolean;
  style?: any;
}

interface State {
  focus: boolean;
  active: boolean;
  checked: boolean;
  empty: boolean;
  class: string;
  boxOpen: boolean;
  boxTop?: any;
  selections?: string[];
  password?: string;
  showPassword?: boolean;
}

class Input extends Component<Props, State> {
  state = {
    focus: false,
    active: false,
    checked: this.props.checked ? true : false,
    empty:
      this.props.value === "" || this.props.value === undefined
        ? true
        : false || true,
    class: this.props.className ? " " + this.props.className : "",
    boxOpen: false,
    boxTop: "",
    selections: [],
    password: "",
    showPassword: false
  };

  parent: HTMLDivElement = null;
  input: HTMLInputElement | HTMLSpanElement | HTMLTextAreaElement = null;
  textInput: HTMLInputElement = null;
  textarea: HTMLTextAreaElement = null;
  box: Scrollbars | HTMLUListElement = null;

  componentDidMount() {
    if (this.props.value !== "" && this.props.value && !this.state.focus) {
      this.setState({
        focus: true
      });
      (this.input as HTMLInputElement).value = this.props.value;
    }

    if (this.props.value !== "" && this.props.value) {
      (this.input as HTMLInputElement).value = this.props.value;
      this.setState(prevState => ({
        ...prevState,
        focus: true
      }));
    }

    if (
      this.props.initial_value !== "" &&
      this.props.initial_value &&
      !this.state.focus
    ) {
      this.setState(prevState => ({
        ...prevState,
        focus: true
      }));
      (this.input as HTMLInputElement).value = this.props.initial_value;
    }

    if (this.props.initial_value !== "" && this.props.initial_value) {
      (this.input as HTMLInputElement).value = this.props.initial_value;
      this.setState(prevState => ({
        ...prevState,
        focus: true
      }));
    }

    if (
      this.props.type === "dropdown" ||
      this.props.type === "select-dropdown"
    ) {
      this.textarea.setAttribute("readonly", "");
    }

    if (
      this.props.type === "select-dropdown" &&
      this.props.selections !== [] &&
      this.props.selections.length > 0 &&
      this.props.selections[0] !== "" &&
      !this.state.focus
    ) {
      this.setState(prevState => ({
        ...prevState,
        focus: true,
        empty: false
      }));
      this.setState(prevState => ({
        ...prevState,
        selections: this.props.selections
      }));
      findDOMNode(this.box as HTMLUListElement)
        .querySelectorAll("li")
        .forEach((elem, i) => {
          if (
            this.props.selections.filter(
              e => e === elem.querySelector("h2").innerText
            ).length > 0
          ) {
            this["checkbox_" + i].check();
          }
        });
    } else if (
      this.props.type === "select-dropdown" &&
      this.props.selections[0] === ""
    ) {
      this.setState(prevState => ({
        ...prevState,
        focus: false
      }));
      this.textarea.value = "";
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.value !== "" &&
      nextProps !== undefined &&
      nextProps.value !== this.props.value
    ) {
      (this.input as HTMLInputElement).value = nextProps.value;
    }
    if (
      nextProps.value !== "" &&
      nextProps.value !== undefined &&
      !this.state.focus &&
      nextProps.value !== this.props.value
    ) {
      this.setState({
        focus: true
      });
      (this.input as HTMLInputElement).value = nextProps.value;
    } else if (nextProps.value === "" && nextProps.value !== this.props.value) {
      this.setState(prevState => ({
        ...prevState,
        focus: false
      }));
      (this.input as HTMLInputElement).value = "";
    }
    if (
      nextProps.type === "select-dropdown" &&
      nextProps.selections &&
      nextProps.selections !== [] &&
      nextProps.selections.length > 0 &&
      nextProps.selections[0] !== "" &&
      !this.state.focus &&
      nextProps.selections !== this.props.selections
    ) {
      this.setState(prevState => ({
        ...prevState,
        focus: true,
        empty: false
      }));
      this.setState(prevState => ({
        ...prevState,
        selections: nextProps.selections
      }));
      findDOMNode(this.box as HTMLUListElement)
        .querySelectorAll("li")
        .forEach((elem, i) => {
          if (
            nextProps.selections.filter(
              e => e === elem.querySelector("h2").innerText
            ).length > 0
          ) {
            this["checkbox_" + i].check();
          }
        });
    } else if (
      nextProps.type === "select-dropdown" &&
      nextProps.selections &&
      nextProps.selections[0] === "" &&
      nextProps.selections !== this.props.selections
    ) {
      this.setState(prevState => ({
        ...prevState,
        focus: false
      }));
      this.textarea.value = "";
    }
  }

  selectInput = e => {
    e.persist();

    if (this.props.type !== "checkbox") {
      this.setState(prevState => ({
        ...prevState,
        focus: true,
        active: true
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        checked: !this.state.checked
      }));
    }
  };

  deselectInput = e => {
    e.persist();

    if (!this.isEmpty()) {
      this.setState(prevState => ({
        ...prevState,
        focus: true,
        active: false
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        focus: false,
        active: false
      }));
    }
  };

  check = () => {
    if (this.props.type === "checkbox") {
      this.setState(prevState => ({
        ...prevState,
        checked: !this.state.checked
      }));
    } else {
      console.error(this.props.name + " is not a checkbox");
    }
  };

  isChecked = () => {
    if (this.props.type === "checkbox") {
      return this.state.checked;
    } else {
      console.error(this.props.name + " is not a checkbox");
    }
  };

  isEmpty = () => {
    if (this.props.type !== "select-dropdown") {
      if (
        (this.input as HTMLInputElement).value === "" ||
        (this.input as HTMLInputElement).value === undefined
      ) {
        return true;
      }
    } else {
      if (this.state.selections && this.state.selections.length > 0) {
        return true;
      }
    }
    return false;
  };

  reset = () => {
    if (this.props.type !== "checkbox") {
      (this.input as HTMLInputElement).value = "";

      if (this.props.type === "password") {
        const input = this.textInput;
        (this.input as HTMLInputElement).value = "";
        input.value = "";

        this.setState(prevState => ({
          ...prevState,
          password: ""
        }));
      }

      this.setState(prevState => ({
        ...prevState,
        focus: false,
        active: false
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        checked: false
      }));
    }
  };

  render() {
    switch (this.props.type) {
      case "dropdown":
        return (
          <div
            className={
              "Input dropdown" +
              (this.state.empty ? " empty" : "") +
              (this.state.focus ? " focus" : "") +
              (this.props.half ? " half" : "") +
              this.state.class
            }
            style={this.props.style}
            onClick={() =>
              this.setState(prevState => ({
                ...prevState,
                boxOpen: !this.state.boxOpen
              }))
            }
          >
            <label
              className={this.state.active ? "focus" : ""}
              htmlFor={this.props.type}
              onClick={e => {
                e.preventDefault();

                const input = this.input;
                (input as HTMLSpanElement).focus();
              }}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              {this.props.label}
            </label>
            <span
              className={this.state.active ? "focus" : ""}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
              ref={input => (this.input = input)}
            >
              {this.state.selections}
            </span>
            <ul
              className="box"
              style={this.state.boxOpen ? {} : { maxHeight: 0 }}
              ref={box => (this.box = box)}
            >
              {this.props.list.map(elem => {
                return (
                  <li
                    onClick={(e: any) => {
                      this.setState(prevState => ({
                        ...prevState,
                        selections: e.target.innerHTML,
                        focus: true,
                        empty: false
                      }));
                    }}
                  >
                    {elem}
                  </li>
                );
              })}
            </ul>

            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }

              .Input label {
                display: block;
                position: absolute;
                z-index: 5;
                color: rgba(0, 0, 0, 0.4);
                white-space: nowrap;
                cursor: inherit;
                transition: all 0.3s;
                transform-origin: left top;
              }

              .Input.focus label {
                transform: translateY(-75%) scale(0.75);
              }

              .Input label.focus {
                color: #cc0000;
              }

              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                margin: -0.15rem 0 0 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }

              .Input span input {
                border: 0;
                position: relative;
                width: 100%;
                width: 100%;
                outline: 0;
                background: none;
                box-shadow: none;
              }

              .Input span input:-webkit-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-moz-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-o-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-khtml-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input,
              .Input span input::placeholder {
                color: #131313;
              }

              .Input span input::selection {
                color: #fff;
                -webkit-text-fill-color: #fff;
                background: #cc0000;
              }
              .Input.dropdown {
                outline: 0;
                cursor: pointer;
              }

              .Input.dropdown span textarea {
                padding: 0 1.5rem 0 0;
                pointer-events: none;
              }

              .Input.dropdown::after {
                content: "";
                position: absolute;
                top: 50%;
                right: 0.5rem;
                transform: translateY(-50%);
                background-image: url(https://storage.googleapis.com/oyah.xyz/assets/img/Arrow.svg);
                background-size: 0.6rem;
                background-repeat: no-repeat;
                background-position: center center;
                width: 1rem;
                height: 1rem;
                transition: all 0.3s;
              }

              .Input.dropdown.open::after {
                transform: scaleY(-1) translateY(50%);
              }

              .Input.dropdown .box-wrapper {
                position: absolute;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 2px;
                padding: 0.2rem 0.3rem;
                margin: 0.2rem 0;
                width: 100%;
                z-index: 1000;
                transition: all 0.3s;
              }

              .Input.dropdown .box {
                text-align: left;
                list-style: none;
                padding: 0;
                /* max-height: calc(1.9rem*5); */
                overflow-y: auto;
                transition: all 0.3s;
                cursor: default;
              }

              .Input.dropdown .box li {
                padding: 0.2rem 0.3rem;
                transition: all 0.15s;
                cursor: pointer;
              }

              .Input.dropdown .box li.disabled {
                opacity: 0.4;
                cursor: default;
              }

              .Input.dropdown .box li:not(.disabled):hover {
                background: rgb(236, 236, 236);
              }

              .Input.dropdown .box li .Input.checkbox {
                float: none;
                margin: 0 0.5rem 0 0;
                vertical-align: middle;
              }

              .Input.dropdown .box li h2 {
                font-size: 1rem;
                display: inline-block;
                vertical-align: middle;
                font-weight: normal;
                margin: 0;
              }
            `}</style>
          </div>
        );
      case "select-dropdown":
        return (
          <div
            className={
              "Input dropdown" +
              (this.state.empty ? " empty" : "") +
              (this.state.focus || this.state.active ? " focus" : "") +
              (this.state.active ? " open dropdown-flip" : "") +
              (this.props.half ? " half" : "") +
              this.state.class
            }
            tabIndex={0}
            style={this.props.style}
            onClick={(e: any) => {
              if (
                !findDOMNode(this.box as HTMLUListElement).contains(e.target)
              ) {
                if (this.state.empty) {
                  this.setState(prevState => ({
                    ...prevState,
                    active: !this.state.active,
                    focus: false
                  }));
                } else {
                  this.setState(prevState => ({
                    ...prevState,
                    active: !this.state.active
                  }));
                }
              }
            }}
            onBlur={() => {
              this.setState(prevState => ({
                ...prevState,
                active: false
              }));
            }}
            ref={parent => (this.parent = parent)}
          >
            <label
              className={this.state.active ? "focus" : ""}
              htmlFor={this.props.type}
              onClick={e => {
                e.preventDefault();

                this.input.focus();
              }}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              {this.props.label}
            </label>
            <span
              className={this.state.active ? "focus" : ""}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
              ref={input => (this.input = input)}
            >
              <Textarea
                id={this.props.label}
                required
                spellCheck={false}
                value={this.state.selections.join(", ") || ""}
                onChange={e => {
                  (this.input as HTMLTextAreaElement).value = e.target.value;
                }}
                inputRef={input => {
                  this.textarea = input;
                }}
              />
            </span>
            <div
              className="box-wrapper"
              style={{
                height: this.state.active ? "calc(1.9rem * 5)" : 0,
                padding: this.state.active ? ".2rem .3rem" : 0,
                top: this.state.boxTop ? this.state.boxTop : ""
              }}
            >
              <Scrollbars
                renderView={props => (
                  <ul
                    {...props}
                    className="box"
                    style={{ ...props.style, marginBottom: "0" }}
                    onClick={() =>
                      this.setState(prevState => ({
                        ...prevState,
                        active: true
                      }))
                    }
                  />
                )}
                ref={box => (this.box = box)}
              >
                {this.props.list.map((elem, i) => {
                  return (
                    <li
                      className={
                        this.state.selections.length >=
                          this.props.maxSelections &&
                        !this["checkbox_" + i].isChecked()
                          ? "disabled"
                          : ""
                      }
                      onClick={(e: any) => {
                        if (
                          (this.state.selections.length <
                            this.props.maxSelections &&
                            this.props.maxSelections) ||
                          !this.props.maxSelections
                        ) {
                          const text = e.target.contains(
                            e.target.querySelector("h2")
                          )
                            ? e.target.querySelector("h2")
                            : e.target.parentElement.querySelector("h2") !==
                              null
                              ? e.target.parentElement.querySelector("h2")
                              : e.target.parentElement.parentElement.querySelector(
                                  "h2"
                                );
                          this.setState(prevState => ({
                            ...prevState,
                            selections: !this["checkbox_" + i].isChecked()
                              ? [...this.state.selections, text.innerText]
                              : this.state.selections.filter(
                                  e => e !== text.innerHTML
                                ),
                            focus: true,
                            empty: false
                          }));

                          if (
                            this["checkbox_" + i].isChecked() &&
                            this.state.selections.filter(
                              e => e !== text.innerHTML
                            ).length === 0
                          ) {
                            this.setState(prevState => ({
                              ...prevState,
                              empty: true,
                              focus: false
                            }));
                          }

                          this["checkbox_" + i].check();
                        } else {
                          const text = e.target.contains(
                            e.target.querySelector("h2")
                          )
                            ? e.target.querySelector("h2")
                            : e.target.parentElement.querySelector("h2") !==
                              null
                              ? e.target.parentElement.querySelector("h2")
                              : e.target.parentElement.parentElement.querySelector(
                                  "h2"
                                );
                          this.setState(prevState => ({
                            ...prevState,
                            selections: !this["checkbox_" + i].isChecked()
                              ? this.state.selections
                              : this.state.selections.filter(
                                  e => e !== text.innerHTML
                                ),
                            focus: true,
                            empty: false
                          }));
                          this["checkbox_" + i].isChecked()
                            ? this["checkbox_" + i].check()
                            : "";
                        }
                      }}
                      key={i}
                    >
                      <Input
                        type="checkbox"
                        label=""
                        {...[
                          this.state.selections.length >=
                          this.props.maxSelections
                            ? "disabled"
                            : ""
                        ]}
                        ref={checkbox => (this["checkbox_" + i] = checkbox)}
                      />
                      <h2>{elem}</h2>
                    </li>
                  );
                })}
              </Scrollbars>
            </div>
            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }

              .Input label {
                display: block;
                position: absolute;
                z-index: 5;
                color: rgba(0, 0, 0, 0.4);
                white-space: nowrap;
                cursor: inherit;
                transition: all 0.3s;
                transform-origin: left top;
              }

              .Input.focus label {
                transform: translateY(-75%) scale(0.75);
              }

              .Input label.focus {
                color: #cc0000;
              }

              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                margin: -0.15rem 0 0 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }

              .Input.dropdown::after {
                content: "";
                position: absolute;
                top: 50%;
                right: 0.5rem;
                transform: translateY(-50%);
                background-image: url(https://storage.googleapis.com/oyah.xyz/assets/img/Arrow.svg);
                background-size: 0.6rem;
                background-repeat: no-repeat;
                background-position: center center;
                width: 1rem;
                height: 1rem;
                transition: all 0.3s;
              }

              .Input.dropdown.open::after {
                transform: scaleY(-1) translateY(50%);
              }

              .Input.dropdown .box-wrapper {
                position: absolute;
                background: #fff;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
                border-radius: 2px;
                padding: 0.2rem 0.3rem;
                margin: 0.2rem 0;
                width: 100%;
                z-index: 1000;
                transition: all 0.3s;
              }
            `}</style>
            <style jsx global>{`
              .Input span textarea {
                position: relative;
                width: 100%;
                outline: 0;
                border: 0;
                background: none;
                box-shadow: none;
                resize: none;
              }

              .Input span textarea:-webkit-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-moz-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-o-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-khtml-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea,
              .Input span textarea::placeholder {
                color: #131313;
              }

              .Input span textarea::selection {
                color: #fff;
                -webkit-text-fill-color: #fff;
                background: #cc0000;
              }

              .Input.dropdown {
                outline: 0;
                cursor: pointer;
              }

              .Input.dropdown span textarea {
                padding: 0 1.5rem 0 0;
                pointer-events: none;
              }

              .Input.dropdown .box {
                text-align: left;
                list-style: none;
                padding: 0;
                /* max-height: calc(1.9rem*5); */
                overflow-y: auto;
                overflow-x: unset !important;
                transition: all 0.3s;
                cursor: default;
              }

              .Input.dropdown .box li {
                padding: 0.2rem 0.3rem;
                transition: all 0.15s;
                cursor: pointer;
              }

              .Input.dropdown .box li.disabled {
                opacity: 0.4;
                cursor: default;
              }

              .Input.dropdown .box li:not(.disabled):hover {
                background: rgb(236, 236, 236);
              }

              .Input.dropdown .box li .Input.checkbox {
                float: none;
                margin: 0 0.5rem 0 0;
                vertical-align: middle;
              }

              .Input.dropdown .box li h2 {
                font-size: 1rem;
                display: inline-block;
                vertical-align: middle;
                font-weight: normal;
                margin: 0;
              }
            `}</style>
          </div>
        );
      case "checkbox":
        return (
          <div
            className={
              "Input checkbox" +
              (this.state.checked ? " checked" : "") +
              (this.props.half ? " half" : "") +
              this.state.class
            }
            style={this.props.style}
            onClick={!this.props.disabled ? this.selectInput : () => {}}
          >
            <span />
            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }
              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                margin: -0.15rem 0 0 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }

              .Input.checkbox {
                display: inline-block;
                font-family: Verdana;
                font-size: 12px;
                width: 1.5rem;
                height: 1.5rem;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 2px;
                cursor: pointer;
                background: #fff;
                padding: 0.2rem 0.3rem;
                position: relative;
                margin: 0.2rem 0.5rem 0 0;
              }

              .Input.checkbox span::after {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 50%;
                left: 50%;
                height: 12px;
                width: 12px;
                padding: 0;
                margin: -6px 0 0 -6px;
                content: "\\2713";
                font-weight: bold;
                font-size: 1rem;
                color: #cc0000;
                border: 0;
                transform: scaleX(0);
                transform-origin: center center;
                transition: all 0.3s;
              }

              .Input.checkbox.checked span::after {
                transform: scaleX(1);
              }
            `}</style>
          </div>
        );
      case "textarea":
        return (
          <div
            className={
              this.state.focus
                ? this.props.half
                  ? "Input focus half" + this.state.class
                  : "Input focus" + this.state.class
                : this.props.half
                  ? "Input half" + this.state.class
                  : "Input" + this.state.class
            }
            style={this.props.style}
          >
            <label
              className={this.state.active ? "focus" : ""}
              htmlFor={this.props.label}
              onClick={e => {
                e.preventDefault();

                this.input.focus();
              }}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              {this.props.label}
            </label>
            <span
              className={this.state.active ? "focus" : ""}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              <Textarea
                id={this.props.label}
                required
                spellCheck={this.props.spellCheck || true}
                onChange={e => {
                  (this.input as HTMLTextAreaElement).value = e.target.value;
                }}
                inputRef={input => {
                  this.input = input;
                }}
              />
            </span>
            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }

              .Input label {
                display: block;
                position: absolute;
                z-index: 5;
                color: rgba(0, 0, 0, 0.4);
                white-space: nowrap;
                cursor: inherit;
                transition: all 0.3s;
                transform-origin: left top;
              }

              .Input.focus label {
                transform: translateY(-75%) scale(0.75);
              }

              .Input label.focus {
                color: #cc0000;
              }

              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                /* margin: -0.15rem 0 0 0; */
                margin: 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }
              @media screen and (-webkit-min-device-pixel-ratio: 0) {
                .Input span input {
                  padding: 0;
                }
              }
              @media (min-width: 768px),
                @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .Input.half:last-of-type {
                  margin-right: 0;
                  width: 50%;
                }
                .Input.half {
                  width: calc(50% - 1rem);
                  float: left;
                  margin-right: 1rem;
                }
              }
            `}</style>
            <style jsx global>{`
              .Input span textarea {
                position: relative;
                width: 100%;
                outline: 0;
                border: 0;
                background: none;
                box-shadow: none;
                resize: none;
              }

              .Input span textarea:-webkit-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-moz-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-o-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea:-khtml-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span textarea,
              .Input span textarea::placeholder {
                color: #131313;
              }

              .Input span textarea::selection {
                color: #fff;
                -webkit-text-fill-color: #fff;
                background: #cc0000;
              }
            `}</style>
          </div>
        );
      case "password":
        return (
          <div
            className={
              this.state.focus
                ? this.props.half
                  ? "Input focus half" + this.state.class
                  : "Input focus" + this.state.class
                : this.props.half
                  ? "Input half" + this.state.class
                  : "Input" + this.state.class
            }
            style={this.props.style}
          >
            <label
              className={this.state.active ? "focus" : ""}
              htmlFor={this.props.type}
              onClick={e => {
                e.preventDefault();

                const input = this.input;
                (input as HTMLInputElement).focus();
              }}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              {this.props.label}
            </label>
            <span
              className={this.state.active ? "focus" : ""}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              <input
                id={this.props.type}
                name={this.props.type}
                type="password"
                value={this.state.password || ""}
                autoComplete={this.props.autocomplete}
                required
                style={
                  this.state.showPassword
                    ? { display: "none" }
                    : { display: "" }
                }
                onChange={e => {
                  e.persist();
                  this.setState(prevState => ({
                    ...prevState,
                    password: e.target.value
                  }));
                }}
                ref={input => {
                  this.input = input;
                }}
              />

              <input
                id={this.props.type}
                name={this.props.type}
                type="text"
                value={this.state.password || ""}
                autoComplete={this.props.autocomplete}
                required
                style={
                  this.state.showPassword
                    ? { display: "" }
                    : { display: "none" }
                }
                onChange={e => {
                  e.persist();
                  this.setState(prevState => ({
                    ...prevState,
                    password: e.target.value
                  }));
                }}
                ref={input => {
                  this.textInput = input;
                }}
              />

              <a
                href=""
                className="toggle-password"
                onMouseDown={e => e.preventDefault()}
                onClick={e => {
                  e.preventDefault();
                  !this.state.showPassword
                    ? this.textInput.focus()
                    : (this.input as HTMLInputElement).focus();
                  this.setState(prevState => ({
                    ...prevState,
                    showPassword: !this.state.showPassword
                  }));
                }}
                tabIndex={-1}
              >
                {this.state.showPassword ? (
                  <FontAwesomeIcon icon="eye-slash" />
                ) : (
                  <FontAwesomeIcon icon="eye" />
                )}
              </a>
            </span>
            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }

              .Input label {
                display: block;
                position: absolute;
                z-index: 5;
                color: rgba(0, 0, 0, 0.4);
                white-space: nowrap;
                cursor: inherit;
                transition: all 0.3s;
                transform-origin: left top;
              }

              .Input.focus label {
                transform: translateY(-75%) scale(0.75);
              }

              .Input label.focus {
                color: #cc0000;
              }

              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                margin: -0.15rem 0 0 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }

              .Input span input {
                border: 0;
                position: relative;
                width: 100%;
                width: 100%;
                outline: 0;
                background: none;
                box-shadow: none;
              }

              .Input span input:-webkit-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-moz-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-o-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-khtml-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input,
              .Input span input::placeholder {
                color: #131313;
              }

              .Input span input::selection {
                color: #fff;
                -webkit-text-fill-color: #fff;
                background: #cc0000;
              }
              .Input span a.toggle-password {
                position: absolute;
                right: 0;
              }
              @media screen and (-webkit-min-device-pixel-ratio: 0) {
                .Input span input {
                  padding: 0;
                }
              }
              @media (min-width: 768px),
                @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .Input.half:last-of-type {
                  margin-right: 0;
                  width: 50%;
                }
                .Input.half {
                  width: calc(50% - 1rem);
                  float: left;
                  margin-right: 1rem;
                }
              }
            `}</style>
            <style jsx global>{`
              .Input span a svg {
                max-width: 1rem;
              }
            `}</style>
          </div>
        );
      default:
        return (
          <div
            className={
              this.state.focus
                ? this.props.half
                  ? "Input focus half" + this.state.class
                  : "Input focus" + this.state.class
                : this.props.half
                  ? "Input half" + this.state.class
                  : "Input" + this.state.class
            }
            style={this.props.style}
          >
            <label
              className={this.state.active ? "focus" : ""}
              htmlFor={this.props.type}
              onClick={e => {
                e.preventDefault();

                const input = this.input;
                (input as HTMLInputElement).focus();
              }}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              {this.props.label}
            </label>
            <span
              className={this.state.active ? "focus" : ""}
              onFocus={this.selectInput}
              onBlur={this.deselectInput}
            >
              <input
                id={this.props.type}
                name={this.props.type}
                type={this.props.type}
                autoComplete={this.props.autocomplete}
                onChange={this.props.onChange ? this.props.onChange : () => {}}
                onKeyPress={this.props.onKeyPress}
                required
                ref={input => {
                  this.input = input;
                }}
              />
            </span>
            <style jsx>{`
              .Input {
                margin-bottom: 2rem;
                position: relative;
                width: 100%;
                cursor: text;
              }

              .Input label {
                display: block;
                position: absolute;
                z-index: 5;
                color: rgba(0, 0, 0, 0.4);
                white-space: nowrap;
                cursor: inherit;
                transition: all 0.3s;
                transform-origin: left top;
              }

              .Input.focus label {
                transform: translateY(-75%) scale(0.75);
              }

              .Input label.focus {
                color: #cc0000;
              }

              .Input span {
                border-bottom: 1px solid rgba(0, 0, 0, 0.4);
                padding-bottom: 2px;
              }

              .Input span::after {
                content: "";
                display: block;
                transform: scaleX(0);
                margin: -0.15rem 0 0 0;
                border-bottom: 2px solid #cc0000;
                width: 100%;
                transition: all 0.3s;
              }

              .Input span.focus::after {
                transform: scaleX(1);
              }

              .Input span input {
                border: 0;
                position: relative;
                width: 100%;
                width: 100%;
                outline: 0;
                background: none;
                box-shadow: none;
              }

              .Input span input:-webkit-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-moz-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-o-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input:-khtml-autofill {
                background: none !important;
                color: #131313 !important;
                -webkit-text-fill-color: #131313;
                box-shadow: 0 0 0px 1000px white inset;
              }

              .Input span input,
              .Input span input::placeholder {
                color: #131313;
              }

              .Input span input::selection {
                color: #fff;
                -webkit-text-fill-color: #fff;
                background: #cc0000;
              }
              @media screen and (-webkit-min-device-pixel-ratio: 0) {
                .Input span input {
                  padding: 0;
                }
              }
              @media (min-width: 768px),
                @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
                .Input.half:last-of-type {
                  margin-right: 0;
                  width: 50%;
                }
                .Input.half {
                  width: calc(50% - 1rem);
                  float: left;
                  margin-right: 1rem;
                }
              }
            `}</style>
          </div>
        );
    }
  }
}

export default Input;
