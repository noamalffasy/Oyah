import db from "../index_firebase";

const users = db.collection("users");

export interface Interface {
  id: string;
  nametag?: string;
  name?: string;
  email?: string;
  likes?: string;
  comment_likes?: string;
  image?: string;
  small_image?: string;
  bio?: string;
  mains?: string;
  reddit?: string;
  twitter?: string;
  providerId?: string;
  is_team?: boolean;
}

export const getAll = async (): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await users
      .get()
      .then(_users => {
        const users = _users.docs.map(user => user.data());
        resolve(users);
      })
      .catch(err => reject(err));
  });
};

export const get = async (
  userIdentifier: Object
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    if (Object.keys(userIdentifier)[0] === "id") {
      const propName = Object.keys(userIdentifier)[0];
      if (userIdentifier[propName]) {
        await users
          .doc(userIdentifier[propName])
          .get()
          .then(user => {
            if (user.exists) {
              resolve({ id: user.id, ...user.data() });
            } else {
              reject("User doesn't exist");
            }
          })
          .catch(err => reject(err));
      } else {
        reject("ID wasn't provided");
      }
    } else {
      const queryStatements: string[][] = Object.keys(userIdentifier).map(
        identiferName => [identiferName, userIdentifier[identiferName]]
      );

      let query = users.where(
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
        .then(users => {
          users.docs.length > 0
            ? users.docs.forEach(user =>
                resolve({ id: user.id, ...user.data() })
              )
            : resolve({ exists: false });
        })
        .catch(err => reject(err));
    }
  });
};

export const create = async (
  info: Interface
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await users
      .doc(info.id)
      .set(info)
      .then(async () => {
        await get({ id: info.id })
          .then(user => resolve(user))
          .catch(err => reject(err));
      });
  });
};

export const getOrCreate = async (
  identifier,
  info: Interface
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    await get(identifier)
      .then(async user => {
        if (!user.exists) {
          create(info)
            .then(user => resolve(user))
            .catch(err => reject(err));
        } else {
          get(identifier)
            .then(user => resolve(user))
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
    await users
      .doc(info.id)
      .update(info)
      .then(async () => {
        await get({ id: info.id })
          .then(user => resolve(user))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};
