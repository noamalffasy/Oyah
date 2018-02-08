import * as Sequelize from "sequelize";

import db from "../index";

export const Comment = db.define("comment", {
  articleID: {
    type: Sequelize.TEXT
  },
  authorID: {
    type: Sequelize.TEXT
  },
  message: {
    type: Sequelize.TEXT
  }
});

let Comments;

Comment.findAll().then(comments => {
  Comments = comments;
});
