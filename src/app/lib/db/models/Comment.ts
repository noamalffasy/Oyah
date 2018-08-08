import { db } from "../../firebase";
import Model from "./Model";

const comments = db.ref("comments");

export interface Comment {
  id: string;
  articleID?: string;
  authorID?: string;
  message?: string;
  likes?: number;
  createdAt?: Date;
}

export default new Model(comments);
