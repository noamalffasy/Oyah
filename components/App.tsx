import * as React from "react";
import { Component } from "react";
// import { spring, AnimatedSwitch } from "react-router-transition";

import { bindActionCreators } from "redux";

import * as signInModalActionCreators from "../actions/signInModal";
import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import Navbar from "./Navbar";

import Footer from "./Footer";
import LoginPopup from "./LoginPopup";
import ErrorAlert from "./ErrorAlert";

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
import { faHeart, faImage } from "@fortawesome/fontawesome-free-regular";
import {
  faRedditAlien,
  faTwitter,
  faFacebookF
} from "@fortawesome/fontawesome-free-brands";

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
  faFacebookF,
  faImage
);

class App extends Component<any, any> {
  state = {
    clicked: null,
    container:
      this.props.url.pathname !== "/article" &&
      this.props.url.pathname !== "/WriteArticle"
  };

  componentWillReceiveProps(nextProps: any) {
    // if (nextProps.user !== this.props.user) {
    //   this.forceUpdate();
    // }
    if (nextProps.url !== this.props.url) {
      this.addContainer(nextProps);
    }
  }

  addContainer = (props: any) => {
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
  };

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
    const { dispatch, signInModal, user, error, url, searchTerm } = this.props;
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
          url={url}
          container={this.state.container}
          logout={logout}
          login={login}
          user={user}
          searchTerm={searchTerm}
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
          url={url}
        />
        <style jsx>{`
          .App {
            min-height: 100%;
            position: relative;
          }
        `}</style>
        <style jsx global>{`
          @keyframes openCard {
            0% {
              top: -1rem;
            }

            100% {
              top: 0;
            }
          }

          @keyframes imageLoad {
            0% {
              background: #c0c0c0;
            }

            50% {
              background: #aaa;
            }

            100% {
              background: #c0c0c0;
            }
          }

          @keyframes loading {
            0% {
              opacity: 0.6;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.6;
            }
          }

          @keyframes like {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.5);
            }
            100% {
              transform: scale(1);
            }
          }

          a {
            color: #cc0000 !important;
            font-weight: 600;
            outline: 0;
            opacity: 0.8;
            cursor: pointer;
            transition: all 0.15s;
          }

          a:hover {
            /* text-decoration: underline !important; */
            text-decoration: none !important;
            opacity: 1;
          }
        `}</style>
      </div>
    );
  }
}

// const mapStateToProps = (state: any) => ({
//   signInModal: state.signInModal,
//   user: state.user,
//   error: state.error
// });

export default App;
