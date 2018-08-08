import db from "../index";
import Model from "./Model";

const quotes = db.ref().child("quotes");

export interface Interface {
  id: string;
  quote: string;
  author: string;
}

export default new Model(quotes);
