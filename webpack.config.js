const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: 'production',
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.json$/,
          type: 'json',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: 'body',
        minify: isDevelopment ? false : {
          collapseWhitespace: true,
          removeComments: true,
        },
      }),
      // Only use inline plugin in production
      ...(isDevelopment ? [] : [
        new HtmlInlineScriptPlugin({
          htmlMatchPattern: [/index.html$/],
          scriptMatchPattern: [/bundle.*.js$/],
        })
      ])
    ],
    devServer: {
      static: './dist',
      port: 8080,
      hot: true,
      // Don't watch dist folder
      watchFiles: {
        paths: ['src/**/*'],
        options: {
          ignored: ['**/node_modules/**', '**/dist/**']
        }
      }
    },
  };
};