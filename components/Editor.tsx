import * as React from "react";
import { Component } from "react";

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
import createFocusPlugin from "draft-js-focus-plugin";

import createInlineToolbarPlugin from "../plugins/inline-toolbar";
import createSideToolbarPlugin from "../plugins/side-toolbar";

// CSS
import "draft-js/dist/Draft.css";
import "draft-js-side-toolbar-plugin/lib/plugin.css";
import "draft-js-inline-toolbar-plugin/lib/plugin.css";

const focusPlugin = createFocusPlugin();

const imagePlugin = createImagePlugin({ decorator: focusPlugin.decorator });
const inlineToolbarPlugin = createInlineToolbarPlugin({ imagePlugin });
const sideToolbarPlugin = createSideToolbarPlugin({ imagePlugin });
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
    )
  };

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

  onClickEditor = () => {
    this.focus();
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
            imagePlugin
          ]}
          spellCheck={true}
        />
        <InlineToolbar id={this.props.id} />
        <SideToolbar id={this.props.id} />
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



export default CustomEditor;
