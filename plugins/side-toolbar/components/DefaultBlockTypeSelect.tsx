import * as React from "react";

import {
  HeadlineOneButton,
  HeadlineTwoButton,
  // BlockquoteButton,
  // CodeBlockButton,
  UnorderedListButton,
  OrderedListButton
} from "draft-js-buttons";
import ImageButton from "../../inline-toolbar/components/ImageButton";

import BlockTypeSelect from "./BlockTypeSelect";

const DefaultBlockTypeSelect = ({
  id,
  imagePlugin,
  getEditorState,
  setEditorState,
  theme
}) => (
  <BlockTypeSelect
    id={id}
    imagePlugin={imagePlugin}
    getEditorState={getEditorState}
    setEditorState={setEditorState}
    theme={theme}
    structure={[
      HeadlineOneButton,
      HeadlineTwoButton,
      UnorderedListButton,
      OrderedListButton,
      // BlockquoteButton,
      // CodeBlockButton,
      ImageButton
    ]}
  />
);

export default DefaultBlockTypeSelect;
