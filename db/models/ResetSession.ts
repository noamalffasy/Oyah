import * as Sequelize from "sequelize";

import db from "../index";

export const ResetSession = db.define("resetsession", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  email: {
    type: Sequelize.TEXT
  }
});

// const Comments = await ResetSession.findAll().then((comments: any) => {
//   return comments;
// });
