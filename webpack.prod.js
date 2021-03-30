const TerserPlugin  = require('terser-webpack-plugin');//支持es6的代码压缩工具
const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');
const webpack = require("webpack");
const WorkboxPlugin = require('workbox-webpack-plugin'); //service worker 使网页可离线使用

module.exports = merge(common, {
    devtool: 'source-map',
    plugins: [
        new TerserPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        //service worker配置
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
    ],
    //将多个入口中共用的模块分离成新的js文件
    optimization: {
        splitChunks: {
            chunks: 'all',   // initial、async和all
            minSize: 30000,   // 形成一个新代码块最小的体积
            maxAsyncRequests: 5,   // 按需加载时候最大的并行请求数
            maxInitialRequests: 3,   // 最大初始化请求数
            automaticNameDelimiter: '~',   // 打包分割符
            name: true,
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/, //打包第三方库
                    chunks: "all",
                    priority: 2 // 优先级
                },
                common: { // 打包其余的的公共代码
                    minChunks: 2, // 引入两次及以上被打包
                    name: 'common', // 分离包的名字
                    chunks: 'all',
                    priority: 1
                },
            }
        },
    },
    mode: "production",
});
