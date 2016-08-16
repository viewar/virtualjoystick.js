module.exports = {
  entry: {
    'index': './index.js'
  },
  output: {
    path: 'bin',
    filename: '[name].js',
    sourceMapFilename: '[file].map'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules']
  },
  plugins: []
};
