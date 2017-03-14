module.exports = {
 entry: './index.ts',
 output: {
   filename: 'bundle.js',
   path: __dirname
 },
 module: {
   rules: [
     {
       test: /\.ts$/,
       loader: 'ts-loader',
       exclude: /node_modules/,
     },
   ]
 },
 resolve: {
   extensions: [".ts", ".js"]
 },
 devtool: 'inline-source-map'
};
