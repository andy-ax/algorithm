const path = require('path');
const merge = require('webpack-merge').merge;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssPlugin = require("mini-css-extract-plugin");

const type = process.env.npm_lifecycle_event;
const events = {
    'dev': {
        filename: '[name].js',
    },
    'build': {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].bundle.js'
    }
};
let output = {
    path: path.resolve(__dirname, 'dist'),
};
output = merge(output, events[type]);

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                include: path.resolve(__dirname, "src"),
                use: [
                    'file-loader'
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Graph'
        }),
        new MiniCssPlugin({
            filename:'[name].css'
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output,
};
