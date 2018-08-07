import { db } from "../../firebase";
import Model from "./Model";

import { UserModel } from "./index";
import { User as UserInterface } from "./User";

const articles = db.ref("articles");

export interface Article {
  id: string;
  title?: string;
  path?: string;
  content?: string;
  authorID?: string;
  author: UserInterface;
  likes?: number;
  createdAt?: string;
  isTimeBased?: boolean;
}

class ArticleModel extends Model {
  getAll(identifier: object = {}) {
    return new Promise<Article[]>(async (resolve, reject) => {
      await Model.prototype.getAll
        .call(this)
        .then(async (articles: Article[]) => {
          const fittingArticles = articles
            .filter(article => {
              if (Object.keys(identifier).length === 0) {
                return true;
              }

              let toPass = false;
              for (const item in identifier) {
                toPass = article[item] && article[item] === identifier[item];
              }

              return toPass;
            })
            .map(async article => {
              return await UserModel.get({ id: article.authorID })
                .then((author: UserInterface) => ({
                    ...article,
                    createdAt: new Date(article.createdAt).toISOString(),
                    author
                  }))
                .catch(err => reject(err));
            });
          Promise.all(fittingArticles)
            .then(articles => resolve(articles))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  get(identifier: object) {
    return new Promise<Article>(async (resolve, reject) => {
      await Model.prototype.get
        .call(this, identifier)
        .then(async (article: Article) => {
          await UserModel.get({ id: article.authorID })
            .then((author: UserInterface) => {
              resolve({ 
                ...article, 
                createdAt: new Date(article.createdAt).toISOString(), 
                author 
              });
            })
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export default new ArticleModel(articles);
