import * as React from "react";
import { Component } from "react";

import routerEvents from "../utils/routerEvents";

import Router from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RoundShape } from "react-placeholder/lib/placeholders";

import Image from "./Image";
import Input from "./Input";
import Verification from "./Verification";
import Loading from "./Loading";
import { Arrow as ArrowSvg } from "./svgs";

// GraphQL
import { withApollo } from "react-apollo";

// import { remove as removeCookie } from "../utils/cookie";
import { app } from "../lib/firebase";

interface Props {
  client?: any;
  container: any;
  login: any;
  user: any;
  openSignInModal: any;
  closeSignInModal: any;
}

interface State {
  focus: boolean;
  container: boolean;
  searchOpen: boolean;
  searchTerm: any;
}

class Navbar extends Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);

    this.addContainer = this.addContainer.bind(this);
    this.search = this.search.bind(this);
  }

  state = {
    focus: false,
    container: this.props.container,
    searchOpen: false,
    searchTerm: ""
  };

  input: Input;

  searchbox: HTMLDivElement;

  componentDidMount() {
    this.addContainer(Router.asPath);

    routerEvents.on("routeChangeComplete", url => {
      this.addContainer(url);
    });
  }

  addContainer(url: string) {
    if (
      // Matches /articles/[anything except 'new']
      (url.match(/\/articles\/(?!new).*$/g) ||
        // Matches /articles/new/[anything]
        url.match(/\/articles\/new\/.*$/g)) &&
      this.state.container === true
    ) {
      this.setState(prevState => ({
        ...prevState,
        container: false
      }));
    } else if (
      // Matches /articles/[anything except 'new']
      url.match(/\/articles\/(?!new).*$/g) &&
      // Matches /articles/new/[anything]
      url.match(/\/articles\/new\/.*$/g) &&
      this.state.container === false
    ) {
      this.setState(prevState => ({
        ...prevState,
        container: true
      }));
    }
  }

  search(e: any) {
    e.preventDefault();

    if (this.state.searchOpen) {
      const searchTerm = (this.input.input as HTMLInputElement).value;

      Router.push(
        `/Search?q=${encodeURI(searchTerm)}`,
        `/search?q=${encodeURI(searchTerm)}`
      ).then(() => {
        (this.input.input as HTMLInputElement).value = "";

        this.setState(prevState => ({
          ...prevState,
          searchOpen: false
        }));
      });
    } else {
      this.setState(prevState => ({
        ...prevState,
        searchOpen: true
      }));

      this.input.input.focus();
    }
    // .then(res => console.log(res))
    // .catch(err => console.log(err));

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
          <div className="navbar-items">
            {/* <ul className="navbar-nav mr-auto">
              <li
                className={
                  Router.pathname === "/" ||
                  Router.pathname === "/index"
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
                  Router.pathname.startsWith("/Articles") ||
                  Router.pathname.startsWith("/Search") ||
                  Router.pathname === "/article" ||
                  Router.pathname === "/WriteArticle"
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link href="/Articles" as="/articles">
                  <a className="nav-link">Articles</a>
                </Link>
              </li>
            </ul> */}
            <div
              className="search form-inline my-2 my-lg-0 ml-auto"
              tabIndex={99999}
              onFocus={() => {
                this.input.input.focus();

                this.setState(prevState => ({
                  ...prevState,
                  searchOpen: true
                }));
              }}
              onBlur={() => {
                this.input.input.blur();

                this.setState(prevState => ({
                  ...prevState,
                  searchOpen: false
                }));
              }}
              ref={div => (this.searchbox = div)}
            >
              <a className="desktop btn" onClick={this.search}>
                <FontAwesomeIcon icon="search" />
              </a>
              <Link href="/Search" as="/search">
                <a className="mobile btn">
                  <FontAwesomeIcon icon="search" />
                </a>
              </Link>
              <Input
                label="Search for an article"
                type="search"
                value={this.state.searchTerm}
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    this.search(e);
                  }
                }}
                style={
                  this.state.searchOpen
                    ? {}
                    : { width: 0, margin: "-1rem 1rem 0 .5rem" }
                }
                ref={input => {
                  this.input = input;
                }}
              />
            </div>
            <Account
              client={this.props.client}
              login={this.props.login}
              user={this.props.user}
              openSignInModal={this.props.openSignInModal}
              closeSignInModal={this.props.closeSignInModal}
            />
          </div>
          <style jsx>{`
            .navbar {
              position: unset;
              padding: 0;
            }

            .navbar .navbar-brand {
              font-family: "Times New Roman", Times, serif;
              font-weight: bold;
              font-size: 3rem;
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

            .navbar .navbar-items {
              display: flex;
              margin-left: auto;
              flex-direction: row;
              align-items: center;
            }

            .navbar .search {
              display: flex;
              /* margin: 0 auto 1rem; */
              margin: 0 0 0.1rem 0;
              outline: 0;
              align-items: center;
              justify-content: center;
            }

            .navbar .search a {
              background: none;
              color: #cc0000;
              padding: 0 0 0.2rem 0;
              opacity: 1;
              outline: 0;
              transition: all 0.3s;
            }

            .navbar .search a:focus {
              box-shadow: none;
            }

            .navbar .search a.desktop {
              display: none;
            }
            @media (min-width: 768px),
              @media(min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
              .navbar .search a {
                padding-right: 0;
              }
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .navbar {
                padding: 0.5rem 1rem;
              }
              .navbar .navbar-brand {
                font-size: 4rem;
              }
              .navbar .search {
                margin: 0;
                width: 15rem;
              }
              .navbar .search a.desktop {
                display: unset;
              }
              .navbar .search a.mobile {
                display: none;
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

            .navbar .search a svg {
              max-width: 1rem;
            }

            .navbar .search .Input {
              display: none;
              flex: 1 1;
              padding: 0.05rem 0 0 0;
              margin: 0 1.5rem 0 0.5rem;
              width: 12rem;
              overflow: hidden;
              transition: all 0.3s;
            }

            .navbar .search .Input span input {
              padding: 0;
            }

            .navbar .search .Input span::after {
              margin: -0.05rem 0 0 0;
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .navbar .search .Input {
                display: block;
                padding: 1rem 0 0 0;
                margin: -1rem 1.5rem 0 1rem;
              }
            }
          `}</style>
        </nav>
      </div>
    );
  }
}

class Account extends Component<any, any> {
  state = {
    loggedIn: false,
    user: {
      nametag: "",
      email: "",
      editor: false,
      image: null,
      small_image: null,
      is_team: false
    },
    infoOpen: false,
    nametagHeight: "1.5rem",
    loading: false
  };

  Account = null;

  nametag: HTMLHeadingElement = null;

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

  componentWillReceiveProps(nextProps: any) {
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
        nametagHeight: `${this.nametag.clientHeight}px`
      }));
    }
  };

  openInfo = e => {
    e.preventDefault();
    this.setState((prevState: any) => ({
      ...prevState,
      infoOpen: true
    }));
  };

  toggleInfo = () => {
    // e.preventDefault();
    this.setState((prevState: any) => ({
      ...prevState,
      infoOpen: !this.state.infoOpen
    }));
  };

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
              margin: 0 0.5rem 0 1rem;
            }

            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Account {
                margin: 0;
              }
            }
          `}</style>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div
            className="detectClick"
            style={this.state.infoOpen ? { display: "block" } : {}}
            onClick={e => {
              if (!this.Account.contains(e.target)) {
                this.setState(prevState => ({
                  ...prevState,
                  infoOpen: false
                }));
              }
            }}
          />
          <div
            className={this.state.infoOpen ? "Account active" : "Account"}
            // tabIndex={0}
            // onFocus={() => {
            //   this.setState((prevState: any) => ({
            //     ...prevState,
            //     infoOpen: true
            //   }));
            // }}
            // onBlur={() => {
            //   this.setState((prevState: any) => ({
            //     ...prevState,
            //     infoOpen: false
            //   }));
            // }}
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
                      animation: "loading 1.5s infinite"
                    }}
                  />
                }
                style={
                  this.state.infoOpen
                    ? {
                        cursor: "default"
                      }
                    : {
                        cursor: "pointer"
                      }
                }
              />
            </div>
            <div className="Info">
              <div className="user">
                <h2 ref={h2 => (this.nametag = h2)}>
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
                  <a onClick={() => this.Account.focus()}>Write article</a>
                </Link>
                <Link
                  href={`/Profile?nametag=${this.state.user.nametag}`}
                  as={`/users/${this.state.user.nametag}`}
                >
                  <a onClick={() => this.Account.focus()}>Profile</a>
                </Link>
                <Link href="/Settings" as="/settings">
                  <a onClick={() => this.Account.focus()}>Settings</a>
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
            <div className="arrow mobile" onClick={this.openInfo} />
            <ArrowSvg className="arrow desktop" onClick={this.toggleInfo} />
          </div>
          <style jsx>{`
            .detectClick {
              position: fixed;
              display: none;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              z-index: 10;
            }

            .Account {
              --border-radius: 0;
              text-align: center;
              margin: 0 0.5rem 0 1rem;
              outline: 0;
              z-index: 10;
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

            .Account .User::after {
              content: "";
              position: absolute;
              display: none;
              background: #fff;
              top: 100%;
              height: 0.5rem;
              width: 100%;
              box-shadow: none;
              transition: all 0.3s;
            }

            .Account.active .User::after {
              box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
            }

            .Account .Info {
              position: absolute;
              display: flex;
              flex-direction: column;
              align-items: center;
              border-bottom-left-radius: var(--border-radius);
              border-bottom-right-radius: var(--border-radius);
              background: #fff;
              width: 100%;
              max-height: 0;
              top: 4.6rem;
              left: 0;
              box-shadow: none;
              z-index: 10;
              overflow: hidden;
              transition: max-height 0.3s, box-shadow 0.3s, padding 0.3s;
            }

            .Account.active .Info {
              box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 4px;
              /* padding-top: 1rem;
              padding-bottom: 3rem; */
              padding: 1rem 0;
              max-height: calc(
                4rem + ${this.state.nametagHeight} + 0.5rem + 1rem + 1rem + 1rem +
                  0.2rem + ((1rem + (0.2rem * 2)) * 3) + 3rem
              );
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
                position: relative;
              }
              .Account.active {
                width: 15rem;
              }
              .Account.active .User {
                /* box-shadow: -1px 2px 2px 1px rgba(0, 0, 0, 0.2); */
                box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
              }
              .Account .User::after {
                display: block;
              }
              .Account .Info {
                top: 4rem;
              }
              .Account.active .Info {
                box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px;
                padding: 0 0 3rem;
              }
            }
          `}</style>
          <style jsx global>{`
            .Account .image,
            .Account .User .image {
              width: 2.5rem !important;
              height: 2.5rem !important;
              user-select: none;
              border-radius: 50%;
            }

            .Account .arrow.desktop {
              display: none;
              position: absolute;
              top: calc(0.2rem + 4rem);
              left: 0;
              right: 0;
              width: 1.2rem;
              height: 1.2rem;
              fill: #cc0000;
              margin: 0 auto;
              order: 1;
              opacity: 1;
              z-index: 20;
              cursor: pointer;
              user-select: none;
              transition: all 0.3s;
            }

            .Account.active .arrow.desktop {
              transform: scaleY(-1);
              order: 5;
              top: calc(
                4rem + ${this.state.nametagHeight} + 0.5rem + 1rem + 1rem + 1rem +
                  0.2rem + ((1rem + (0.2rem * 2)) * 3) + 3rem
              );
              height: 2rem;
            }

            .Account .arrow.mobile {
              position: absolute;
              top: calc(0.2rem + 4rem);
              right: calc(15px + 0.5rem + 0.7rem + 0.2rem);
              width: 0.7rem;
              height: 0.7rem;
              border: 2px solid #cc0000;
              border-top: transparent;
              border-left: transparent;
              box-shadow: none;
              z-index: 10;
              transform: rotate(45deg);
              transition: all 0.3s;
            }

            .Account.active .arrow.mobile {
              /* transform: rotate(45deg) scaleY(-1); */
              top: calc(0.2rem + 4rem);
              right: calc(15px + 0.5rem + 0.7rem);
              height: 1.2rem;
              width: 1.2rem;
              background: #fff;
              border: 0;
              box-shadow: -6px -5px 4px -5px rgba(0, 0, 0, 0.15);
            }
            @media (min-width: 992px),
              @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
              .Account .image,
              .Account .User .image {
                width: 3.56rem !important;
                height: 3.56rem !important;
                user-select: none;
                border-radius: 50%;
                cursor: pointer;
              }
              .Account .arrow.desktop {
                display: block;
              }
              .Account .arrow.mobile {
                display: none;
              }
            }
          `}</style>
        </React.Fragment>
      );
    }
  }
}

export default withApollo(Navbar);
