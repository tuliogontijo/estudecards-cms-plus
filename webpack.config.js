/* eslint-disable no-undef */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/app.js',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'content-script.bundle.js',
      clean: true,
    },

    devtool: isDevelopment ? 'cheap-module-source-map' : false,

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
          generator: { filename: 'img/[name].[hash][ext]' }
        }
      ],
    },

    watch: isDevelopment,
    watchOptions: { ignored: /node_modules/ },

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),

      new ESLintPlugin({
        files: 'src/**/*.js',
        fix: isDevelopment,
        failOnError: !isDevelopment,
      }),

      new MiniCssExtractPlugin({
        filename: 'styles/content-styles.css',
      }),

      new CopyPlugin({
        patterns: [
          { from: 'manifest.json', to: '.' },
          { from: 'assets/icons', to: 'icons' },
        ],
      }),
    ],

    optimization: {
      minimize: !isDevelopment,
    },

    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@core': path.resolve(__dirname, 'src/core'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@img': path.resolve(__dirname, 'assets/img'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@constants': path.resolve(__dirname, 'src/constants/index.js'),
        'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
      }
    }
  };
};
