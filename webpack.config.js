const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoPreprocess = require('svelte-preprocess');
const { join } = require('path');

module.exports = {
  mode: 'production',
  // devtool: 'inline-source-map',
  entry: {
    'popup': join(__dirname, './src/popup/main.ts'),
    'background-script': join(__dirname, './src/background-script/main.ts'),
    'content-script': join(__dirname, './src/content-script/main.ts'),
    'injected-script': join(__dirname, './src/injected-script/main.ts'),
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules/,
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            hotReload: true,
            preprocess: autoPreprocess()
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.svelte', '.mjs', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup/index.html',
      publicPath: '.',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    // TODO: use this plugin to copy popup assets like CSS, fonts...
    new CopyPlugin({
      patterns: [
        { from: "...", to: "popup-assets" },
      ],
    }),
  ]
};