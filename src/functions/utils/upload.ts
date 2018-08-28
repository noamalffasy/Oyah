import * as shortid from "shortid";
import sharp from "sharp";
import imagemin from "imagemin";

import admin from "./firebase";

import { bucketName } from "../config";

const bucket = admin.storage().bucket(bucketName);

function getBuffer(dataURL: string, file: Express.Multer.File) {
  return file
    ? file.buffer
    : Buffer.from(dataURL.replace(/data:image\/(.*?);base64,/, ""), "base64");
}

async function writeFile(filename: string, data: Buffer) {
  return new Promise(async (_, reject) => {
    const imageFile = bucket.file(filename);
    const minifiedBuffer = await imagemin.buffer(data).then(buffer => buffer);

    await imageFile.save(minifiedBuffer).catch(err => reject(err));
    await imageFile.makePublic();
  });
}

function saveResizedImages(data: any, _filename: any) {
  const filename = _filename.replace(".jpeg", "");

  const file = bucket.file(`${filename}_small.jpeg`);
  const stream = file.createWriteStream({
    metadata: { contentType: "image/jpeg" }
  });

  sharp(data)
    .resize(40, undefined)
    .max()
    .pipe(stream);

  stream
    .on("finish", () => {
      file.makePublic();
      return data;
    })
    .on("error", err => err);
}

async function isValid(buffer) {
  return new Promise<boolean>(async (resolve, reject) => {
    const magic = buffer.toString("hex", 0, 4);

    const MAGIC_NUMBERS = {
      jpg: "ffd8ffe0",
      jpg1: "ffd8ffe1",
      jpeg: "ffd8ffdb",
      png: "89504e47",
      gif: "47494638"
    };

    if (
      magic === MAGIC_NUMBERS.jpg ||
      magic === MAGIC_NUMBERS.jpg1 ||
      magic === MAGIC_NUMBERS.jpeg ||
      magic === MAGIC_NUMBERS.png ||
      magic === MAGIC_NUMBERS.gif
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
}

export async function uploadFile({
  file = null,
  where = "user",
  articleID = null,
  main = true,
  dataURL = null,
  sessionCookie
}) {
  return new Promise<{ path: string; filename: string }>(
    async (resolve, reject) => {
      const buffer = getBuffer(dataURL, file);
      const userID = admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then(({ uid }) => uid)
        .catch(() => reject(new Error("Not logged in")));

      const filename =
        where === "user"
          ? "user-#" + userID + ".jpeg"
          : articleID + (main ? "/main" : "/" + shortid.generate()) + ".jpeg";

      if (await isValid(buffer)) {
        await writeFile(
          where === "user" ? `users/${filename}` : `articles/${filename}`,
          buffer
        )
          .then(async () => {
            saveResizedImages(
              buffer,
              where === "user" ? `users/${filename}` : `articles/${filename}`
            );

            resolve({
              path:
                where === "user"
                  ? `https://storage.googleapis.com/oyah.xyz/users/${filename}`
                  : `https://storage.googleapis.com/oyah.xyz/articles/${filename}`,
              filename
            });
          })
          .catch((err: Error) => reject(err));
      } else {
        reject(new Error("File is not valid"));
      }
    }
  );
}
