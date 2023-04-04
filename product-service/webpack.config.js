const path = require('path');
//const webpack = require('webpack')
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isLocal = slsw.lib.webpack.isLocal;

module.exports = (async () => {
  //const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    target: 'node',
    plugins: [
      /*new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),*/
      new ForkTsCheckerWebpackPlugin()
    ],
    externals: [nodeExternals()],
    /*{
      modulesDir: path.resolve(__dirname, 'node_modules'),
    })],*/
    module: {
      rules: [
        {
          test: /\.(ts|js)?$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
      ],
    }
  };
})();