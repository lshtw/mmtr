const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        'js/app.js': './src/index.js', // scripts
        'styles/style.css': './src/styles/style.scss' //styles
    },
    output: {
        path: __dirname + '/build/',
        filename: "[name]",
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',

            }
        },
            {
                test: /\.scss$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'css-loader'
                },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
            test: /\.(png|svg|jpg|gif|ttf)$/,
                use: [
                     'file-loader'
                ]
             },
       ]
    },
     plugins: [
         new CleanWebpackPlugin(["build"]),
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
        contentBase: __dirname + '/build/',
        hot: true
    }
};