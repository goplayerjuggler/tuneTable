import { fileURLToPath } from "url";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import HtmlInlineCssWebpackPluginModule from "html-inline-css-webpack-plugin";
import HtmlInlineScriptPlugin from "html-inline-script-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import fs from "fs";

const HtmlInlineCssWebpackPlugin =
	HtmlInlineCssWebpackPluginModule.default || HtmlInlineCssWebpackPluginModule;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to concatenate tune files before build
class ConcatenateTunesPlugin {
	apply(compiler) {
		const tunesDir = path.resolve(__dirname, "src", "tunes");
		const templateFile = path.resolve(
			__dirname,
			"src",
			"tunes-template.json.js"
		);
		const outputFile = path.resolve(__dirname, "src", "tunes.compiled.js");
		// Persists across recompilations within one webpack session
		let lastInputHash = null;

		compiler.hooks.beforeCompile.tapAsync(
			"ConcatenateTunesPlugin",
			(params, callback) => {
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

					console.log(`Concatenating ${tuneFiles.length} tune files...`);

					const tuneObjects = tuneFiles.map((filename) => {
						const filepath = path.join(tunesDir, filename);
						const content = fs.readFileSync(filepath, "utf8");
						const lines = content.trimEnd().split("\n");
						return `{${lines.slice(1, -1).join("\n")}}`;
					});

					const arrayLiteral =
						"[\n        " + tuneObjects.join(",\n        ") + "\n    ]";

					const template = fs.readFileSync(templateFile, "utf8");
					const newContent = template.replace(
						"//CopyTunesHere",
						`tunes: ${arrayLiteral},`
					);

					fs.writeFileSync(outputFile, newContent, "utf8");
					lastInputHash = inputHash;
					// Only update hash after a successful write
					callback();
				} catch (error) {
					console.error("Error concatenating tunes:", error);
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
		entry: "./src/index.js",
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, "dist"),
			clean: true,
			publicPath: ""
		},
		externals: {
			abcjs: "ABCJS"
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
			new ConcatenateTunesPlugin(),

			new HtmlWebpackPlugin({
				template: "./src/index.html",
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
			static: "./dist",
			port: 8080,
			hot: true,
			// Don't watch dist folder
			watchFiles: {
				paths: ["src/**/*"],
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
