import { db } from "../../firebase";
import Model from "./Model";

import { ArticleModel } from "./index";
import { Interface as ArticleInterface } from "./Article";

const homepage = db.ref("home");

export interface Interface {
  [key: number]: string;
}

class HomeModel extends Model {
  get(identifier: object) {
    return new Promise<ArticleInterface[]>(async (resolve, reject) => {
      await Model.prototype.get
        .call(this, identifier)
        .then(async obj => {
          let articles: ArticleInterface[] = [];

          delete obj.id;
          delete obj.original;
          delete obj.exists;
          
          for (const i in obj) {
            const articleId = obj[i];

            await ArticleModel.get({ id: articleId })
              .then(article => articles.push(article))
              .catch(err => reject(err));
          }
          resolve(articles);
        })
        .catch(err => reject(err));
    });
  }
}
export default new HomeModel(homepage);
