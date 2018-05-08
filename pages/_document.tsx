import * as React from "react";
import Document from "next/document";
import { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

import "../lib/firebase";

class MyDocument extends Document {
  static getInitialProps({ renderPage }: any) {
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

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://storage.googleapis.com/oyah.xyz/assets/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://storage.googleapis.com/oyah.xyz/assets/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://storage.googleapis.com/oyah.xyz/assets/favicons/favicon-16x16.png"
          />
          <link
            rel="manifest"
            href="https://storage.googleapis.com/oyah.xyz/assets/manifest.json"
          />
          <link
            rel="mask-icon"
            href="https://storage.googleapis.com/oyah.xyz/assets/favicons/safari-pinned-tab.svg"
            color="#cc0000"
          />
          <link
            rel="shortcut icon"
            href="https://storage.googleapis.com/oyah.xyz/assets/favicons/favicon.ico"
          />
          <meta name="apple-mobile-web-app-title" content="Oyah" />
          <meta name="application-name" content="Oyah" />
          <meta name="msapplication-TileColor" content="#cc0000" />
          <meta
            name="msapplication-config"
            content="https://storage.googleapis.com/oyah.xyz/assets/favicons/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script src="/js/jquery.min.js" />
          <script src="/js/popper.min.js" />
          <script src="/js/bootstrap.bundle.min.js" />
          <link rel="stylesheet" href="/_next/static/style.css" />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          />
        </body>
        <style jsx global>{`
          html,
          body,
          body > div:first-child,
          body > div > #__next,
          body > div > #__next > div {
            height: 100%;
          }

          .pace {
            -webkit-pointer-events: none;
            pointer-events: none;

            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
          }

          .pace-inactive {
            display: none;
          }

          .pace .pace-progress {
            background: #29d;
            position: fixed;
            z-index: 2000;
            top: 0;
            right: 100%;
            width: 100%;
            height: 2px;
          }
        `}</style>
      </html>
    );
  }
}

export default MyDocument;
