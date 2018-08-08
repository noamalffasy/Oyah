import * as React from "react";
import { Component } from "react";

import * as moment from "moment";

import ArticleBlock from "./ArticleBlock";
import { Article } from "../lib/db/models/Article";

interface Props {
  articles: Article[];
}

class Marble extends Component<Props> {
  getBestArticles(_articles: Article[], time: number) {
    let bestArticles = [];
    const articles = _articles.filter(
      article =>
        article.isTimeBased &&
        moment(article.createdAt).diff(moment(), "weeks") >= -time
    );

    for (let i = 1; i <= time; i++) {
      bestArticles.push(this.getBestArticle(articles, i));
    }

    return bestArticles;
  }

  getBestArticle(_articles, weeksAgo) {
    const articles = _articles.filter(
      article =>
        moment(article.createdAt).diff(moment(), "weeks") >= -weeksAgo - 1 &&
        moment(article.createdAt).diff(moment(), "weeks") <= -weeksAgo
    );

    const bestArticle = articles.sort((a, b) => {
      if (a.likes > b.likes) return -1;
      if (a.likes < b.likes) return 1;

      if (moment(a.createdAt).isAfter(b.createdAt)) return -1;
      return 1;
    })[0];

    return bestArticle;
  }

  render() {
    const articles = this.getBestArticles(this.props.articles, 3);

    return (
      <div className="Marble">
        <h2>You Might Have Missed</h2>
        <div className="articles">
          {articles.map((article, i) => {
            return (
              <ArticleBlock
                id={article.id}
                path={article.path}
                dominantColor={article.dominantColor}
                title={article.title}
                alt={article.title}
                official={article.author.is_team}
                loading={false}
                key={i}
              />
            );
          })}
        </div>
        <style jsx>{`
          .Marble {
            margin: 1.5rem 0 4rem 0;
          }

          .Marble h2 {
            margin-bottom: 1.5rem;
          }

          .Marble .articles {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }
        `}</style>
        <style jsx global>{`
          .Marble .articles .Article {
            margin: 0 0 1.5rem;
            width: 100%;
          }

          @media (min-width: 768px),
            @media (min-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
            .Marble .articles .Article {
              margin: 0 1rem 1rem 0;
              width: calc(1 / 2 * 100% - (1 / 2 * 1rem));
            }
            .Marble .articles .Article:nth-child(2n) {
              margin: 0 0 1rem;
            }
          }

          @media (min-width: 992px),
            @media (min-width: 992px) and (-webkit-min-device-pixel-ratio: 1) {
            .Home .Marble .articles .Article {
              width: calc(1 / 3 * 100% - (1 / 3 * 2rem));
              margin: 0 1rem 1rem 0;
            }

            .Home .Marble .articles .Article:nth-child(2n) {
              margin: 0 1rem 1rem 0;
            }

            .Home .Marble .articles .Article:nth-child(3n) {
              margin: 0 0 1rem;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Marble;
