const webpack = require('webpack')

module.exports = {
    devtool: 'source-map', // or eval
    entry: './src/index.js',
    output: {
        path: './',
        filename: 'app.js'
    },
    plugins: [
        
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false,
            mangle: true,
            minimize: true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
}