module.exports = {
  webpack: (config: any) => {
    return {
      ...config,
      externals: {
        ...config.externals,
        fs: "fs"
      },
      module: {
        ...config.module,
        rules: config.module.rules.concat([
          {
            test: /\.md$/,
            loader: "emit-file-loader",
            options: {
              name: "dist/[path][name].[ext]"
            }
          },
          {
            test: /\.md$/,
            loader: "raw-loader"
          }
        ])
      }
    };
  }
};
