<template>
  <div
    class="index"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中..."
    style="display:inline"
  >
    <input
      type="file"
      @change="importFile(this)"
      id="imFile"
      style="display: none"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    />
    <a id="downlink"></a>
    <!-- {{chineseWhere}} -->
    <!-- {{headData}} -->
    <!-- <el-button class="button" @click="uploadFile()">导入</el-button> -->
    <el-button @click="downloadFile()" v-if="pagetype==1">导出Excel</el-button>
    <i
      @click="downloadFile()"
      v-if="pagetype==2"
      class="el-icon-download"
      title="导出excel"
      style="cursor:pointer"
    ></i>
    <!-- <span class="buttonExc" @click="downloadFile(excelData)"></span> -->
    <!--错误信息提示-->
    <el-dialog title="提示" v-model="errorDialog">
      <span>{{errorMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorDialog=false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入xlsx
//var XLSX = require('xlsx')
export default {
  name: "Index",
  props: {
    tableData: {
      //表格数据
      type: Array,
      default: []
    },
    title: {
      //表格组件名
      type: String,
      default: "表格数据"
    },
    headData: {
      //中文表头数据
      type: Array,
      default() {
        return [];
      }
    },
    chineseWhere: {
      //中文表头数据
      type: Array,
      default() {
        return [];
      }
    },
    pagetype: {
      type: [String, Number], //1全部导出 2单条一级报关数据导出 3 单条费用导出
      default: 1
    },
    outindex: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      fullscreenLoading: false, // 加载中
      imFile: "", // 导入文件el
      outFile: "", // 导出文件el
      errorDialog: false, // 错误信息弹窗
      errorMsg: "", // 错误信息内容
      excelData: []
    };
  },
  mounted() {
    this.imFile = document.getElementById("imFile");
    this.outFile = document.getElementById("downlink");
  },
  created() {
    this.$watch(
      function() {
        return this.tableData + this.headData;
      },
      function() {
        // console.log(this.tableData)
        let headArr = [];
        let fieldsArr = [];
        if (this.headData.length == 2) {
          headArr = this.headData[0].concat(this.headData[1]);
          fieldsArr = headArr.map(i => i.field);
        }
        /*   console.log(6666)
         console.log(this.pagetype)
         console.log(this.headData) */
        //  console.log(headArr)
        //  console.log(fieldsArr)
        let tableData = JSON.parse(JSON.stringify(this.tableData)).map(i => {
          Object.keys(i).forEach(e => {
            if (String(i[e]) == "null" || String(i[e]) == "undefined") {
              i[e] = "";
            }
          });
          if (fieldsArr.includes("confirmstatus_wagein")) {
            //应付费用确认状态
            // i.confirmstatus_wagein=(i.confirmstatus_in==1?'未确认':'已确认') +' | '+i.wageall_in
            i.confirmstatus_wagein =
              i.confirmstatus_in == 1 ? "未确认" : "已确认";
          }
          if (fieldsArr.includes("confirmstatus_wageout")) {
            //应收费用确认状态
            //  i.confirmstatus_wageout=(i.confirmstatus_out==1?'未确认':'已确认')+' | '+i.wageall_out
            i.confirmstatus_wageout =
              i.confirmstatus_out == 1 ? "未确认" : "已确认";
          }
          if (fieldsArr.includes("status")&&this.title=="mawbManageNew.vue") {
            //应收费用确认状态
            //  i.confirmstatus_wageout=(i.confirmstatus_out==1?'未确认':'已确认')+' | '+i.wageall_out
              if(i.status=='1'){
                  i.status='可用'
                }else if(i.status=='2'){
                i.status='已领用'
                }else if(i.status=='5'){
                i.status= '作废'
                }else if(i.status=='8'){
                i.status= '外借'
                }else if(i.status=='10'){
                  i.status= '删除'
                }
          }

          if (fieldsArr.includes("bookingstatus")) {
            i.bookingstatus =
              i.bookingstatus == 1 ? "未预定" : "已预定";
          }

          return i;
        });
        //按模板顺序排序
        var arr = [];
        if (this.pagetype == 2 && this.outindex != -1) {
          tableData = tableData.splice(this.outindex, 1); //单条导出
        }
        tableData.forEach(e => {
          let obj = {};

          headArr.forEach(i => {
            if (i.title) {
              obj[i.field] = e[i.field];
            }
          });
          arr.push(obj);
          //   console.log(headArr)
        });
        // console.log(arr)
        this.excelData = arr;
      },
      { immediate: true }
    );
  },
  watch: {},
  methods: {
    uploadFile: function() {
      // 点击导入按钮
      this.imFile.click();
    },
    downloadFile: function(rs) {
      // 点击导出按钮
      var rs = this.excelData;
      let titleMap = this.headData[0].concat(this.headData[1]);
      var getName = function(params) {
        var name = "";
        titleMap.forEach(i => {
          if (i.field == params) {
            name = i.title;
          }
        });
        return name ? name : params;
      };
      let data = [{}];
      for (let k in rs[0]) {
        // console.log(k)
        // if(k!='wageprofit'){
        data[0][k] = getName(k);
        // }
      }
      data = data.concat(rs);
      let title = "";
      if(sessionStorage.nav){
         JSON.parse(sessionStorage.nav).forEach(i => {
            if (i.auturl == this.title) {
              title = i.autname;
            }
          });
      }

      switch (this.title) {
        case "reconMngFir.vue":
          title = "应收未对账";
          break;
        case "reconMngSec.vue":
          title = "应收对账中";
          break;
        /* case 'credentialMngFir.vue':
        title='应收未开票'
        break;
      case  'reconMngThd.vue':
        title='可开凭证'
        break;
     case 'credentialMngSec.vue':
        title='已开凭证'
     break; */
        default:
          break;
      }
      // console.log(data)
      this.downloadExl(data, title || "导出Excel数据");
    },
    importFile: function() {
      // 导入excel
      this.fullscreenLoading = true;
      let obj = this.imFile;
      if (!obj.files) {
        this.fullscreenLoading = false;
        return;
      }
      var f = obj.files[0];
      var reader = new FileReader();
      let $t = this;
      reader.onload = function(e) {
        var data = e.target.result;
        if ($t.rABS) {
          $t.wb = XLSX.read(btoa(this.fixdata(data)), {
            // 手动转化
            type: "base64"
          });
        } else {
          $t.wb = XLSX.read(data, {
            type: "binary"
          });
        }
        let json = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]]);
        //console.log(typeof json)
        $t.dealFile($t.analyzeData(json)); // analyzeData: 解析导入数据
      };
      if (this.rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    downloadExl: function(json, downName, type) {
      // 导出到excel
      let keyMap = []; // 获取键

      for (let k in json[0]) {
        keyMap.push(k);
      }

      //console.info('keyMap', keyMap, json)
      let tmpdata = []; // 用来保存转换好的json
      var margearr = [
        {
          s: {
            //s为开始
            c: 0, //开始列
            r: 0 //可以看成开始行,实际是取值范围
          },
          e: {
            //e结束
            c: 24, //结束列
            r: 0 //结束行
          }
        }
      ];

      tmpdata["A1"] = {
        v: this.pagetype == 3 ? "" : "查询条件:",
        s: {
          font: {
            name: "宋体",
            sz: 14,
            color: { rgb: "#F56C6C" },
            bold: true
          }
          //, fill: { bgColor: "FFFF00" }
        }
      };

      this.chineseWhere.forEach((i, index) => {
        let k = index + 2;
        tmpdata["A" + k] = {
          v: i.title,
          s: {
            font: {
              name: "宋体",
              sz: 11,
              color: { rgb: "#F56C6C" },
              bold: true
            }
          }
        };
        tmpdata["B" + k] = { v: i.value };
        margearr.push({
          s: {
            //s为开始
            c: 1, //开始列
            r: index + 1
          },
          e: {
            //e结束
            c: 24, //结束列
            r: index + 1
          }
        });
      });

      if (this.pagetype != 3) {
        margearr.push({
          s: {
            //s为开始
            c: 0, //开始列
            r: this.chineseWhere.length + 4 //可以看成开始行,实际是取值范围
          },
          e: {
            //e结束
            c: 24, //结束列
            r: this.chineseWhere.length + 4 //结束行
          }
        });
      }
      //console.log(margearr)
      tmpdata["!merges"] = margearr;
      /* alert(this.pagetype)
alert((this.chineseWhere.length+(this.pagetype==3?1:5))) */

      tmpdata[
        "A" + (this.chineseWhere.length + (this.pagetype == 3 ? 1 : 5))
      ] = {
        v: "查询结果:共" + (json.length - (this.pagetype == 3 ? 2 : 1)) + "条",
        s: {
          font: {
            name: "宋体",
            sz: 14,
            color: { rgb: "#F56C6C" },
            bold: true
          }
        }
      };

      json
        .map((v, i) =>
          keyMap.map((k, j) =>
            Object.assign(
              {},
              {
                v: v[k],
                style:
                  i != 0
                    ? {}
                    : {
                        font: {
                          name: "宋体",
                          sz: 11,
                          color: { rgb: "#F56C6C" },
                          bold: true
                        }
                      },
                position:
                  (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) +
                  (i +
                    (this.chineseWhere.length + (this.pagetype == 3 ? 2 : 6)))
              }
            )
          )
        )
        .reduce((prev, next) => prev.concat(next))
        .forEach(function(v, index) {
          tmpdata[v.position] = {
            v: v.v || "",
            s: v.style
          };
        });

      let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10
      //  console.log(tmpdata)
      // console.log(outputPos)
      let tmpWB = {
        SheetNames: ["mySheet"], // 保存的表标题
        Sheets: {
          mySheet: Object.assign(
            {},
            tmpdata, // 内容
            {
              "!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1] // 设置填充区域
            }
          )
        }
      };
      //console.log(tmpWB.Sheets)
      let tmpDown = new Blob(
        [
          this.s2ab(
            XLSX.write(
              tmpWB,
              {
                bookType: type === undefined ? "xlsx" : type,
                bookSST: false,
                type: "binary",
                cellStyles: true
              } // 这里的数据是用来定义导出的格式类型
            )
          )
        ],
        {
          type: ""
        }
      ); // 创建二进制对象写入转换好的字节流
      var href = URL.createObjectURL(tmpDown); // 创建对象超链接
      this.outFile.download = downName + ".xlsx"; // 下载名称
      this.outFile.href = href; // 绑定a标签
      this.outFile.click(); // 模拟点击实现下载
      setTimeout(function() {
        // 延时释放
        URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
      }, 100);
    },
    analyzeData: function(data) {
      // 此处可以解析导入数据
      return data;
    },
    dealFile: function(data) {
      // 处理导入的数据
      console.log(data);
      this.imFile.value = "";
      this.fullscreenLoading = false;
      if (data.length <= 0) {
        this.errorDialog = true;
        this.errorMsg = "请导入正确信息";
      } else {
        this.excelData = data;
      }
    },
    s2ab: function(s) {
      // 字符串转字符流
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    },
    getCharCol: function(n) {
      // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
      let s = "";
      let m = 0;
      while (n > 0) {
        m = (n % 26) + 1;
        s = String.fromCharCode(m + 64) + s;
        n = (n - m) / 26;
      }
      return s;
    },
    fixdata: function(data) {
      // 文件流转BinaryString
      var o = "";
      var l = 0;
      var w = 10240;
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttonExc {
  display: inline-flex;
  width: 24px;
  height: 24px;
  text-align: center;
  background: url("../../../boStatic/images/Excel.png") no-repeat center;
  background-size: 16px 16px;
  cursor: pointer;
}
</style>
