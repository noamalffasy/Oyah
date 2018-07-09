import { db } from "../../firebase";
import Model from "./Model";

const articles = db.ref("articles");

export interface Interface {
  id: string;
  title?: string;
  path?: string;
  content?: string;
  authorID?: string;
  likes?: number;
  createdAt?: Date;
}

export default new Model(articles);
