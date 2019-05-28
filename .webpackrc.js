var path = require('path');
module.exports = {
  devServer: {
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: "/index.html" }]
    },
  },
}
