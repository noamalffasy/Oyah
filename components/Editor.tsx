import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import Editor from "draft-js-plugins-editor";
import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding
} from "draft-js";
import { mdToDraftjs, draftjsToMd } from "draftjs-md-converter";

import createBlockBreakoutPlugin from "draft-js-block-breakout-plugin";
import createImagePlugin from "draft-js-image-plugin";
import createVideoPlugin from "draft-js-video-plugin";
import createFocusPlugin from "draft-js-focus-plugin";

import createInlineToolbarPlugin from "../plugins/inline-toolbar";
import createSideToolbarPlugin from "../plugins/side-toolbar";

import Input from "./Input";
import ActionButtons from "./ActionButtons";

// CSS
import "draft-js/dist/Draft.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";
import "draft-js-video-plugin/lib/plugin.css";

const focusPlugin = createFocusPlugin();
const videoPlugin = createVideoPlugin();

const imagePlugin = createImagePlugin({ decorator: focusPlugin.decorator });
const inlineToolbarPlugin = createInlineToolbarPlugin({ imagePlugin });
const sideToolbarPlugin = createSideToolbarPlugin({ imagePlugin, videoPlugin });
const blockBreakoutPlugin = createBlockBreakoutPlugin();

const { InlineToolbar } = inlineToolbarPlugin;
const { SideToolbar } = sideToolbarPlugin;

interface Props {
  className?: any;
  value: any;
  id: any;
  placeholder?: any;
  onClick?: any;
}

interface State {
  editorState: any;
  videoModalOpen: boolean;
}

function fixType(raw: any) {
  const _entities: any = raw.entityMap;
  const entities = Object.keys(_entities).map(key => {
    return _entities[key];
  });
  entities.map((elem: any, i: any) => {
    if (elem.type) {
      elem.type = elem.type.toLowerCase();
      raw.entityMap[i] = elem;
    }
  });

  return raw;
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
};

function getBlockStyle(block: any) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class CustomEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.focus = this.focus.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  state = {
    editorState: EditorState.createWithContent(
      convertFromRaw(fixType(mdToDraftjs(this.props.value)))
    ),
    videoModalOpen: false
  };

  ctrls: {
    VideoModal?: VideoModal;
  } = {};

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      editorState: EditorState.createWithContent(
        convertFromRaw(fixType(mdToDraftjs(this.props.value)))
      )
    }));
  }

  _handleKeyCommand(command: any, editorState: any) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e: any) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType: any) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle: any) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  text() {
    return draftjsToMd(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
  }

  focus() {
    this.refs.editor.focus();
  }

  onChange(editorState: any) {
    this.setState(prevState => ({
      ...prevState,
      editorState
    }));
  }

  onClickEditor = e => {
    if (!findDOMNode(this.ctrls.VideoModal).contains(e.target)) {
      this.focus();
    }
  };

  openVideoModal = () => {
    this.setState(prevState => ({
      ...prevState,
      videoModalOpen: true
    }));
  };

  closeVideoModal = () => {
    this.setState(prevState => ({
      ...prevState,
      videoModalOpen: false
    }));
  };

  render() {
    return (
      <div
        className={"Editor " + this.props.className}
        onClick={this.onClickEditor}
      >
        {/* <BlockStyleControls
          editorState={this.state.editorState}
          onToggle={this.toggleBlockType}
        /> */}
        <Editor
          editorState={this.state.editorState}
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.mapKeyToEditorCommand}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          ref="editor"
          plugins={[
            blockBreakoutPlugin,
            inlineToolbarPlugin,
            sideToolbarPlugin,
            focusPlugin,
            imagePlugin,
            videoPlugin
          ]}
          spellCheck={true}
        />
        <InlineToolbar id={this.props.id} />
        <SideToolbar
          id={this.props.id}
          isVideoModalOpen={this.state.videoModalOpen}
          openVideoModal={this.openVideoModal}
          closeVideoModal={this.closeVideoModal}
        />
        {/* <InlineToolbar
          structure={[
            (props: any) => [
              <BoldButton {...props} />,
              <ItalicButton {...props} />,
              <UnderlineButton {...props} />,
              <CodeButton {...props} />,
              <Separator {...props} />,
              <ImageButton {...props} />
            ]
          ]}
        /> */}
        <VideoModal
          isOpen={this.state.videoModalOpen}
          editorState={this.state.editorState}
          videoPlugin={videoPlugin}
          onChange={this.onChange}
          open={this.openVideoModal}
          close={this.closeVideoModal}
          ref={modal => (this.ctrls.VideoModal = modal)}
        />
        <style jsx global>{`
          .Editor .DraftEditor-root {
            font-family: Georgia, Cambria, "Times New Roman", Times, serif;
            font-size: 1.25rem;
            min-height: auto;
            border: 0;
            border-bottom: 1px solid #ddd;
            border-radius: 0;
            padding-bottom: 1rem;
          }

          .Editor
            .DraftEditor-root
            .public-DraftEditorPlaceholder-root
            .public-DraftEditorPlaceholder-inner {
            opacity: 0.5;
            color: #212529;
          }

          // .Editor .DraftEditor-editorContainer .public-DraftStyleDefault-block {
          //   margin-bottom: 1rem;
          // }

          .Editor .DraftEditor-editorContainer h1,
          .Editor .DraftEditor-editorContainer h2,
          .Editor .DraftEditor-editorContainer h3,
          .Editor .DraftEditor-editorContainer h4,
          .Editor .DraftEditor-editorContainer h5,
          .Editor .DraftEditor-editorContainer h6 {
            font-family: -apple-system, blinkmacsystemfont, "segoe ui", roboto,
              "helvetica neue", arial, sans-serif, "apple color emoji",
              "segoe ui emoji", "segoe ui symbol";
          }

          .Editor .DraftEditor-editorContainer blockquote {
            border-left: 5px solid #eee;
            color: #666;
            font-family: "Hoefler Text", "Georgia", serif;
            font-style: italic;
            margin: 16px 0;
            padding: 10px 20px;
          }

          .Editor .DraftEditor-editorContainer pre {
            background-color: rgba(0, 0, 0, 0.05);
            font-family: "Inconsolata", "Menlo", "Consolas", monospace;
            font-size: 16px;
            padding: 20px;
          }

          .Editor .DraftEditor-editorContainer img {
            border-radius: 2px;
            width: 100%;
            max-height: 15rem;
            min-height: 15rem;
            box-shadow: none;
            transition: all 0.3s;
          }

          .Editor
            .DraftEditor-editorContainer
            .draftJsMentionPlugin__iframeContainer__21EVZ {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            background: rgba(0, 0, 0, 0.5);
            overflow: hidden;
            animation: 1.5s ease 0s infinite normal none running loading;
          }

          .Editor
            .DraftEditor-editorContainer
            .draftJsMentionPlugin__iframeContainer__21EVZ
            iframe {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }

          .Editor
            .DraftEditor-editorContainer
            img.draftJsFocusPlugin__unfocused__1Wvrs:hover {
            cursor: default;
            box-shadow: 0 0 0.5rem 0.5rem #d2e3f7;
          }

          .Editor
            .DraftEditor-editorContainer
            img.draftJsFocusPlugin__focused__3Mksn {
            cursor: default;
            box-shadow: 0 0 0.5rem 0.5rem #accef7;
          }

          .Editor .RichEditor-controls {
            font-size: 1rem;
            user-select: none;
          }

          .Editor .RichEditor-controls::after {
            content: "";
            display: block;
            margin: 1rem auto;
            border-bottom: 1px solid rgba(0, 0, 0, 0.5);
            width: 4rem;
            -webkit-transition: all 0.3s;
            transition: all 0.3s;
          }

          .Editor .RichEditor-controls .RichEditor-styleButton {
            display: inline-block;
            margin-right: 16px;
            padding: 2px 0;
            background: none;
            color: #212529;
            border: 0;
            border-radius: 0;
            opacity: 0.6;
            cursor: pointer;
            transition: all 0.15s;
          }

          .Editor .RichEditor-controls .RichEditor-styleButton:hover {
            opacity: 1;
          }

          .Editor .RichEditor-controls .RichEditor-activeButton {
            color: #cc0000;
            opacity: 1;
          }

          @media (min-width: 576px),
            @media (min-width: 576px) and (-webkit-min-device-pixel-ratio: 1) {
            .Editor .DraftEditor-editorContainer img {
              min-height: 20rem;
            }
          }
          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Editor .DraftEditor-editorContainer img {
              min-height: 25rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

interface VideoModalProps {
  isOpen: any;
  editorState: any;
  videoPlugin: any;
  onChange: any;
  open: any;
  close: any;
}

class VideoModal extends Component<VideoModalProps> {
  ctrls: {
    popup?: HTMLDivElement;
    videoURL?: Input;
    ActionButtons?: ActionButtons;
  } = {};

  closeCheck = e => {
    if (!this.ctrls.popup.contains(e.target)) {
      this.props.close();
    }
  };

  addVideo = videoURL => {
    const { editorState, onChange } = this.props;
    onChange(this.props.videoPlugin.addVideo(editorState, { src: videoURL }));
    this.props.close();
  };

  render() {
    return (
      <div
        className="VideoModal modal"
        role="dialog"
        style={{
          visibility: this.props.isOpen ? "visible" : "collapse",
          opacity: this.props.isOpen ? 1 : 0
        }}
        onClick={this.closeCheck}
      >
        <div
          className="modal-dialog"
          role="document"
          style={!this.props.isOpen ? { marginTop: "-10rem" } : {}}
          onKeyPress={e => {
            if (e.key === "Enter") {
              this.addVideo(this.ctrls.videoURL.input.value);
            }
          }}
          ref={div => {
            this.ctrls.popup = div;
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add video</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.close}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Input
                label="Video URL"
                type="text"
                ref={input => (this.ctrls.videoURL = input)}
              />
            </div>
            <div className="modal-footer">
              <ActionButtons
                primaryText="Add"
                primaryAction={() =>
                  this.addVideo(this.ctrls.videoURL.input.value)
                }
                secondaryText="Cancel"
                secondaryAction={this.props.close}
                ref={btns => (this.ctrls.ActionButtons = btns)}
              />
            </div>
          </div>
        </div>
        <style jsx>{`
          .VideoModal {
            display: block !important;
            opacity: 0;
            background: rgba(0, 0, 0, 0.3);
            transition: all 0.3s;
          }

          .VideoModal .modal-dialog {
            transition: all 0.3s;
          }

          .VideoModal .modal-content,
          .VideoModal .modal-content .modal-header,
          .VideoModal .modal-content .modal-footer {
            border: 0;
          }

          .VideoModal .modal-content {
            border-radius: 0;
            box-shadow: 0 0.3125rem 1rem 0 rgba(0, 0, 0, 0.24);
          }

          .VideoModal .modal-content .modal-header button.close {
            outline: 0;
          }

          .VideoModal .modal-content .modal-body {
            width: 90%;
            margin: 0 auto;
            padding: 15px;
            padding-bottom: 0;
            max-height: 20rem;
            transition: all 0.3s;
          }

          .VideoModal .modal-content .modal-footer {
            padding-top: 0;
          }
        `}</style>
      </div>
    );
  }
}

export default CustomEditor;
