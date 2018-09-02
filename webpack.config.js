const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: './src/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
    // minimizer: [new UglifyJsPlugin({
    //   include: /\.min\.js$/
    // })]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{ loader: "html-loader", options: { minimize: true } }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [{ loader: 'url-loader', options: { limit: 10000 }}]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "src/index.html",
      filename: "index.html"
    }),
    new HtmlWebPackPlugin({
      template: "src/views/search.html",
      filename: "views/search.html",
      inject: false
    }),
    new HtmlWebPackPlugin({
      template: "src/views/search.list.html",
      filename: "views/search.list.html",
      inject: false
    }),
    new HtmlWebPackPlugin({
      template: "src/views/search.statistics.chart.html",
      filename: "views/search.statistics.chart.html",
      inject: false
    }),
    new HtmlWebPackPlugin({
      template: "src/views/search.statistics.html",
      filename: "views/search.statistics.html",
      inject: false
    }),
    new HtmlWebPackPlugin({
      template: "src/views/search.statistics.percentage.html",
      filename: "views/search.statistics.percentage.html",
      inject: false
    })
  ]
};