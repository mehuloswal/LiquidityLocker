const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

const extensions = ['.js', '.jsx'];

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'build'),
  },
  resolve: { extensions },
  devServer: {
    client: {
      overlay: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-react', { runtime: 'automatic' }]],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new EslintWebpackPlugin({ extensions }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // favicon: './public/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env.DEVELOPMENT_ERC20LOCKER_CONTRACT_ADDRESS': JSON.stringify(
        '0xf85983340dE2c9016F84824A5C747fD80AC0E213'
      ),
      'process.env.DEVELOPMENT_LPLOCKER_CONTRACT_ADDRESS': JSON.stringify(
        '0x97b8B9a6Df65f09a1ABBFC51807380689Ead6Ed0'
      ),
    }),
  ],
  stats: 'minimal',
};
