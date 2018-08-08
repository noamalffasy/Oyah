import { db } from "../../firebase";
import Model from "./Model";

const quotes = db.ref().child("quotes");

export interface Quote {
  id: string;
  quote: string;
  author: string;
}

class QuoteModel extends Model {
  async getRandom() {
    return new Promise<Quote>(async (resolve, reject) => {
      await this.getAll({
        order: "random"
      })
        .then((quotes: Quote[]) => {
          resolve(quotes[0]);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }
}

export default new QuoteModel(quotes);
