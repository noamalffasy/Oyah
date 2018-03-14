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
  },
  likes: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE
  }
});

let Comments;

Comment.findAll().then(comments => {
  Comments = comments;
});
