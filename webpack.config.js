const path = require('path');
var nodeExternals = require('webpack-node-externals');
const envLoader = require('./env-loader'); // Import environment info
const environment = envLoader();
const {
  NODE_ENV = environment,
} = process.env;

module.exports = {
  entry: './index.ts',
  mode: NODE_ENV,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['moment']
    })
  ],
  devtool: 'source-map',
  externalsPresets: {
    node: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match TypeScript files
        use: 'ts-loader', // Use ts-loader for .ts and .tsx files
        exclude: /node_modules/, // Exclude node_modules directory
      },
      {
        test: /env-loader\.js$/,
        loader: 'env-loader',
      },
    ],
  },
  performance: { hints: false },
  devServer: {
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true,
    open: false,
    hot: true,
    port: 8000,
    host: 'localhost'
  },
}