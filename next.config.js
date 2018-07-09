const path = require("path");
const webpack = require("webpack");
const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const dev = process.env.NODE_ENV !== "production"

module.exports = withCSS(
  withTypescript({
    cssModules: true,
    cssLoaderOptions: {
      modules: true,
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]"
    },
    useFileSystemPublicRoutes: dev,
    distDir: dev ? ".next" : "./dist/functions/next",
    webpack: (config, {
      dev
    }) => {
      const prevEntry = config.entry;
      // Service worker
      config.entry = () =>
        prevEntry().then(entry => {
          if (entry["main.js"]) {
            entry["main.js"].push(path.resolve(dev ? "./utils/offline" : "./utils/offline"));
          }
          return entry;
        });
      if (!dev) {
        config.plugins.push(
          new SWPrecacheWebpackPlugin({
            cacheId: "oyah",
            filepath: path.resolve(dev ? "./public/sw.js" : "./public/sw.js"),
            minify: true,
            staticFileGlobsIgnorePatterns: [/next\//, /bundles/],
            runtimeCaching: [{
                handler: "fastest",
                urlPattern: /[.](.[[png|jpg|jpeg|css]])/
              },
              {
                handler: "networkFirst",
                urlPattern: /^http.*/
              },
              {
                handler: "cacheFirst",
                urlPattern: /^https:\/\/storage\.googleapis\.com\/oyah.xyz\//
              }
            ]
          })
        );
      }

      config.module.rules.push({
        test: /\.css%/,
        use: [
          "isomorphic-style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader"
        ]
      });

      // // Inline critical CSS
      // config.plugins = config.plugins.push(
      //   new CriticalPlugin({
      //     src: ""
      //   })
      // );

      // // Minify and uglify JavaScript
      // config.plugins = config.plugins.filter(
      //   plugin => plugin.constructor.name !== "UglifyJsPlugin"
      // );
      // config.plugins.push(new webpack.optimize.UglifyJsPlugin());

      // Import Markdown files
      config.externals.fs = "fs";
      config.module.rules.push({
        test: /\.md$/,
        loader: "raw-loader"
      });
      config.module.rules.push({
        test: /\.md$/,
        loader: "emit-file-loader",
        options: {
          name: "dist/[path][name].[ext]"
        }
      });
      return config;
    }
  })
);