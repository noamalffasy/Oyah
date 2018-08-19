import { db } from "../../firebase";
import Model from "./Model";

import { UserModel } from "./index";
import { User as UserInterface } from "./User";

const comments = db.ref("comments");

interface Likes {
  [name: string]: boolean;
}

export interface Comment {
  id: string;
  articleID?: string;
  authorID?: string;
  message?: string;
  likes?: Likes;
  createdAt?: Date;
}

class CommentModel extends Model {
  getAll(identifier: object = {}) {
    return new Promise<Comment[]>(async (resolve, reject) => {
      await Model.prototype.getAll
        .call(this)
        .then(async (comments: Comment[]) => {
          const fittingComments = comments
            .filter(comment => {
              if (Object.keys(identifier).length === 0) {
                return true;
              }

              let toPass = false;
              for (const item in identifier) {
                toPass = comment[item] && comment[item] === identifier[item];
              }

              return toPass;
            })
            .map(async comment => {
              return await UserModel.get({ id: comment.authorID })
                .then((author: UserInterface) => ({
                  ...comment,
                  createdAt: new Date(comment.createdAt).toISOString(),
                  author
                }))
                .catch(err => reject(err));
            });
          Promise.all(fittingComments)
            .then(comments => resolve(comments))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }
}

export default new CommentModel(comments);
