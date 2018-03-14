import * as Sequelize from "sequelize";

import db from "../index";

export const Article = db.define("article", {
  title: {
    type: Sequelize.TEXT
  },
  path: {
    type: Sequelize.TEXT
  },
  content: {
    type: Sequelize.TEXT
  },
  authorID: {
    type: Sequelize.INTEGER
  },
  likes: {
    type: Sequelize.INTEGER
  },
  createdAt: {
    type: Sequelize.DATE
  }
});

let Articles;

Article.findAll().then(articles => {
  Articles = articles;
});