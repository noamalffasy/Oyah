import decorateComponentWithProps from "decorate-component-with-props";
import createStore from "./utils/createStore";

import Toolbar from "./components/Toolbar";
import DefaultBlockTypeSelect from "./components/DefaultBlockTypeSelect";

import buttonStyles from "../buttonStyles.css";
import toolbarStyles from "../toolbarStyles.css";
import blockTypeSelectStyles from "./blockTypeSelectStyles.css";

export default (config = {}) => {
  const defaultTheme = { buttonStyles, toolbarStyles, blockTypeSelectStyles };

  const store = createStore({
    isVisible: false
  });

  const {
    theme = defaultTheme,
    structure = [DefaultBlockTypeSelect],
    imagePlugin,
    videoPlugin
  }: any = config;

  const toolbarProps = {
    store,
    structure,
    theme,
    imagePlugin,
    videoPlugin
  };

  return {
    initialize: ({ setEditorState, getEditorState, getEditorRef }) => {
      store.updateItem("getEditorState", getEditorState);
      store.updateItem("setEditorState", setEditorState);
      store.updateItem("getEditorRef", getEditorRef);
    },
    // Re-Render the toolbar on every change
    onChange: editorState => {
      store.updateItem("editorState", editorState);
      return editorState;
    },
    SideToolbar: decorateComponentWithProps(Toolbar, toolbarProps)
  };
};
