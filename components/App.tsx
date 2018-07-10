import * as React from "react";
import { Component } from "react";
// import { spring, AnimatedSwitch } from "react-router-transition";

import { bindActionCreators } from "redux";

import Router, { withRouter, SingletonRouter } from "next/router";
import routerEvents from "../utils/routerEvents";

import * as signInModalActionCreators from "../actions/signInModal";
import * as userActionCreators from "../actions/user";
import * as errorActionCreators from "../actions/error";

import Navbar from "./Navbar";

import Footer from "./Footer";
import LoginPopup from "./LoginPopup";
import ErrorAlert from "./ErrorAlert";

import configureLoadingProgressBar from "../lib/progressBar";

import * as fontawesome from "@fortawesome/fontawesome-svg-core";
import {
  faSearch,
  faAngleDown,
  faExclamationCircle,
  faArrowAltCircleUp,
  faEye,
  faEyeSlash,
  faHeart as faHeartFill,
  faShareSquare
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faImage } from "@fortawesome/free-regular-svg-icons";
import {
  faRedditAlien,
  faTwitter,
  faFacebookF
} from "@fortawesome/free-brands-svg-icons";

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

interface Props {
  dispatch: any;
  signInModal: any;
  user: any;
  error: any;
  searchTerm?: any;
  router: SingletonRouter;
}

@withRouter
class App extends Component<Props, any> {
  state = {
    clicked: null,
    container:
      this.props.router.pathname !== "/article" &&
      this.props.router.pathname !== "/WriteArticle"
  };

  componentDidMount() {
    configureLoadingProgressBar();

    routerEvents.on("routerChangeComplete", url => {
      console.log("Load complete");
      
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
    const { dispatch, signInModal, user, error, searchTerm } = this.props;
    const openSignInModal = bindActionCreators(
      signInModalActionCreators.open,
      dispatch
    );
    const closeSignInModal = bindActionCreators(
      signInModalActionCreators.close,
      dispatch
    );
    const login = bindActionCreators(userActionCreators.login, dispatch);
    // const logout = bindActionCreators(userActionCreators.logout, dispatch);
    const setError = bindActionCreators(errorActionCreators.setError, dispatch);
    return (
      <div className={this.state.container ? "App container" : "App"}>
        <ErrorAlert error={error} setError={setError} />
        <Navbar
          container={this.state.container}
          // logout={logout}
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
          user={user}
        />
        <style jsx>{`
          .App {
            min-height: 100vh;
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
              background-color: rgba(205, 205, 205, 0.6);
            }

            50% {
              background-color: rgba(205, 205, 205, 1);
            }

            100% {
              background-color: rgba(205, 205, 205, 0.6);
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
