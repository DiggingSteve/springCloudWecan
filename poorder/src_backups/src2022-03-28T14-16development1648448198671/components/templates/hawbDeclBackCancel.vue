<template>
  <div class="hawb-decl-back">
    <!-- {{tgReasonForm}} -->
    <el-form :inline="true">
      <el-form-item label="退关原因：" >
        <my-select :groupid="240" class="input-required" v-model="tgReasonForm.canceltype"></my-select>
      </el-form-item>

      <el-form-item label="退关描述：" style="width:100%">
        <el-input
          type="textarea"
          style="width:468px"
          :rows="2"
          class="input-required"
          v-model="tgReasonForm.delbillreason"
        ></el-input>
      </el-form-item>

      <!-- <el-row style="display:flex">
             <el-form-item label="签单件数：" >
              <el-input v-model="signpiece" :disabled="!signApplicationCanEdit" :class="signApplicationCanEdit?'input-required':''"></el-input>
            </el-form-item>
            <el-form-item label="签单重量：">
              <el-input v-model="signweight" :disabled="!signApplicationCanEdit" :class="signApplicationCanEdit?'input-required':''"></el-input>
            </el-form-item>
            <el-form-item label="签单体积：">
              <el-input v-model="signvolume" :disabled="!signApplicationCanEdit" :class="signApplicationCanEdit?'input-required':''"></el-input>
            </el-form-item>
      </el-row> -->


    </el-form>

    <div>
      <commonTable
        style="margin:20px 0"
        class="hawb-table"
        :head="hawbTableHead"
        :tableData="hawbTableData"
        :showAllZiTable="true"
      >
          <template slot="khjcno" slot-scope="props">
            <khjcnoSlot :tableCheckedIndex.sync="leftTableCheckedIndex" :propsData.sync="props.data" pagetype=1></khjcnoSlot>
          </template>

          <template slot="ziTable" slot-scope="props" >
            <commonTable
              :head="ziTableHead"
              :table-data="props.data.row.realList"
              v-if="props.data.row.realList.length>0"
              :style="{height:(props.data.row.realList.length+1)*32+'px'}"
              class="peihuoZiTable"
              isMultiSelect
            >
              <template slot="khjcno" slot-scope="ziprops">
                <khjcnoSlot :tableCheckedIndex.sync="leftZiTableCheckedIndex" :propsData.sync="ziprops.data" pagetype=2></khjcnoSlot>
              </template>
            </commonTable>
          </template>


      </commonTable>

      <div class="footer" v-if="inputModelData.commbillmodifystatus==2">
        <el-button type="primary" style="background:#FA1A1A" @click="declBack('1')">直接退关</el-button>
        <el-button type="primary" @click="openDialog(1)" v-show="!isAssignOrder">重新上榜</el-button>
        <el-button type="primary" @click="openDialog(2)" v-show="!isAssignOrder">合并到现有单号</el-button>
      </div>
    </div>

    <el-dialog
      title="重新上榜服务编辑"
      :visible.sync="serviceListDialogVisible"
      top="1%"
      append-to-body
      :close-on-click-modal="false"
      width="1360px"
    >
      <div class="detail">
        <div class="detail-c">
          <serviceList
            v-if="serviceListDialogVisible"
            :newService.sync="newService"
            :opersystem="inputModelData.opersystem"
            pagetype="1"
            :orderguid="inputModelData.orderguid"
            orderdom="总单"
          ></serviceList>
          <div style="text-align:right">
            <el-button @click="declBack('2')">保存</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      custom-class="combine-dialog"
      title="合并到现有单号"
      width="1000px"
      :visible.sync="combineDialogVisible"
      append-to-body
    >
      <div>
        <newFormCmpt
          :view-data.sync="combineViewData"
          :model-data="combineModelData"
          :search-data.sync="combineSearchData"
          pagetype="1"
          :exForm="true"
        ></newFormCmpt>
        <!-- <el-button type="primary" @click="combineSearch">合并</el-button> -->
        <el-button type="primary" @click="declBack('3')">合并</el-button>

        <!-- <div v-show="combineSearchResult.length > 0">
          <div class="pono-list-c">
            <div class="pono-item" v-for="item of combineSearchResult" :key="item.pono">
              <el-radio v-model="flagPono" :label="item.pono" :title="item.pono"></el-radio>
            </div>
          </div>
          <el-button class="combine-btn" type="primary" @click="declBack('3')">合并</el-button>
        </div>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from "../../api/localStorage.js";
import serviceList from "../orderDetails/serviceList"; //服务列表组件
import khjcnoSlot from '@/components/templates/khjcnoSlot' 

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    signApplicationCanEdit:Boolean,
      refrashKhjcno: {
      type: Boolean,
      required: false
    },
    inputModelData: Object
  },
  components: { serviceList,khjcnoSlot },
  data() {
    return {
      tgReasonForm: {
        canceltype: "",
        delbillreason: ""
      },
      signpiece:'',
      signweight:'',
      signvolume:'',
      hawbDataAll: [],
      hawbTableHead: [
        {
          title: "预报进仓编号",
          field: "khjcno",
          style: { "pointer-events": "all" }
        },
           {
          title: "预报件/重/体",
          field: "ybjzt",
          formatType: 4,
          format: row => `${row.piece}/${row.weight}/${row.volume}`
        },
        {
          title: "实际件/重/体",
          field: "sjjzt",
          formatType: 4,
          format: row => `${row.pieceReal}/${row.weightReal}/${row.volumeReal}`
        },
        {
          title: "入库类型",
          field: "storeType",
          formatType: 2,
          format: x => (x == "请选择" ? "--" : x)
        },
        { title: "入库仓库", field: "storename_yb" },
        { title: "分运单号", field: "hawb" }
      ],
        ziTableHead: [
        {
          title: "客户进仓编号",
          field: "khjcno",
          style: { "pointer-events": "all" }
        },
        {
          title: "实际件/重/体",
          field: "ybjzt",
          formatType: 4,
          format: row => `${row.piece}/${row.weight}/${row.volume}`
        },
        {
          title: "入库类型",
          field: "storeType",
          formatType: 2,
          format: x => (x == "请选择" ? "--" : x)
        },
        { title: "入库仓库", field: "storeName" }
      ],
      // hawbTableData:[],
      serviceListDialogVisible: false,
      newService: {},

      combineDialogVisible: false,
      combineViewData: {
        pono: { title: "订舱编号", type: 1, whereStr: "equal" },
        // fid: { title: "委托客户", type: 14, pagetype: "1" },
        mawb: { title: "总运单号", type: 1, whereStr: "equal" }
        // hbh: { title: "航班号", type: 1, whereStr: "like" },
        // hbrq: { title: "航班日期", type: 15 },
      },
      combineModelData: {},
      combineSearchData: {},
      leftTableCheckedIndex: -1,
      leftZiTableCheckedIndex: -1,
      // combineSearchResult: [],
      // flagPono: ''
    };
  },
  created(){
              // this.signpiece=this.signApplicationCanEdit?this.inputModelData.signpiece:this.inputModelData.realpiece 
              // this.signweight=this.signApplicationCanEdit?this.inputModelData.signweight:this.inputModelData.realweight
              // this.signvolume=this.signApplicationCanEdit?this.inputModelData.signvolume:this.inputModelData.realvolume      
  },
  computed: {
    hawbTableData() {
      // 将分单和报关单转换到同一个数组并插入对应的序号，方便表格显示
      // let data = []
      // this.hawbDataAll.forEach((hawb, hawbindex) => {
      //   hawb.hawbindex = hawbindex
      //   this.$set(hawb, 'backybpiece', 0)
      //   this.$set(hawb, 'backybweight', 0)
      //   this.$set(hawb, 'backybvolume', 0)
      //   data.push(hawb)
      //   hawb.declList.forEach((decl, declindex) => {
      //     decl.isdecl = true
      //     decl.hawbindex = hawbindex
      //     decl.declindex = declindex
      //     this.$set(decl, 'style', { background: '#f8f8f8' })
      //     data.push(decl)
      //   })
      // })
      // return data
      return this.hawbDataAll;
    },
    isAssignOrder() {
      // 一货两站 操作站订单只能撤单
      if (
        this.inputModelData &&
        this.inputModelData.orderguid &&
        this.inputModelData.orderguid !== "-1"
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (!val ) {
          this.hawbDataAll = [];
          return;
        }

        // let params = {
        //   hpoid: this.inputModelData.guid
        // };
        // this.$axios({
        //   method: "get",
        //   url: this.$store.state.webApi + "api/axpline/GetAxplineDecl",
        //   params,
        //   loading: true,
        //   tip: false
        // }).then(({ data }) => {
        //   // 有报关服务时才显示报关单，没有报关服务时过滤掉报关单
        //   let hasDeclService = false;
        //   for (let service of this.inputModelData.serviceList) {
        //     if (service.servicecode === "AA0610" && service.isdel == 1) {
        //       hasDeclService = true;
        //       break;
        //     }
        //   }
        //   if (hasDeclService) {
        //     this.hawbDataAll = data;
        //   } else {
        //     this.hawbDataAll = data.map(i => {
        //       i.declList = [];
        //       return i;
        //     });
        //   }
        // });

        this.$axios({
          method: "get",
          url: this.$store.state.webApi + "api/Store/GetYbList",
          params: { hpoid: this.inputModelData.guid,area: this.inputModelData.area || "" },
          noarea: true,
          loading: true,
          tip: false
        }).then(results => {
          console.log("配货数据");
          console.log(results.data);
          let arr=[];
          results.data.forEach(i=>{
            i.realList=i.realList.filter(i=>i.isshow)
            i.ziTableHidden = i.realList.length == 0;
            arr.push(i)
          })
           this.$emit("success", true);   
          this.hawbDataAll = arr
        });
      }
    }
  },
  methods: {
    declBack(declbackType) {
      if (
        declbackType=="3"&&
        !this.combineModelData.pono &&
        !this.combineModelData.mawb
      ) {
        return this.$message.error("请输入订舱编号或总运单号");
      }
      if (!this.tgReasonForm.canceltype) {
        return this.$message.error("请选择退关原因");
      }
      if (!this.tgReasonForm.delbillreason) {
        return this.$message.error("请输入退关描述");
      }

      let tgreason = [
        {
          reasontype: "退关",
          delbillreason: this.tgReasonForm.delbillreason,
          delbillman: localStorage.usrname,
          delbilldate: formatDate(new Date(), "yyyy-MM-dd hh:mm"),
          canceltype: this.tgReasonForm.canceltype,
          area: this.inputModelData.area || ""
        }
      ];
      if (this.inputModelData.tgreason) {
        try {
          let json = JSON.parse(this.inputModelData.tgreason);
          json.push(tgreason[0]);
          tgreason = json;
        } catch (error) {
          console.error(error);
        }
      }

      let  data = {
          tgReason: JSON.stringify(tgreason),
          hpoid: this.inputModelData.guid,
          boguid: this.inputModelData.boguid,
          storeList: this.hawbTableData.map(i=>{
            return {ybStoreGuid:i.guid,storeType:i.storeType,realStoreGuidList:i.realList.filter(n=>n.checked).map(e=>e.guid),khjcno:i.khjcno}
          })
        };
        data.storeList=data.storeList.filter(i=>i.realStoreGuidList.length>0)
        if(data.storeList.length==0){
          return this.$message.error('请选择进仓编号！');
        }
           let arr=this.hawbTableData.filter(i=>{
            return i.realList.filter(n=>n.checked).length>0
          })
        
         let piece=arr.map(i=>Number(i.piece)).reduce((a,b)=>a+b)
         let weight=arr.map(i=>Number(i.weight)).reduce((a,b)=>a+b)
         let volume=arr.map(i=>Number(i.volume)).reduce((a,b)=>a+b)
      //  console.log(data.storeList);return
      if (declbackType === "2") { 
            if (this.inputModelData.system == "空出" && this.inputModelData.area == this.conditionalAreaForBuild) {
              data.nodecode = "AO5025";
            } else {
              data.nodecode = "AO5020";
            }
      }

      if(declbackType === "2"||declbackType === "3"){
          data.ybkhjcno=arr.map(i=>i.khjcno).toString()
          data.ybpiece=piece
          data.ybweight=weight
          data.ybvolume=volume
      }else{          
          data.signpiece=piece
          data.signweight=weight
          data.signvolume=volume
      }
      
      let api = "";
      if (declbackType === "1") {
        api = "api/CancelCustomStore";
      } else if (declbackType === "2") {
        api = "api/againCustomStore";
        data.serviceList = Object.values(this.newService).map(i => {
          return {
            servicecode: i.servicecode,
            oprequest: i.oprequest,
            isdel: i.model ? "1" : "2"
          };
        });
      } else if (declbackType === "3") {
        api = "api/comboineCustomStore";
        data.orderPono = this.combineModelData.pono || "";
        data.orderMawb = this.combineModelData.mawb || "";
        delete data.isCancel;
      //  console.log(data);return;
      }
      // console.log(data);return;
        // if(this.signApplicationCanEdit){
        //          if (!this.signpiece) {
        //             return this.$message.error("请填写签单件数！");
        //           }
        //           if (!this.signweight) {
        //             return this.$message.error("请填写签单重量！");
        //           }
        //           if (!this.signvolume) {
        //             return this.$message.error("请填写签单体积！");
        //           }
        // }
        // data.signpiece=this.signpiece 
        // data.signweight=this.signweight
        // data.signvolume=this.signvolume 

      // return
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + api,
        data,
        loading: true,
        tip: false
      }).then(({ data }) => {
        this.$message.success(data.resultmessage);
        this.$emit("update:visible", false);
        this.$emit("success", true);       
        this.combineDialogVisible = false;
      });
    },
    openDialog(type=1) {
      if (!this.tgReasonForm.canceltype) {
        return this.$message.error("请选择退关原因");
      }
      if (!this.tgReasonForm.delbillreason) {
        return this.$message.error("请输入退关描述");
      }
      if (this.hawbDataAll.map(i=>i.realList).flat().every(i => !i.checked)) {
        return this.$message.error("请选择进仓编号");
      }
      if(type==1){
        this.serviceListDialogVisible = true;
      }else{
        this.combineDialogVisible = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
//.hawb-decl-back-dialog {
.hawb-table {
  margin-bottom: 20px;
  .el-input {
    width: 60px;
  }
  //}
  // .footer {
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-between;
  //   align-items: center;
  // }
}
.combine-dialog {
  .pono-list-c {
    display: flex;
    flex-wrap: wrap;
    width: 810px;
    margin: 10px 0;
    .pono-item {
      width: 270px;
      border: 1px solid #e8e8e8;
      overflow: hidden;
      text-overflow: ellipsis;
      .el-radio {
        width: 100%;
        padding-left: 10px;
        line-height: 35px;
      }
    }
  }
}
  .peihuoZiTable {
    padding: 0px;
    /deep/ th {
      background-color: #dfffd0;
    }
    /deep/ td {
      background-color: #dfffd0;
    }
  }
</style>
