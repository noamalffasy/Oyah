const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");

module.exports = withCSS(
  withTypescript({
    cssModules: true,
    cssLoaderOptions: {
      modules: true,
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]"
    },
    useFileSystemPublicRoutes: false,
    webpack: config => {
      config.externals.fs = "fs";
      config.module.rules.push(
        {
          test: /\.md$/,
          loader: "raw-loader"
        }
      );
      return config;
    }
  })
);
