module.exports = {
    entry: './src/App.tsx',
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
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']}
        ]
    }
}
