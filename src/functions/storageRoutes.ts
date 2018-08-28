import * as express from "express";
import multer from "multer";

import { uploadFile } from "./utils/upload";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default (app: express.Application) => {
  app.post("/uploadFile", upload.single(), async (req, res) => {
    const { dataURL, where, articleID, main } = req.body;

    const file = await uploadFile({
      file: req.file,
      where,
      articleID,
      main,
      dataURL,
      sessionCookie: req.cookies["__session"]
    });

    res.send(() => file);
  });
};
