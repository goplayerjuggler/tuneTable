import { fileURLToPath } from "url";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlInlineCssWebpackPluginModule from "html-inline-css-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { buildTuneLists } from "./build/build-tune-lists.mjs";

const HtmlInlineCssWebpackPlugin =
	HtmlInlineCssWebpackPluginModule.default || HtmlInlineCssWebpackPluginModule;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Builds tune-list JSON files before a production build. Runs once per
// build. In development this plugin is a no-op: tune lists are built
// separately, via `npm run build:tunes`, rather than as part of webpack's
// compile — see the npm scripts section of the README.
class ConcatenateTunesPlugin {
	constructor({ isDevelopment = false } = {}) {
		this.isDevelopment = isDevelopment;
	}

	apply(compiler) {
		// No-op in development — see comment above.
		if (this.isDevelopment) return;

		compiler.hooks.beforeCompile.tapAsync(
			"ConcatenateTunesPlugin",
			async (params, callback) => {
				try {
					console.log("Building tune lists...");
					await buildTuneLists({
						isDevelopment: this.isDevelopment,
						outputDir: path.join(compiler.outputPath, "tune-lists"),
						manifestPath: path.resolve(
							__dirname,
							"src/generated/tune-lists-manifest.json"
						)
					});
					callback();
				} catch (error) {
					console.error("Error in pre-build step:", error);
					callback(error);
				}
			}
		);
	}
}

export default (env, argv) => {
	const isDevelopment = argv.mode === "development";
	return {
		mode: argv.mode || "production",
		devtool: isDevelopment ? "eval-source-map" : false,
		entry: path.resolve(__dirname, "src/index.js"),
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "dist"),
			clean: {
				// Preserve tune-list JSON files written by ConcatenateTunesPlugin
				// in beforeCompile, which runs before webpack's emit/clean phase
				keep: (asset) => asset.startsWith("tune-lists/")
			},
			publicPath: ""
		},
		externals: {
			abcjs: "ABCJS"
		},
		resolve: {
			alias: env?.localAbcTools
				? {
						"@goplayerjuggler/abc-tools": path.resolve(
							__dirname,
							"../abcTools/"
						)
					}
				: {}
		},
		module: {
			rules: [
				{
					test: /\.css$/i,
					use: [
						isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
						"css-loader"
					]
				},
				{
					test: /\.json$/,
					type: "json"
				},
				{
					test: /\.html$/i,
					type: "asset/source",
					exclude: path.resolve(__dirname, "src/index.html")
				}
			]
		},
		plugins: [
			// Run before everything else
			new ConcatenateTunesPlugin({ isDevelopment }),

			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "src/index.html"),
				inject: "body",
				minify: isDevelopment
					? false
					: {
							collapseWhitespace: true,
							removeComments: true
						}
			}),
			// Extract CSS to temporary file in production (will be inlined)
			...(!isDevelopment
				? [
						new MiniCssExtractPlugin({
							filename: "styles.css"
						})
					]
				: []),
			// Inline both CSS and JS in production
			...(isDevelopment
				? []
				: [
						new HtmlInlineCssWebpackPlugin(),
						new HtmlInlineScriptPlugin({
							htmlMatchPattern: [/index.html$/],
							scriptMatchPattern: [/bundle.*.js$/]
						})
					])
		],
		devServer: {
			static: path.resolve(__dirname, "dist"),
			port: 8080,
			hot: true,
			// Don't watch dist folder
			watchFiles: {
				paths: [path.resolve(__dirname, "src/**/*")],
				options: {
					ignored: [
						"**/node_modules/**",
						"**/dist/**",
						"**/src/generated/**",
						// Tune data is no longer watched — run `npm run build:tunes` manually
						"**/src/tunes/**"
					]
				}
			}
		},
		watchOptions: {
			ignored: [
				"**/node_modules/**",
				"**/src/tunes.compiled.js",
				"**/src/generated/**",
				// Tune data is no longer watched — run `npm run build:tunes` manually
				"**/src/tunes/**"
			]
		},
		optimization: {
			minimizer: [
				`...`, // Extend existing minimizers (like terser for JS)
				new CssMinimizerPlugin()
			]
		}
	};
};
