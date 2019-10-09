module.exports = {
 entry: './src/index.ts',
 output: {
   filename: 'bundle.js',
   path: __dirname + '/dist',
 },
 module: {
   rules: [
     {
       test: /\.tsx?$/,
       loader: 'ts-loader',
       exclude: /node_modules/
     },
     {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
   ]
 },
 resolve: {
   extensions: [".tsx", ".ts", ".js"]
 },
 devtool: "inline-source-map"
};
