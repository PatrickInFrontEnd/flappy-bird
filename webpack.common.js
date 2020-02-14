const path = require("path");
module.exports = {
    entry: {
        index: "./src/JS/Main/index.js"
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
