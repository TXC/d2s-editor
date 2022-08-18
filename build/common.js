const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const env = process.env.NODE_ENV;
const isDev = env === 'development';
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: isDev,
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    implementation: require('sass'),
    sourceMap: true,
  },
};

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      sourceMap: true,
      config: 'postcss.config.js',
    },
  },
};

module.exports = {
  entry: {
    app: {
      import: path.resolve(__dirname, '../src/js/index'),
      dependOn: 'd2Data',
    },
    d2Data: {
      import: path.resolve(__dirname, '../src/js/d2/index')
    }
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
    filename: '[name].js',
    assetModuleFilename: '[path][ext][query]',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      js: path.resolve(__dirname, '../src/js'),
      types: path.resolve(__dirname, '../src/types')
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.webpack.json'),
          getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|svg|jpe?g|gif|woff2?|eot|ttf|otf)$/,
        parser: {
          dataUrlCondition: {
            maxSize: 24 * 1024, // 24KiB
          },
        },
        generator: {
          filename: '[path][name][ext][query]',
        },
        type: 'asset',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          cssLoader,
          postCSSLoader,
          sassLoader,
        ],
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      'process': 'process/browser',
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../src/js/d2/constants.bundle.min.js'), to: path.resolve(__dirname, '../public/d2/') },
      ],
    }),
    new HtmlWebpackPlugin({
      //title: 'Canvas demo',
      template: path.resolve(__dirname, '../src/index.html'),
      favicon: path.resolve(__dirname, '../src/assets/images/diablo-icon.png'),
      //inject: false,
      //meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      //hash: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
  ],
};
