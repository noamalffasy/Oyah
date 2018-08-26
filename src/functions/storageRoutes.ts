import * as express from "express";

import admin from "./utils/firebase";

import { bucketName } from "./config";

const bucket = admin.storage().bucket(bucketName);

export default (app: express.Application) => {
  app.post("/uploadFile", (req, res) => {
      
  });
};
