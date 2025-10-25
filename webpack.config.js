import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlInlineCssWebpackPluginModule from "html-inline-css-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
const HtmlInlineCssWebpackPlugin =
	HtmlInlineCssWebpackPluginModule.default || HtmlInlineCssWebpackPluginModule;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => {
	const isDevelopment = argv.mode === "development";

	return {
		mode: argv.mode || "production",
		devtool: isDevelopment ? "eval-source-map" : false,
		entry: "./src/index.js",
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "dist"),
			clean: true,
			publicPath: "",
		},
		externals: {
			abcjs: "ABCJS",
		},
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: [
						isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
						"css-loader",
					],
				},
				{
					test: /\.json$/,
					type: "json",
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				inject: "body",
				minify: isDevelopment
					? false
					: {
							collapseWhitespace: true,
							removeComments: true,
					  },
			}),
			// Extract CSS to temporary file in production (will be inlined)
			...(!isDevelopment
				? [
						new MiniCssExtractPlugin({
							filename: "styles.css",
						}),
				  ]
				: []),
			// Inline both CSS and JS in production
			...(isDevelopment
				? []
				: [
						new HtmlInlineCssWebpackPlugin(),
						new HtmlInlineScriptPlugin({
							htmlMatchPattern: [/index.html$/],
							scriptMatchPattern: [/bundle.*.js$/],
						}),
				  ]),
		],
		devServer: {
			static: "./dist",
			port: 8080,
			hot: true,
			// Don't watch dist folder
			watchFiles: {
				paths: ["src/**/*"],
				options: {
					ignored: ["**/node_modules/**", "**/dist/**"],
				},
			},
		},
		optimization: {
			minimizer: [
				`...`, // Extend existing minimizers (like terser for JS)
				new CssMinimizerPlugin(),
			],
		},
	};
};
