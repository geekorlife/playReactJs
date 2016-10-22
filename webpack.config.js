module.exports = {
    entry: './src/index.js',
    output: {
        path: './',
        filename: 'app.js'
    },
    devServer:{
        inline: true,
        host: '192.168.2.8',
        port: 5555
    },
    module:{
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