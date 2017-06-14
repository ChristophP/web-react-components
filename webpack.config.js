const path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js",
    library: 'WebReactComponents',
    libraryTarget: "umd"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ["es2015", "react"],
        plugins: ["transform-object-rest-spread"]
      },
    }]
  },
  externals: {
    react: "React",
    'react-dom': "ReactDOM"
  },
  devServer: {
    contentBase: path.join(__dirname, 'dev-assets'),
    port: 8080
  }
};
