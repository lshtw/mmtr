const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaders = require('./loaders');

module.exports = {
    entry: {
        'js/app.js': './src/index.js', // scripts
        'styles/style.css': './src/styles/style.scss' //styles
    },
    output: {
        path: __dirname + '/build/',
        filename: '[name]',
    },
    module: {
        rules: [
            loaders.JSLoader,
            loaders.ESLintLoader,
            loaders.SCSSLoader,
            loaders.FileLoader
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './style/style.css',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin([{
            from: './src/fonts',
            to: './fonts'
        },
        {
            from: './src/img',
            to: './img'
        },
        ]),
    ],
    devServer: {
        contentBase: __dirname + '/build/'
    }
};