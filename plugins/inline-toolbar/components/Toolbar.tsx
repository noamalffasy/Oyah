import * as React from "react";
import { Component } from "react";
import { getVisibleSelectionRect } from "draft-js";

const getRelativeParent = element => {
  if (!element) {
    return null;
  }

  const position = window
    .getComputedStyle(element)
    .getPropertyValue("position");
  if (position !== "static") {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

interface Props {
  imagePlugin: any;
  id: any;
  theme: any;
  store: any;
  structure: any;
}

interface State {
  isVisible: boolean;
  position: any;
  overrideContent: any;
}

class Toolbar extends Component<Props, State> {
  state = {
    isVisible: false,
    position: undefined,

    /**
     * If this is set, the toolbar will render this instead of the regular
     * structure and will also be shown when the editor loses focus.
     * @type {Component}
     */
    overrideContent: undefined
  };

  toolbar: HTMLDivElement = null;

  componentWillMount() {
    this.props.store.subscribeToItem("selection", this.onSelectionChanged);
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem("selection", this.onSelectionChanged);
  }

  /**
   * This can be called by a child in order to render custom content instead
   * of the regular structure. It's the responsibility of the callee to call
   * this function again with `undefined` in order to reset `overrideContent`.
   * @param {Component} overrideContent
   */
  onOverrideContent = overrideContent => {
    this.setState({ overrideContent });
  };

  onSelectionChanged = () => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      if (!this.toolbar) return;
      const relativeParent = getRelativeParent(this.toolbar.parentElement);
      const toolbarHeight = this.toolbar.clientHeight;
      const relativeRect = (
        relativeParent || document.body
      ).getBoundingClientRect();
      const selectionRect = getVisibleSelectionRect(window);

      if (!selectionRect) return;

      const position = {
        top: selectionRect.top - relativeRect.top - toolbarHeight,
        left: selectionRect.left - relativeRect.left + selectionRect.width / 2
      };
      this.setState({ position });
    });
  };

  getStyle() {
    const { store } = this.props;
    const { overrideContent, position } = this.state;
    const selection = store
      .getItem("getEditorState")()
      .getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    const isVisible =
      (!selection.isCollapsed() && selection.getHasFocus()) || overrideContent;
    const style = { ...position };

    if (isVisible) {
      style.visibility = "visible";
      style.transform = "translate(-50%) scale(1)";
      style.transition = "transform 0.15s cubic-bezier(.3,1.2,.2,1)";
    } else {
      style.transform = "translate(-50%) scale(0)";
      style.visibility = "hidden";
    }

    return style;
  }

  render() {
    const { imagePlugin, id, theme, store, structure } = this.props;
    const { overrideContent: OverrideContent } = this.state;
    const childrenProps = {
      id,
      imagePlugin,
      theme: theme.buttonStyles,
      getEditorState: store.getItem("getEditorState"),
      setEditorState: store.getItem("setEditorState"),
      onOverrideContent: this.onOverrideContent
    };

    return (
      <div
        className={theme.toolbarStyles.toolbar}
        style={this.getStyle()}
        ref={div => (this.toolbar = div)}
      >
        {OverrideContent ? (
          <OverrideContent {...childrenProps} />
        ) : (
          structure.map((Component, index) => (
            <Component key={index} {...childrenProps} />
          ))
        )}
      </div>
    );
  }
}

export default Toolbar;
