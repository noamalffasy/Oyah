import * as admin from "firebase-admin";

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oyah-200816.firebaseio.com"
});

const db = admin.database();

export default db;
