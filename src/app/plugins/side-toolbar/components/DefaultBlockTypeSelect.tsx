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
import VideoButton from "./VideoButton";

import BlockTypeSelect from "./BlockTypeSelect";

const DefaultBlockTypeSelect = ({
  id,
  imagePlugin,
  videoPlugin,
  getEditorState,
  setEditorState,
  openVideoModal,
  closeVideoModal,
  theme
}) => (
  <BlockTypeSelect
    id={id}
    imagePlugin={imagePlugin}
    videoPlugin={videoPlugin}
    getEditorState={getEditorState}
    setEditorState={setEditorState}
    openVideoModal={openVideoModal}
    closeVideoModal={closeVideoModal}
    theme={theme}
    structure={[
      HeadlineOneButton,
      HeadlineTwoButton,
      UnorderedListButton,
      OrderedListButton,
      // BlockquoteButton,
      // CodeBlockButton,
      ImageButton,
      VideoButton
    ]}
  />
);

export default DefaultBlockTypeSelect;
