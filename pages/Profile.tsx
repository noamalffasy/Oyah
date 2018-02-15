import * as React from "react";
import { Component } from "react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Head from "next/head";

import * as userActionCreators from "../actions/user";

import App from "../components/App";

import Image from "../components/Image";

import withData from "../lib/withData";
import { graphql } from "../utils/graphql";
import gql from "graphql-tag";

interface Props {
  data?: any;
  dispatch?: any;
  user?: any;
  signInModal?: any;
}

@graphql(gql`
  {
    currentUser {
      ok
      jwt
      errors {
        field
        message
      }
      user {
        id
        name
        bio
        mains
        reddit
        twitter
      }
    }
  }
`)
class Profile extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = { articles: [] };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { dispatch, user } = nextProps;
    const login = bindActionCreators(userActionCreators.login, dispatch);
    if (
      nextProps.data &&
      !nextProps.data.loading &&
      nextProps.data.currentUser &&
      nextProps.data.currentUser.user !== null &&
      (!this.props.data.currentUser ||
        nextProps.data.currentUser.user !== this.props.data.currentUser.user)
    ) {
      const data = nextProps.data.currentUser;
      if (data.error) {
        if (
          data.error[0].message !== "User is not logged in (or authenticated)."
        ) {
          console.error(data.error);
        }
      } else {
        login({
          ...user,
          ...data.user,
          mains: data.user.mains !== null ? data.user.mains.split(", ") : null
        });
      }
    }
  }

  render() {
    if (Object.keys(this.props.user).length !== 0) {
      return (
        <App {...this.props}>
          <div className="Profile Content">
            <Head>
              <title>{this.props.user.nametag + " | Oyah"}</title>
              <meta
                name="description"
                content={this.props.user.nametag + " profile"}
              />
            </Head>
            <div className="user">
              <div className="info">
                <Image
                  src={
                    this.props.user.image !== null
                      ? "/img/users/" +
                        encodeURIComponent(this.props.user.image)
                      : "/img/User.png"
                  }
                  alt={this.props.user.nametag}
                />
                <h2>{this.props.user.nametag}</h2>
              </div>
              {this.props.user.bio !== null && <p>{this.props.user.bio}</p>}
            </div>
            <table className="other-info">
              <tbody>
                {this.props.user.name !== null &&
                  this.props.user.name !== "" && (
                    <tr>
                      <td>Full Name</td>
                      <td>{this.props.user.name}</td>
                    </tr>
                  )}
                {this.props.user.mains !== null &&
                  this.props.user.mains !== "" && (
                    <tr>
                      <td>Mains</td>
                      <td>{this.props.user.mains}</td>
                    </tr>
                  )}
                {this.props.user.reddit !== null &&
                  this.props.user.reddit !== "" && (
                    <tr>
                      <td>Reddit</td>
                      <td>
                        <a
                          href={
                            "https://reddit.com/u/" + this.props.user.reddit
                          }
                        >
                          <b>u/</b>
                          {this.props.user.reddit}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.props.user.twitter !== null &&
                  this.props.user.twitter !== "" && (
                    <tr>
                      <td>Twitter</td>
                      <td>
                        <a
                          href={
                            "https://twitter.com/" + this.props.user.twitter
                          }
                        >
                          <b>@</b>
                          {this.props.user.twitter}
                        </a>
                      </td>
                    </tr>
                  )}
                {this.props.user.name === null &&
                  this.props.user.mains === null &&
                  this.props.user.reddit === null &&
                  this.props.user.twitter === null && (
                    <tr>
                      <td>No info has been provided yet by the user</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          <style jsx>{`
            .Profile .user {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-flow: column;
            }

            .Profile .user .info {
              display: flex;
              flex-flow: column;
              align-items: center;
              justify-content: center;
            }

            .Profile .user .info h2,
            .Profile .user .info p {
              text-align: center;
            }

            .Profile .user .info h2 {
              font-weight: 400;
              margin: 1rem 0 1.5rem;
              font-size: 2.1rem;
            }

            .Profile .user p {
              margin: 0 1.5rem;
            }

            .Profile .other-info {
              text-align: center;
              margin: 0 auto;
              padding: 0 0 1rem;
            }

            .Profile .other-info td {
              padding: 0.2rem 0.5rem;
            }

            .Profile .other-info td:nth-child(odd) {
              color: #969696;
            }

            .Profile .other-info td:nth-child(even) {
              font-weight: 400;
            }

            .Profile .other-info td {
              display: table-cell;
              vertical-align: middle;
              padding: 0.2rem 0.5rem 2rem;
            }

            .Profile .other-info td {
              padding: 0.5rem 2rem;
            }
            @media (min-width: 480px),
              @media (min-width: 480px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .user .bio {
                max-width: 70%;
              }
            }
            @media (min-width: 576px),
              @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile {
                padding-bottom: 4.5rem;
              }
              .Profile .user .bio {
                max-width: 60%;
              }
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Profile .user {
                flex-flow: row;
              }
              .Profile .user .bio {
                max-width: 40%;
              }
            }
          `}</style>
          <style jsx global>{`
            .Profile .user .info .image {
              display: block;
              margin: 0 auto;
              width: 10rem;
              height: 10rem;
              border-radius: 50%;
            }
          `}</style>
        </App>
      );
    } else {
      return (
        <App {...this.props}>
          <div className="NotLoggedIn Content">
            <Head>
              <title>{"Not logged in | Oyah"}</title>
              <meta name="description" content="Not logged in, Oyah" />
            </Head>
            <h2>Not Logged In</h2>
            <p>You need to login in order to view this page</p>
          </div>
          <style jsx>{`
            .NotLoggedIn {
              text-align: center;
            }

            .NotLoggedIn > h2 {
              font-size: 4rem;
              color: #cc0000;
            }

            .NotLoggedIn > p {
              font-size: 2rem;
            }
          `}</style>
        </App>
      );
    }
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default withData(connect(mapStateToProps, null)(Profile));
