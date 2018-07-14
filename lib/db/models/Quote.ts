import { db } from "../../firebase";
import Model from "./Model";

const quotes = db.ref().child("quotes");

export interface Interface {
  id: string;
  quote: string;
  author: string;
}

class QuoteModel extends Model {
  async getRandom() {
    return new Promise<Interface>(async (resolve, reject) => {
      await this.getAll({
        order: "random"
      })
        .then((quotes: Interface[]) => {
          resolve(quotes[0]);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
}

export default new QuoteModel(quotes);
