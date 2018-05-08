import db from "../index";
import Model from "./Model";

const users = db.ref("/users");

export interface Interface {
  id: string;
  nametag?: string;
  name?: string;
  email?: string;
  likes?: string;
  comment_likes?: string;
  image?: string;
  small_image?: string;
  bio?: string;
  mains?: string;
  reddit?: string;
  twitter?: string;
  providerId?: string;
  is_team?: boolean;
}

export default new Model(users);
