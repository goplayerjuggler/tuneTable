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
		compiler.hooks.beforeCompile.tapAsync(
			"ConcatenateTunesPlugin",
			(params, callback) => {
				try {
					const tunesDir = path.resolve(__dirname, "src", "tunes");
					const templateFile = path.resolve(
						__dirname,
						"src",
						"tunes-template.json.js"
					);
					const outputFile = path.resolve(
						__dirname,
						"src",
						"tunes.compiled.js"
					);

					console.log("Concatenating tune files...");

					// Read all .js files from tunes directory (excluding index.js if it exists)
					const tuneFiles = fs
						.readdirSync(tunesDir)
						.filter((f) => f.endsWith(".js") && f !== "index.js");

					console.log(`Found ${tuneFiles.length} tune files`);

					// Read and extract object literals from each file
					const tuneObjects = tuneFiles.map((filename) => {
						const filepath = path.join(tunesDir, filename);
						const content = fs.readFileSync(filepath, "utf8");

						// Extract everything between the first and last lines
						const lines = content.trimEnd().split("\n");

						return `{${lines.slice(1, -1).join("\n")}}`;
					});

					// Create the array literal with proper indentation
					const arrayLiteral =
						"[\n        " + tuneObjects.join(",\n        ") + "\n    ]";

					// Read the template file
					const template = fs.readFileSync(templateFile, "utf8");

					// Replace the placeholder with the array
					const newContent = template.replace(
						"//CopyTunesHere",
						`tunes: ${arrayLiteral},`
					);

					// Only write if content changed (prevents infinite loop + unnecessary rebuilds)
					let shouldWrite = true;
					if (fs.existsSync(outputFile)) {
						const existingContent = fs.readFileSync(outputFile, "utf8");
						shouldWrite = existingContent !== newContent;
					}

					if (shouldWrite) {
						console.log(
							`Regenerating tunes.json.js with ${tuneFiles.length} tunes`
						);
						fs.writeFileSync(outputFile, newContent, "utf8");
					}
					callback();
				} catch (error) {
					console.error("Error concatenating tunes:", error);
					callback(error);
				}
			}
		);

		// Tell webpack to watch the tune files
		compiler.hooks.thisCompilation.tap(
			"ConcatenateTunesPlugin",
			(compilation) => {
				const tunesDir = path.resolve(__dirname, "src", "tunes");
				const tuneFiles = fs
					.readdirSync(tunesDir)
					.filter((f) => f.endsWith(".data.js"))
					.map((f) => path.join(tunesDir, f));

				tuneFiles.forEach((file) => {
					compilation.fileDependencies.add(file);
				});
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
					ignored: ["**/node_modules/**", "**/dist/**"]
				}
			}
		},
		watchOptions: {
			ignored: ["**/node_modules/**"]
		},
		optimization: {
			minimizer: [
				`...`, // Extend existing minimizers (like terser for JS)
				new CssMinimizerPlugin()
			]
		}
	};
};
