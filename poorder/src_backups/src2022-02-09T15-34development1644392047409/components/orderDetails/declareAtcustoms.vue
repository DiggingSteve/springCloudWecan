<template>
  <div class="elform" :class="{disabled:baoguanFinished}">
    <!-- {{ponoDisabledList}} -->
    <myAlert :servicecode="servicecode" v-if="!mark"></myAlert>
    <div v-if="!mark" style="text-align: right;transform: translate(-122px,-42px);height:0px">
      <el-button :type="baoguanFinished?'danger':'primary'" title="报关操作" style='pointer-events: all;'
        @click="openBgBtn">
        {{baoguanFinished?'取消完成':'报关完成'}}
      </el-button>
    </div>
    <slot v-if="!mark"></slot>
    <div v-if="mark">

      <el-form ref="form" :inline="true" style="display:flex;align-items:center;margin-bottom:10px;flex-wrap:wrap">



        <div style="width:100%">
          <el-form-item label="分运单号：" style="min-width:200px;margin-right:14px;" v-if="mawbinfo.orderdom=='总单'">
            <el-select v-model="dataform.hawb" clearable @change="hawbSel" :disabled="putIndex!=-1"
              class="input-required" placeholder="请选择或输入并选择">
              <el-option v-for="item in hawblistBg" :key="item.hawb" :label="item.hawb" :value="item.hawb">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="mawbinfo.orderdom=='总单'?'分单件数：':'实际件数'" style="min-width:150px">
            <span>{{dataform.piece}}</span>
          </el-form-item>
          <el-form-item :label="mawbinfo.orderdom=='总单'?'分单重量：':'实际重量：'" style="min-width:150px">
            <span>{{dataform.weight}}</span>
          </el-form-item>
        </div>



        <div v-for="(item,index) in hawbform" :class="{disabled:ponoDisabledList.includes(item.pono)}">
          <el-row style="width:100%">
            <el-form-item label="报关单号：" style="min-width:200px;margin-right:20px;" :key="index">
              <el-input v-model="item.pono" class="input-required" clearable maxlength="12"></el-input>

            </el-form-item>

            <!-- <el-form-item label="始发港：">
              <el-input v-model="item.sfg" class="input-required" style="width:100px" clearable v-verify="'sfgmdg'">
              </el-input>
            </el-form-item>
            <el-form-item label="目的港：">
              <el-input v-model="item.mdg" class="input-required" style="width:100px" clearable v-verify="'sfgmdg'">
              </el-input>
            </el-form-item> -->

            <el-form-item label="件：" style="width:100px">
              <el-input style="width:60px;" v-model.number="item.piece" class="input-required" v-verify="'integer'">
              </el-input>
            </el-form-item>
            <el-form-item label="重：" style="width:100px">
              <el-input style="width:60px;" v-model="item.weight" class="input-required" v-verify="'fixedTwo'">
              </el-input>
            </el-form-item>
            <el-form-item label="连单数：" style="width:130px">
              <el-input style="width:60px;" v-model.number="item.lds" v-verify="'integer'"></el-input>
            </el-form-item>

            <el-form-item label="报关类型：">
              <my-select :groupid="19" itemstyle="width:100px;min-width:120px;" v-model="item.bglx"
                class="input-required"></my-select>
            </el-form-item>

            <!-- note:配单操作 -->
            <!-- 出境关别 -->
            <el-form-item label="出境关别：" style="margin-left:4px" v-show="item.bglx==='通关一体化'">
              <page-select 
                :modelval.sync="item.cjgb" 
                :pagedata="exitType" 
                :viewdata="exitTypeTitle"
                class="input-required">
              </page-select>
            </el-form-item>  

            <el-form-item label="报关供应商：" style="margin-left:4px">
              <page-select :modelval.sync="item.bggys" :pagetype="3" @change="getGysname($event,index)"
                class="input-required"></page-select>
            </el-form-item>


            <el-form-item>
              <div style="flex:0 45px"><span><i @click="hawbformDel(index)"
                    style="width:18px;height:18px;font-size:18px;cursor:pointer;margin-top:5px;"
                    :style="{color:index!=0?'red':'#67C23A'}"
                    :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"></i></span> </div>
            </el-form-item>
          </el-row>
        </div>




        <div style="display:flex;justify-content:space-between;width:100%">
          <el-form-item>
            <el-button size="mini" @click="saveListInfo" >保存</el-button>
            <el-button size="mini" @click="resetForm('close')">取消</el-button>
          </el-form-item>

          <el-form-item>
            <baoguanNodeBtn :area="mawbinfo.area" :mawbguid="mawbguid" :node-list="jiediandata"
              :boguid="mawbinfo.boguid" :jsxm-data="jsxmData" :orderpgid="orderpgid" ref="bgnode" :childpgid="childpgid"
              @edit-node-success="edit_node_success" v-if="!mark"></baoguanNodeBtn>
          </el-form-item>
        </div>







      </el-form>



      <commonTable class="commonTable" :head="tableHead" :table-data="tableData" style="margin-top:8px;" 
        :zi-index="ziIndex" >
        <template slot="operate" slot-scope="props">
          <i class="el-icon-setting" @click="setListInfo(props.data.index)" :icondisabled="ponoDisabledList.includes(props.data.row.pono)"></i>
          <i class="el-icon-delete" @click="delListInfo(props.data.index)" :icondisabled="ponoDisabledList.includes(props.data.row.pono)"></i>
        </template>
        <template slot="jdinfo" slot-scope="props">
          <span style="color:#0066FF;cursor:pointer;pointer-events: all" @click="showJdinfo(props.data.index)">查看</span>
        </template>
        <template slot="status" slot-scope="props">
          {{ getStatusText(props.data.value) }}
        </template>
        <template slot="weight" slot-scope="props">{{Number(props.data.value).toFixed(2)}}</template>

        <template slot="ziTable">
          <commonTable :head="ziTableHead" :table-data="ziTableData" style="width:500px;margin-left:151px;">
          </commonTable>
        </template>


      </commonTable>
    </div>


    <el-dialog append-to-body :visible.sync="nodewageVisible" :close-on-click-modal="false" width="380px" top="10%"
      center>
      <el-form label-position="left" :inline="true" label-width="85px" class="smallform" style="padding-left:12px;">
        <el-form-item label="费用：" v-model="nodewageForm.wageall">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="币种：" v-model="nodewageForm.currency">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="操作人：" v-model="nodewageForm.addman">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="操作日期：">
          <el-date-picker v-model="nodewageForm.adddate" type="datetime" placeholder="选择日期时间">
          </el-date-picker>

        </el-form-item>
        <el-form-item>
          <el-button type="info" plain style="margin-left:85px;width:180px;">确认</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog title="报关完成" append-to-body :visible.sync="bgVisible" :close-on-click-modal="false" class="taskFinish"
      width="400px" top="7%" center>
      <el-row>
        <el-col :span="7" style="text-align: right;line-height: 28px;">
          操作人：
        </el-col>
        <el-col :span="12" :offset="3">
          <el-input v-model="czman"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" style="text-align: right;line-height: 28px;">
          完成时间：
        </el-col>
        <el-col :span="12" :offset="3">
          <el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" v-model="decldate"
            style="width: 175px;"></el-date-picker>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="text-align: center;">
          <el-button type="primary" @click="bgFinishFunc"><span style="padding: 0 20px;">确认</span></el-button>
        </el-col>
      </el-row>

    </el-dialog>

  </div>
</template>
<script>

  import { getChangeRate, formatDate } from '../../api/localStorage.js'
  import baoguanNodeBtn from '../templates/baoguanNodeBtn' //放行等按钮组
  import gysField from '../templates/gysField'
  export default {
    props: {
      mawbguid: [Number, String],
      jiediandata: {
        type: Array,
        default: () => []
      },
      hawblist: {
        type: Array,
        default: () => []
      }
      , mawbinfo: {
        type: Object,
        default: () => { }
      },
      serviceguid: [Number, String],
      orderpgid: [Number, String],
      childpgid: [Number, String],
      servicecode: String,
      mark: {
        type: String,
        default: () => ""
      },
      modifyIndex: {
        type: [Number, String],
        default: -1
      },
      ponoDisabledList:{
        type:Array,
        default:()=>[]
      }
    },
    components: {
      baoguanNodeBtn, gysField
    },

    data() {


      return {
        wtxmAll: [],//
        piform: { bglx: "", bggysname: "", bggys: "" },
        bgNodeStatus: [],
        currentPage: 1,
        pageSize: 10,
        disabled: false,
        putIndex: -1,
        ziIndex: -1,
        dataform: {
          hawb: '',
          piece: '',
          weight: '',
          sid: ''
        },
        hawbform: [ //第一个分单的件重体应该默认全部件重体
          {
            pono: '',
            hawb: "",
            sfg:'',
            mdg:'',
            piece: "",
            weight: "",
            lds: 0,
            bglx: "",
            cjgb: '',
            bggys: '',
            guid: -1,
            isdel: 1
          }
        ],
        tableHead: [
          { title: "操作", field: "operate" },
          { title: "节点信息", field: "jdinfo" },
          { title: "当前状态", field: "status" },
          { title: "分运单号", field: "hawb" },
          { title: "报关单号", field: "pono" },
          // { title: "始发港", field: "sfg" },
          // { title: "目的港", field: "mdg" },
          { title: "件数", field: "piece" },
          { title: "重量", field: "weight" },
          { title: "连单数", field: "lds" },
          { title: "报关类型", field: "bglx" },
          { title: '出境关别', field: 'cjgb'}, // 表格新增出境差别内容
          { title: "报关供应商", field: "bggysname" },
        ]
        , tableData: []
        , ziTableHead: [
          { title: "状态", field: "nodename" },
          { title: "操作人", field: "nodeman" },
          { title: "操作时间", field: "nodedate" }
        ]
        , ziTableData: [],
        nodewageVisible: false, //节点费用
        nodewageForm: {},
        hawblistBg: [],
        bgVisible: false,
        decldate: '',
        czman: '',
        exitType: [], // 出境关别枚举
        exitTypeTitle: [ // 出境关别下拉选项
          { title: "typename", field: 'ready01' }, //配置绑定label 和 value 字段名
          { title: "名称", field: 'ready01' }, //显示两列的名字与字段名
          { title: "代码", field: 'typename' }
        ]
      }
    }
    , methods: {
      openBgBtn() {
        this.czman = localStorage.usrname;
        this.decldate = formatDate(new Date(), 'yyyy-MM-dd hh:mm')
        if (this.baoguanFinished) {
          this.bgFinishFunc()
        } else {
          this.bgVisible = true
        }
      },
      bgFinishFunc() {
        let url = 'api/SetAllDeclFinish ';
        if (this.baoguanFinished) {
          url = 'api/SetAllDeclUnFinish '
        }
        let data = {
          boguid: this.mawbinfo.boguid,
          hpoguid: this.mawbinfo.guid,
          czman: this.czman,
          decldate: this.decldate
        }
        this.$axios({ method: 'put', url: this.$store.state.webApi + url, data: data, loading: true, tip: true })
          .then(result => {
            if (result.data.resultstatus == 0) {
              console.log(result.data)
              this.$message.success(result.data.resultmessage)
              this.edit_node_success();
              this.bgVisible = false
            } else {
              this.$message.error(result.data.resultmessage)
            }
          })
      },
      setpono() {//设置报关单
        let val = this.dataform && this.dataform.hawb || '';

        if (val) {
          let letterarr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
          this.tableData.forEach(n => {
            letterarr.splice(letterarr.indexOf(n.pono.substr(-1, 1)), 1)
          })
          this.hawbform.forEach((d, v) => {

            if (!d.pono) {
              // if(this.mawbinfo.orderdom!='直单'){
              //  d.pono=val.substr(-7,7)+letterarr[0]
              // }else{
              d.pono = this.dataform.hawb
              // }
            } else {
              letterarr.splice(letterarr.indexOf(d.pono.substr(-1, 1)), 1)
            }
          })
        } else {

        }
      },
      hawbSel(el) {
        //console.log(el)

        if (this.mawbinfo.orderdom != '直单') {


          if (el) {
            let data = JSON.parse(JSON.stringify(this.hawblistBg.filter(i => i.hawb == el)[0]))
            this.dataform.hawb = data.hawb
            this.dataform.piece = data.ybpiece
            this.dataform.weight = data.ybweight
            this.dataform.sid = data.guid
          } else {
            this.dataform.hawb = ''
            this.dataform.piece = 0
            this.dataform.weight = 0
            this.dataform.sid = ''
          }

        } else {
          this.dataform.hawb = this.mawbinfo.mawb
          this.dataform.piece = this.mawbinfo.ybpiece
          this.dataform.weight = this.mawbinfo.ybweight
          this.dataform.sid = -1
        }
        this.setpono()
      },
      getStatusText(status) {
        let text = ''
        for (let i in this.bgNodeStatus) {
          if (this.bgNodeStatus[i].nodeindex == status) {
            text = this.bgNodeStatus[i].nodename
            break
          }
        }
        return text
      },
      initHawbform() {
        var obj = {
          pono: '',
          hawb: '',
          piece: "",
          sfg: this.mawbinfo.sfg,
          mdg: this.mawbinfo.mdg,
          weight: "",
          lds: 0,
          bglx: '普通报关',
          cjgb: '',
          bggys: '',
          bggysname: '',
          guid: -1,
          isdel: 1
        }
        return obj
      },
      hawbformDel(index) { //删除表单分单


        if (index == 0) {

          let data = this.initHawbform();

          data.bglx = this.hawbform[this.hawbform.length - 1].bglx;
          data.bggys = this.hawbform[this.hawbform.length - 1].bggys;
          data.cjgb = this.hawbform[this.hawbform.length - 1].cjgb; // 回显出境关别内容

          let piece = this.dataform.piece - this.hawbform.reduce((prev, i) => prev += Number(i.piece), 0);
          let weight = this.dataform.weight - this.hawbform.reduce((prev, i) => prev += Number(i.weight), 0);

          let msg = (this.mawbinfo.orderdom != '直单' ? "分运单的件数" : "实际件数");
          let msg2 = (this.mawbinfo.orderdom != '直单' ? "分运单的重量" : "实际重量");

          // if(piece==0){
          //   return this.$message.error(`报关单件数之和已等于${msg},无需继续添加`);
          // }
          //  if(piece<0){
          //   return this.$message.error(`报关单件数之和已大于${msg},无法继续添加`);
          // }

          // if(weight==0){
          //   return this.$message.error(`报关单重量之和已等于${msg2},无需继续添加`);
          // }
          // if(weight<0){
          //   return this.$message.error(`报关单重量之和已大于${msg2},无法继续添加`);
          // }


          data.piece = piece > 0 ? piece : 0
          data.weight = weight > 0 ? weight : 0
          this.hawbform.push(data)
          //   this.hawbform.forEach(i=>{
          //      piece=piece-i.piece
          //      weight=weight-i.weight
          // })
          this.setpono()
        } else {

          let piece = this.dataform.piece;
          let weight = this.dataform.weight;


          for (var i = this.hawbform.length - 1; i--; i >= 0) {
            if (i >= 1) {
              piece = piece - this.hawbform[i].piece
              weight = weight - this.hawbform[i].weight
            }
          }



          this.hawbform.splice(index, 1);
          this.hawbform[this.hawbform.length - 1].piece = piece >= 0 ? piece : 0;
          this.hawbform[this.hawbform.length - 1].weight = weight >= 0 ? Number(weight).toFixed(2) : 0;

        }
        ////console.log(JSON.stringify(this.hawbform))



      },
      weightVerify(index) {
        // let totalWeight = this.hawbform.reduce((prev, i) => prev += Number(i.weight), 0)

        // if (totalWeight > this.hawbform[0].hawbweight) {
        //   let cur_weight = Math.floor( (totalWeight - this.hawbform[index].weight) * 100 ) / 100
        //   let num = Math.floor( (this.hawbform[0].hawbweight - cur_weight) * 100 ) / 100

        //   setTimeout(() => {
        //     this.hawbform[index].weight = num
        //   },)
        // }
      },
      showJdinfo(index) {
        if (this.ziIndex == index) {
          this.ziIndex = -1
        } else {
          this.ziIndex = index
          this.$axios({ method: 'get', url: this.$store.state.webApi + "api/ExAiraxpNode", params: { guid: this.tableData[index].guid, area: this.mawbinfo.area, system: '系统', boguid: this.mawbinfo.boguid }, loading: false, tip: false }).then(results => {
            //console.log("节点信息")
            //console.log(results.data)
            this.ziTableData = results.data.filter(i => {
              return i.nodedate.indexOf('1900') == -1
            })
          })

        }
      },
      getGysname(val, index) {
        this.hawbform[index].bggysname = val.usr_name;
      },

      getFormInfo() {

        let newArr = JSON.parse(JSON.stringify(this.hawbform))
        if (this.putIndex != -1) {
          this.tableData.forEach(item => {
            var delguid = item.guid
            var n = 0
            if (item.hawb == this.tableData[this.putIndex].hawb) {
              newArr.forEach((item2, index) => {
                if (item.guid == item2.guid) {
                  n = 1;
                  if (JSON.stringify(item) !== (JSON.stringify(item2))) {
                    item2.isdel = 3
                  } else {
                    newArr.splice(index, 1)
                  }
                }
                // 报关类型不是通关一体化 -> 出境关别为空
                if (item2.bglx !== '通关一体化') {
                  item2.cjgb = ''
                }
              })
              if (!n) {
                newArr.push({ guid: delguid, isdel: 2 })
              }

            }

          })
        }
        return newArr



      },
      getListInfo(callback) {

        this.resetForm()
        this.$axios({ method: "get", url: this.$store.state.webApi + "api/ExAxplineDecl", params: { sid: this.mawbguid, serviceguid: this.serviceguid, servicecode: this.servicecode }, loading: true, tip: false }).then(results => {
          //console.log("报关信息")
          //console.log(results.data)
          // 转换通关一体化字段类型，0 => '', 数字类型 => 字符串类型
          // results.data.forEach(item => Number(item.cjgb) === 0 ? '' :  String(item.cjgb));
          this.tableData = results.data.reverse();
          if(callback) {
            callback()
          } else {
            this.$emit('getJsxmData', results.data, this.servicecode == 'AA0610' || this.servicecode == 'AG0150' ? 4 : 10, this.servicecode)    
            this.resetForm('open')
          }
         
        })
      },
      async saveListInfo() {


        if (!this.dataform.hawb) {
          this.$message.error("请先选择分运单号"); return;
        }

        if (this.hawbform.filter(i => !i.pono || !i.piece || !i.weight || !i.bglx || !i.bggys || i.piece == 0 || Number(i.weight) == 0 
        || (i.bglx === '通关一体化' && !i.cjgb)).length > 0) {
          this.$message.error("请检查信息是否完整和件重是否为0"); return;
        }


        let flag = 0;
        let msg = (this.mawbinfo.orderdom != '直单' ? "分运单的件数" : "实际件数")
        this.hawbform.forEach(i => {
          if (this.hawbform.filter(e => e.pono == i.pono).length > 1 || this.tableData.filter(e => e.pono == i.pono).length > (this.putIndex != -1 ? 1 : 0)) {
            flag++
          }
        })
        if (flag > 0) {
          return this.$message.error('报关单号重复！');
        }


        let piece = this.dataform.piece - (this.hawbform.reduce((prev, i) => prev += Number(i.piece), 0) + (this.putIndex == -1 ? this.tableData.filter(i => i.hawb == this.dataform.hawb).reduce((prev, i) => prev += Number(i.piece), 0) : ''));

        //  if(piece<0){
        //       return this.$message.error(`相同运单下的报关单件数之和不能大于${msg}`);
        //   }
        //  if(piece!==0){
        //         return this.$message.error(`相同运单下的报关单件数之和必须等于${msg}`);
        //     }


        let confirm = true;
        if (piece > 0) {
          return this.$message.error(`相同运单下的报关单件数之和不能小于${msg}`);
        }

        if (piece < 0) {
          confirm = await this.$confirm(`相同运单下的报关单件数之和已大于${msg},是否继续？`, '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(() => { })
        }


        if (!confirm) return

        /*         var piececa=this.dataform.piece
        
               this.hawbform.forEach(i=>{
                  piececa= piececa-i.piece
               })
               if(piececa!=0){
                 this.$message.error("报关的件数与"+(this.mawbinfo.orderdom!='直单'?"分运单的件数":"实际件数")+"不相等");return;
               } */
        var jsonArr = {}
        jsonArr.hawb = this.dataform.hawb
        jsonArr.hpoid = this.mawbguid
        jsonArr.sid = this.dataform.sid
        jsonArr.declList = this.getFormInfo()
        jsonArr.pono = this.mawbinfo.pono

        //  if(this.checkRequier!=''){
        //    this.$message.error("请填写"+this.checkRequier);return;
        //  }


        this.ajaxFunc(jsonArr);



      },
      piliangFunc() {
        if (!this.piform.bglx && !this.piform.bggys) {
          this.$message.error("请选择报关类型或报关供应商"); return;
        }


        var jsonArr = { declList: [], sid: -1, hpoid: this.mawbguid }
        this.tableData.forEach(i => {
          if (i.checked) {
            let json = { isdel: 3 }
            if (this.piform.bglx) {
              json.bglx = this.piform.bglx
            }
            if (this.piform.bggys) {
              json.bggys = this.piform.bggys
            }
            jsonArr.declList.push(Object.assign({}, i, json))
          }
        })
        if (jsonArr.declList.length == 0) {
          this.$message.error('请先选择'); return;
        }
        this.ajaxFunc(jsonArr)
      },
      ajaxFunc(jsonArr) {
        jsonArr.serviceguid = this.serviceguid
        jsonArr.orderdom = this.mawbinfo.orderdom
        jsonArr.servicecode = this.servicecode
        //console.log(JSON.stringify(jsonArr));
        this.$axios({ method: 'post', url: this.$store.state.webApi + 'api/ExAxplineDecl', data: jsonArr, loading: true, tip: false }).then(results => {
          //console.log(results.data)
          if (results.data.resultstatus == 0) {
            // json.guid=results.data.resultguid
            //   this.tableData.push(json)
            //   this.initFunc()
            // this.disabled=true;
            layer.msg("成功");
            this.putIndex = -1
            this.getListInfo()
            this.piform.bglx = ""
            this.piform.bggys = ""
            if (this.mark) {
              this.$emit('searchDeclare')
              this.$emit('update:dialogVisible', false)
            }
          } else {
            this.$message.error(results.data.resultmessage)
          }
        })

      },
      setListInfo(index) {

        this.getListInfo(
          () => {
            this.putIndex = index
            this.$nextTick(() => {
              let n = -1;
              this.tableData.forEach((i, k) => {
                if (i.hawb == this.tableData[index].hawb) {
                  n += 1
                  this.$set(this.hawbform, n, JSON.parse(JSON.stringify(this.tableData[k])))
                }
              })

              this.hawbSel(this.tableData[index].hawb)
            })

          }
        )
       
        

        //  this.disabled=false;

      },
      delListInfo(index) {
        let json = { orderdom: this.mawbinfo.orderdom, declguid: this.tableData[index].guid, czman: localStorage.usrname }
        let ex = ''
        if (this.getStatusText(this.tableData[index].status) == '可交付') {
          return this.$message.error('当前状态为可交付,不可删除!');
        }
        if (this.mawbinfo.orderdom == '直单') {
          // json={guid:this.mawbinfo.guid};
          ex = '此操作将删除所有报关单,是否继续?'
        } else {
          //  json={guid:this.hawblist.filter(i=>this.tableData[index].hawb)[0].guid};
          ex = "此操作将删除与分运单号" + this.tableData[index].hawb + "相关的报关单, 是否继续?"
        }

        this.$confirm(ex, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$axios({ method: 'put', url: this.$store.state.webApi + 'api/DeleteDeclListByGuid', data: json, loading: true, tip: false }).then(results => {
            //console.log(results.data)
            if (results.data.resultstatus == 0) {
              layer.msg("成功");
              this.putIndex = -1
              this.getListInfo()
            } else {
              this.$message.error(results.data.resultmessage)
            }
          })
        })


      },
      resetForm(open) {
        this.putIndex = -1
        this.hawbform = [this.initHawbform()]
        this.hawbSel()

        if (open == 'close' && this.mark) {
          this.$emit("update:dialogVisible", false)
        }
      }
      , edit_node_success() {
        //成功的回调
        this.getListInfo()
        this.$emit('edit-node-success', true)

      },

      
    }
    , computed: {
      checkRequier() { //检查是否必填，除备注外全部必填
        var require = "";
        this.hawbform.forEach(item => {
          if (item.bggys == -1 || !item.bggys) {
            require = '报关供应商';
          }
          Object.keys(item).reverse().forEach(i => {
            if (!item[i]) {
              this.tableHead.forEach(item2 => {
                if (i == item2.field && item2.field != 'bggysname' && item2.field != 'lds') {
                  require = item2.title;
                }
              })

            }

          })
        })

        return require
      }

      , jsxmData() {
        var wtxmname = this.mawbinfo.wtxmname
        var gid = this.mawbinfo.gid
        var sid = this.mawbinfo.guid
        var arr = []
        this.tableData.forEach(i => {
          if (i.checked) {
            arr.push({
              otherguid: i.sid,
              sid: sid,
              guid: i.guid,
              gid: gid,
              wtxmname: wtxmname,
              bggys: i.bggys,
              bggysname: i.bggysname,
              status: i.status,
              boguid: this.mawbinfo.boguid,
              orderpgid: this.orderpgid,
              childpgid: this.childpgid

            })
          }


        })
        return arr
      },
      baoguanFinished() {
        //报关服务是否完成
        return !!(
          this.mawbinfo.serviceList &&
          this.mawbinfo.serviceList.find(
            i => i.servicecode == "AA0610" && i.status == 500
          )
        );
      }

    },
    created() {
      this.$watch(
        () => {
          return this.hawblist
        }, (val) => {
          if (this.mawbinfo.orderdom == '直单') {
            this.hawblistBg = [
              {
                hawb: this.mawbinfo.mawb,
                sid: -1,
                ybpiece: this.mawbinfo.ybpiece,
                ybweight: this.mawbinfo.ybweight
              }
            ]

          } else {
            this.hawblistBg = this.hawblist
          }
        }, { immediate: true, deep: true }
      )
      this.getListInfo()
      this.bgNodeStatus = JSON.parse(localStorage.statusData).filter(item => {
        return item.dom == '报关状态' && item.system == '空出'
      })

      this.exitType = JSON.parse(localStorage.groupType).filter(i => i.groupid == 1485)
    },
    watch: {

    }

  }
</script>
<style lang="less" scoped>
  .mulSelPane-title {
    font-size: 14px;
    color: #333;
    position: absolute;
    top: 0px;
    background: #fff;
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    z-index: 10;
    padding: 0px 20px
  }

  .elform {

    /deep/ .el-form-item__label {
      padding-right: 5px;
      color: #333;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }

  .smallform {
    /deep/ .el-input__inner {
      width: 180px;
    }

    /deep/ .el-form-item {
      margin-bottom: 0px;
    }
  }

  .taskFinish {
    .el-row {
      margin-bottom: 14px;

      .el-col:first-child {
        text-align: right;
        line-height: 28px;
      }

      /deep/ .el-input__inner {
        font-size: 12px;
      }
    }

    .wage-row {
      margin-bottom: 20px;

      .el-col:first-child {
        .el-select {
          width: 80px;
          height: 28px;
        }
      }
    }
  }
</style>