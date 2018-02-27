import * as sequelize from "sequelize";
// import jwt from "express-jwt";
import * as nodemailer from "nodemailer";
import * as toArray from "stream-to-array";
import * as sharp from "sharp";
import * as Hashids from "hashids";

import db from "../db";
import { User, Article, Comment, ResetSession } from "../db/models";

import { createSession, getSessionOnJWT } from "../db/models/Session";

const MAGIC_NUMBERS = {
  jpg: "ffd8ffe0",
  jpg1: "ffd8ffe1",
  png: "89504e47",
  gif: "47494638"
};

async function isLoggedIn(ctx: any) {
  return new Promise(async (resolve, reject) => {
    if (ctx.state.jwt) {
      const token = ctx.state.jwt;
      const session: any = await getSessionOnJWT(token);

      session.user = await session.getUser();
      resolve(session);
    } else {
      reject("User is not logged in (or authenticated).");
    }
  });
}

function checkMagicNumbers(magic: any) {
  if (
    magic == MAGIC_NUMBERS.jpg ||
    magic == MAGIC_NUMBERS.jpg1 ||
    magic == MAGIC_NUMBERS.png ||
    magic == MAGIC_NUMBERS.gif
  )
    return true;
}

function writeFile(filename: any, data: any, encoding: any, extname: any) {
  const fs = require("fs");
  return new Promise((resolve, reject) => {
    sharp(data).toFile(filename.replace(extname, ".jpeg"), (err, info) => {
      if (err) reject(err);
      resolve(data);
    });
    // fs.writeFile(filename, data, encoding, (err: Error) => {
    //   if (err) reject(err);
    //   else resolve(data);
    // });
  });
}

function saveResizedImages(_filename: any, extname: any) {
  const filename = _filename.replace(extname, "");

  sharp(_filename.replace(extname, ".jpeg"))
    .resize(40, undefined)
    .withoutEnlargement()
    .toFile(filename + "_small.jpeg", (err, info) => {
      if (err) throw err;
    });
}

function parseJSONLiteral(ast: any) {
  switch (ast.kind) {
    case ast.kind.STRING:
    case ast.kind.BOOLEAN:
      return ast.value;
    case ast.kind.INT:
    case ast.kind.FLOAT:
      return parseFloat(ast.value);
    case ast.kind.OBJECT: {
      const value = Object.create(null);
      ast.fields.forEach((field: any) => {
        value[field.name.value] = parseJSONLiteral(field.value);
      });

      return value;
    }
    case ast.kind.LIST:
      return ast.values.map(parseJSONLiteral);
    default:
      return null;
  }
}

async function _sendMail(mailOptions: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "noahm1228@gmail.com",
      pass: "200702579"
    }
  });

  // send mail with defined transport object
  return await transporter
    .sendMail(mailOptions)
    .then(info => {
      return { status: true };
    })
    .catch(err => {
      throw err;
    });
}

export default {
  // Query
  allUsers: async () => {
    const fs = require("fs");
    return await User.findAll().then((users: any) => {
      let Users: any[] = [];
      users.forEach((user: any) => {
        Users.push(user.dataValues);
      });
      return Users;
    });
  },

  currentUser: async (_: any, {}, ctx: any) => {
    try {
      return await isLoggedIn(ctx)
        .then(async session => {
          return {
            ok: true,
            session
          };
        })
        .catch(err => {
          return {
            ok: false,
            errors: [err]
          };
        });
    } catch (e) {
      return {
        ok: false,
        errors: e
      };
    }
    // return await isLoggedIn(ctx)
    // .then(async res => {
    // const user = res.user;

    // return user;
    // return res;
    // })
    // .catch(err => {
    //   throw err;
    // });
  },
  allArticles: async () => {
    return await Article.findAll().then((articles: any) => {
      let Articles: any[] = [];
      articles.forEach((article: any) => {
        Articles.push(article.dataValues);
      });
      return Articles;
    });
  },

  // Mutation
  getUser: async (_: any, { id, email }: any) => {
    const path = require("path");
    const fs = require("fs");

    return id
      ? await User.findOne({ where: { id } })
          .then((user: any) => {
            return user.get({ plain: true });
          })
          .catch((err: Error) => {
            if (err.message === "Cannot read property 'get' of null") {
              throw new Error("User doesn't exist");
            }
            throw err;
          })
      : await User.findOne({ where: { email } })
          .then((user: any) => {
            return user.get({ plain: true });
          })
          .catch((err: Error) => {
            if (err.message === "Cannot read property 'get' of null") {
              throw new Error("User doesn't exist");
            }
            throw err;
          });
  },
  signinUser: async (_: any, { email }: any, ctx: any) => {
    const bcrypt = require("bcrypt");
    const path = require("path");
    const fs = require("fs");

    let user = await User.findOne({ where: { email: email.email } })
      .then((user: any) => {
        if (user !== null) {
          return user.get({ plain: true });
        }
        throw "User not found";
      })
      .catch((err: Error) => {
        throw err;
      });

    return await bcrypt
      .compare(email.password, user.password)
      .then(async (res: any) => {
        if (res) {
          // const cert = fs.readFileSync("private.key"); // get private key
          const token = await createSession({
            id: user.id,
            nametag: user.nametag,
            name: user.name,
            email: user.email,
            password: email.password
          });

          ctx.cookies.set("reactQLJWT", token.jwt(), {
            expires: token.expiresAt
          });

          return { token: token.jwt(), user };
        } else {
          throw "Incorrect password";
        }
      });
  },
  createUser: async (
    _: any,
    { authProvider, nametag, name }: any,
    ctx: any
  ) => {
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const saltRounds = 10;

    let password = await bcrypt
      .hash(authProvider.email.password, saltRounds)
      .then((hash: any) => {
        return hash;
      });

    const newUser = {
      nametag: nametag,
      name: name ? name : null,
      email: authProvider.email.email,
      password: password,
      likes: "",
      comment_likes: ""
    };

    const response = User.findOrCreate({
      where: { email: newUser.email },
      defaults: newUser
    });

    const exists = await response.spread((user: any, created: any) => {
      return !created;
    });

    if (!exists) {
      const id = await response
        .then(() => User.findOrCreate({ where: { email: newUser.email } }))
        .spread((user: any, created: any) => {
          return user.get({ plain: true }).id;
        });

      const token = await createSession({
        id,
        nametag: newUser.nametag,
        name: newUser.name,
        email: newUser.email,
        password: authProvider.email.password
      });

      ctx.cookies.set("reactQLJWT", token.jwt(), {
        expires: token.expiresAt
      });

      return {
        user: {
          id,
          nametag: newUser.nametag,
          name: newUser.name,
          email: newUser.email,
          password: authProvider.email.password,
          image: null,
          small_image: null,
          editor: false
        },
        token
      };
    } else {
      throw new Error("User already exists");
    }
  },
  forgetPassword: async (_: any, { email }: any) => {
    let id: number;
    while (true) {
      id = Math.floor(Math.random() * 900000) + 100000;

      const sess = ResetSession.findOrCreate({
        where: { id },
        defaults: { id, email }
      });

      const exists = await sess.spread((session: any, created: any) => {
        return !created;
      });

      if (!exists) {
        setTimeout(() => {
          ResetSession.destroy({ where: { id } });
        }, 15 * 60000);
        break;
      }
    }

    const hashids = new Hashids("oyah.xyz", 8);

    const mailOptions = {
      from: `Oyah`,
      to: email,
      subject: "Oyah reset password",
      text: "https://www.oyah.xyz/reset?id=" + hashids.encode(id)
    };

    return await _sendMail(mailOptions);
  },
  getResetEmail: async (_: any, { id }: any) => {
    return await ResetSession.findOne({ where: { id } })
      .then((res: any) => {
        const resetSession = res.get({ plain: true });

        return resetSession;
      })
      .catch((err: Error) => {
        throw err;
      });
  },
  resetPassword: async (_: any, { email, password: _password }: any, ctx: any) => {
    const bcrypt = require("bcrypt");
    const saltRounds = 10;

    const _oldUser = await User.findOne({ where: { email } });
    const oldUser = _oldUser.get({ plain: true });

    const password = await bcrypt
      .hash(_password, saltRounds)
      .then((hash: any) => {
        return hash;
      });

    return await User.update({ ...oldUser, password }, { where: { email } })
      .then(async (result: any) => {
        const token = await createSession({ ...oldUser, password });

        ctx.cookies.set("reactQLJWT", token.jwt(), {
        expires: token.expiresAt
      });

        return {
          user: {
            ...oldUser,
            password
          },
          token
        };
      })
      .catch((err: Error) => {
        throw err;
      });
  },
  updateUser: async (_: any, info: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const oldUser = res.user;
        const bcrypt = require("bcrypt");
        const saltRounds = 10;

        let password;
        if (info.password) {
          password = await bcrypt
            .hash(info.password, saltRounds)
            .then((hash: any) => {
              return hash;
            });
          info.password = password;
        }

        if (info.mains && info.mains.length > 0) {
          info.mains = info.mains.join(", ");
        } else {
          info.mains = "";
        }

        info.password ? delete info[password] : "";
        return User.update(info, { where: { email: oldUser.email } })
          .then(async (result: any) => {
            const token = await createSession({ ...oldUser, ...info });

            return {
              user: {
                ...oldUser,
                ...info
              },
              token
            };
          })
          .catch((err: Error) => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
    // if (context !== undefined) {
    //   const bcrypt = require("bcrypt");
    //   const path = require("path");
    //   const fs = require("fs");
    //   const jwt = require("jsonwebtoken");
    //   const saltRounds = 10;

    //   if (info.password) {
    //     const password = await bcrypt
    //       .hash(info.password, saltRounds)
    //       .then(hash => {
    //         return hash;
    //       });
    //     info.password = password;
    //   }

    //   if (info.mains && info.mains.length > 0) {
    //     info.mains = info.mains.join(", ");
    //   } else {
    //     info.mains = "";
    //   }

    //   const oldUser = await User
    //     .findOne({ where: { email: context.user.email } })
    //     .then(user => {
    //       return user.get({ plain: true });
    //     })
    //     .catch(err => {
    //       throw err;
    //     });

    //   if (user.image !== null) {
    //     const image = user.image;

    //     user.small_image =
    //       image.replace(/\..*$/, "") +
    //       "_small" +
    //       image.replace(/.*(?=\.)/, "");
    //   } else {
    //     user.small_image = null;
    //   }

    //   return bcrypt
    //     .compare(context.user.password, oldUser.password)
    //     .then(res => {
    //       if (res) {
    //         info.password ? delete info[password] : "";
    //         return User
    //           .update(info, { where: { email: context.user.email } })
    //           .then(async result => {
    //             const token = await createSession({ ...oldUser, ...info });
    //             return {
    //               user: {
    //                 ...oldUser,
    //                 ...info
    //               },
    //               token
    //             };
    //           })
    //           .catch(err => {
    //             throw err;
    //           });
    //       } else {
    //         throw "Incorrect password";
    //       }
    //     });
    // } else {
    //   throw new Error("User is not logged in (or authenticated).");
    // }
  },
  searchArticle: async (_: any, { searchTerm }: any) => {
    return await Article.findAll({
      where: {
        title: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("title")),
          "LIKE",
          "%" + searchTerm.toLowerCase() + "%"
        )
      }
    }).then((articles: any) => {
      let Articles: any[] = [];
      articles.forEach((article: any) => {
        Articles.push(article.dataValues);
      });
      return Articles;
    });
  },
  getArticle: async (_: any, { id }: any) => {
    return await Article.findOne({ where: { id } }).then(
      async (_article: any) => {
        if (_article !== null) {
          const article = _article.get({ plain: true });
          return await Comment.findAll({ where: { articleID: id } }).then(
            async (comments: any) => {
              return { ...article, comments };
            }
          );
        } else {
          return {
            errors: ["Article doesn't exist"]
          };
        }
      }
    );
  },
  likeArticle: async (_: any, { articleID, liked }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user;
        const likedArticles = user.likes.split(", ");
        const indexOfArticle = likedArticles.indexOf(articleID);
        const likes = liked
          ? [...likedArticles, articleID].join(", ")
          : likedArticles
              .slice(0, indexOfArticle)
              .concat(likedArticles.slice(indexOfArticle + 1))
              .join(", ");
        return await Article.findOne({ where: { id: articleID } }).then(
          async (_article: any) => {
            const article = _article.get({ plain: true });
            return await Article.update(
              { likes: liked ? article.likes + 1 : article.likes - 1 },
              { where: { id: articleID } }
            )
              .then(async (_article: any) => {
                return await User.update({ likes }, { where: { id: user.id } })
                  .then((user: any) => {
                    return article;
                  })
                  .catch((err: Error) => {
                    console.error(err);
                  });
              })
              .catch((err: any) => {
                console.error(err);
              });
          }
        );
      })
      .catch(err => {
        throw err;
      });
  },
  sendComment: async (_: any, { id, articleID, message }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user;
        await Comment.findOrCreate({
          where: { id },
          defaults: { articleID, authorID: user.id, message }
        });
        return { id, articleID, authorID: user.id, message };
      })
      .catch(err => {
        throw err;
      });
  },
  likeComment: async (_: any, { id, articleID, liked }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user;
        const likedComments = user.comment_likes.split(", ");
        const commentID = JSON.stringify({ articleID, id });
        const indexOfComment = likedComments.indexOf(commentID);
        const commentLikes = liked
          ? [...likedComments, commentID].join(", ")
          : likedComments
              .slice(0, indexOfComment)
              .concat(likedComments.slice(indexOfComment + 1))
              .join(", ");
        return await Comment.findOne({ where: { id, articleID } }).then(
          async (_comment: any) => {
            const comment = _comment.get({ plain: true });
            return await Comment.update(
              { likes: liked ? comment.likes + 1 : comment.likes - 1 },
              { where: { id, articleID } }
            )
              .then(async (_comment: any) => {
                return await User.update(
                  { comment_likes: commentLikes },
                  { where: { id: user.id } }
                )
                  .then((user: any) => {
                    return comment;
                  })
                  .catch((err: Error) => {
                    console.error(err);
                  });
              })
              .catch((err: any) => {
                console.error(err);
              });
          }
        );
      })
      .catch(err => {
        throw err;
      });
  },
  updateComment: async (_: any, { id, articleID, message }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user.dataValues;
        const comment = await Comment.find({ where: { id, articleID } });
        if (comment.dataValues.authorID === user.id) {
          await Comment.update({ message }, { where: { id, articleID } });
          return { id, articleID, authorID: user.id, message };
        } else {
          throw new Error(
            "This user is not the author of the selected comment"
          );
        }
      })
      .catch(err => {
        throw err;
      });
  },
  deleteComment: async (_: any, { id, articleID }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user.dataValues;
        const comment = await Comment.find({ where: { id, articleID } });
        if (comment.dataValues.authorID === user.id) {
          Comment.destroy({ where: { id, articleID } })
            .then((result: any) => {
              return { status: result };
            })
            .catch((err: any) => {
              throw err;
            });
        } else {
          throw new Error(
            "This user is not the author of the selected comment"
          );
        }
      })
      .catch(err => {
        throw err;
      });
  },
  createArticle: async (
    _: any,
    { id, title, content, authorID }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const newArticle = {
          id,
          title,
          content,
          authorID
        };

        Article.findOrCreate({
          where: { id: newArticle.id },
          defaults: newArticle
        });

        return newArticle;
      })
      .catch(err => {
        throw err;
      });
  },
  updateArticle: async (_: any, { id, title, content }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user.dataValues;
        const article = await Article.find({ where: { id } });
        if (article.dataValues.authorID.toString() === user.id) {
          await Article.update({ title, content }, { where: { id } })
            .then((result: any) => {
              return {
                id,
                title,
                content
              };
            })
            .catch((err: Error) => {
              throw err;
            });
        } else {
          throw new Error(
            "This user is not the author of the selected article"
          );
        }
      })
      .catch(err => {
        throw err;
      });
  },
  deleteArticle: async (_: any, { id }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const user = res.user.dataValues;
        const article = await Article.find({ where: { id } });
        if (article.dataValues.authorID.toString() === user.id) {
          await Article.destroy({ where: { id } })
            .then((result: any) => {
              return { status: result };
            })
            .catch((err: Error) => {
              throw err;
            });
        } else {
          throw new Error(
            "This user is not the author of the selected article"
          );
        }
      })
      .catch(err => {
        throw err;
      });
  },
  uploadFile: async (
    _: any,
    { file, where, articleID, image }: any,
    ctx: any
  ) => {
    // uploadFile: async (_: any, args: any, ctx: any) => {
    // const req = root.rootValue.req;
    return await isLoggedIn(ctx)
      .then(async (res: any) => {
        const path = require("path");
        const fs = require("fs");
        const util = require("util");
        const _file = await file;

        if (res) {
          const user = res.user;

          const id = where === "user" ? user.id : null;
          const buffer = !image
            ? await toArray(_file.stream).then((parts: any) => {
                const buffers = parts.map(
                  (part: any) =>
                    util.isBuffer(part) ? part : Buffer.from(part)
                );
                return Buffer.concat(buffers);
              })
            : Buffer.from(
                image.replace(/data:image\/(.*?);base64,/, ""),
                "base64"
              );
          const magic = buffer.toString("hex", 0, 4);
          const filename = !image
            ? where === "user"
              ? "user-#" + user.id + path.extname(_file.filename)
              : articleID + path.extname(_file.filename)
            : where === "user"
              ? "user-#" +
                user.id +
                "." +
                /data:image\/(.*?);base64/.exec(image)[1]
              : articleID + "." + /data:image\/(.*?);base64/.exec(image)[1];
          if (checkMagicNumbers(magic)) {
            return writeFile(
              where === "user"
                ? path.join(__dirname, "../static/img/users/") + filename
                : path.join(__dirname, "../static/img/articles/") + filename,
              buffer,
              "binary",
              !image
                ? path.extname(_file.filename)
                : /data:image\/(.*?);base64/.exec(image)[1]
            )
              .then(result => {
                if (where === "user") {
                  User.update({ image: filename }, { where: { id } })
                    .then((result: any) => {
                      saveResizedImages(
                        path.join(__dirname, "../static/img/users/") + filename,
                        !image
                          ? path.extname(_file.filename)
                          : "." + /data:image\/(.*?);base64/.exec(image)[1]
                      );
                      return { path: filename };
                    })
                    .catch((err: any) => {
                      throw err;
                    });
                } else {
                  saveResizedImages(
                    path.join(__dirname, "../static/img/articles/") + filename,
                    !image
                      ? path.extname(_file.filename)
                      : "." + /data:image\/(.*?);base64/.exec(image)[1]
                  );
                  return { path: filename };
                }
              })
              .catch(err => {
                throw err;
              });
          } else {
            throw "File is not valid";
          }
        } else {
          throw "Incorrect password";
        }
      })
      .catch(err => {
        throw err;
      });
  },
  sendMail: async (_: any, { name, email, subject, message }: any) => {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "noahm1234@outlook.com",
      subject: subject,
      text: message
    };

    return await _sendMail(mailOptions);
  }
};
