const path = require('path');
var nodeExternals = require('webpack-node-externals');
const {
  NODE_ENV = 'production',
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
    ],
  },
}