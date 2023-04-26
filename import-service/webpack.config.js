const path = require('path');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = (async () => {
  return {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    target: 'node',
    plugins: [new ForkTsCheckerWebpackPlugin()],
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(ts|js)?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    }
  };
})();
