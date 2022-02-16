const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package.json');
const pkgVersion = require('./lerna.json').version;

const now = new Date();
const banner = `/**
 * ${pkg.name} v${pkgVersion}
 * ${pkg.repository.url}
 * Copyright (c) 2019 ${pkg.author}
 * Released under the ${pkg.license} license
 * Date: ${now.toISOString()}
 */`;
module.exports = (env) => ({
  entry: path.resolve(
    __dirname,
    'packages/filerobot-image-editor/src/index.js',
  ),
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.jsx', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            preamble: banner,
            comments: false,
          },
        },
      }),
    ],
  },
  // disableAnalyzerPlugin is provided from analyze script for disabling the analyzer plugin
  // as we use other plugin for analyzing the already bundeled dist from the script fired.
  plugins: [...(env.disableAnalyzerPlugin ? [] : [new BundleAnalyzerPlugin()])],
  output: {
    clean: true,
    filename: 'filerobot-image-editor.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'FilerobotImageEditor',
      type: 'umd',
      export: 'default',
    },
  },
});
