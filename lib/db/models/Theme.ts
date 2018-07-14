import { db } from "../../firebase";
import Model from "./Model";

const themes = db.ref().child("themes");

export interface Theme {
    title: string;
    tag: string;
}

export default new Model(themes);
