const merge = require('webpack-merge').merge;
const common = require('./webpack.common');
const webpack = require('webpack');

module.exports = merge(common, {
    devtool: 'eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        host: 'localhost',
        port: '3000'
    },
});
