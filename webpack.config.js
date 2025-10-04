import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
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
    externals: {
      'abcjs': 'ABCJS'
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
