import * as admin from "firebase-admin";

import config from "../config";

const serviceAccount = require("../serviceAccountKey.json");

export const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${config.projectId}.firebaseapp.com`
    })
  : admin.app();

export default admin;
