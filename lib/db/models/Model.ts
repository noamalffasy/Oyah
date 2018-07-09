import { database } from "firebase";

function shuffle(array: any[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default class Model {
  constructor(docRef: database.Reference) {
    this.docRef = docRef;
  }

  docRef: database.Reference;

  async getAll(sort = null): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!sort) {
        this.docRef.once("value", _objs => {
          if (_objs && _objs.val()) {
            const objIds = Object.keys(_objs.val()).map(id => id);
            const objs = objIds.map(id => ({
              id,
              ..._objs.val()[id],
              exists: _objs.exists(),
              original: _objs.child(id)
            }));

            resolve(objs);
          } else {
            reject("Doesn't exist");
          }
        });
      } else {
        const _objs: any = await this.docRef
          .once("value")
          .then(_objs => {
            const objIds =
              _objs.val() &&
              typeof _objs.val() === "object" &&
              !Array.isArray(_objs.val())
                ? Object.keys(_objs.val()).map(id => id)
                : [];
            const objs = objIds.map(id => ({
              id,
              ..._objs.val()[id],
              exists: _objs.exists(),
              original: _objs.child(id)
            }));

            return objs;
          })
          .catch(err => reject(err));

        let objsToReturn: any[] = [];
        for (const key in sort) {
          switch (key) {
            case "where":
              for (const operator in sort[key]) {
                switch (operator) {
                  case "or":
                    const statements = sort[key][operator];
                    _objs.forEach(obj => {
                      let toReturn = false;
                      statements.forEach(statement => {
                        for (const field in statement) {
                          toReturn = statement[field](obj[field]);
                        }
                      });
                      if (toReturn) {
                        objsToReturn.push(obj);
                      }
                    });
                    break;
                }
              }
              break;
            case "order":
              const objs: any = objsToReturn.length > 0 ? objsToReturn : _objs;
              if (sort[key] !== "random") {
                resolve(objs.sort());
              } else {
                resolve(shuffle(objs));
              }
              break;
            default:
              await this.docRef
                .once("value")
                .then(_objs => {
                  if (
                    _objs.val() &&
                    typeof _objs.val() === "object" &&
                    !Array.isArray(_objs.val())
                  ) {
                    const objIds = Object.keys(_objs.val()).filter(
                      objId => _objs.val()[objId][key] === sort[key]
                    );

                    const objs = objIds.map(id => ({
                      id,
                      ..._objs.val()[id],
                      exists: true,
                      original: _objs.child(id)
                    }));

                    resolve(objs.length > 0 ? objs : [{ exists: false }]);
                  } else {
                    resolve([{ exists: false }]);
                  }
                })
                .catch(err => reject(err));
              break;
          }
        }
      }
    });
  }

  get(identifier: object) {
    return new Promise(async (resolve, reject) => {
      if (Object.keys(identifier)[0] === "id") {
        const propName = Object.keys(identifier)[0];

        if (identifier[propName]) {
          const objRef = this.docRef.child(identifier[propName]);

          await objRef.once("value").then(_obj => {
            if (_obj.exists()) {
              const obj = {
                id: _obj.key,
                ..._obj.val(),
                original: _obj
              };

              resolve(
                _obj.exists() ? { exists: true, ...obj } : { exists: false }
              );
            } else {
              resolve({ exists: false });
            }
          });
        } else {
          resolve({ exists: false });
        }
      } else {
        const queryStatements: string[][] = Object.keys(identifier).map(
          identiferName => {
            return [identiferName, identifier[identiferName]];
          }
        );
        let query = this.docRef
          .orderByChild(queryStatements[0][0])
          .equalTo(queryStatements[0][1]);

        queryStatements.forEach((statement, i) => {
          if (i !== 0) {
            query = query.orderByChild(statement[0]).equalTo(statement[1]);
          }
        });

        await query
          .once("value")
          .then(_objs => {
            if (_objs.exists()) {
              const objIds = Object.keys(_objs.val()).map(id => id);
              const objs = objIds.map(id => ({
                id,
                ..._objs.val()[id],
                original: _objs.child(id)
              }));

              resolve(
                objs.length > 0
                  ? { exists: true, ...objs[0] }
                  : { exists: false }
              );
            } else {
              resolve({ exists: false });
            }
          })
          .catch(err => reject(err));
      }
    });
  }

  async create(info, is_user = false) {
    return new Promise(async (resolve, reject) => {
      const objPath = is_user ? this.docRef.child(info.id) : this.docRef.push();

      await objPath
        .set({
          ...info,
          id: is_user ? info.id : objPath.key,
          originalId: info.id
        })
        .then(async () => {
          await this.get({ id: is_user ? info.id : objPath.key })
            .then(obj => resolve(obj))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  async getOrCreate(identifier, info, is_user = false) {
    return new Promise(async (resolve, reject) => {
      await this.get(identifier)
        .then(async (obj: any) => {
          if (!obj.exists) {
            await this.create(info, is_user)
              .then(obj => resolve(obj))
              .catch(err => reject(err));
          } else {
            await this.get(info)
              .then(obj => resolve(obj))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  }

  async update(info) {
    return new Promise(async (resolve, reject) => {
      await this.docRef
        .child(info.id)
        .update(info)
        .then(async () => {
          await this.get({ id: info.id })
            .then(obj => resolve(obj))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  async destroy(identifier) {
    return new Promise(async (resolve, reject) => {
      await this.get(identifier)
        .then(async (obj: any) => {
          obj.original.ref
            .remove()
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}
