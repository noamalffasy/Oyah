import * as React from "react";
import { Component } from "react";
// import { spring, AnimatedSwitch } from "react-router-transition";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Head from "next/head";

import * as signInModalActionCreators from "../actions/signInModal";
import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import Article from "./Article";

import Navbar from "./Navbar";

import Footer from "./Footer";
import LoginPopup from "./LoginPopup";

import withData from "../lib/withData";

import * as fontawesome from "@fortawesome/fontawesome";
import {
  faSearch,
  faAngleDown,
  faExclamationCircle,
  faArrowAltCircleUp,
  faEye,
  faEyeSlash,
  faHeart as faHeartFill,
  faShareSquare
} from "@fortawesome/fontawesome-free-solid";
import { faHeart } from "@fortawesome/fontawesome-free-regular";
import {
  faRedditAlien,
  faTwitter,
  faFacebookF
} from "@fortawesome/fontawesome-free-brands";
import ErrorAlert from "./ErrorAlert";

fontawesome.library.add(
  faSearch,
  faAngleDown,
  faExclamationCircle,
  faArrowAltCircleUp,
  faEye,
  faEyeSlash,
  faHeart,
  faHeartFill,
  faShareSquare,
  faRedditAlien,
  faTwitter,
  faFacebookF
);

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = { clicked: null, container: true };

    this.addContainer = this.addContainer.bind(this);

    this.addContainer(props);
  }

  componentDidMount() {
    this.addContainer(this.props);
  }

  componentWillReceiveProps(nextProps: any) {
    // if (nextProps.user !== this.props.user) {
    //   this.forceUpdate();
    // }
    if (nextProps.url !== this.props.url) {
      this.addContainer(nextProps);
    }
  }

  addContainer(props: any) {
    const url = props.url;
    if (
      (props.url.pathname === "/article" ||
        props.url.pathname === "/WriteArticle") &&
      this.state.container === true
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        container: false
      }));
    } else if (
      props.url.pathname !== "/article" &&
      props.url.pathname !== "/WriteArticle" &&
      this.state.container === false
    ) {
      this.setState((prevState: any) => ({
        ...prevState,
        container: true
      }));
    }
  }

  // mapStyles(styles: any) {
  //   return {
  //     opacity: styles.opacity
  //   };
  // }

  // wrap the `spring` helper to use a bouncy config
  //   bounce(val) {
  //     return spring(val, {
  //       stiffness: 330,
  //       damping: 22
  //     });
  //   }

  //   transition = {
  //     // start in a transparent, upscaled state
  //     atEnter: {
  //       opacity: 0
  //     },
  //     // leave in a transparent, downscaled state
  //     atLeave: {
  //       opacity: this.bounce(0)
  //     },
  //     // and rest at an opaque, normally-scaled state
  //     atActive: {
  //       opacity: this.bounce(1)
  //     }
  //   };

  render() {
    const { dispatch, signInModal, user, error } = this.props;
    const openSignInModal = bindActionCreators(
      signInModalActionCreators.open,
      dispatch
    );
    const closeSignInModal = bindActionCreators(
      signInModalActionCreators.close,
      dispatch
    );
    const login = bindActionCreators(userActionCreators.login, dispatch);
    const logout = bindActionCreators(userActionCreators.logout, dispatch);
    const setError = bindActionCreators(errorActionCreators.setError, dispatch);
    return (
      <div className={this.state.container ? "App container" : "App"}>
        <ErrorAlert error={error} setError={setError} />
        <Navbar
          url={this.props.url}
          container={this.state.container}
          logout={logout}
          login={login}
          user={user}
          openSignInModal={openSignInModal}
          closeSignInModal={closeSignInModal}
        />
        {
          // <AnimatedSwitch atEnter={this.transition.atEnter} atLeave={this.transition.atLeave} atActive={this.transition.atActive} mapStyles={this.mapStyles} className="route-wrapper">
        }
        {this.props.children}
        {
          //</AnimatedSwitch>
        }
        <Footer />
        <LoginPopup
          signInModal={signInModal}
          closeSignInModal={closeSignInModal}
          login={login}
        />
        <style jsx>{`
          .App {
            min-height: 100%;
            position: relative;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  signInModal: state.signInModal,
  user: state.user,
  error: state.error
});

export default App;
