var path = require("path")

module.exports = {
 entry: './app/index.ts',
 output: {
   filename: 'bundle.js',
   path: path.resolve(__dirname, "build"),
   publicPath: "/assets/"
 },
 module: {
   rules: [
     {
       enforce: 'pre',
       test: /\.js$/,
       loader: "source-map-loader"
     },
     {
       enforce: 'pre',
       test: /\.ts$/,
       use: "source-map-loader"
     }
   ]
 },
 resolve: {
   extensions: [".ts", ".js"]
 },
 devtool: 'inline-source-map',
};
