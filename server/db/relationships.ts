// ----------------------
// IMPORTS

/* App */
import { User, Session, Article, Comment } from "./models";

// ----------------------

// User has many sessions
User.hasMany(Session);
User.hasMany(Article, { foreignKey: "authorID" });
User.hasMany(Comment, { foreignKey: "authorID" });

Article.hasMany(Comment, { foreignKey: "articleID" });

// And a session belongs to a user
Session.belongsTo(User);
Article.belongsTo(User, {
  as: "author",
  foreignKey: "authorID"
});
Comment.belongsTo(User, {
  as: "author",
  foreignKey: "authorID"
});

Comment.belongsTo(Article, {
  as: "article",
  foreignKey: "articleID"
});
