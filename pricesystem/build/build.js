'use strict'
require('./check-versions')()
//const axios = require('axios')
const os = require('os')
var ifaces = os.networkInterfaces()
var ip = '',
  result = []
for (var dev in ifaces) {
  ifaces[dev].forEach(function (details) {
    if (ip === '' && details.family === 'IPv4' && !details.internal) {
      ip = details.address
      return;
    }
  })
}
//console.log(os.networkInterfaces()); return;
// console.log(ip); return;
// console.log(process.argv); 
// console.log(process.argv[0]); 
// console.log(process.argv[1]); 
// console.log(process.argv[2]); 
// console.log(process.argv[3]); return
const config2 = require('../config/prod.env')



process.env.NODE_ENV = 'production'
//process.env.buildSystem = 'hengfeng'
process.env.buildVersionNumber = config2.buildVersionNumber

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')

const fs = require('fs')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const spinner = ora('building for production...')
//1.删除旧是目录
function deleteFolder(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path) //同步版的 fs.exists，检测给定的路径是否存在。
    files.forEach(file => {
      let curPath = path + '/' + file
      let stat = fs.statSync(curPath) //同步 stat(). 返回 fs.Stats 的实例。文件信息
      if (stat.isDirectory()) { //是否是目录
        //递归删除目录
        deleteFolder(curPath)
      } else {
        fs.unlinkSync(curPath) //删除文件，同步
      }
    })
    fs.rmdirSync(path) //删除根目录
  }
}

//删除临时文件
function deleteTemp(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(file => {
      let curPath = path + '/' + file
      let stat = fs.statSync(curPath)
      if (stat.isFile() && /.+\.(zip|log)$/.test(file)) {
        fs.unlinkSync(curPath)
      }
    })
  }
}

spinner.start()
//console.log(process.argv[2],12122)
//删除之前的旧目录和文件
// deleteFolder(path.join(__dirname, '..', 'dist'))
// deleteTemp(path.join(__dirname, '..'))
// deleteTemp(path.join(__dirname, '../deploy'))
if (process.argv[2] == 'wffmanagement') { //wffmanagement 编译时删除原编译的目录
  deleteFolder(path.join(__dirname, '..', 'dist/wffmanagement'))
}
if (process.argv[2] == 'priceSystem') { //priceSystem 编译时删除原编译的目录
  deleteFolder(path.join(__dirname, '..', 'dist/priceSystem'))
}

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // console.log(chalk.cyan('  Build complete.\n'))
    // console.log(chalk.yellow(
    //   '  Tip: built files are meant to be served over an HTTP server.\n' +
    //   '  Opening index.html over file:// won\'t work.\n'
    // ))


    console.log((process.argv[2] == 'index' ? 'bo' : process.argv[2]=='priceSystem'?'priceSystem':'wffmanagement') + ",版本号为" + config2.buildVersionNumber)


  })
})
