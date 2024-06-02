const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const miniCSSExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.common.js");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { merge } = require("webpack-merge");

const port = 5050;

module.exports = merge(commonConfig, {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
    },
    stats: "errors-warnings",
    devServer: {
        static: {
            directory: path.join(__dirname, "src"),
        },
        port,
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
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.json$/,
                type: "json",
            },
            {
                test: /\.(jpg|gif|png|)$/,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash][ext][query]",
                },
            },
            {
                test: /\.(mp3|mp4|flac)$/,
                type: "asset/resource",
                generator: {
                    filename: "gameSounds/[hash][ext][query]",
                },
            },
        ],
    },
    plugins: [
        new HtmlPlugin({
            filename: "index.html",
            template: "./src/index.html",
        }),
        new miniCSSExtractPlugin({
            filename: "[name].[ext]",
        }),
        new BrowserSyncPlugin({
            host: "localhost",
            port: 3000,
            proxy: `http://localhost:${port}`,
        }),
    ],
});
