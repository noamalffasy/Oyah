import * as moment from "moment";

import { db } from "../../firebase";
import Model from "./Model";

import { ArticleModel } from "./index";
import { Article as ArticleInterface } from "./Article";

const homepage = db.ref("home");

export interface Home {
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

          if (Object.keys(obj).length === 0) {
            await ArticleModel.getAll().then(_articles => {
              articles = _articles
                .filter(article => {
                  if (
                    article.isTimeBased &&
                    moment(article.createdAt).diff(moment(), "days") <= -7
                  ) {
                    return false;
                  }

                  return true;
                })
                .sort((a, b) => {
                  if (a.likes > b.likes) {
                    return 1;
                  } else if (a.likes < b.likes) {
                    return -1;
                  }

                  if (
                    moment(a.createdAt).unix() > moment(b.createdAt).unix() &&
                    !a.isTimeBased &&
                    !b.isTimeBased
                  ) {
                    return 1;
                  } else if (
                    moment(a.createdAt).unix() > moment(b.createdAt).unix() &&
                    a.isTimeBased &&
                    !b.isTimeBased
                  ) {
                    return -1;
                  } else if (
                    moment(a.createdAt).unix() > moment(b.createdAt).unix() &&
                    a.isTimeBased &&
                    b.isTimeBased
                  ) {
                    return 1;
                  } else if (
                    moment(a.createdAt).unix() < moment(b.createdAt).unix()
                  ) {
                    return -1;
                  }

                  return 0;
                })
                .reverse();
            });
          } else {
            for (const i in obj) {
              const articleId = obj[i];

              await ArticleModel.get({ id: articleId })
                .then(article => articles.push(article))
                .catch(err => reject(err));
            }
          }
          resolve(articles);
        })
        .catch(err => reject(err));
    });
  }
}
export default new HomeModel(homepage);
