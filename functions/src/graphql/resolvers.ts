// import * as sequelize from "sequelize";
// import jwt from "express-jwt";
import * as express from "express";
import * as toArray from "stream-to-array";
import * as sharp from "sharp";
import * as admin from "firebase-admin";
import * as algoliasearch from "algoliasearch";

import { User, Article, Comment, Quote } from "../db/models";
import config from "../config";

// import { parse as parseCookie } from "../utils/cookie";

const client = algoliasearch(
  config.algoliaKeys.ApplicationID,
  config.algoliaKeys.APIKey
);
const searchIndex = client.initIndex("articles");

const serviceAccount = require("../serviceAccountKey.json");
const bucket = admin.storage().bucket("oyah.xyz");

!admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://oyah-200816.firebaseapp.com"
    })
  : admin.app();

const MAGIC_NUMBERS = {
  jpg: "ffd8ffe0",
  jpg1: "ffd8ffe1",
  jpeg: "ffd8ffdb",
  png: "89504e47",
  gif: "47494638"
};

async function saveCookie({ res }: { res: express.Response }, idToken) {
  return new Promise(async (resolve, reject) => {
    const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 Days

    await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        async cookie => {
          const options: express.CookieOptions = {
            maxAge: expiresIn,
            httpOnly: true,
            // secure: false
            secure: true
          };

          res.cookie("__session", cookie, options);

          resolve(cookie);
        },
        err => {
          reject(err);
        }
      );
  });
}

async function isLoggedIn(
  { req, res },
  { cookie: _cookie, idToken } = { cookie: null, idToken: null }
) {
  return new Promise(async (resolve, reject) => {
    const cookie = _cookie
      ? _cookie
      : req && req.cookies && Object.keys(req.cookies).length !== 0
        ? req.cookies["__session"]
        : res.locals && res.locals.sessCookie
          ? res.locals.sessCookie
          : null;

    if (cookie) {
      await admin
        .auth()
        .verifySessionCookie(cookie, true)
        .then(async decodedClaims => {
          const { uid } = decodedClaims;

          const user = await User.get({ id: uid })
            .then((user: any) => {
              if (user !== null) {
                return user;
              } else {
                reject("User doesn't exist");
              }
            })
            .catch((err: Error) => {
              reject(err);
            });
          resolve(user);
        })
        .catch(err => {
          console.log(err);
          if (err.code === "auth/user-not-found") {
            reject("An error occured");
          } else {
            reject("Not logged in");
          }
        });
    } else if (idToken) {
      await admin
        .auth()
        .verifyIdToken(idToken, true)
        .then(async decodedToken => {
          const { uid } = decodedToken;

          const user = await User.get({ id: uid })
            .then((user: any) => {
              if (user !== null) {
                return user;
              } else {
                reject("User doesn't exist");
              }
            })
            .catch((err: Error) => {
              reject(err);
            });

          resolve(user);
        })
        .catch(() => {
          reject("Not logged in");
        });
    } else {
      reject("Not logged in");
    }
  });
}

function checkMagicNumbers(magic: any) {
  if (
    magic === MAGIC_NUMBERS.jpg ||
    magic === MAGIC_NUMBERS.jpg1 ||
    magic === MAGIC_NUMBERS.jpeg ||
    magic === MAGIC_NUMBERS.png ||
    magic === MAGIC_NUMBERS.gif
  )
    return true;
}

function isEmpty(str: string | undefined) {
  if (str !== "" && str !== undefined) {
    return false;
  }
  return true;
}

interface ConditionObj {
  condition: Boolean;
  error: String;
}

function checkConditions(conditions: Array<ConditionObj>) {
  const errors = conditions
    .filter(obj => obj.condition === false)
    .map(obj => obj.error);

  return errors.length > 0 ? errors.join("\n• ") : true;
}

async function writeFile(filename: any, data: any) {
  return new Promise(async (resolve, reject) => {
    const file = bucket.file(filename);

    await file
      .save(data)
      .then(() => resolve(data))
      .catch(err => reject(err));
    await file.makePublic();
  });
}

function saveResizedImages(data: any, _filename: any) {
  const filename = _filename.replace(".jpeg", "");

  const file = bucket.file(`${filename}_small.jpeg`);
  const stream = file.createWriteStream({
    metadata: { contentType: "image/jpeg" }
  });

  sharp(data)
    .resize(40, undefined)
    .max()
    .pipe(stream);

  stream
    .on("finish", () => {
      file.makePublic();
      return data;
    })
    .on("error", err => err);
}

export default {
  // Query
  allUsers: async () => {
    return await User.getAll()
      .then(users => users)
      .catch(err => {
        throw err;
      });
  },

  currentUser: async (_, __, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async user => {
        return { user };
      })
      .catch(err => {
        throw err;
      });
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
    return await Article.getAll()
      .then((articles: any) => articles)
      .catch(err => {
        throw err;
      });
  },
  getRandomQuote: async () => {
    return await Quote.getAll({
      order: "random"
    })
      .then((quotes: any) => {
        return quotes[0];
      })
      .catch((err: Error) => {
        throw err;
      });
  },

  // Mutation
  getUser: async (_: any, { id, email, nametag }: any) => {
    return id
      ? await User.get({ id })
          .then((user: any) => {
            return user;
          })
          .catch((err: Error) => {
            if (err.message === "Cannot read property 'get' of null") {
              throw new Error("User doesn't exist");
            }
            throw err;
          })
      : email
        ? await User.get({ email })
            .then((user: any) => {
              return user;
            })
            .catch((err: Error) => {
              if (err.message === "Cannot read property 'get' of null") {
                throw new Error("User doesn't exist");
              }
              throw err;
            })
        : await User.get({ nametag })
            .then((user: any) => {
              return user;
            })
            .catch((err: Error) => {
              if (err.message === "Cannot read property 'get' of null") {
                throw new Error("User doesn't exist");
              }
              throw err;
            });
  },
  signinUser: async (_: any, { authInfo }: any, ctx: any) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async user => {
        const { idToken } = authInfo;

        const cookie = await saveCookie(ctx, idToken);

        return { user, cookie };
      })
      .catch(err => {
        throw err;
      });
  },
  createUser: async (
    _: any,
    { email, name, nametag, image, authInfo: { idToken } }: any,
    ctx: any
  ) => {
    return await admin
      .auth()
      .verifyIdToken(idToken, true)
      .then(async decodedToken => {
        const {
          uid,
          firebase: { sign_in_provider: providerId }
        } = decodedToken;

        const newUser = {
          id: uid,
          email,
          nametag,
          name: name ? name : null,
          image,
          providerId,
          reddit: null,
          twitter: null
        };

        const user: any = await User.getOrCreate(
          { email: newUser.email },
          newUser,
          true
        )
          .then(user => user)
          .catch(err => {
            throw err;
          });

        const cookie = await saveCookie(ctx, idToken);

        return {
          user: {
            ...newUser,
            id: user.id,
            small_image: null,
            editor: false
          },
          cookie
        };
      })
      .catch(err => {
        throw err;
      });
  },
  updateUser: async (_: any, info: any, ctx: any) => {
    const { authInfo } = info;
    delete info.authInfo;

    return await isLoggedIn(ctx, authInfo)
      .then(async (oldUser: any) => {
        if (info.mains && info.mains.length > 0) {
          info.mains = info.mains.join(", ");
        } else {
          info.mains = "";
        }

        await admin
          .auth()
          .updateUser(oldUser.id, {
            email: info.email,
            displayName: info.nametag
          })
          .catch(err => {
            if (err === "email-already-exists") {
              throw new Error(
                "Email is already in use, please choose another one"
              );
            }
            throw err;
          });

        return await User.update({ id: oldUser.id, ...info })
          .then(async () => {
            return {
              user: {
                ...oldUser,
                ...info
              }
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
    //       return user;
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
    return await searchIndex
      .search({
        query: searchTerm,
        attributesToRetrieve: [
          "id",
          "authorID",
          "title",
          "path",
          "dominantColor"
        ],
        restrictSearchableAttributes: ["title", "content"]
      })
      .then(res => res.hits.map(article => ({ ...article, exists: true })))
      .catch(err => {
        throw err;
      });
    // return await Article.getAll({
    //   where: {
    //     or: [
    //       {
    //         title(title) {
    //           return title.toLowerCase().includes(searchTerm.toLowerCase());
    //         }
    //       },
    //       {
    //         content(content) {
    //           return content.toLowerCase().includes(searchTerm.toLowerCase());
    //         }
    //       }
    //     ]
    //   },
    //   order: ["createdAt", "DESC"]
    // })
    //   .then((articles: any) => articles)
    //   .catch(err => {
    //     throw err;
    //   });
  },
  getArticle: async (_: any, { id }: any) => {
    return await Article.get({ id }).then(async (article: any) => {
      if (article !== null) {
        return article;
      } else {
        return {
          errors: ["Article doesn't exist"]
        };
      }
    });
  },
  getArticlesByUser: async (_: any, { authorID }: any) => {
    return await Article.getAll({ authorID })
      .then((articles: any) => (articles[0].exists ? articles : []))
      .catch(err => {
        throw err;
      });
  },
  likeArticle: async (_: any, { articleID }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (user: any) => {
        const likedArticles = user.likes.split(", ");
        const indexOfArticle = likedArticles.indexOf(articleID);
        const liked = indexOfArticle !== -1;
        const likes = !liked
          ? [...likedArticles, articleID].join(", ")
          : likedArticles
              .slice(0, indexOfArticle)
              .concat(likedArticles.slice(indexOfArticle + 1))
              .join(", ");

        return await Article.get({ id: articleID }).then(
          async (article: any) => {
            return await Article.update({
              id: articleID,
              likes: !liked ? article.likes + 1 : article.likes - 1
            })
              .then(async (article: any) => {
                return await User.update({ id: user.id, likes })
                  .then(() => {
                    searchIndex.partialUpdateObject({
                      objectID: articleID,
                      likes: Object.keys(article.likes).length
                    });

                    return article;
                  })
                  .catch((err: Error) => {
                    throw err;
                  });
              })
              .catch((err: any) => {
                throw err;
              });
          }
        );
      })
      .catch(err => {
        throw err;
      });
  },
  sendComment: async (
    _: any,
    { id, articleID, message, authInfo }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async (user: any) => {
        return await Comment.getOrCreate(
          { id },
          {
            id,
            articleID,
            authorID: user.id,
            message,
            likes: 0,
            createdAt: new Date().toString()
          }
        ).then(async comment => {
          return comment;
        });
      })
      .catch(err => {
        throw err;
      });
  },
  likeComment: async (_: any, { id, articleID }: any, ctx: any) => {
    return await isLoggedIn(ctx)
      .then(async (user: any) => {
        const likedComments = user.comment_likes.split(", ");
        const commentID = JSON.stringify({ articleID, id });
        const indexOfComment = likedComments.indexOf(commentID);
        const liked = indexOfComment !== -1;
        const commentLikes = !liked
          ? [...likedComments, commentID].join(", ")
          : likedComments
              .slice(0, indexOfComment)
              .concat(likedComments.slice(indexOfComment + 1))
              .join(", ");
        return await Comment.get({ id, articleID }).then(
          async (comment: any) => {
            return await Comment.update({
              id,
              articleID,
              likes: liked ? comment.likes + 1 : comment.likes - 1
            })
              .then(async (comment: any) => {
                return await User.update({
                  id: user.id,
                  comment_likes: commentLikes
                })
                  .then(() => {
                    return comment;
                  })
                  .catch((err: Error) => {
                    throw err;
                  });
              })
              .catch((err: any) => {
                throw err;
              });
          }
        );
      })
      .catch(err => {
        throw err;
      });
  },
  updateComment: async (
    _: any,
    { id, articleID, message, authInfo }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async (user: any) => {
        const comment: any = await Comment.get({ id, articleID });
        if (comment.authorID === user.id) {
          return await Comment.update({ id, articleID, message })
            .then(() => {
              return { ...comment, author: user, message };
            })
            .catch(err => {
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
  deleteComment: async (_: any, { id, articleID, authInfo }: any, ctx: any) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async (user: any) => {
        const comment: any = await Comment.get({ id, articleID });

        if (comment.authorID === user.id) {
          Comment.destroy({ id, articleID })
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
    { id, title, content, authorID, authInfo }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async () => {
        const doesExist = async filename => {
          return await bucket
            .file(filename)
            .exists()
            .then(data => (data[0] ? true : false));
        };

        const check = await checkConditions([
          {
            condition: !isEmpty(title),
            error: "Title mustn't be empty"
          },
          {
            condition: await doesExist(`articles/${id}/main.jpeg`),
            error: "Image mustn't be empty"
          },
          {
            condition: !isEmpty(content),
            error: "Content mustn't be empty"
          }
        ]);

        if (check === true) {
          const newArticle = {
            id,
            title,
            path: `https://storage.googleapis.com/oyah.xyz/articles/${id}/main.jpeg`,
            content,
            authorID,
            likes: "",
            createdAt: new Date().toString()
          };

          return await Article.getOrCreate(
            { id: newArticle.id },
            { ...newArticle, id: newArticle.id }
          )
            .then((res: any) => {
              searchIndex.addObject({
                objectID: res.id,
                likes: "",
                ...newArticle
              });
              return res;
            })
            .catch(err => {
              throw err;
            });
        } else {
          throw check;
        }
      })
      .catch(err => {
        throw err;
      });
  },
  updateArticle: async (
    _: any,
    { id, title, path: _path, content, authInfo }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async (user: any) => {
        const article: any = await Article.get({ id });
        if (article.authorID.toString() === user.id) {
          const path = _path ? _path : article.path;

          const newArticle = {
            id,
            title,
            path,
            content
          };

          return await Article.update(newArticle)
            .then(() => {
              searchIndex.partialUpdateObject({
                objectID: id,
                ...newArticle
              });

              return newArticle;
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
  deleteArticle: async (_: any, { id, authInfo }: any, ctx: any) => {
    return await isLoggedIn(ctx, authInfo)
      .then(async (user: any) => {
        const article: any = await Article.get({ id });

        if (article.authorID.toString() === user.id) {
          return await Article.destroy({ id })
            .then((result: any) => {
              searchIndex.deleteObject(id);

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
    { file, where, articleID, main, image }: any,
    ctx: any
  ) => {
    return await isLoggedIn(ctx)
      .then(async (user: any) => {
        // const path = require("path");
        const util = require("util");
        const shortid = require("shortid");
        const _file = await file;

        if (user) {
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
              ? "user-#" + user.id + ".jpeg"
              : articleID +
                (main ? "/main" : "/" + shortid.generate()) +
                ".jpeg"
            : where === "user"
              ? "user-#" + user.id + ".jpeg"
              : articleID +
                (main ? "/main" : "/" + shortid.generate()) +
                ".jpeg";
          if (checkMagicNumbers(magic)) {
            return await writeFile(
              where === "user" ? `users/${filename}` : `articles/${filename}`,
              buffer
            )
              .then(async () => {
                if (where === "user") {
                  return await User.update({ id: user.id, image: filename })
                    .then(async () => {
                      saveResizedImages(buffer, `users/${filename}`);
                    })
                    .catch((err: any) => {
                      throw err;
                    });
                } else {
                  saveResizedImages(buffer, `articles/${filename}`);
                }

                return {
                  path:
                    where === "user"
                      ? `https://storage.googleapis.com/oyah.xyz/users/${filename}`
                      : `https://storage.googleapis.com/oyah.xyz/articles/${filename}`
                };
              })
              .catch((err: Error) => {
                throw err;
              });
          } else {
            throw new Error("File is not valid");
          }
        } else {
          throw new Error("Incorrect password");
        }
      })
      .catch(err => {
        throw err;
      });
  }
};
