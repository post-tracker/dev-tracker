const path = require( 'path' );

module.exports = {
    entry: './app/index.jsx',
    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            'env',
                            'react',
                        ],
                    },
                },
            },
        ],
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join( __dirname, 'dev' ),
        compress: true,
        https: true,
        host: '0.0.0.0',
        port: 9000,
        publicPath: "https://localhost:9000/scripts/"
    },
    output: {
        filename: 'app.js',
        path: path.resolve( __dirname, 'web/scripts' ),
    },
    resolve: {
        extensions: [
            '.js',
            '.jsx',
        ],
    },
};
