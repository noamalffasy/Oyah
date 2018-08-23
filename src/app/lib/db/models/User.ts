import { db } from "../../firebase";
import Model from "./Model";

const users = db.ref("/users");

export interface User {
  id: string;
  nametag?: string;
  name?: string;
  email?: string;
  image?: string;
  small_image?: string;
  bio?: string;
  mains?: string | Array<string>;
  reddit?: string;
  twitter?: string;
  providerId?: string;
  is_team?: boolean;
}

class UserModel extends Model {
  get(identifier: object) {
    return new Promise<User>(async (resolve, reject) => {
      await Model.prototype.get
        .call(this, identifier)
        .then(async (user: User) => resolve(user))
        .catch(err => reject(err));
    });
  }

  create(info: User) {
    return new Promise<User>(async (resolve, reject) => {
      await Model.prototype.create
        .call(this, { ...info, reddit: null, twitter: null }, true)
        .then((user: User) => resolve(user))
        .catch(err => reject(err));
    });
  }
}

export default new UserModel(users);
