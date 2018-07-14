import { db } from "../../firebase";
import Model from "./Model";

import { UserModel } from "./index";
import { Interface as UserInterface } from "./User";

const articles = db.ref("articles");

export interface Interface {
  id: string;
  title?: string;
  path?: string;
  content?: string;
  authorID?: string;
  author: object;
  likes?: number;
  createdAt?: Date;
}

class ArticleModel extends Model {
  get(identifier: object) {
    return new Promise<Interface>(async (resolve, reject) => {
      await Model.prototype.get
        .call(this, identifier)
        .then(async (article: Interface) => {
          await UserModel.get({ id: article.authorID })
            .then((author: UserInterface) => {
              resolve({ ...article, author });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export default new ArticleModel(articles);
