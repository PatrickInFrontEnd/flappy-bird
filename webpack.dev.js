const HtmlPlugin = require("html-webpack-plugin");
const miniCSSExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack.common.js");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const merge = require("webpack-merge");

const port = 5050;

module.exports = merge(commonConfig, {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
    },
    stats: "errors-warnings",
    devServer: {
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
                test: /\.(jpg|gif|png|)$/,
                loader: "file-loader",
                options: {
                    outputPath: "images",
                    name: "[name].[hash].[ext]",
                    esModule: false,
                },
            },
            {
                test: /\.(mp3|mp4|flac)$/,
                loader: "file-loader",
                options: {
                    outputPath: "gameSounds",
                    name: "[name].[hash].[ext]",
                    esModule: false,
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
