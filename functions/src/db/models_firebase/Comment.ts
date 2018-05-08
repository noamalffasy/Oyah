import db from "../index_firebase";

const comments = db.collection("comments");

export interface Interface {
  id: string;
  articleID?: string;
  authorID?: string;
  message?: string;
  likes?: number;
  createdAt?: Date;
}

export const getAll = async (
  limit: object = null
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    if (!limit) {
      await comments
        .get()
        .then(_comments => {
          const comments = _comments.docs.map(comment => comment.data());
          resolve(comments);
        })
        .catch(err => reject(err));
    } else {
      const _comments = await comments
        .get()
        .then(_comments => {
          const comments = _comments.docs.map(comment => ({
            id: comment.id,
            ...comment.data()
          }));
          return comments;
        })
        .catch(err => {
          throw err;
        });

      let commentsToReturn: FirebaseFirestore.DocumentData[] = [];

      for (const option in limit) {
        switch (option) {
          case "where":
            for (const operator in limit[option]) {
              switch (operator) {
                case "or":
                  const statements = limit[option][operator];
                  _comments.forEach(comment => {
                    let toReturn = false;
                    statements.forEach(statement => {
                      for (const field in statement) {
                        toReturn = statement[field](comment[field]);
                      }
                    });
                    if (toReturn) {
                      commentsToReturn.push(comment);
                    }
                  });
                  break;
                case "order":
                  const firstField = limit[option][operator][0];
                  const secondField = limit[option][operator][1];
                  if (commentsToReturn.length > 0) {
                    const comments = commentsToReturn.sort((a, b) => {
                      if (a[firstField] < b[firstField]) {
                        return secondField === "desc" ? 1 : -1;
                      }
                      if (a[firstField] > b[firstField]) {
                        return secondField === "desc" ? -1 : 1;
                      }
                      return 0;
                    });

                    comments.forEach(comment => {
                      commentsToReturn.push(comment);
                    });
                  } else {
                    await comments
                      .orderBy(firstField, secondField)
                      .get()
                      .then(_comments => {
                        const comments = _comments.docs.map(comment => ({
                          id: comment.id,
                          ...comment.data()
                        }));
                        commentsToReturn.push(comments);
                      })
                      .catch(err => reject(err));
                  }
                  break;
              }
            }
            break;
          default:
            const queryStatements: string[][] = Object.keys(limit).map(
              identiferName => {
                return [identiferName, limit[identiferName]];
              }
            );

            let query = comments.where(
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
              .then(comments => {
                comments.docs.length > 0
                  ? resolve(
                      comments.docs.map(comment => ({
                        id: comment.id,
                        ...comment.data()
                      }))
                    )
                  : { exists: false };
              })
              .catch(err => reject(err));
            break;
        }
      }
      resolve(commentsToReturn);
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
      const commentRef = comments.doc(identifier[propName]);
      if (!reference) {
        await commentRef.get().then(comment => {
          comment.exists
            ? resolve(
                snapshot ? comment : { id: comment.id, ...comment.data() }
              )
            : resolve({ exists: false });
        });
      } else {
        resolve(commentRef);
      }
    } else {
      const queryStatements: string[][] = Object.keys(identifier).map(
        identiferName => {
          return [identiferName, identifier[identiferName]];
        }
      );
      let query = comments.where(
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
        .then(comments => {
          comments.docs.length > 0
            ? comments.docs.forEach(comment =>
                resolve(
                  snapshot ? comment : { id: comment.id, ...comment.data() }
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
    await comments
      .doc(info.id)
      .set(info)
      .then(async () => {
        await get({ id: info.id })
          .then(comment => resolve(comment))
          .catch(err => reject(err));
      });
  });
};

export const getOrCreate = async (
  identifier,
  info: Interface
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await get(identifier, true)
      .then(async (comment: FirebaseFirestore.DocumentSnapshot) => {
        if (!comment.exists) {
          await create(info)
            .then(comment => resolve(comment))
            .catch(err => reject(err));
        } else {
          await get(identifier)
            .then((comment: FirebaseFirestore.DocumentData) => resolve(comment))
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
    await comments
      .doc(info.id)
      .update(info)
      .then(async () => {
        await get({ id: info.id })
          .then(comment => resolve(comment))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};

export const destroy = async (identifier): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    await get(identifier, true, true)
      .then(async (comment: FirebaseFirestore.DocumentReference) => {
        await comment
          .delete()
          .then(res => resolve(res))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
