'use strict'// 引入scp2
var client = require('scp2')
console.log(process.argv[2])
client.scp('./dist/', //默认打包的路径 
{ 
  // 'host': '192.168.0.162',
  // 'port': '22',
  // 'username': 'test', 
  // 'password': 'test',  
  // 'path': '/work/test/'
  'host': process.argv[2] == 'pro' ? '192.168.0.96' : '192.168.0.113',
  'port': '22',
  'username': 'itguest',
  'password': 'itguest',
  'path': ''
} , 
err => { 
if (!err) { 
        console.log('项目发布完毕!')
 } else { 
     console.log('err', err) 
    }
})