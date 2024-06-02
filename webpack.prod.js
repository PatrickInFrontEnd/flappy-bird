const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const miniCSSExtractPlugin = require("mini-css-extract-plugin");
const JsOptimizer = require("terser-webpack-plugin");
const commonConfig = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(commonConfig, {
    mode: "production",
    output: {
        filename: "[name].[contentHash].js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: "html-loader",
            },
            {
                test: /\.(sa|sc)ss$/,
                exclude: /node_modules/,
                use: [miniCSSExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [miniCSSExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.json$/,
                type: "json",
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash].[ext]",
                },
            },
            {
                test: /\.(mp3|mp4|flac)$/,
                type: "asset/resource",
                generator: {
                    filename: "gameSounds/[hash].[ext]",
                },
            },
        ],
    },
    optimization: {
        minimizer: [
            new JsOptimizer(),
            new HtmlPlugin({
                filename: "index.html",
                template: "./src/index.html",
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                },
            }),
        ],
    },
    plugins: [
        new miniCSSExtractPlugin({
            filename: "[name].[contentHash].css",
        }),
        new CleanWebpackPlugin(),
    ],
});
