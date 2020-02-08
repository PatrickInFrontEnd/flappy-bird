const HtmlPlugin = require("html-webpack-plugin");
const miniCSSExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.common.js");
const merge = require("webpack-merge");

module.exports = merge(commonConfig, {
    mode: "development",
    output: {
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader"
            },
            {
                test: /\.(sa|sc)ss$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(jpg|gif|png|)$/,
                loader: "file-loader",
                options: {
                    outputPath: "images",
                    name: "[name].[hash].[ext]",
                    esModule: false
                }
            },
            {
                test: /\.(mp3|mp4|flac)$/,
                loader: "file-loader",
                options: {
                    outputPath: "gameSounds",
                    name: "[name].[hash].[ext]",
                    esModule: false
                }
            }
        ]
    },
    plugins: [
        new HtmlPlugin({
            filename: "index.html",
            template: "./src/index.html"
        }),
        new miniCSSExtractPlugin({
            filename: "[name].[ext]"
        })
    ]
});
