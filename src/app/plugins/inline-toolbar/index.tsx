import decorateComponentWithProps from "decorate-component-with-props";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton
  // CodeButton
} from "draft-js-buttons";
import { Separator } from "draft-js-inline-toolbar-plugin";

import createStore from "./utils/createStore";
import Toolbar from "./components/Toolbar";

import toolbarStyles from "../toolbarStyles.css";
import buttonStyles from "../buttonStyles.css";

export default config => {
  const defaultTheme = { toolbarStyles, buttonStyles };

  const store = createStore({
    isVisible: false
  });

  const {
    theme = defaultTheme,
    structure = [
      BoldButton,
      ItalicButton,
      UnderlineButton,
      config.LinkButton
      // CodeButton
    ],
    imagePlugin
  }: any = config;

  const toolbarProps = {
    store,
    structure,
    theme,
    imagePlugin
  };

  return {
    initialize: ({ getEditorState, setEditorState }: any) => {
      store.updateItem("getEditorState", getEditorState);
      store.updateItem("setEditorState", setEditorState);
    },
    // Re-Render the text-toolbar on selection change
    onChange: (editorState: any) => {
      store.updateItem("selection", editorState.getSelection());
      return editorState;
    },
    InlineToolbar: decorateComponentWithProps(Toolbar, toolbarProps)
  };
};

export { Separator };
