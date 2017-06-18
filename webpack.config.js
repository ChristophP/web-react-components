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
        plugins: [
          "transform-object-rest-spread"
        ]
      },
    }]
  },
  externals: {
    react: {
      commonjs: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      root: 'ReactDOM',
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'dev-assets'),
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    disableHostCheck: true
  }
};
