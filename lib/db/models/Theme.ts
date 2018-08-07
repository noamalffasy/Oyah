import { db } from "../../firebase";
import Model from "./Model";

const themes = db.ref().child("themes");

export interface Theme {
  title: string;
  tag: string;
}

class ThemeModel extends Model {
  get(identifier: object) {
    return new Promise<Theme>(async (resolve, reject) => {
      await Model.prototype.getAll
        .call(this)
        .then(async (themes: Theme[]) => {
          const fittingThemes = themes.filter(theme => {
            let toPass = false;
            for (const item in identifier) {
              toPass = theme[item] && theme[item] === identifier[item];
            }

            return toPass;
          });
          resolve(fittingThemes[0]);
        })
        .catch(err => reject(err));
    });
  }
}

export default new ThemeModel(themes);
