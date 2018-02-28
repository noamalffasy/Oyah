import * as Sequelize from "sequelize";

import db from "../index";

export const Quote = db.define(
  "quote",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    quote: {
      type: Sequelize.TEXT
    },
    author: {
      type: Sequelize.TEXT
    }
  },
  {
    timestamps: false
  }
);

// const Quotes = await Quote.findAll().then((quotes: any) => {
//   return quotes;
// });
