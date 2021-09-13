const path = require('path')

 const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, ''),
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    chunkFilename: 'js/[name].[hash:8].js',
    sourceMapFilename: 'js/[name].[hash:8].map',
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(process.cwd(), 'dist'),
      serveIndex: true,
      watch: true,
    },
    bonjour: true,
    webSocketServer: 'ws',
    client: {
      progress: true,
      webSocketTransport: 'ws',
    },
    headers: {
      'X-Content-Type-Options': 'none'
    },
    hot: true
  },
  resolve: {
    alias: {
      '@': './'
    }
  },
  module: {
    rules: [
      { // Images
        test: /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/,
        use: [
          {
            loader: path.resolve(__dirname, './node_modules/url-loader/dist/cjs.js'),
            options: {
              limit: 4096,
              fallback: {
                loader: path.resolve(__dirname, './node_modules/file-loader/dist/cjs.js'),
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      { // Fonts
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: path.resolve(__dirname, './node_modules/url-loader/dist/cjs.js'),
            options: {
              limit: 4096,
              fallback: {
                loader: path.resolve(__dirname, './node_modules/file-loader/dist/cjs.js'),
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      { // Sass
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                ident: true
              },
            },
          }
        ]
      },
    ]
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: './public/index.html',
          to: './',
          toType: 'dir',
          priority: -1,
        },
        {
          from: './public/favicon.ico',
          to: './',
          toType: 'dir',
          priority: -1,
        }
      ],
    }),
  ]
};
