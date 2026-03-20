import { fileURLToPath } from "url";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlInlineCssWebpackPluginModule from "html-inline-css-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import fs from "fs";
import { buildTuneLists } from "./build/build-tune-lists.mjs";

const HtmlInlineCssWebpackPlugin =
	HtmlInlineCssWebpackPluginModule.default || HtmlInlineCssWebpackPluginModule;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to concatenate tune files and build tune-list JSON files before build
class ConcatenateTunesPlugin {
	constructor({ isDevelopment = false } = {}) {
		this.isDevelopment = isDevelopment;
	}

	apply(compiler) {
		const tunesDir = path.resolve(__dirname, "src", "tunes");
		const templateFile = path.resolve(
			__dirname,
			"src",
			"tunes-template.data.js"
		);
		// Persists across recompilations within one webpack session
		let lastInputHash = null;

		compiler.hooks.beforeCompile.tapAsync(
			"ConcatenateTunesPlugin",
			async (params, callback) => {
				try {
					const tuneFiles = fs
						.readdirSync(tunesDir)
						.filter((f) => f.endsWith(".data.js"));

					// Hash based on filenames + mtimes — cheap and sufficient
					const templateStat = fs.statSync(templateFile);
					const inputHash =
						tuneFiles
							.map((f) => {
								const stat = fs.statSync(path.join(tunesDir, f));
								return `${f}:${stat.mtimeMs}`;
							})
							.join("|") + `|template:${templateStat.mtimeMs}`;

					if (inputHash === lastInputHash) {
						// Inputs unchanged — skip silently (handles duplicate startups
						// and any spurious recompilations)
						return callback();
					}

					console.log(`tune lists from ${tuneFiles.length} tune files...`);

					// Build tune-list JSON files — runs only when tune files or the
					// template change (same input-hash guard as concatenation above)
					await buildTuneLists({
						isDevelopment: this.isDevelopment,
						outputDir: path.join(compiler.outputPath, "tune-lists")
					});

					// Only update hash after both steps succeed
					lastInputHash = inputHash;
					callback();
				} catch (error) {
					console.error("Error in pre-build step:", error);
					callback(error);
				}
			}
		);

		compiler.hooks.thisCompilation.tap(
			"ConcatenateTunesPlugin",
			(compilation) => {
				// Watch the directory itself — triggers on add/delete
				compilation.contextDependencies.add(tunesDir);

				// Watch the template file
				compilation.fileDependencies.add(templateFile);

				// Watch individual tune files for edits
				// (contextDependencies covers add/delete but not content changes)
				fs.readdirSync(tunesDir)
					.filter((f) => f.endsWith(".data.js"))
					.forEach((f) =>
						compilation.fileDependencies.add(path.join(tunesDir, f))
					);
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
						"**/src/tunes.compiled.js"
					]
				}
			}
		},
		watchOptions: {
			ignored: ["**/node_modules/**", "**/src/tunes.compiled.js"]
		},
		optimization: {
			minimizer: [
				`...`, // Extend existing minimizers (like terser for JS)
				new CssMinimizerPlugin()
			]
		}
	};
};
