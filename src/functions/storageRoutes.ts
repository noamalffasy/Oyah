import * as express from "express";
import * as multer from "multer";
import * as cookieParser from "cookie-parser";

import { uploadFile } from "./utils/upload";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default (app: express.Application) => {
  app.use(cookieParser());

  app.post("/uploadFile", upload.single("file"), async (req, res, next) => {
    const { dataURL, where, articleID, main } = req.body;

    await uploadFile({
      file: req.file,
      where,
      articleID,
      main,
      dataURL,
      sessionCookie: req.cookies["__session"]
    })
      .then(file => res.send(file))
      .catch((err: Error) => {
        res.status(400);
        res.send(err.message);
      });
  });
};
