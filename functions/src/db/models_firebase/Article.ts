import db from "../index_firebase";
import * as Comment from "./Comment";

const articles = db.collection("articles");

export interface Interface {
  id: string;
  title?: string;
  path?: string;
  content?: string;
  authorID?: string;
  likes?: number;
  createdAt?: Date;
}

export const getAll = async (
  limit = null
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    if (!limit) {
      await articles
        .get()
        .then(_articles => {
          const articles = _articles.docs.map(article => ({
            id: article.id,
            ...article.data()
          }));
          resolve(articles);
        })
        .catch(err => reject(err));
    } else {
      const _articles = await articles
        .get()
        .then(_articles => {
          const articles = _articles.docs.map(article => ({
            id: article.id,
            ...article.data()
          }));
          return articles;
        })
        .catch(err => {
          throw err;
        });
      let articlesToReturn: FirebaseFirestore.DocumentData[] = [];
      for (const option in limit) {
        switch (option) {
          case "where":
            for (const operator in limit[option]) {
              switch (operator) {
                case "or":
                  const statements = limit[option][operator];
                  _articles.forEach(article => {
                    let toReturn = false;
                    statements.forEach(statement => {
                      for (const field in statement) {
                        toReturn = statement[field](article[field]);
                      }
                    });
                    if (toReturn) {
                      articlesToReturn.push(article);
                    }
                  });
                  break;
                case "order":
                  const firstField = limit[option][operator][0];
                  const secondField = limit[option][operator][1];
                  if (articlesToReturn.length > 0) {
                    const articles = articlesToReturn.sort((a, b) => {
                      if (a[firstField] < b[firstField]) {
                        return secondField === "desc" ? 1 : -1;
                      }
                      if (a[firstField] > b[firstField]) {
                        return secondField === "desc" ? -1 : 1;
                      }
                      return 0;
                    });

                    articles.forEach(article => {
                      articlesToReturn.push(article);
                    });
                  } else {
                    await articles
                      .orderBy(firstField, secondField)
                      .get()
                      .then(_articles => {
                        const articles = _articles.docs.map(article => ({
                          id: article.id,
                          ...article.data()
                        }));
                        articlesToReturn.push(articles);
                      })
                      .catch(err => reject(err));
                  }
                  break;
              }
            }
            break;
          default:
            const queryStatements: string[][] = Object.keys(option).map(
              identiferName => {
                return [identiferName, option[identiferName]];
              }
            );
            let query = articles.where(
              queryStatements[0][0],
              "==",
              queryStatements[0][1]
            );

            queryStatements.forEach((statement, i) => {
              if (i !== 0) {
                query = query.where(statement[0], "==", statement[1]);
              }
            });

            await query
              .get()
              .then(articles => {
                articles.docs.length > 0
                  ? articles.docs.forEach(article =>
                      resolve({ id: article.id, ...article.data() })
                    )
                  : { exists: false };
              })
              .catch(err => reject(err));
            break;
        }
      }
      resolve(articlesToReturn);
    }
  });
};

export const get = async (
  identifier: object,
  snapshot: boolean = false,
  reference: boolean = false
): Promise<
  | FirebaseFirestore.DocumentData
  | FirebaseFirestore.DocumentSnapshot
  | FirebaseFirestore.DocumentReference
> => {
  return new Promise(async (resolve, reject) => {
    if (
      Object.keys(identifier)[0] === "id" ||
      (reference && Object.keys(identifier)[0] === "id")
    ) {
      const propName = Object.keys(identifier)[0];
      const articleRef = articles.doc(identifier[propName]);

      const comments = await Comment.getAll({
        articleID: identifier[propName]
      }).then(comments => comments);

      if (!reference) {
        await articleRef.get().then(article => {
          resolve(
            snapshot
              ? article
              : article.exists
                ? { id: article.id, ...article.data(), comments }
                : { exists: false }
          );
        });
      } else {
        resolve(articleRef);
      }
    } else {
      const queryStatements: string[][] = Object.keys(identifier).map(
        identiferName => {
          return [identiferName, identifier[identiferName]];
        }
      );
      let query = articles.where(
        queryStatements[0][0],
        "==",
        queryStatements[0][1]
      );

      queryStatements.forEach((statement, i) => {
        if (i !== 0) {
          query = query.where(statement[0], "==", statement[1]);
        }
      });

      await query
        .get()
        .then(articles => {
          articles.docs.length > 0
            ? articles.docs.forEach(async article =>
                resolve(
                  snapshot
                    ? article
                    : {
                        id: article.id,
                        ...article.data(),
                        comments: await Comment.getAll({
                          articleID: article.id
                        }).then(comments => comments)
                      }
                )
              )
            : { exists: false };
        })
        .catch(err => reject(err));
    }
  });
};

export const create = async (
  info: Interface
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await articles
      .doc(info.id)
      .set(info)
      .then(async () => {
        await get({ id: info.id })
          .then(article => resolve(article))
          .catch(err => reject(err));
      });
  });
};

export const getOrCreate = async (
  identifier,
  info: Interface
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await get(identifier, true)
      .then(async (article: FirebaseFirestore.DocumentSnapshot) => {
        if (!article.exists) {
          await create(info)
            .then(article => resolve(article))
            .catch(err => reject(err));
        } else {
          await get(identifier)
            .then(article => resolve(article))
            .catch(err => reject(err));
        }
      })
      .catch(err => {
        throw err;
      });
  });
};

export const update = async (
  info: Interface
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await articles
      .doc(info.id)
      .update(info)
      .then(async () => {
        await get({ id: info.id })
          .then(article => resolve(article))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

export const destroy = async identifier => {
  return new Promise(async (resolve, reject) => {
    await get(identifier, false, true)
      .then(async (article: FirebaseFirestore.DocumentReference) => {
        article
          .delete()
          .then(res => resolve(res))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
