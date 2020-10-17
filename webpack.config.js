module.exports = {
    entry: './src/App.tsx',
    devServer: {
        proxy: {
            '/api/*': {
                target: 'https://localhost:8443',
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    output: {
        path: __dirname + '/public',
        filename: 'build/app.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},
            {test: /\.css$/, use: ['style-loader', 'css-loader']}
        ]
    }
}
