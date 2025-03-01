const path = require('path');
const webpack = require('webpack');

module.exports = {
    // Other webpack configuration options...
    resolve: {
        fallback: {
            "path": require.resolve("path-browserify")
        }
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^fs$/,
            contextRegExp: /compile-run/
        })
    ]
};
