const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: 'bundle.js',
    library: 'WebReactComponents',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: [
        'babel-loader',
        'eslint-loader',
      ],
    }],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  devServer: {
    contentBase: path.join(__dirname, 'dev-assets'),
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
};
