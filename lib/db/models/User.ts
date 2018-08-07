import { db } from "../../firebase";
import Model from "./Model";

const users = db.ref("/users");

export interface User {
  id: string;
  nametag?: string;
  name?: string;
  email?: string;
  image?: string;
  small_image?: string;
  bio?: string;
  mains?: string | Array<string>;
  reddit?: string;
  twitter?: string;
  providerId?: string;
  is_team?: boolean;
}

export default new Model(users);
