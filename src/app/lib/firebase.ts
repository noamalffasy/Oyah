import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

import config from "./config";

export const app = !firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app();

export const db = app.database();
export default firebase;
