import * as React from "react";
import { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import Popup from "../../../components/Popup";
// import Input from "../../../components/Input";

interface Props {
  getEditorState: any;
  setEditorState: any;
  id: any;
  videoPlugin: any;
  theme: any;
  openVideoModal: Function;
}

interface State {
  popupOpen: boolean;
}

class VideoButton extends Component<Props, State> {
  state = {
    popupOpen: false
  };

  openPopup = () => {
    this.props.openVideoModal();
  };

  addVideo = video => {
    const { getEditorState, setEditorState } = this.props;
    setEditorState(this.props.videoPlugin.addVideo(getEditorState(), video));
  };

  render() {
    const { theme } = this.props;
    return (
      <div className={theme.buttonWrapper}>
        <button
          className={theme.button}
          style={{ padding: "5px" }}
          onClick={this.openPopup}
        >
          <FontAwesomeIcon icon="video" />
        </button>
      </div>
    );
  }
}

export default VideoButton;
