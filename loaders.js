const JSLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
    }
};
const ESLintLoader = {
    test: /\.js$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: {
        loader: 'eslint-loader',
        options: {
            configFile: '.eslintrc.js',
            fix: true
        },
    }
};
const SCSSLoader = {
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader' // creates style nodes from JS strings
        },
        {
            loader: 'css-loader' // translates CSS into CommonJS
        },
        {
            loader: 'sass-loader' // compiles Sass to CSS
        }
    ]
};
const FileLoader =  {
    test: /\.(png|svg|jpg|gif|ttf)$/,
    use: [
        'file-loader'
    ]
}
module.exports = {
    JSLoader: JSLoader,
    ESLintLoader: ESLintLoader,
    SCSSLoader: SCSSLoader,
    FileLoader: FileLoader
};