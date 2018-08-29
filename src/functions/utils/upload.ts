import * as shortid from "shortid";
import * as sharp from "sharp";

import admin from "./firebase";

import { bucketName } from "../config";

const bucket = admin.storage().bucket(bucketName);

function getBuffer(dataURL: string, file: Express.Multer.File) {
  return file
    ? file.buffer
    : Buffer.from(dataURL.replace(/data:image\/(.*?);base64,/, ""), "base64");
}

async function writeFile(data: Buffer, filename: string) {
  return new Promise<Buffer>(async (resolve, reject) => {
    const file = bucket.file(filename);

    await file
      .save(data)
      .then(async () => {
        await file.makePublic();
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function resizeImage(data: Buffer, size: number) {
  return new Promise<Buffer>(async (resolve, reject) => {
    await sharp(data)
      .resize(size)
      .toBuffer()
      .then(resizedBuffer => resolve(resizedBuffer))
      .catch(err => {
        reject(err);
      });
  });
}

async function saveResizedImages(data: Buffer, filename: string, size) {
  return new Promise<Buffer>(async (resolve, reject) => {
    await resizeImage(data, size)
      .then(async smallBuffer => {
        await writeFile(smallBuffer, filename)
          .then(async () => {
            resolve(smallBuffer);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function saveImage(buffer: Buffer, filename: string, size: number) {
  return new Promise<string>(async (resolve, reject) => {
    await saveResizedImages(buffer, filename, size)
      .then(async resizedBuffer => {
        const filenameNoExt = filename.replace(".jpeg", "");
        const smallFilename = `${filenameNoExt}_small.jpeg`;

        await saveResizedImages(resizedBuffer, smallFilename, 40)
          .then(() => resolve(filename))
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function makeResponsive(buffer: Buffer, _filename: string) {
  return new Promise<string[]>(async (resolve, reject) => {
    const sizes = [1920, 1600, 1366, 1024, 768, 640];

    const paths = await Promise.all(
      sizes.map(async size => {
        return new Promise<string>(async (resolve, reject) => {
          const filenameNoExt = _filename.replace(".jpeg", "");
          const filename = `${filenameNoExt}/${size}px.jpeg`;

          await saveImage(buffer, filename, size)
            .then(async filename => resolve(filename))
            .catch(err => {
              reject(err);
            });
        });
      })
    ).then(paths => paths);

    resolve(paths);
  });
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
  return new Promise<{ path: string[]; filename?: string[] }>(
    async (resolve, reject) => {
      const buffer = getBuffer(dataURL, file);
      const userID = await admin
        .auth()
        .verifySessionCookie(sessionCookie)
        .then(({ uid }) => uid)
        .catch(() => reject(new Error("Not logged in")));

      const filename =
        where === "user"
          ? `${userID}.jpeg`
          : articleID + (main ? "/main" : "/" + shortid.generate()) + ".jpeg";

      if (await isValid(buffer)) {
        if (where === "article") {
          await makeResponsive(buffer, `articles/${filename}`)
            .then(paths => {
              const urls = paths.map(
                path => `https://storage.googleapis.com/oyah.xyz/${path}`
              );
              resolve({
                path: urls
              });
            })
            .catch(err => reject(err));
        } else {
          await saveImage(buffer, `users/${filename}`, null)
            .then(path => {
              resolve({
                path: [`https://storage.googleapis.com/oyah.xyz/${path}`]
              });
            })
            .catch(err => reject(err));
        }
      } else {
        reject(new Error("File is not valid"));
      }
    }
  );
}
