const path = require("path");
module.exports = {
    entry: {
        index: "./src/JS/Main/index.js"
    },
    output: {
        filename: "[name].[contentHash].js",
        path: path.join(__dirname, "/dist")
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    }
};
