import * as admin from "firebase-admin";
import * as stream from "stream";
import * as _gm from "gm";

import db from "../index";
import Model from "./Model";

const gm = _gm.subClass({
  imageMagick: true
});

const articles = db.ref("articles");

const bucket = admin.storage().bucket("oyah.xyz");

export interface Interface {
  id: string;
  title?: string;
  path?: string;
  dominantColor?: string;
  content?: string;
  authorID?: string;
  likes?: number;
  createdAt?: Date;
}

const ArticleModel = new Model(articles);

export default ArticleModel;

function updateDominantColor(article: Interface) {
  return new Promise(async (resolve, reject) => {
    const filename = article.path.replace(
      "https://storage.googleapis.com/oyah.xyz/",
      ""
    );

    const imageFile = bucket.file(filename);

    await imageFile
      .download()
      .then(async (data: any) => {
        const HIST_START = "comment={";
        const HIST_END = "\x0A}";

        const strData = (await new Promise((resolve, reject) => {
          gm(data[0])
            .resize(250, 250)
            .colors(1)
            .stream("histogram", (err, stdout: any) => {
              if (err) reject(err);

              const writeStream = new stream.PassThrough();
              let strData = "";

              writeStream.on("data", data => {
                strData = strData + data.toString();
              });
              writeStream.on("end", () => {
                resolve(strData);
              });
              writeStream.on("error", error => {
                reject(error);
              });
              stdout.pipe(writeStream);
            });
        })) as string;

        const beginIndex = strData.indexOf(HIST_START) + HIST_START.length + 1;
        const endIndex = strData.indexOf(HIST_END);
        const cData = strData.slice(beginIndex, endIndex).split("\n");

        if (cData.length > 8) cData.splice(0, cData.length - 8);
        if (beginIndex === -1 || endIndex === -1)
          reject(new Error(`PALETTE_DETECTION_FAILED: Image not found.`));

        const dominantColor = cData
          .map(_xs => {
            const xs = _xs.trim().split(":");
            if (xs.length !== 2) return;

            const colors = xs[1]
              .split("(")[1]
              .split(")")[0]
              .split(",");

            if (!colors || !Array.isArray(colors)) return;

            return `rgb(${Number(colors[0])}, ${Number(colors[1])}, ${Number(
              colors[2]
            )})`;
          })
          .filter(function(v) {
            return !!v;
          })[0];

        ArticleModel.update({
          id: article.id,
          dominantColor
        })
          .then(() => resolve(dominantColor))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

articles.on("child_added", async res => {
  const article: Interface = res.val();

  await updateDominantColor(article);
});

articles.on("child_changed", async res => {
  const article: Interface = res.val();

  await updateDominantColor(article);
});
