import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import { withRouter, SingletonRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RoundShape } from "react-placeholder/lib/placeholders";

import { Collapse, NavbarToggler } from "reactstrap";

import Image from "./Image";
import Input from "./Input";
import Verification from "./Verification";
import Loading from "./Loading";
import ArrowSvg from "./ArrowSvg";

// GraphQL
import { withApollo } from "react-apollo";

// import { remove as removeCookie } from "../utils/cookie";
import { app } from "../lib/firebase";

interface Props {
  client?: any;
  url: any;
  container: any;
  login: any;
  user: any;
  router: SingletonRouter;
  searchTerm: any;
  openSignInModal: any;
  closeSignInModal: any;
}

interface State {
  focus: boolean;
  container: boolean;
  navOpen: boolean;
  searchTerm: any;
}

class Navbar extends Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);

    this.state = {
      focus: false,
      container: props.container,
      navOpen: false,
      searchTerm: ""
    };

    this.addContainer = this.addContainer.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    this.addContainer(this.props);

    if (this.props.url.pathname === "/Search") {
      const { searchTerm } = this.props;
      this.setState((prevState: any) => ({
        ...prevState,
        searchTerm
      }));
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.url !== this.props.url) {
      this.addContainer(nextProps);
    }
  }

  addContainer(props: Props) {
    const url = props.url;
    if (
      (url.pathname === "/article" || url.pathname === "/WriteArticle") &&
      this.state.container === true
    ) {
      this.setState(prevState => ({
        ...prevState,
        container: false
      }));
    } else if (
      url.pathname !== "/article" &&
      url.pathname !== "/WriteArticle" &&
      this.state.container === false
    ) {
      this.setState(prevState => ({
        ...prevState,
        container: true
      }));
    }
  }

  onFocus() {
    this.setState(prevState => ({
      ...prevState,
      focus: true
    }));
  }

  onBlur() {
    this.setState(prevState => ({
      ...prevState,
      focus: false
    }));
  }

  toggleNav() {
    this.setState(prevState => ({
      ...prevState,
      navOpen: !this.state.navOpen
    }));
  }

  search(e: any) {
    e.preventDefault();

    const searchTerm = this.input.input.value;

    this.props.router.push(`/search?q=${encodeURI(searchTerm)}`);

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
      <div className={!this.state.container ? " container" : ""}>
        <nav className="navbar navbar-expand-lg navbar-light">
          <Link href="/">
            <a className="navbar-brand">Oyah</a>
          </Link>
          <NavbarToggler onClick={this.toggleNav} />
          <Collapse isOpen={this.state.navOpen} navbar>
            <ul className="navbar-nav mr-auto">
              <li
                className={
                  this.props.url.pathname === "/" ||
                  this.props.url.pathname === "/index"
                    ? "nav-item active"
                    : "nav-item"
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
              client={this.props.client}
              login={this.props.login}
              user={this.props.user}
              url={this.props.url}
              openSignInModal={this.props.openSignInModal}
              closeSignInModal={this.props.closeSignInModal}
            />
          </Collapse>
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

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .navbar .search {
                margin: 0;
              }
              .navbar .search-input {
                margin-right: 1rem;
              }
            }

            @media (min-width: 1200px),
              @media (min-width: 1200px) and (-webkit-min-device-pixel-ratio: 1) {
              .navbar .search {
                width: unset;
              }
            }
          `}</style>
          <style jsx global>{`
            .navbar .navbar-toggler {
              border: 0;
              outline: 0;
            }

            .navbar .navbar-toggler span {
              background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(204,0,0,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
            }
            .navbar .search button svg {
              max-width: 1rem;
            }
            .navbar .search .Input span input {
              padding: 0;
            }
          `}</style>
        </nav>
      </div>
    );
  }
}

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
      infoOpen: false,
      nametagHeight: "1.5rem",
      loading: false
    };

    this.openInfo = this.openInfo.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
  }

  ctrls: {
    nametag?: HTMLHeadingElement;
  } = {};

  componentWillMount() {
    if (Object.keys(this.props.user).length > 0) {
      this.setState((prevState: any) => ({
        ...prevState,
        loggedIn: true,
        user: this.props.user
      }));
    }
  }

  componentDidMount() {
    this.fixNametagHeight(this.state);
  }

  componentWillReceiveProps(nextProps: any, nextState: any) {
    // if (
    //   nextProps.data &&
    //   nextProps.data.currentUser &&
    //   nextProps.data.currentUser.user !== null &&
    //   Object.keys(this.props.user).length === 0
    // ) {
    //   const data = nextProps.data.currentUser;
    //   if (data.error) {
    //     if (
    //       data.error[0].message !== "User is not logged in (or authenticated)."
    //     ) {
    //       console.error(data.error);
    //     }
    //   } else {
    //     this.props.login({
    //       ...data.user
    //       // mains: data.user.mains !== null ? data.user.mains.split(", ") : null
    //     });

    //     this.setState((prevState: any) => ({
    //       ...prevState,
    //       loggedIn: true,
    //       user: data.user
    //     }));
    //   }
    // }
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
      (nextProps.user !== this.props.user ||
        Object.keys(nextProps.user).length > 0) &&
      !nextProps.user.loading
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        infoOpen: false,
        loggedIn: Object.keys(nextProps.user).length !== 0 ? true : false,
        user: {
          ...nextProps.user,
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

    if (
      (nextProps.user !== this.props.user ||
        Object.keys(nextProps.user).length > 0) &&
      nextProps.user.loading
    ) {
      this.setState(prevState => ({
        ...prevState,
        loading: true
      }));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.nametag !== prevProps.user.nametag) {
      this.fixNametagHeight(this.state);
    }
  }

  fixNametagHeight = state => {
    if (state.loggedIn) {
      this.setState(prevState => ({
        ...prevState,
        nametagHeight: `${this.ctrls.nametag.clientHeight}px`
      }));
    }
  };

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
          {!this.state.loading ? (
            <a onClick={() => this.props.openSignInModal("login")}>Sign in</a>
          ) : (
            <Loading />
          )}
          <style jsx>{`
            .Account {
              text-align: center;
              margin-bottom: 0.8rem;
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Account {
                margin-bottom: 0;
              }
            }
          `}</style>
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
                this.state.user.image !== null
                  ? this.state.user.image
                  : "https://storage.googleapis.com/oyah.xyz/assets/img/User.png"
              }
              smallSrc={
                this.state.user.small_image !== null
                  ? this.state.user.small_image
                  : "https://storage.googleapis.com/oyah.xyz/assets/img/User_small.png"
              }
              alt={this.state.user.nametag}
              customPlaceholder={
                <RoundShape
                  className="image"
                  color="#e0e0e0"
                  style={{
                    display: "inline-block",
                    width: "3.56rem",
                    height: "3.56rem",
                    borderRadius: "50%",
                    animation: "loading 1.5s infinite"
                  }}
                />
              }
              style={
                this.state.infoOpen
                  ? {
                      width: "3.56rem",
                      height: "3.56rem",
                      userSelect: "none",
                      borderRadius: "50%",
                      cursor: "default"
                    }
                  : {
                      width: "3.56rem",
                      height: "3.56rem",
                      userSelect: "none",
                      borderRadius: "50%",
                      cursor: "pointer"
                    }
              }
            />
          </div>
          <div className="Info">
            <div className="user">
              <h2 ref={h2 => (this.ctrls.nametag = h2)}>
                {this.state.user.nametag}
                {this.state.user.is_team && (
                  <Verification
                    isArticle={false}
                    style={{ marginLeft: ".5rem" }}
                  />
                )}
              </h2>
              <p>{this.state.user.email}</p>
            </div>
            <div className="links">
              <Link href="/WriteArticle" as="/articles/new">
                <a onClick={() => findDOMNode(this.Account).focus()}>
                  Write article
                </a>
              </Link>
              <Link
                href={`/Profile?nametag=${this.state.user.nametag}`}
                as={`/users/${this.state.user.nametag}`}
              >
                <a onClick={() => findDOMNode(this.Account).focus()}>Profile</a>
              </Link>
              <Link href="/Settings" as="/settings">
                <a onClick={() => findDOMNode(this.Account).focus()}>
                  Settings
                </a>
              </Link>
              <a
                href="/signout"
                onClick={e => {
                  e.preventDefault();

                  // removeCookie(document.cookie, "token");
                  app.auth().signOut();

                  this.props.client.cache.reset().then(() => {
                    window.location.href = `${window.location.protocol}//${
                      window.location.host
                    }/signout?redirect_to=${encodeURIComponent(
                      window.location.pathname
                    )}`;
                  });
                }}
              >
                Sign out
              </a>
            </div>
            {/* <FontAwesomeIcon icon="angle-down" fixedWidth fixedHeight onClick={this.toggleInfo} /> */}
            {/* <img
              onClick={this.toggleInfo}
              className="arrow"
              src={process.env.PUBLIC_URL + "/img/Arrow.png"}
              alt=""
            /> */}
          </div>
          <ArrowSvg className="arrow" onClick={this.toggleInfo} />
          <style jsx>{`
            .Account {
              --border-radius: 0;
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

            .Account .Info {
              display: flex;
              flex-direction: column;
              align-items: center;
              border-bottom-left-radius: var(--border-radius);
              border-bottom-right-radius: var(--border-radius);
              background: #fff;
              width: 100%;
              top: 4rem;
              left: 0;
              box-shadow: none;
              z-index: 10;
              overflow: hidden;
              transition: max-height 0.3s, box-shadow 0.3s, padding 0.3s;
            }

            .Account .Info::before {
              content: "";
              position: absolute;
              background: #fff;
              width: 100%;
              height: 9px;
              left: 0;
              top: -4px;
              opacity: 0;
            }

            .Account .Info * {
              transition: all 0.3s;
            }

            .Account .Info .user h2,
            .Account .Info .user p {
              text-align: center;
              cursor: default;
            }

            .Account .Info .user h2 {
              font-size: 1.5rem;
              white-space: ${this.state.nametagHeight === "1.5rem"
                ? "nowrap"
                : "initial"};
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
            }

            .Account .Info .links a:first-child {
              margin-top: 0;
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Account {
                width: 4rem;
                margin-bottom: 0;
              }
              .Account.active {
                width: 15rem;
              }
              .Account.active .User {
                /* box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2); */
                box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
              }
              .Account .User::after {
                content: "";
                position: absolute;
                background: #fff;
                top: 100%;
                height: 0.5rem;
                width: 100%;
                opacity: 0;
              }
              .Account.active .User::after {
                opacity: 1;
              }
              .Account .Info {
                position: absolute;
                /* height: 2rem; */
                /* opacity: 0; */
                max-height: 0;
                /* visibility: hidden; */
              }
              .Account.active .Info {
                /* box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2); */
                box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
                padding-bottom: 3rem;
                /* opacity: 1; */
                /* visibility: visible; */
                max-height: calc(
                  4rem + ${this.state.nametagHeight} + 0.5rem + 1rem + 1rem +
                    1rem + 0.2rem + ((1rem + (0.2rem * 2)) * 3) + 3rem
                );
              }
              .Account.active .Info::before {
                opacity: 1;
              }
            }
          `}</style>
          <style jsx global>{`
            .Account svg.arrow {
              position: absolute;
              top: calc(0.2rem + 4rem);
              left: 0;
              right: 0;
              width: 1.2rem;
              height: 1.2rem;
              color: #cc0000;
              margin: 0 auto;
              order: 1;
              opacity: 1;
              z-index: 20;
              visibility: hidden;
              cursor: pointer;
              user-select: none;
              transition: all 0.3s;
            }

            .Account.active svg.arrow {
              transform: scaleY(-1);
              filter: FlipV;
              order: 5;
              top: calc(
                4rem + ${this.state.nametagHeight} + 0.5rem + 1rem + 1rem + 1rem +
                  0.2rem + ((1rem + (0.2rem * 2)) * 3) + 3rem
              );
              height: 2rem;
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Account svg.arrow {
                visibility: visible;
              }
            }
          `}</style>
        </div>
      );
    }
  }
}

export default withRouter(withApollo(Navbar));
