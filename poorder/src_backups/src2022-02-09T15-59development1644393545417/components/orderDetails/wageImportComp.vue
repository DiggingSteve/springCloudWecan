<template>
  <el-upload
    :disabled="disabled"
    style="display: inline-block;"
    action=""
    :show-file-list="false"
    :http-request="selectFile">
    <el-button type="primary" :disabled="disabled">导入模板</el-button>
  </el-upload>
</template>

<script>
import { getCharCol, formatDate } from '../../api/localStorage.js'

/**
 * 将合并的单元格拆分
 * refer: https://www.jianshu.com/p/5c131c27841c
 * @param {Object} Sheets - 通过XLSX解析后的数据
 * @returns {Object} 将合并的单元格拆分后的数据
 */
function resolveMerged(Sheets) {
  let newSheets = JSON.parse(JSON.stringify(Sheets))
  if (!newSheets['!merges']) return newSheets

  let merges = newSheets['!merges']
  delete newSheets['!merges']

  for (let merge of merges) {
    let mergedKey = []

    for (let i=0; i <= (merge.e.c-merge.s.c); i++) {
      for (let j=0; j <= (merge.e.r-merge.s.r); j++) {
        mergedKey.push( getCharCol(merge.s.c+i) + (merge.s.r+j+1) )
      }
    }

    mergedKey.forEach(key => {
      newSheets[key] = newSheets[mergedKey[0]]
    })
  }
  return newSheets
}

/**
 * 生成Excel首行数据
 * 当Excel首行的单元格为空时XLSX解析Excel为JSON会丢失数据，手动填充首行数据可解决
 * refer: https://github.com/SheetJS/js-xlsx#common-spreadsheet-format
 * @param {Object} Sheets - 通过XLSX解析后的数据
 */
function generateFirstRow(Sheets) {
  // 开始和结束列
  let ref = Sheets['!ref'].match(/([A-Z])+/g)
  let colStart = Sheets['!ref'].split(':')[0].match(/([0-9])+/g)

  let colIndex = 0
  let colKey = getCharCol(colIndex)

  while(colKey != ref[1]) {
    Sheets[colKey + colStart] = {
      t: 's',
      v: colKey
    }

    colKey = getCharCol(++colIndex)
  }

  Sheets[colKey + '1'] = {
    t: 's',
    v: colKey
  }
}

function file2Xce(f) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader()
    var wb //读取完成的数据　
    var rABS = false

    reader.onload = function (e) {
      var data = e.target.result
      if (rABS) {
        wb = XLSX.read(btoa(fixdata(data)), { //手动转化
          type: 'base64'
        })
      } else {
        wb = XLSX.read(data, {
          type: 'binary'
        })
      }

      resolve(wb)
    }

    if (rABS) {
      reader.readAsArrayBuffer(f)
    } else {
      reader.readAsBinaryString(f)
    }
  })
}

function fixdata(data) { //文件流转BinaryString
  var o = "",
    l = 0,
    w = 10240;
  for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}

export default {
  props: {
    importData: {
      required: true,
      type: Object
    },
    disabled: Boolean
  },
  data () {
    return {
      importTemplate: {
        A: 'servicename',
        B: 'items',
        C: 'price',
        D: 'minimal',
        E: 'wagetype',
        F: 'sfg',
        G: 'mdg',
        H: 'mawbthreecode',
        I: 'hbh',
        J: 'hwxz',
        K: 'weightbegin',
        L: 'volumebegin',
        M: 'bglx',
        N: 'materialpm',
        O: 'materialstd',
        P: 'clothtype',
        Q: 'clothstd',
        R: 'packagetype',
        S: 'currency'
      },
      requiredField: [
        'items',
        'currency',
        'wagetype',
        'price'
      ]
    }
  },
  methods: {
    selectFile ({ file }) {
      if (!file) return

      let fileX = file.name.split(".").reverse()[0]
      let fileXyes = false
      ;["xlsx", "xlc", "xlm", "xlsm", "xls", "xlt", "xlw"].forEach(function (value) {
        if (fileX === value) {
          fileXyes = true
        }
      })
      if (!fileXyes) {
        return this.$message.error('格式错误！请重新选择')
      }

      setTimeout(() => {
        this.analyzeFile(file)
      }, 100)
    },
    analyzeFile (file) {
      file2Xce(file)
      .then(({ SheetNames, Sheets }) => {
        // this.SheetNames = SheetNames
        // this.selectedSheet = SheetNames[0]
        // this.Sheets = Sheets
        
        let newSheets = resolveMerged(Sheets[SheetNames[0]])
        generateFirstRow(newSheets)

        let json = XLSX.utils.sheet_to_json(newSheets)

        this.resolveWage(json, newSheets)
      })
    },
    resolveWage (jsonData, raw) {
      console.log(jsonData)
      let colKeys = Object.keys(this.importTemplate)
      let wageDataAll = []
      let failedData = []
      let wageStartIndex = 2  // 费用数据从excel的第三行开始

      outter:
      for (let jsonIndex in jsonData) {
        let item = jsonData[jsonIndex]
        let itemResolveData = {}
        // console.log(item)
        
        for (let col of colKeys) {
          let field = this.importTemplate[col]
          let value = item[col]

          if (value === '服务名称' || value === '费用名称') {
            continue outter
          }

          // 必填字段无值时做失败处理
          if (this.requiredField.includes(field) && !value) {
            failedData.push(Number(jsonIndex) + wageStartIndex)
            continue outter
          }

          if (field === 'items') {
            let sid = this.getItemsSid(value)
            if (!sid) {
              // 如果费用名称不合法，直接做失败处理
              failedData.push(Number(jsonIndex) + wageStartIndex)
              continue outter
            } else {
              itemResolveData['sid'] = sid
            }
          }

          if (field === 'weightbegin' && value) {
            let valueArr = value.split('-')
            itemResolveData['weightbegin'] = valueArr[0].trim()
            itemResolveData['weightend'] = valueArr[1].trim()
          } else if (field === 'volumebegin' && value) {
            let valueArr = value.split('-')
            itemResolveData['volumebegin'] = valueArr[0].trim()
            itemResolveData['volumeend'] = valueArr[1].trim()
          } else {
            itemResolveData[field] = value
          }
        }
        
        this.setCompleteValue(itemResolveData)
        // console.log('itemResolveData', itemResolveData)
        wageDataAll.push(itemResolveData)
      }
      console.log('failedData', failedData)

      this.importPost(wageDataAll)
    },
    importPost (wageData) {

      let data = {
        wagelist: wageData
      }
      // let data = wageData[0]
      console.log(data)
      // return
      this.$axios({ method: 'post', url: this.$store.state.BasicWebApi + 'api/BatchInsertSystemWage', data, loading: true, tip: true, noarea: true})
      .then(({ data }) => {
        console.log(data)
        // this.$emit('newWage')
        // this.cancel()
        // 弹窗提示新增失败数量并重新获取数据








      })
    },
    /**
     * 获取费用对应的sid
     */
    getItemsSid (itemsname) {
      if (!this.fwxm) this.fwxm = JSON.parse(localStorage.fwxm)

      for (let item of this.fwxm) {
        if (item.s_name === itemsname) {
          return item.id
        }
      }
      return null
    },
    setCompleteValue (data) {
      data.area = this.importData.area
      data.system = this.importData.system
      if (this.importData.wagestd === '客户标准') {
        data.fid = this.importData.fid
      } else {
        data.fid = ''
      }

      data.pricetype = '1' // 价格类型默认单价
      data.begindate = formatDate(new Date(), 'yyyy-MM-dd')

      data.istodoor = ''
      data.inspection = ''
      data.cancelorder = ''

      data.wageinout = 1
      data.itemstatus = 1
      data.czman = localStorage.usrname
    }
  }
}
</script>

<style lang="less" scoped>

</style>
