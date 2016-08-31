module.exports = {
  entry: {
    'index': './index.js'
  },
  output: {
    path: 'bin',
    filename: 'index.js',
    library: 'virtualJoystick',
    libraryTarget: 'umd'
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
