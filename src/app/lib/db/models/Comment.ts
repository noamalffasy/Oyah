import { db } from "../../firebase";
import Model from "./Model";

const comments = db.ref("comments");

interface Likes {
  [name: string]: boolean
}

export interface Comment {
  id: string;
  articleID?: string;
  authorID?: string;
  message?: string;
  likes?: Likes;
  createdAt?: Date;
}

export default new Model(comments);
