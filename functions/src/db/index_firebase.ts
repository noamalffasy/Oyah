import * as admin from "firebase-admin";

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://oyah-200816.firebaseapp.com"
});

const db = admin.firestore();

export default db;
