const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'client.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // The Modeler supplies React.createElement; keep Babel 8
                        // from importing the automatic JSX runtime.
                        presets: [
                            ['@babel/preset-react', { runtime: 'classic', development: false }],
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            react: 'camunda-modeler-plugin-helpers/vendor/react',
        },
    },
    devtool: 'cheap-module-source-map',
};
