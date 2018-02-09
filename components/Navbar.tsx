import * as React from "react";
import { Component } from "react";

import Link from "next/link";
import { withRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Image from "./Image";
import Input from "./Input";

// GraphQL
import graphql from "../utils/graphql";
import gql from "graphql-tag";

import { faSearch } from "@fortawesome/fontawesome-free-solid";
import { findDOMNode } from "react-dom";

interface Props {
  url: any;
  container: any;
  logout: any;
  login: any;
  user: any;
  openSignInModal: any;
  closeSignInModal: any;
  searchArticle?: any;
}

@graphql(
  gql`
    mutation searchArticle($searchTerm: String!) {
      searchArticle(searchTerm: $searchTerm) {
        id
        title
      }
    }
  `,
  {
    name: "searchArticle"
  }
)
class Navbar extends Component<Props, any> {
  constructor(props: Props, context: any) {
    super(props, context);

    this.state = { focus: false, container: props.container, searchTerm: "" };

    this.addContainer = this.addContainer.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.addContainer(this.props);

    if (this.props.url.pathname === "/Search") {
      this.setState((prevState: any) => ({
        ...prevState,
        searchTerm: this.props.url.query.q
      }));
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.url !== this.props.url) {
      this.addContainer(nextProps);
    }
  }

  addContainer(props: any) {
    const url = props.url;
    if (
      (url.pathname === "/article" || url.pathname === "/WriteArticle") &&
      this.state.container === true
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        container: false
      }));
    } else if (
      url.pathname !== "/article" &&
      url.pathname !== "/WriteArticle" &&
      this.state.container === false
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        container: true
      }));
    }
  }

  onFocus() {
    this.setState((prevState: any) => ({
      ...prevState,
      focus: true
    }));
  }

  onBlur() {
    this.setState((prevState: any) => ({
      ...prevState,
      focus: false
    }));
  }

  search(e: any) {
    e.preventDefault();

    const searchTerm = this.input.input.value;

    this.props.url.push("/search?q=" + encodeURI(searchTerm));

    // this.props
    //   .searchArticle({
    //     variables: {
    //       searchTerm
    //     }
    //   })
    //   .then((res: any) => {
    //     if (res.errors) {
    //       res.errors.forEach((error: any) => {
    //         console.error(error);
    //       });
    //     } else {
    //       const data = res.data.searchArticle;
    //       console.log(data);
    //     }
    //   });
  }

  render() {
    return (
      <nav
        className={
          "navbar navbar-expand-lg navbar-light" +
          (!this.state.container ? " container" : "")
        }
      >
        <Link href="/">
          <a className="navbar-brand">Oyah</a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li
              className={
                this.props.url.pathname === "/" ? "nav-item active" : "nav-item"
              }
            >
              <Link href="/">
                <a className="nav-link">Home</a>
              </Link>
            </li>
            <li
              className={
                this.props.url.pathname.startsWith("/Articles") ||
                this.props.url.pathname.startsWith("/Search") ||
                this.props.url.pathname === "/article" ||
                this.props.url.pathname === "/WriteArticle"
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link href="/Articles" as="/articles">
                <a className="nav-link">Articles</a>
              </Link>
            </li>
            <li
              className={
                this.props.url.pathname === "/Contact"
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link href="/Contact" as="/contact">
                <a className="nav-link">Contact us</a>
              </Link>
            </li>
          </ul>
          <form
            className="search form-inline my-2 my-lg-0"
            onSubmit={this.search}
          >
            <button className="btn my-2 my-sm-0" type="submit">
              <FontAwesomeIcon icon="search" />
            </button>
            <Input
              label="Search for an article"
              type="search"
              value={this.state.searchTerm}
              style={{
                flex: "1 1",
                margin: "0 1.5rem 0 0.5rem"
              }}
              ref={input => {
                this.input = input;
              }}
            />
          </form>
          <Account
            logout={this.props.logout}
            login={this.props.login}
            user={this.props.user}
            openSignInModal={this.props.openSignInModal}
            closeSignInModal={this.props.closeSignInModal}
          />
        </div>
        <style jsx>{`
          .navbar .navbar-brand {
            font-family: "Times New Roman", Times, serif;
            font-weight: bold;
            font-size: 4rem;
            text-transform: uppercase;
            user-select: none;
            -webkit-user-drag: none;
            opacity: 1;

            background: -webkit-linear-gradient(#000, #f00);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .navbar .navbar-brand:hover {
            text-decoration: none !important;
          }

          .navbar .navbar-toggler {
            border: 0;
            outline: 0;
          }

          .navbar .navbar-toggler span {
            background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(204,0,0,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
          }

          .navbar .navbar-nav {
            text-align: center;
          }

          .navbar a.nav-link {
            color: rgba(0, 0, 0, 0.5) !important;
            white-space: nowrap;
            opacity: 1;
            transition: all 0.1s;
          }

          .navbar a.nav-link:hover {
            color: rgba(0, 0, 0, 0.7) !important;
            text-decoration: none !important;
          }

          .navbar .nav-item.active a.nav-link {
            color: rgba(0, 0, 0, 0.9) !important;
          }

          .navbar .search {
            margin: 0 auto;
            width: 15rem;
            display: flex;
          }

          .navbar .search button {
            background: none;
            color: #cc0000;
          }

          @media (min-width: 992px) {
            .navbar .search {
              margin: 0;
            }
            .navbar .search-input {
              margin-right: 1rem;
            }
          }

          @media (min-width: 1200px) {
            .navbar .search {
              width: unset;
            }
          }
        `}</style>
        <style jsx global>{`
          .navbar .search button svg {
            max-width: 1rem;
          }
          .navbar .search p.Input span input {
            padding: 0;
          }
        `}</style>
      </nav>
    );
  }
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
        nametag
        email
        small_image
        image
        editor
      }
    }
  }
`)
@graphql(
  gql`
    mutation signoutUser {
      signoutUser {
        status
      }
    }
  `,
  {
    name: "signoutUser"
  }
)
class Account extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.Account = null;
    this.state = {
      loggedIn: false,
      user: {
        nametag: "",
        email: "",
        editor: false,
        image: null
      },
      infoOpen: false
    };

    this.openInfo = this.openInfo.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
  }

  componentWillReceiveProps(nextProps: any) {
    if (
      nextProps.data &&
      nextProps.data.currentUser &&
      nextProps.data.currentUser.user !== null &&
      Object.keys(this.props.user).length === 0
    ) {
      const data = nextProps.data.currentUser;
      if (data.error) {
        if (
          data.error[0].message !== "User is not logged in (or authenticated)."
        ) {
          console.error(data.error);
        }
      } else {
        this.props.login({
          ...data.user,
          // mains: data.user.mains !== null ? data.user.mains.split(", ") : null
        });

        this.setState((prevState: any) => ({
          ...prevState,
          loggedIn: true,
          user: data.user
        }));
      }
    }
    // if (this.Account) {
    //   if (
    //     nextProps.clicked !== null &&
    //     !this.Account.contains(nextProps.clicked)
    //   ) {
    //     this.setState((prevState: any) => ({
    //       ...prevState,
    //       infoOpen: false
    //     }));
    //   }
    // }
    if (
      nextProps.user !== this.props.user ||
      Object.keys(nextProps.user).length > 0
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        infoOpen: false,
        loggedIn: Object.keys(nextProps.user).length !== 0 ? true : false,
        user: {
          nametag:
            Object.keys(nextProps.user).length !== 0
              ? nextProps.user.nametag
              : "",
          email:
            Object.keys(nextProps.user).length !== 0
              ? nextProps.user.email
              : "",
          editor:
            Object.keys(nextProps.user).length !== 0
              ? nextProps.user.editor
              : false
        }
      }));
    }
  }

  openInfo(e: any) {
    e.preventDefault();
    this.setState((prevState: any) => ({
      ...prevState,
      infoOpen: true
    }));
  }

  toggleInfo(e: any) {
    // e.preventDefault();
    this.setState((prevState: any) => ({
      ...prevState,
      infoOpen: !this.state.infoOpen
    }));
  }

  static defaultProps = {
    data: {
      currentUser: {
        user: null
      }
    }
  };

  render() {
    if (!this.state.loggedIn) {
      return (
        <div className="Account">
          <a onClick={() => this.props.openSignInModal("login")}>Sign in</a>
        </div>
      );
    } else {
      return (
        <div
          className={this.state.infoOpen ? "Account active" : "Account"}
          tabIndex={0}
          onFocus={() => {
            this.setState((prevState: any) => ({
              ...prevState,
              infoOpen: true
            }));
          }}
          onBlur={() => {
            this.setState((prevState: any) => ({
              ...prevState,
              infoOpen: false
            }));
          }}
          ref={div => {
            this.Account = div;
          }}
        >
          <div className="User">
            <Image
              onClick={this.openInfo}
              className="user"
              src={
                this.props.user.image !== null
                  ? "/img/users/" + encodeURIComponent(this.props.user.image)
                  : "/img/User.png"
              }
              alt={this.props.user.nametag}
              style={
                this.state.infoOpen
                  ? {
                      width: "4rem",
                      height: "4rem",
                      userSelect: "none",
                      transform: "scale(0.89)",
                      borderRadius: "50%",
                      cursor: "default"
                    }
                  : {
                      width: "4rem",
                      height: "4rem",
                      userSelect: "none",
                      transform: "scale(0.89)",
                      borderRadius: "50%",
                      cursor: "pointer"
                    }
              }
            />
          </div>
          <div className="Info">
            <div className="user">
              <h2>{this.state.user.nametag}</h2>
              <p>{this.state.user.email}</p>
            </div>
            <div className="links">
              <Link href="/WriteArticle" as="/articles/new">
                <a onClick={() => findDOMNode(this.Account).focus()}>
                  Write article
                </a>
              </Link>
              <Link href="/Profile" as="/profile">
                <a onClick={() => findDOMNode(this.Account).focus()}>Profile</a>
              </Link>
              <Link href="/Settings" as="/settings">
                <a onClick={() => findDOMNode(this.Account).focus()}>
                  Settings
                </a>
              </Link>
              <Link href="/signout">
                <a>Sign out</a>
              </Link>
            </div>
            <img
              className="arrow"
              src="/img/Arrow.svg"
              onClick={this.toggleInfo}
            />
            {/* <FontAwesomeIcon icon="angle-down" fixedWidth fixedHeight onClick={this.toggleInfo} /> */}
            {/* <img
              onClick={this.toggleInfo}
              className="arrow"
              src={process.env.PUBLIC_URL + "/img/Arrow.png"}
              alt=""
            /> */}
          </div>
          <style jsx>{`
            .Account {
              --border-radius: 8px;
              position: relative;
              text-align: center;
              margin-bottom: 1rem;
              outline: 0;
              transition: all 0.3s;
            }

            .Account > a {
              cursor: pointer;
            }

            /*  .Account > a:hover {
            text-decoration: underline !important;
          } */

            .Account.active {
              width: 15rem;
            }

            .Account .User {
              display: flex;
              flex-direction: column;
              align-items: center;
              border-top-left-radius: var(--border-radius);
              border-top-right-radius: var(--border-radius);
              /* margin-top: 2rem; */
              /* height: 6rem; */
              transition: all 0.3s;
            }

            .Account.active .User {
              box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2);
            }

            .Account.active .User::after {
              content: "";
              display: block;
              background: #fff;
              top: 100%;
              position: absolute;
              height: 0.5rem;
              width: 100%;
            }

            .Account .User img.arrow {
              width: 2rem;
              order: 1;
            }

            .Account .Info {
              display: flex;
              flex-direction: column;
              align-items: center;
              border-bottom-left-radius: var(--border-radius);
              border-bottom-right-radius: var(--border-radius);
              background: #fff;
              width: 100%;
              background: none;
              box-shadow: none;
              top: 4rem;
              left: 0;
              z-index: 10;
              transition: all 0.3s;
            }

            .Account.active .Info {
              background: #fff;
              box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2);
              height: auto;
              padding-bottom: 3rem;
            }

            .Account .Info::before {
              content: "";
              background: #fff;
              display: none;
              width: 100%;
              height: 9px;
              position: absolute;
              left: 0;
              top: -4px;
            }

            .Account.active .Info::before {
              display: block;
            }

            .Account .Info * {
              transition: all 0.3s;
            }

            .Account.active .Info * {
              opacity: 1;
              visibility: visible;
              height: auto;
            }

            .Account .Info .user {
              overflow: hidden;
            }

            .Account .Info .user h2,
            .Account .Info .user p {
              text-align: center;
              cursor: default;
            }

            .Account .Info .user h2 {
              font-size: 1.5rem;
            }

            .Account .Info .user p {
              font-size: 1rem;
            }

            .Account .Info .links a {
              margin: 0.2rem 0;
              opacity: 0.8;
            }

            .Account .Info .links a:hover {
              margin: 0.2rem 0;
              opacity: 1;
            }

            .Account .Info .links {
              display: flex;
              flex-direction: column;
              align-items: center;
              flex: 1 1;
              overflow: hidden;
            }

            .Account .Info .links a:first-child {
              margin-top: 0;
            }

            .Account .Info img.arrow {
              position: absolute;
              top: 0.2rem;
              left: 0;
              right: 0;
              width: 1.2rem;
              height: 1.2rem;
              color: #cc0000;
              order: 1;
              opacity: 1;
              cursor: pointer;
              z-index: 20;
              margin: 0 auto;
              visibility: hidden;
              user-select: none;
              transition: all 0.3s;
            }

            .Account.active .Info img.arrow {
              transform: scaleY(-1);
              filter: FlipV;
              order: 5;
              top: 80%;
              height: 2rem;
            }

            @media (min-width: 992px) {
              .Account {
                width: 4rem;
                margin-bottom: 0;
              }
              .Account .Info {
                position: absolute;
                height: 2rem;
              }
              .Account .Info * {
                opacity: 0;
                height: 0;
                visibility: hidden;
              }
              .Account .Info img.arrow {
                visibility: visible;
              }
            }
          `}</style>
        </div>
      );
    }
  }
}

export default Navbar;
