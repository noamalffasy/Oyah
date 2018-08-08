import * as admin from "firebase-admin";

import { projectId } from "../config";

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`
});

const db = admin.database();

export default db;
