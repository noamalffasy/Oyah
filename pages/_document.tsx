import * as React from "react";
import Document from "next/document";
import { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  render() {
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
          />
          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/favicons/favicon.ico" type="image/x-icon" />
          <link
            rel="shortcut icon"
            href="/favicons/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/favicons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/favicons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/favicons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/favicons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/favicons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/favicons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/favicons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/favicons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/favicons/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/favicons/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicons/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicons/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta
            name="msapplication-TileImage"
            content="/favicons/ms-icon-144x144.png"
          />
          <title>Oyah</title>
          <link rel="stylesheet" href="/css/bootstrap.min.css" />
          {/* <link rel="stylesheet" href="/css/App.css" /> */}

          <script
            async
            src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          />
          <script>
            {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-3759936513100574",
              enable_page_level_ads: true
            });`}
          </script>
          <script
            type="text/javascript"
            src="//platform-api.sharethis.com/js/sharethis.js#property=5a4e76fc9982360012942ace&product=custom-share-buttons"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/jquery.min.js" />
          <script src="/js/popper.min.js" />
          <script src="/js/bootstrap.bundle.min.js" />
        </body>
        <style jsx global>{`
          @keyframes openCard {
            0% {
              top: -1rem;
            }

            100% {
              top: 0;
            }
          }

          @keyframes imageLoad {
            0% {
              background: #c0c0c0;
            }

            50% {
              background: #aaa;
            }

            100% {
              background: #c0c0c0;
            }
          }

          @keyframes loading {
            0% {
              opacity: 0.6;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.6;
            }
          }

          @keyframes like {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.5);
            }
            100% {
              transform: scale(1);
            }
          }
          
          html,
          body,
          body > div:first-child,
          body > div > #__next,
          body > div > #__next > div {
            height: 100%;
          }

          a {
            color: #cc0000 !important;
            font-weight: 600;
            outline: 0;
            opacity: 0.8;
            cursor: pointer;
            transition: all 0.15s;
          }

          a:hover {
            /* text-decoration: underline !important; */
            text-decoration: none !important;
            opacity: 1;
          }
        `}</style>
      </html>
    );
  }
}

export default MyDocument;
