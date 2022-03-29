<template>
  <div>
    <div class="page-container-box">
      <!-- {{nodeViewData}} -->
      <newFormCmpt :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pagetype="1" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere"
        :formFieldConfig="false">
      </newFormCmpt>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="nodeModelData={};dialogShow=true">新增</el-button>
      </div>
    </div>

    <tableCompt name="nodeController.vue" :table-data-res="tableDataRes" :nestedTableType="2"
      v-on:transmitMsg="getZimessage" :ziTableData="ziTableData" :chinese-where="chineseWhere" showZiConfig
      :showTotal="showTotal">
      <template slot="operate" slot-scope="props">
        <i class="el-icon-setting" title="修改" @click="openDialog(props.data.index)"></i>
        <i class="el-icon-delete" title="删除" @click="nodeFunc(props.data.index)"></i>
      </template>
      <template slot="fun" slot-scope="props">
        {{getVal(1339,props.data.value)}}
      </template>
      <template slot="startdate" slot-scope="props">
        {{getVal(1361,props.data.value)}}
      </template>
      <template slot="ctrlname" slot-scope="props">
        <!-- {{getArea(props.data.row.area)}}-{{getSystem(props.data.row.system)}}-{{props.data.value}} -->
        {{getSystem(props.data.row.system)}}-{{props.data.value}}
      </template>
      <template slot="area" slot-scope="props">
        {{getArea(props.data.value)}}
      </template>
      <template slot="system" slot-scope="props">
        {{getSystem(props.data.value)}}
      </template>
      <template slot="logname" slot-scope="props">
        {{getVal(1360,props.data.value)}}
      </template>
      <template slot="approverstatus" slot-scope="props">
        {{props.data.value==1?'有效':'无效'}}
      </template>
    </tableCompt>

    <el-dialog title="节点操作" v-if="dialogShow" center :visible.sync="dialogShow" width="900px">
      <!-- {{nodeModelData}} -->
      <!-- {{required}} -->
      <new-form-cmpt pagetype="2" :view-data.sync="nodeViewData" :model-data.sync="nodeModelData"
        :required.sync="required"></new-form-cmpt>
      <div class="searchForm" style="width:100%;text-align:right;padding-right:28px">
        <el-button @click="nodeFunc()">确认</el-button>
        <el-button @click="dialogShow=false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getChangeValue } from "../api/localStorage.js";
  import { openZimessage } from '@/components/mixins/topPageMixin'

  export default {
    name: "nodeControllerPage",
    components: {},
    mixins: [openZimessage],
    props: {
      pagetype: {
        type: [Number, String],
        default: 1//1控制类 2预警类
      }
    },
    data() {
      return {
        name: "nodeControllerPage.vue",
        inputViewData: {
          fun: {
            title: "名称",
            type: 1
          },
          ctrldesc: {
            title: "描述",
            type: 1
          },
          ctrltype: {
            title: '类型',
            type: 4,
            groupid: 1366,
          },
          //  area:{
          //   title:'所属地区',
          //   type:5,
          //   options:JSON.parse(localStorage.cityCode)
          // },  
        },
        inputModelData: {

        },
        searchData: {},
        nodeViewData: {
          area: {
            title: '站点',
            type: 5,
            options: JSON.parse(localStorage.cityCode),
            required: true,
          },
          system: {
            title: "系统",
            type: 5,
            whereStr: "in",
            options: JSON.parse(localStorage.groupType).filter(i => i.groupid == 57).map(i => { return { label: i.typename, value: i.typename } }),
            groupid: 57,
            required: true,
            bindLabel: 'typename',
            bindValue: 'typename',
          },
          bigtype: {
            title: '大类',
            type: 4,
            groupid: 1400,
            required: true,
            elEvent: {
              eventName: 'change',
              eventFunc: this.bigtypeBlur
            },
          },
          ctrltype: {
            title: '小类',
            type: 4,
            groupid: 1366,
            required: true,
            elEvent: {
              eventName: 'change',
              eventFunc: this.ctrltypeBlur
            },
          },
          fun: {
            title: '名称',
            type: 4,
            groupid: 1339,
            bindLabel: 'ready01',
            bindValue: 'typename',
            required: true,
            elEvent: {
              eventName: 'change',
              eventFunc: this.funBlur
            },
          },
          ctrldesc: {
            title: '描述',
            type: 17,
            idStyle: { width: '100%' },
            itemStyle: { width: '840px' }
          },
          logname: {
            title: '被控角色',
            type: 4,
            groupid: 1360,
            bindLabel: 'ready01',
            bindValue: 'typename',
            required: true
          },
          startdate: {
            title: '起算日',
            required: true,
            type: 4,
            groupid: 1361,
            bindLabel: 'ready01',
            bindValue: 'typename'
          },
          controldays: {
            title: '时效(小时)',
            required: true,
            type: 1,
            verify: "integer"
          },
          approverstatus: {
            title: '状态',
            required: true,
            type: 4,
            options: [
              { label: '有效', value: 1 },
              { label: '无效', value: 2 }
            ],
            default: 1
          },
          begindate: {
            title: '开始日期',
            required: true,
            type: 6,
            defaultVal: true
          },
          enddate: {
            title: '结束日期',
            type: 6,
            // required:true
          },
        },
        required: '',
        nodeModelData: {},
        selectTableIndex: -1,
        putIndex: -1 //点击打开展开分单索引
      };
    },

    methods: {
      getArea(area) {
        if (area) {
          let alllength = this.nodeViewData.area.options.length
          let arr = area.split(',')
          if (area == -1 || arr.length == alllength) {
            return '全部'
          }
          if (arr.length == alllength - 1) {
            return ("非" + this.nodeViewData.area.options.map(i => i.value).filter(i => !area.includes(i))[0])
          }
        }
        return area
      },
      getSystem(system) {
        if (system) {
          let alllength = this.nodeViewData.system.options.length
          let arr = system.split(',')
          if (system == -1 || arr.length == alllength) {
            return '全部'
          }
          if (arr.length == alllength - 1) {
            return ("非" + this.nodeViewData.system.options.map(i => i.value).filter(i => !system.includes(i))[0])
          }
        }
        return system
      },
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        if (this.pagetype == 1) {
          this.searchData.bigtype = '控制类'
        } else {
          this.searchData.bigtype = '预警类'
        }
        var jsonArr2 = {
          where: { ...this.searchData },
          order: "begindate desc"
        };
        jsonArr2.where.czlx = -1;
        jsonArr2.where.gid = -1;
        jsonArr2.where.servicetype = -1;
        delete jsonArr2.where.area
        delete jsonArr2.where.system
        var json = { json: JSON.stringify(jsonArr2) };

        json.area = this.$store.state.areaStateCode
        json.system = this.$store.state.systemCheck

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/ExSystemAreaApproverSearch",
          params: json,
          loading: true,
          tip: false,
          nofield: true,
          nodom: true,
          noarea: true,
          nosystem: true
        })
          .then(results => {
            //console.log(results)
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            setTimeout(() => {
              results.data.forEach(i => {
                i.enddate = i.enddate == '--' ? '' : i.enddate
              })
              this.tableDataRes = getChangeValue(results.data, "空出");
            }, 0);

          })
          .catch(errors => { });
      },
      reset() {
        this.inputModelData = {};
      },
      getVal(groupid, val) {
        if (val === undefined || val === null) return '';
        var groupType = JSON.parse(localStorage.groupTypeCode)[groupid]
        var data = ''
        groupType.forEach(item => {
          if (item.typename == val) {
            data = item.ready01
          }
        })
        return data
      },
      openDialog(index) {
        this.selectTableIndex = index;
        this.nodeModelData = { ...this.tableDataRes[index] }
        this.nodeModelData.enddate = this.nodeModelData.enddate == '--' ? '' : this.nodeModelData.enddate
        if (this.nodeModelData.area == -1) {
          this.nodeModelData.area = this.nodeViewData.area.options.map(i => i.value).toString()
        }

        if (this.nodeModelData.system == -1) {
          this.nodeModelData.system = this.nodeViewData.system.options.map(i => i.value).toString()
        }
        this.nodeModelData.enddate = this.nodeModelData.enddate == '--' ? '' : this.nodeModelData.enddate

        this.dialogShow = true;
        setTimeout(() => {
          this.bigtypeBlur(false)
          this.ctrltypeBlur(false)
          this.funBlur(false)
        }, 500);

      },
      async nodeFunc(index) {
        //有index 代表删除
        let json = {}
        let method = "post"
        let api = "api/ExSystemAreaApproverAdd"

        if (!index && index != 0) {
          if (this.required) {
            return this.$message.error('请填写' + this.required)
          }
          json = JSON.parse(JSON.stringify(this.nodeModelData))
          json.czman = localStorage.usrname;
          json.czlx = -1;
          json.gid = -1;
          json.servicetype = -1;
          json.area = json.area.split(',').length == this.nodeViewData.area.options.length ? -1 : json.area;
          json.system = json.system.split(',').length == this.nodeViewData.system.options.length ? -1 : json.system;
          // if(new Date(json.begindate)>new Date(json.enddate)){
          //   return this.$message.error('结束日期不能小于开始日期！')
          // };
          json.ctrlname = this.nodeViewData.fun.options.filter(i => i.value == json.fun)[0].label
        } else {
          let confirm = await this.$confirm("请确认操作", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning"
          })
          if (!confirm) return;
          json = { ...this.tableDataRes[index] }
          json.isdel = 2
        }

        json.enddate = json.enddate == '--' ? '' : json.enddate

        // console.log(json);return

        if (json.guid) {
          method = "put"
          api = "api/ExSystemAreaApproverEdit"
        }

        this.$axios({
          method: method,
          url: this.$store.state.webApi + api,
          data: json,
          loading: false,
          tip: false
        }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            this.dialogShow = false;
            this.search()
          } else {
            this.$message.error(results.data.resultmessage)
          }
        });
      },
      bigtypeBlur(clear = true) {
        let group = JSON.parse(localStorage.groupType)
        let val = this.nodeModelData.bigtype
        if (val) {
          let id = group.filter(i => i.groupid == 1400 && i.typename == val)[0].id
          if (clear) {
            this.$set(this.nodeModelData, 'ctrltype', "")
            this.$set(this.nodeModelData, 'fun', "")
            this.$set(this.nodeModelData, 'logname', "")
            this.$set(this.nodeModelData, 'startdate', "")
          }
          this.nodeViewData.ctrltype.options = group.filter(i => i.groupid == 1366 && i.ready02.includes(id)).map(i => { return { value: i.typename, label: i.ready01 } })
        }
      },

      ctrltypeBlur(clear = true) {
        let group = JSON.parse(localStorage.groupType)
        let val = this.nodeModelData.ctrltype
        // console.log(this.nodeViewData.fun.options)
        if (val) {
          let id = group.filter(i => i.groupid == 1366 && i.typename == val)[0].id
          if (clear) {
            this.$set(this.nodeModelData, 'fun', "")
            this.$set(this.nodeModelData, 'logname', "")
            this.$set(this.nodeModelData, 'startdate', "")
          }
          this.nodeViewData.fun.options = group.filter(i => i.groupid == 1339 && i.ready02.includes(id)).map(i => { return { value: i.typename, label: i.ready01 } })
        }
      },
      funBlur(clear = true) {
        let group = JSON.parse(localStorage.groupType)
        let val = this.nodeModelData.fun
        if (val) {
          let id = group.filter(i => i.groupid == 1339 && i.typename == val)[0].id
          if (clear) {
            this.$set(this.nodeModelData, 'logname', "")
            this.$set(this.nodeModelData, 'startdate', "")
          }
          this.nodeViewData.logname.options = group.filter(i => i.groupid == 1360 && i.ready02.includes(id)).map(i => { return { value: i.typename, label: i.ready01 } })
          this.nodeViewData.startdate.options = group.filter(i => i.groupid == 1361 && i.ready02.includes(id)).map(i => { return { value: i.typename, label: i.ready01 } })
        }
      }
    },
    watch: {

    },
    created() {
      /*     this.$watch(
            ()=>{
               return this.nodeModelData.ctrltype
          },(val)=>{
               let group=JSON.parse(localStorage.groupType)
               if(val){
               let id = group.filter(i=>i.groupid==1366&&i.typename==val)[0].id
               this.$set(this.nodeModelData,'fun',"")
                this.$set(this.nodeModelData,'logname',"")
                this.$set(this.nodeModelData,'startdate',"")
               this.nodeViewData.fun.options=group.filter(i=>i.groupid==1339&&i.ready02.includes(id)).map(i=>{return {value:i.typename,label:i.ready01}})
               }
          })
      
          this.$watch(
            ()=>{
               return this.nodeModelData.fun
          },(val)=>{
               let group=JSON.parse(localStorage.groupType)
               if(val){
               let id = group.filter(i=>i.groupid==1339&&i.typename==val)[0].id
                this.$set(this.nodeModelData,'logname',"")
                this.$set(this.nodeModelData,'startdate',"")
               this.nodeViewData.logname.options=group.filter(i=>i.groupid==1360&&i.ready02.includes(id)).map(i=>{return {value:i.typename,label:i.ready01}})
               this.nodeViewData.startdate.options=group.filter(i=>i.groupid==1361&&i.ready02.includes(id)).map(i=>{return {value:i.typename,label:i.ready01}})
               }
          }) */
    },
    computed: {}
  };
</script>


<style scoped lang="less">
</style>