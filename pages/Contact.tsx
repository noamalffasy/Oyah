import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";
import Head from "next/head";

import App from "../components/App";

import Input from "../components/Input";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import withData from "../lib/withData";

interface Props {
  user?: any;
  signInModal?: any;
  sendMail?: any;
}

interface State {
  error: any;
  message: string;
  title?: any;
}

@graphql(
  gql`
    mutation sendMail(
      $name: String!
      $email: String!
      $subject: String!
      $message: String!
    ) {
      sendMail(
        name: $name
        email: $email
        subject: $subject
        message: $message
      ) {
        status
      }
    }
  `,
  {
    name: "sendMail"
  }
)
class Contact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { error: false, message: "" };

    this.reset = this.reset.bind(this);
    this.send = this.send.bind(this);
  }

  reset(e: any = undefined) {
    if (e) {
      e.preventDefault();
    }

    this.name.reset();
    this.email.reset();
    this.subject.reset();
    this.message.reset();
  }

  send(e: any) {
    e.preventDefault();

    if (
      !this.name.isEmpty() &&
      !this.email.isEmpty() &&
      !this.subject.isEmpty() &&
      !this.message.isEmpty()
    ) {
      this.setState(prevState => ({
        ...prevState,
        error: false
      }));
      this.props
        .sendMail({
          variables: {
            name: this.name.input.value,
            email: this.email.input.value,
            subject: this.subject.input.value,
            message: this.message.input.value
          }
        })
        .then((res: any) => {
          if (res.error) {
            console.error(res.error);
          } else {
            console.log(res);
            const data = res.data.sendMail;
            // this.props.cookies.set("token", data.token);

            this.reset();

            this.setState(prevState => ({
              ...prevState,
              error: false,
              title: data.status ? "Success" : "Error",
              message: data.status
                ? "The message has been successfully sent!"
                : "The message wasn't sent because of an error"
            }));
          }
        })
        .catch((err: Error) => {
          console.error(err);
        });
    } else {
      this.setState((prevState: State) => ({
        ...prevState,
        error: "Fill all the fields"
      }));
    }
  }

  render() {
    if (this.state.message === "") {
      return (
        <App {...this.props}>
          <Head>
            <title>Contact Us | Oyah</title>
            <meta name="description" content="Contact us, Oyah" />
          </Head>
          <div className="Contact Content">
            <form>
              <div
                className={
                  this.state.error
                    ? "alert alert-danger fade show"
                    : "alert alert-danger alert-dismissible fade hide"
                }
                role="alert"
                style={
                  !this.state.error
                    ? {
                        maxHeight: 0,
                        padding: 0,
                        margin: 0
                      }
                    : { maxHeight: "5rem" }
                }
              >
                {this.state.error}
              </div>
              <Input
                label="Name"
                type="string"
                ref={input => {
                  this.name = input;
                }}
              />
              <Input
                label="Email"
                type="email"
                ref={input => {
                  this.email = input;
                }}
              />
              <Input
                label="Subject"
                type="string"
                ref={input => {
                  this.subject = input;
                }}
              />
              <Input
                label="Message"
                type="textarea"
                ref={input => {
                  this.message = input;
                }}
              />
              <div className="action-buttons">
                <button className="secondary" onClick={this.reset}>
                  Reset
                </button>
                <button className="primary" onClick={this.send}>
                  Send
                </button>
              </div>
            </form>
          </div>
          <style jsx>{`
            .alert.alert-danger {
              position: absolute;
              border-radius: 0;
              border: 0;
              background-color: rgb(204, 84, 84);
              color: #fff;
              text-align: center;
              top: -4rem;
              width: 100%;
              opacity: 1;
              cursor: default;
              transition: all 0.3s;
            }

            .alert.alert-danger.fade.show {
              top: 0;
            }

            .alert.alert-danger button.close {
              color: #fff;
              font-weight: 400;
              opacity: 1;
              cursor: pointer;
            }

            .Content {
              padding-bottom: 4.5rem;
            }

            .Content::after {
              content: "";
              clear: both;
              display: block;
            }

            .Contact {
              text-align: center;
            }

            .Contact form {
              margin: 0 auto;
            }

            .Contact .alert {
              border: 0;
              padding: 0;
              background: none;
              color: #ec0000;
              margin-bottom: 1.5rem;
            }

            .Contact p:last-of-type {
              margin-bottom: 0.5rem;
            }

            .Contact .action-buttons {
              display: flex;
              flex-direction: row;
              float: right;
            }

            .Contact .action-buttons button {
              background: none;
              border: 0;
              outline: 0;
              box-shadow: none;
              opacity: 0.8;
              transition: all 0.15s;
            }

            .Contact .action-buttons button:hover {
              /* text-decoration: underline; */
              opacity: 1;
            }

            .Contact .action-buttons button.primary {
              margin: 1rem 0 1rem 1rem;
              cursor: pointer;
              color: #cc0000;
            }

            .Contact .action-buttons button.secondary {
              margin: 1rem;
              cursor: pointer;
              color: #7f7f7f;
            }
            @media (min-width: 576px) {
              .Content {
                padding-bottom: 3.5rem;
              }
              .Contact form {
                width: 80%;
              }
            }
            @media (min-width: 768px) {
              .Contact form {
                width: 70%;
              }
            }
            @media (min-width: 992px) {
              .Contact form {
                width: 50%;
              }
            }      
          `}</style>
        </App>
      );
    } else {
      return (
        <App {...this.props}>
          <div className="Contact Content">
            <h2>{this.state.title}</h2>
            <p>{this.state.message}</p>
          </div>
          <style jsx>
            {`
              .Contact {
                text-align: center;
              }
              .Contact > h2 {
                font-size: 4rem;
                color: #cc0000;
              }

              .Contact > p {
                font-size: 2rem;
              }
            `}
          </style>
        </App>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user
});

export default withData(connect(mapStateToProps, null)(Contact));
