module.exports = {
	entry: "./src/index.js",
	output: {
    path: __dirname + "/dist",
		filename: "bundle.js",
		library: 'WRC',
		libraryTarget: "umd"
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
			query: {
				presets: ["es2015", "react"],
				plugins: ["transform-object-rest-spread"]
			},
		}]
	},
	externals: {
		react: "React",
		'react-dom': "ReactDOM"
	}
};
