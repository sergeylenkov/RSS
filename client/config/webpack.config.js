const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'browserslist',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', 'scss', 'css'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
      },
    ],
  },
};
