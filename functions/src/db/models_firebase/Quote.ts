import db from "../index_firebase";

const quotes = db.collection("quotes");

export interface Interface {
  id: string;
  quote: string;
  author: string;
}

function shuffle(array: any[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getAll = async (
  sort = null
): Promise<FirebaseFirestore.DocumentData> => {
  return new Promise(async (resolve, reject) => {
    if (!sort) {
      await quotes
        .get()
        .then(_quotes => {
          const quotes = _quotes.docs.map(quote => ({
            id: quote.id,
            ...quote.data()
          }));

          resolve(quotes);
        })
        .catch(err => reject(err));
    } else {
      for (const key in sort) {
        switch (key) {
          case "order":
            if (sort[key] !== "random") {
              await quotes
                .orderBy(sort[key])
                .get()
                .then(_quotes => {
                  const quotes = _quotes.docs.map(quote => ({
                    id: quote.id,
                    ...quote.data()
                  }));

                  resolve(quotes);
                })
                .catch(err => reject(err));
            } else {
              await quotes
                .get()
                .then(_quotes => {
                  const quotes = shuffle(
                    _quotes.docs.map(quote => ({
                      id: quote.id,
                      ...quote.data()
                    }))
                  );

                  resolve(quotes);
                })
                .catch(err => reject(err));
            }
            break;
          default:
            await quotes
              .get()
              .then(_quotes => {
                const quotes = _quotes.docs.map(quote => ({
                  id: quote.id,
                  ...quote.data()
                }));
                resolve(quotes);
              })
              .catch(err => reject(err));
            break;
        }
      }
    }
  });
};
