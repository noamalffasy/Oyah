import * as algoliasearch from "algoliasearch/lite";

import { ArticleModel } from "./db/models";
import { Article as ArticleInterface } from "./db/models/Article";

import { algoliaKeys } from "./config";

const client = algoliasearch(algoliaKeys.ApplicationID, algoliaKeys.APIKey);
const index = client.initIndex("articles");

export async function searchArticle(searchTerm) {
  return new Promise<ArticleInterface[]>(async (resolve, reject) => {
    await index
      .search({
        query: searchTerm,
        attributesToRetrieve: ["id"],
        restrictSearchableAttributes: ["title", "content"]
      })
      .then(async res => {
        resolve(
          await Promise.all(
            res.hits.map(async _article => {
              return await ArticleModel.get({ id: _article.objectID }).then(
                article => article
              );
            })
          )
        );
      })
      .catch(err => reject(err));
  });
}
