'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const glob = require('glob')
const env = process.env.NODE_ENV === 'testing' ?
  require('../config/test.env') :
  require('../config/prod.env')

let system = process.argv[2]
//if (!system) system = 'index'
//console.log(process.env.buildVersionNumber);return
Date.prototype.Format = function (format) {
  var obj = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var index in obj) {
    if (new RegExp("(" + index + ")").test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (obj[index]) : (("00" + obj[index]).substr(("" + obj[index]).length)));
    }
  }
  return format;
};
let buildTime = new Date().Format('yyyy-MM-dd hh-mm').replace(' ', 'T') //不能使用冒号

function getHtmlWebpackPlugin() {
  let plugin = []
  glob.sync('./html/*.html')
    .forEach(function (name) {
      var start = name.indexOf('html/') + 5,
        end = name.length - 5;
      var n = name.slice(start, end);

      if (system && n != system) return

      plugin.push(new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, `../dist/${n}.html`),
        template: `./html/${n}.html`,
        title: '',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        chunks: ['vendor', 'manifest', n],
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }))
    });
  // console.log(plugin)
  return plugin;
}

function outputFilePath(key) {
  let r = `?r=${process.env.buildVersionNumber }`
  if (!system || system == 'index') {
    if (key == 'filename') {
      return utils.assetsPath('js/[name].[chunkhash].js' + r)
    } else if (key == 'chunkFilename') {
      return utils.assetsPath('js/[id].[chunkhash].js' + r)
    } else if (key == 'cssfilename') {
      return utils.assetsPath('css/[name].[contenthash].css' + r)
    }
  } else {
    if (key == 'filename') {
      return path.posix.join(`${system}/js/[name].[chunkhash].js` + r)
    } else if (key == 'chunkFilename') {
      return path.posix.join(`${system}/js/[id].[chunkhash].js` + r)
    } else if (key == 'cssfilename') {
      return path.posix.join(`${system}/css/[name].[contenthash].css` + r)
    }
  }
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    // filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    filename: outputFilePath('filename'),
    chunkFilename: outputFilePath('chunkFilename')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          pure_funcs: ['console.log']
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      // filename: utils.assetsPath('css/[name].[contenthash].css'),
      filename: outputFilePath('cssfilename'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap ? {
        safe: true,
        map: {
          inline: false
        }
      } : {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    ...(getHtmlWebpackPlugin()),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks(module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      },
      // {
      //   from: path.resolve(__dirname, '../boStatic'),
      //   to: config.dev.assetsSubDirectory,//将项目下的boStatic目录中的文件放入到dist/static目录中
      //   ignore: ['.*']
      // },
      {
        from: path.resolve(__dirname, '../boStatic'),
        to: 'boStatic', ////将项目下的bostatic目录中的文件放入到dist/boStatic目录中
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src'), //备份本地src文件
        to: ('../src_backups/src' + buildTime + (process.argv.includes('production') ? 'production' : 'development') + process.env.buildVersionNumber),
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
