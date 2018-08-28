export async function uploadFile({
  file = null,
  where = "user",
  articleID = null,
  main = true,
  dataURL = null
}) {
  return new Promise<{ path: string }>(async (resolve, reject) => {
    const data = new FormData();

    data.append("file", file);
    data.append("dataURL", dataURL);
    data.append("where", where);
    data.append("articleID", articleID);
    data.append("main", `${main}`);

    await fetch(
      `${
        window.location.hostname !== "localhost"
          ? "https://oyah.xyz"
          : `http://${window.location.host}`
      }/uploadFile`,
      {
        body: data,
        headers: {
          "Content-Type": "multipart-form-data"
        },
        credentials: "include",
        method: "POST"
      }
    )
      .then(async res => {
        const { path } = await res.json();

        resolve({ path });
      })
      .catch((err: Error) => reject(err));
  });
}
