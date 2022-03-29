<!--
 * @Description:  始发港货站费用维护
 * @Version: 
 * @Autor: ZX
 * @Date: 2021-10-27 16:50:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-16 15:06:04
-->
<template>
  <div class="frm-system-wage">
    <div class="page-container-box">
      <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
      >
      </newFormCmpt>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>


      <tableCompt
        :name="name"
        :table-data-res="tableDataRes"
        :nestedTableType="2"
        :ziTableData="ziTableData"
        :depotModule="depotModule"
        @transmitMsg="getHZCostData"
        @initFreightData="search"
        @modify="modifyCost"
        @deleteCost="deleteCost"
        showZiConfig
        expansionSubcolumn="cname"
      >
        <template slot="add" slot-scope="props" v-if="depotModule">
          <i
            class="el-icon-document-add"
            style="color:#1a7dbf;font-weight:bold"
            @click="openAddDepotCostDialog(props.data.row, 'out')"
          >
          </i>
        </template>
      </tableCompt>

      <el-dialog
        title="始发港货站费用维护"
        :visible.sync="sfghzCostDialog"
        width="65%"
        class="common-dialog"
        @close="closeDialog"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
      >
        <div class="head">
          <span>始发港: {{ sfghzDialogInfo.sfg }}</span> &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp;
          <span>货站中文名称: {{ sfghzDialogInfo.cname }}</span> &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; 
          <span>货站英文名称: {{ sfghzDialogInfo.ename }}</span>&nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; 
          <span>供应商名称：{{supplierName}} </span>
        </div>

        <br />
        <commonTable
          class="commonTable"
          :head="tableHeadTemplate"
          :table-data="sfghzDialogInfo.tableData"
          :firstTdShow="addEditDataStatus"
          :putIndex="modCostIndex"
        >
          <template slot="firstTd" slot-scope="props">
            <td style="text-align:left;padding-left:8px;">
              <i
                class="el-icon-success"
                style="color:green;font-weight:bold"
                title="费用新增"
                @click="addConfirmWage()"
              ></i>

              <!-- 取消操作 未勾选费用时 -->
              <i
                class="el-icon-error"
                style="color:red;font-weight:bold"
                title="取消修改"
                @click="clearCost"
              ></i>
            </td>

            <td>
              <!-- 费用名称 -->
              <!-- 组合下拉框 -->

              <page-select
                :pagetype="5"
                :modelval.sync="editFormModel.items"
                style="width: 100%; border: 0;background:#fffaf2;"
                @change="getSelectData"
              >
              </page-select>
            </td>
            <td>
              <!-- 制单成本 -->
              <el-select v-model="editFormModel.iszd" style="width:106px;background:#fffaf2;">
                <el-option
                  v-for="(item, index) in makeBillList"
                  :key="item.label"
                  :value="item.id"
                  :label="item.label"
                ></el-option>
              </el-select>
            </td>
            <td>
              <!-- 计算方式 -->
              <el-select v-model="editFormModel.jsfs_out" style="width:120px;background:#fffaf2;">
                <el-option
                  v-for="(item, index) in billList"
                  :key="index"
                  :value="item.typename"
                  :label="item.typename"
                ></el-option>
              </el-select>
            </td>
            <td>
              <!-- 单价  输入框 -->
              <el-input
                v-model="editFormModel.price"
                style="width:72px;background:#fffaf2;"
              ></el-input>
            </td>
            <td>
              <!-- MIN 输入框 -->
              <el-input
                v-model="editFormModel.min_price"
                style="width:72px;background:#fffaf2;"
              ></el-input>
            </td>
            <td>
              <!-- 币种 -->
              <el-select v-model="editFormModel.currency" style="width:84px;background:#fffaf2;">
                <el-option
                  v-for="(item, index) in currencyData"
                  :key="index"
                  :value="item.cname"
                  :label="item.cname"
                ></el-option>
              </el-select>
            </td>
            <td>
              <!-- 开始日期 -->
              <el-date-picker
              v-model="editFormModel.begindate"
              style="background:#fffaf2;width:150px;"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            
            </td>
            <td>
              <!-- 结束日期 -->
              <el-date-picker
                v-model="editFormModel.enddate"
                style="width:150px;"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </td>
            <td>
              <!-- 状态 -->
              <el-select
                v-model="editFormModel.price_status"
                style="width:84px;background:#fffaf2;"
              >
                <el-option
                  v-for="(item, index) in costCtatus"
                  :key="index"
                  :value="item.id"
                  :label="item.label"
                ></el-option>
              </el-select>
            </td>

          </template>
          <template slot="operate" slot-scope="props">
            <!-- <i
              class="edit"
              title="费用编辑"
              @click="config(props.data)"
            ></i> -->
            <i class="el-icon-setting" title="费用编辑" @click="config(props.data)" ></i>
            <!-- <i
              class="delete"
              @click="deleteCost(props.data.row)"
              title="费用删除'"
            ></i> -->
            <i class="el-icon-delete"  title="费用删除" @click="deleteCost(props.data.row)" ></i>
            <i
              class="el-icon-success"
              style="color:green;font-weight:bold"
              title="费用新增"
              @click="addConfirmWage()"
              v-show="props.data.row.guid === costGuid"
            ></i>

            <!-- 取消操作 未勾选费用时 -->
            <i
              class="el-icon-error"
              style="color:red;font-weight:bold"
              title="取消修改"
              @click="clearCost"
              v-show="props.data.row.guid === costGuid"
            ></i>
          </template>
        </commonTable>
      </el-dialog>
  </div>
</template>

<script>
import commonTable from "@/components/templates/commonTable";
import { formatDate } from "@/api/localStorage.js";
export default {
  name: "portDepotCostMaintain",
  components: {
    commonTable
  },
  data() {
    return {
      name: "portDepotCostMaintain.vue",
      // 表单控件的数据
      formData: [],

      allSupplierData:[],
      tableHeadTemplate: [
        {
          field: "operate",
          title: "操作"
        },
        {
          field: "items",
          title: "费用名称"
        },
        {
          field: "iszd",
          title: "作为制单成本"
        },
        {
          field: "jsfs_out",
          title: "计费方式"
        },
        {
          field: "price",
          title: "单价"
        },
        {
          field: "min_price",
          title: "MIN"
        },
        {
          field: "currency",
          title: "币种"
        },
        {
          field: "begindate",
          title: "开始日期"
        },
        {
          field: "enddate",
          title: "结束日期"
        },
        {
          field: "price_status",
          title: "状态"
        },
        {
          field: "addman",
          title: "创建人"
        },
        {
          field: "adddate",
          title: "创建时间"
        },
        {
          field: "modifyman",
          title: "修改人"
        },
        {
          field: "modifydate",
          title: "修改日期"
        }
      ],
      sfghzCostDialog: false,

      // 查询空间配置
      inputViewData: {
        sfg: {
          title: "始发港",
          pagetype:6,
          type:20,
          multiple:false,
          sfdValue:""
        },
        cname: {
          title: "货站名称",
          type: 20,
          pagedata: [],
          multiple:false,
          viewdata: [
            {
              title:'cname',field: 'cname',
            },
            {
              title:'中文名称',field: 'cname',
            },
            {
              title:'英文名称',field: 'ename',
            }
          ]
        },
      },
      // 表格数据
      tableDataRes: [],
      // 嵌套表格数据
      ziTableData: [],
      // 控件的数据
      inputModelData: {},
      //   导出Excel中文条件
      chineseWhere: [],
      // 是否显示隐藏表单
      pageshow: true,
      searchData: {},
      // 始发港货站弹窗展示信息
      sfghzDialogInfo: {
        sfg: "",
        ename: "",
        cname: "",
        tableData: []
      },
      //费用index
      modCostIndex: -1,
      // 编辑form model 数据
      editFormModel: {
        jjdguid: "", //货站id
        sid: "", //计费方式 传递 id
        items: "",
        iszd: "", //是否带入制单
        jsfs_out: "", //结算方式
        price: "", // 单价
        min_price: "", //MIN
        currency: "人民币", // 币种
        begindate: "", // 开始时间
        enddate: "", // 结束时间
        price_status: 1, //状态
        guid:"" //货站费用的guid
      },
      // 制单状态
      makeBillList: [
        {
          id: 0,
          label: "否"
        },
        {
          id: 1,
          label: "是"
        }
      ],
      // 计算方式
      billList: [],
      // 币种
      currencyData: [],
      // 状态
      costCtatus: [
        {
          id: 0,
          label: "无效"
        },
        {
          id: 1,
          label: "有效"
        }
      ],

      costNameData: localStorage.getItem("fwxm"),
      costGuid: null,
      addEditDataStatus: false,
      // 编辑的入口  货站外部点击进入 out   弹窗内部进入编辑
      modifyEntrance: "",
      selectHzData: null,
      updateCost:false,
      supplierName:"", //供应商
      ziTableRowData:null,
      depotModule:false,
    };
  },
  methods: {
    reset() {
      this.inputModelData = {};
    },
    handleClose() {
      this.sfghzCostDialog = false;
    },
    formatWage(wage) {
      wage.gid = wage.gid == "0" ? "" : wage.gid;
      wage.itemstatus = wage.itemstatus === 1 ? "有效" : "无效";
      wage.begindate = formatDate(new Date(wage.begindate), "yyyy-MM-dd") || "";
      wage.enddate = formatDate(new Date(wage.enddate), "yyyy-MM-dd") || "";
    },
    search() {
      console.log(22);
      console.log(this.inputModelData);
      this.tableDataRes = [];
      let jsonArr2 = {
        where: this.searchData,
        order: "adddate desc"
      };
      let json = { json: JSON.stringify(jsonArr2) };
      console.log(this.searchData);
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExJjdCustomPrice",
        params: json,
        loading: true,
        tip: false,
        noselect: true,
        noarea:true
      }).then(
        result => {
          let resultData = result.data;
        console.log(this.allSupplierData)
        resultData.map(item => {
          this.allSupplierData.forEach(obj => {
              if((item.gid && item.gid !== -1) && (obj.id && obj.id !== -1)) {
                if(item.gid=== obj.id){
                 item.gysname = obj.usr_name
                }
              }
          })
        })
          

          this.tableDataRes =  resultData
        
        },
        err => {
          console.log(err);
        }
      );
    },
    // 拿到对应嵌套表格的数据
    // getZimessage(row) {
    //   const { index } = row;
    //   console.log(row)
    //   this.ziTableData = [];
    //   this.tableDataRes.forEach(item => {
    //     if (item.index === index) {
    //       item.jjdpricelist.forEach(obj => {
    //         this.ziTableData.push(obj);
    //       });
    //     }
    //   });
    // },
    //最外层添加-- 添加货站费用
    openAddDepotCostDialog(row, str) {
      console.log(row);
      
      const { jjdguid, gid } = row;
      if(gid && gid !== -1) {
        this.allSupplierData.forEach(item => {
          if(item.id === gid){
              this.supplierName = item.usr_name
          }
        })
      }
      row.trigger = "add"
      // this.editFormModel.jjdguid = jjdguid;
      this.ziTableRowData = row;
      
      //加载货站的费用
      this.getHZCostData(this.ziTableRowData);


      if (str) {
        this.modifyEntrance = "out";
        if (this.modifyEntrance === "out") {
          this.addEditDataStatus = true;
        } else {
          this.addEditDataStatus = false;
        }
      }

      const { sfg, cname, ename, jjdpricelist } = row;
      this.sfghzDialogInfo.sfg = sfg;
      this.sfghzDialogInfo.ename = ename;
      this.sfghzDialogInfo.cname = cname;
      this.sfghzDialogInfo.tableData = jjdpricelist;

      this.sfghzCostDialog = true;
    },
    // 添加新的费用
    addConfirmWage() {
      this.editFormModel.begindate = formatDate(
        this.editFormModel.begindate,
        "yyyy-MM-dd hh:mm:ss"
      );
      this.editFormModel.enddate = formatDate(
        this.editFormModel.enddate,
        "yyyy-MM-dd hh:mm:ss"
      );
      console.log(this.ziTableRowData);
      this.editFormModel.jjdguid = this.ziTableRowData.jjdguid

      if(this.editFormModel.enddate === '') {
        this.editFormModel.enddate = '1900-01-01'
      }
      console.log( this.editFormModel)

      if(this.editFormModel.items !== '' && this.editFormModel.iszd !== '' && this.editFormModel.jsfs_out !== '' && this.editFormModel.price !== '' && this.editFormModel.min_price !== '' && this.editFormModel.currency !== '' 
       && this.editFormModel.begindate !=='' && this.editFormModel.price_status !== '') {
      if(this.updateCost === false) {
        this.$axios({
                method: "post",
                url: this.$store.state.BasicWebApi + "api/PostExJjdCustomPrice",
                data: this.editFormModel,
                loading: true,
                tip: false,
              }).then(result => {
                let resultData = result.data;
                console.log(result);
                if (resultData.length == 0) {
                  return this.$message("无查询结果");
                } else {
                  this.pageshow = false;
                }
                // 清空表单
                this.clearCost();
                // 获取最新内容
                this.getHZCostData(this.ziTableRowData);
                // this.sfghzCostDialog = false
                // this.search();
                console.log(this.ziTableData);
              });
      } else if(this.updateCost === true){
             
              
              this.$axios({
                method: "put",
                url: this.$store.state.BasicWebApi + "api/PutExJjdCustomPrice",
                data: this.editFormModel,
                loading: true,
                tip: false,
              }).then(result => {
                let resultData = result.data;
               
                console.log(result);
                if (resultData.length == 0) {
                  return this.$message("无查询结果");
                } else {
                  this.pageshow = false;
                }

                 this.updateCost === false
                // 获取最新内容
                this.getHZCostData(this.ziTableRowData);
                // 清空表单
                this.clearCost();

                // this.sfghzCostDialog = false
                // this.search();
                console.log(this.ziTableData);
              });
      }
       } else {
         alert('请填写必要字段')
       }

      



      
    },
    // 取消添加费用
    clearCost() {
      this.modCostIndex = -1;
      this.updateCost = false
      this.costGuid = null;
      this.editFormModel = {
        sid: "",
        iszd: "",
        jsfs_out: "",
        price: "",
        min_price: "",
        currency: "",
        begindate: "",
        enddate: "",
        price_status: "",
        addman: "",
        adddate: "",
        modifyman: "",
        modifydate: ""
      };
    },
    getSelectData(row) {
      console.log(row);
      const { id } = row;
      this.editFormModel.sid = id;
    },
    // 获取货站费用
    getHZCostData(data) {
      console.log(data);
      if(data){
        this.ziTableRowData = data
      }
      this.$axios({
        method: "get",
        url: this.$store.state.BasicWebApi + "api/GetExJjdCustomPriceByGuid",
        params: { guid: this.ziTableRowData.jjdguid  },
        loading: true,
        tip: false
      }).then(result => {
        if (result.data.length == 0) {

          this.$nextTick(() => {
            this.ziTableData = []
            this.sfghzDialogInfo.tableData = []
          })
          return this.$message("无查询结果");

        } else {
          if(data.trigger === 'add'){
            this.sfghzDialogInfo.tableData = result.data;
          } else if (data.trigger === 'unfold') {
            this.ziTableData = result.data;
          }
          this.pageshow = false;
        }
        
       
          
          
      });
    },

    //最外层----货站下费用的入口 编辑
    modifyCost(val) {
      this.modifyEntrance = "in";
      this.config(val);
      console.log(val);
      console.log(this.tableDataRes);

      this.selectHzData = this.tableDataRes.filter(
        item => item.jjdguid === val.row.jjdguid
      );

      //传递最外层数据
      this.openAddDepotCostDialog(this.selectHzData[0]);
    },
    config(row) {

      this.updateCost = true
      
      const {
        guid,
        iszd,
        sid,
        jsfs_out,
        currency,
        begindate,
        enddate,
        price_status,
        addman,
        modifyman,
        modifydate,
        min_price,
        items,
        price,
        adddate
      } = row.row;
      this.editFormModel = {
        iszd: iszd,
        items:items,
        sid:sid,
        guid:guid,
        jsfs_out: jsfs_out,
        price: price,
        currency: currency,
        begindate: begindate,
        min_price:min_price,
        enddate: enddate,
        price_status: price_status,
        addman: addman,
        adddate: adddate,
        modifyman: modifyman,
        modifydate: modifydate
      };
      console.log(row.row)
      console.log(this.editFormModel)
      this.costGuid = guid;

      this.modCostIndex = row.index;
    },
    // 删除费用
     deleteCost(row) {
      console.log(row);
      console.log(row)
      const { guid } = row;
      this.$axios({
        method: "delete",
        url: this.$store.state.BasicWebApi + "api/DeleteExJjdCustomPrice ",
        data: { guid: guid },
        loading: true,
        tip: false
      }).then(
        result => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getHZCostData(this.ziTableRowData);
          // this.search();
        },
        err => {
          console.log(err);
        }
      );
    },
    closeDialog() {
      this.clearCost();
    }
  },
  watch:{
    '$route'(val){
      switch (val.params.ready08) {
        case 'AESOUT' :
          this.depotModule = false
          break;
        case 'AEWOUT' :
          this.depotModule = true
      }
    }
  },
  mounted() {
    const formDataInfo = JSON.parse(localStorage.getItem("jjd"));
    console.log(formDataInfo)
    console.log( this.$router.history.current.params.ready08)
     if(this.$router.history.current.params.ready08 ===  'AESOUT'){
      this.depotModule = false
    } else if(this.$router.history.current.params.ready08 ===  'AEWOUT') {
      this.depotModule = true
    }


    
    let arr = [];
    let hzNameList = [];
    let hzEnglishNameList = [];
    JSON.parse(localStorage.getItem("jjd")).forEach(obj => {
        console.log(obj)
        arr.push(obj.sfg);
  
      if(obj.cname && obj.ename){
          this.inputViewData.cname.pagedata.push({
            cname:obj.cname,
            ename:obj.ename
          });
      }

    });
    arr = [];

    

    const initCostData = JSON.parse(localStorage.getItem("groupType"));
    // 通过本地缓存取 计费方式
    this.billList = initCostData.filter(item => item.groupid === 33);

    this.currencyData = JSON.parse(localStorage.getItem("currencyData"));
    console.log(this.inputViewData.cname)



    this.allSupplierData = getxmdata('gysxm')
  }
};
</script>

<style lang="less" scoped>
// 操作
.edit{
  background: url("../../boStatic/images/edit.png") no-repeat;
  display: inline-block;
  height: 27px;
  width: 20px;
  cursor: pointer;
  position: relative;
  left: 1px;
  top: 7px;
}
.delete{
  background: url("../../boStatic/images/delete.png") no-repeat;
  height: 27px;
  width: 20px;
  cursor: pointer;
  position: relative;
  background-position: center;
  left: 1px;
  top: 7px;
}
</style>
<style lang="less" scoped>
.frm-system-wage {
  display: flex;
  flex-direction: column;
  height: 100%;
  .page-container-box {
    .searchForm {
      .search-type {
        display: inline;
        margin-left: 20px;
      }
    }
  }
}
/deep/ .wagestandard {
  max-width: 800px !important;
  min-width: 800px !important;
}

/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 125px;
}
</style>
