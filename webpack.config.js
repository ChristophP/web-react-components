module.exports = {
	entry: "./src/index.js",
	output: {
    path: __dirname + "/dist",
		filename: "bundle.js",
		libraryTarget: "umd"
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
			query: {
				presets: ["es2015", "react"],
				plugins: [
				]
			},
		}]
	},
	externals: {
		preact: "React"
	}
};
