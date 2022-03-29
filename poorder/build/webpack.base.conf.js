'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const glob = require('glob')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

let system = process.argv[2]
//if (!system) system = 'index'
// console.log(__dirname)

function getEntry() {
  var entry = {}
  glob.sync('./src/*.js')
    .forEach(function (name) {
      var start = name.indexOf('src/') + 4,
        end = name.length - 3;
      var eArr = [];
      var n = name.slice(start, end);
      if (process.env.NODE_ENV === 'production') {
        if (system && n != system) return
      }

      eArr.push(name);
      entry[n] = eArr;
    });
  if (entry.index) entry.index.unshift('babel-polyfill')
  // console.log(entry)
  return entry;
}



let obj = {
  context: path.resolve(__dirname, '../'),
  entry: getEntry(),
  // {
  //   app: './src/main.js'
  // },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      // {
      //   test: /\.vue$/,
      //   loader: 'file-loader',
      //   exclude: [
      //     resolve('src/App.vue'),
      //     resolve('src/index.vue'),
      //     resolve('src/login.vue'),
      //     resolve('src/components'),
      //   ],
      //   options: {
      //     emitFile: false,
      //   }
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        // include: [
        //   resolve('src/App.vue'),
        //   resolve('src/index.vue'),
        //   resolve('src/login.vue'),
        //   resolve('src/components'),
        // ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          //   name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          name: utils.assetsPath('fonts/[name].[ext]') //为防止更新版本后，CargoPouch字体丢失
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

//console.log(config.build.buildSystem)
if (config.build.buildSystem == 'hengfeng') {
  // console.log(system)
  obj.module.rules.push({
    test: /\.(vue|js)$/, //打包时替换字符串
    loader: 'webpack-replace-loader',
    options: {
      arr: [{
        search: '唯凯',
        replace: '恒丰',
        attr: 'g'
      }]
    }
  })
}

module.exports = obj
