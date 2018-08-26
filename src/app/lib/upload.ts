import * as shortid from "shortid";

import { app } from "./firebase";

import { UserModel } from "./db/models";

const bucket = app.storage("gs://oyah.xyz").ref();

async function writeFile(filename: string, dataURL: string, file: File) {
  return new Promise(async (resolve, reject) => {
    const imageFile = bucket.child(filename);

    dataURL
      ? await imageFile
          .putString(dataURL, "data_url")
          .then(file => resolve(file))
          .catch(err => reject(err))
      : await imageFile
          .put(file)
          .then(file => resolve(file))
          .catch(err => reject(err));
    // await file.makePublic();
  });
}

async function getDataURL(file) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(new Error("File is not valid"));
    fr.readAsDataURL(file);
  });
}

async function isValid({ file, dataURL }) {
  return new Promise<boolean>(async (resolve, reject) => {
    const fileURL = await getDataURL(file)
      .then(url => url)
      .catch(err => reject(err));

    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = dataURL ? dataURL : fileURL;
  });
}

export async function uploadFile({
  file = null,
  where = "user",
  articleID = null,
  main = true,
  dataURL = null,
  user
}) {
  return new Promise<{ path: string }>(async (resolve, reject) => {
    const filename =
      where === "user"
        ? "user-#" + user.id + ".jpeg"
        : articleID + (main ? "/main" : "/" + shortid.generate()) + ".jpeg";
    if (await isValid({ file, dataURL })) {
      await writeFile(
        where === "user" ? `users/${filename}` : `articles/${filename}`,
        dataURL,
        file
      )
        .then(async () => {
          if (where === "user") {
            await UserModel.update({ id: user.id, image: filename }).catch(
              (err: any) => {
                reject(err);
              }
            );
          }

          resolve({
            path:
              where === "user"
                ? `https://storage.googleapis.com/oyah.xyz/users/${filename}`
                : `https://storage.googleapis.com/oyah.xyz/articles/${filename}`
          });
        })
        .catch((err: Error) => reject(err));
    } else {
      reject(new Error("File is not valid"));
    }
  });
}
