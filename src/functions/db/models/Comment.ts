import db from "../index";
import Model from "./Model";

const comments = db.ref("comments");

export interface Interface {
  id: string;
  articleID?: string;
  authorID?: string;
  message?: string;
  likes?: number;
  createdAt?: Date;
}

export default new Model(comments);
