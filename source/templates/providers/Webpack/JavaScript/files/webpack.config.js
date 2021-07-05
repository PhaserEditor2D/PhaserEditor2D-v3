const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.js"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            },
            {
                test: /\.json/,
                type: "asset/resource"
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name]-[contenthash].bundle.js",
        assetModuleFilename: "asset-packs/[name]-[hash][ext][query]"
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "./dist"),
        open: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html"),
            minify: false
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "static",
                    globOptions: {
                        // asset pack files are imported in code as modules
                        ignore: ["**/publicroot", "**/*-pack.json"]
                    }
                }
            ]
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
};