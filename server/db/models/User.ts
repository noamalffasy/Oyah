import * as Sequelize from "sequelize";

import db from "../index";

export const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    nametag: {
      type: Sequelize.TEXT
    },
    name: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.TEXT
    },
    password: {
      type: Sequelize.TEXT
    },
    likes: {
      type: Sequelize.TEXT
    },
    comment_likes: {
      type: Sequelize.TEXT
    },
    image: {
      type: Sequelize.TEXT
    },
    bio: {
      type: Sequelize.TEXT
    },
    mains: {
      type: Sequelize.TEXT
    },
    reddit: {
      type: Sequelize.TEXT
    },
    twitter: {
      type: Sequelize.TEXT
    },
    editor: {
      type: Sequelize.BOOLEAN
    },
    is_team: {
      type: Sequelize.BOOLEAN
    }
  },
  {
    timestamps: false
  }
);

let Users;

User.findAll().then(users => {
  Users = users;
});
