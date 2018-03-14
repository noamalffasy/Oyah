import * as React from "react";
import { Component } from "react";
import { findDOMNode } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// GraphQL
import graphql from "../../../utils/graphql";
import gql from "graphql-tag";

interface ImageButtonProps {
  getEditorState: any;
  setEditorState: any;
  id: any;
  imagePlugin: any;
  theme: any;
  uploadFile?: any;
}

@graphql(
  gql`
    mutation uploadFile(
      $file: Upload
      $where: String!
      $articleID: String
      $image: String
    ) {
      uploadFile(
        file: $file
        where: $where
        articleID: $articleID
        image: $image
      ) {
        path
      }
    }
  `,
  {
    name: "uploadFile"
  }
)
class ImageButton extends Component<ImageButtonProps> {
  preventBubblingUp = (e: any) => {
    e.preventDefault();
  };

  uploadImage = () => {
    const imageDialog = findDOMNode(this.imageDialog);
    try {
      imageDialog.click();
    } catch (e) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      imageDialog.dispatchEvent(evt);
    }
  };

  getFile = () => {
    const imageDialog = findDOMNode(this.imageDialog);

    this.props
      .uploadFile({
        variables: {
          file: imageDialog.files[0],
          where: "article",
          articleID: this.props.id
        }
      })
      .then((res: any) => {
        this.addImage(res.data.uploadFile.path);
      })
      .catch(err => {
        console.error(err);
      });
  };

  addImage = (image: any) => {
    const { getEditorState, setEditorState } = this.props;
    setEditorState(this.props.imagePlugin.addImage(getEditorState(), image));
  };

  render() {
    const { theme } = this.props;
    return (
      <div className={theme.buttonWrapper} onMouseDown={this.preventBubblingUp}>
        <button
          className={theme.button}
          style={{ padding: "5px" }}
          onClick={this.uploadImage}
        >
          <FontAwesomeIcon icon="image" />
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={this.getFile}
          ref={dialog => (this.imageDialog = dialog)}
        />
      </div>
    );
  }
}

export default ImageButton;
