<template>
  <div class="mawbContacts">
<!-- {{comContact}} -->
    <!-- {{inputModelData}} -->
    <!-- {{orderdom}}
    {{mawbguid}} -->
    <!-- {{wsLxrAllData}} -->
    <div class="rel-title">
      <h3 :class="{active: activeLxrss === 2}" @click="activeLxrss = 2">客户联系人</h3>
      <h3 :class="{active: activeLxrss === 1}" @click="activeLxrss = 1">我司联系人</h3>
     
    </div> <pageSelect pagetype="9" v-show="activeLxrss == 1&&pagetype==2" :modelval.sync="comContact" @change="addNewCon" style="width:180px;display:inline-block;float:right" placeholder='添加我司联系人'></pageSelect>
    <!-- {{activeLxrss}} -->
    <div v-show="activeLxrss == 2">
      <!-- <commonTable :head="tableHead" title="客户联系人" style="margin-top:18px;" :tableData="khlxrData">
        <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
      </commonTable>-->

      <!-- {{khlxrData}} -->
      <div class="customer-rel-table-c">
        <h4 class="rel-table-title">客户联系人</h4>
        <el-table
          class="rel-table"
          :data="khlxrData"
          border
          stripe
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="pagetype==2" type="selection" width="55" :selectable="ifUsebled">
          </el-table-column>
          <el-table-column align="center" label="抬头" prop="lxrtitle" width="80"></el-table-column>
          <el-table-column
            align="center"
            label="姓名"
            prop="jobname"
            width="130"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="khlxrEditIndex !== scope.$index">{{ scope.row.jobname }}</span>
              <el-input v-else v-model="scope.row.jobname" placeholder="姓名" class="input-required"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机"
            prop="phone"
            width="170"
            :show-overflow-tooltip="true"
            :formatter="tableCellEmptyFormat"
          >
            <template slot-scope="scope">
              <span v-if="khlxrEditIndex !== scope.$index">{{ scope.row.phone }}</span>
              <el-input v-else v-model="scope.row.phone" placeholder="手机"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="电话"
            prop="mobile"
            width="170"
            :show-overflow-tooltip="true"
            :formatter="tableCellEmptyFormat"
          >
            <template slot-scope="scope">
              <span v-if="khlxrEditIndex !== scope.$index">{{ scope.row.mobile }}</span>
              <el-input v-else v-model="scope.row.mobile" placeholder="电话"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="邮箱" prop="email" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <a
                v-if="khlxrEditIndex !== scope.$index"
                :href="'mailto:'+scope.row.email"
              >{{ scope.row.email }}</a>
              <el-input v-else v-model="scope.row.email" placeholder="邮箱" class="input-required"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200">
            <template slot="header" slot-scope="scope">
              <el-input
                class="rel-table-search-input"
                v-model="lxrSearchText"
                size="mini"
                placeholder="输入关键字搜索"
              ></el-input>
            </template>
            <div class="edit-btn-c" slot-scope="scope">
              <template v-if="khlxrEditIndex !== scope.$index">
                <el-button size="mini" type="primary" @click="khlxrEditIndex = scope.$index">修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="scope.row.lxrtitle === '客服'"
                  @click="deleteKhlxr(scope.$index, scope.row.guid)"
                >删除</el-button>
              </template>
              <template v-else>
                <el-button size="mini" type="primary" @click="saveEditingKhlxr">保存</el-button>
                <el-button size="mini" @click="cancelEditKhlxr">取消</el-button>
              </template>
            </div>
          </el-table-column>
        </el-table>

        <div class="footer-btn-c">
          <el-button type="primary" @click="sendMsg" v-if="pagetype==2">发送邮件</el-button>
          <el-button type="primary" @click="addKhlxr = true">新增联系人</el-button>
          <el-button type="primary" @click="saveKhlxr">保存</el-button>
        </div>
      </div>
    </div>

    <div v-show="activeLxrss == 1">
      <!-- 合并我司联系人，不区分销售站操作站 -->
      <!-- {{wsLxrAllData}}
<br>
      {{wslxrData.concat(xszlxrData, czzlxrData)}}-->
      <commonTable
        :head="tableHead"
        title="我司联系人"
        :tableData="wsLxrAllData"
        :isMultiSelect="pagetype==2"
      >
        <template slot="email" slot-scope="props">
          <a :href="'mailto:'+props.data.value">{{props.data.value}}</a>
        </template>
      </commonTable>

<div style="margin-top:25px;text-align:right">
          <el-button type="primary" @click="sendMsg" v-if="pagetype==2">发送邮件</el-button>

</div>
      <!-- <commonTable v-if="!bzcz" :head="tableHead" title="销售站联系人" style="margin-top:18px;" :tableData="xszlxrData">
        <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
      </commonTable>
      <commonTable v-if="!bzcz" :head="tableHead" title="操作站联系人" style="margin-top:18px;" :tableData="czzlxrData">
        <template slot="email" slot-scope="props"><a :href="'mailto:'+props.data.value">{{props.data.value}}</a></template>
      </commonTable>-->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mawbguid: [Number, String],
    zdsid: [Number, String],
    orderdom:String,
    inputModelData: Object,
    pagetype: {
      type: [Number, String],
      default: 1 // 如果传2,代表预打印中的发送并打印，需要发送联系人
    }
  },
  data() {
    return {
      relList: [],
      tableHead: [
        { title: "抬头", field: "lxrtitle", width: "150px" },
        { title: "姓名", field: "jobname", width: "150px" },
        { title: "联系电话", field: "mobile", width: "180px" },
        { title: "邮箱", field: "email" }
      ],
      tableData: [],
      lxrSearchText: "",
      khlxrEditIndex: null, // null:不修改, index:修改
      backupKhlxrEditData: {},
      addKhlxr: false, // 新增联系人
      addKhlxrIndex: 0, // 新增联系人的index，防止添加后数据错乱

      deletedKhlxr: [], // 删除后的客户联系人，需要保存下来调接口用

      activeLxrss: 2,
      wsLxrAllData: [],
      checkTableData:[],
      comContact:''
    };
  },
  watch: {
    lxrSearchText() {
      this.khlxrEditIndex = null;
    },
    khlxrEditIndex(val) {
      if (val !== this.khlxrData.length - 1) this.addKhlxr = false;
      if (val !== null) {
        // 备份修改前的联系人数据
        this.backupKhlxrEditData.jobname = this.khlxrData[
          this.khlxrEditIndex
        ].jobname;
        this.backupKhlxrEditData.mobile = this.khlxrData[
          this.khlxrEditIndex
        ].mobile;
        this.backupKhlxrEditData.email = this.khlxrData[
          this.khlxrEditIndex
        ].email;
      }
    }
  },
  computed: {
    // 客户联系人
    khlxrData() {
      const searchField = ["jobname", "phone", "mobile", "email"];

      let filteredList = this.relList.filter(item => {
        if (item.lxrss !== 2) return false;

        // 搜索过滤
        if (!this.lxrSearchText) return true;
        for (const field of searchField) {
          if (item[field] && item[field].includes(this.lxrSearchText))
            return true;
        }
        return false;
      });

      if (this.addKhlxr) {
        filteredList.push({
          addindex: ++this.addKhlxrIndex,
          fid: this.inputModelData.fid,
          sid: this.inputModelData.guid,
          boguid: this.inputModelData.boguid,
          invoiceid: 0,
          jobname: "",
          email: "",
          operateType: "new",
          comxz: 1,
          lxrss: 2,
          lxrtitle: "操作",
          department: "操作",
          post: "操作",
          mobile: "",
          phone: ""
        });

        this.khlxrEditIndex = filteredList.length - 1;
      }

      return filteredList;
    },
    // 我司联系人
    wslxrData() {
      return this.relList.filter(item => {
        return (
          item.lxrss == 1 &&
          item.lxrtitle !== "销售" &&
          item.lxrtitle !== "客服" &&
          item.lxrtitle !== "财务" &&
          item.lxrtitle !== "结算"
        );
      });
    },
    // 销售站联系人
    xszlxrData() {
      return this.relList.filter(item => {
        return item.lxrss == 4;
      });
    },
    // 操作站联系人
    czzlxrData() {
      return this.relList.filter(item => {
        if (this.inputModelData.area === this.conditionalAreaForBuild && item.lxrtitle === "操作人")
          return false;
        // 本站操作时，隐藏销售站联系人，并将上榜人归纳为操作站联系人
        // if (this.bzcz && item.lxrtitle == '上榜人') {
        //   return true
        // }
        return item.lxrss == 3;
      });
    },
    // 本站操作时不显示销售站联系人
    bzcz() {
      return (
        this.inputModelData.childguid == "-1" &&
        this.inputModelData.orderguid == "-1"
      );
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.checkTableData = val;
    },
    ifUsebled(row,index){
     // console.log(row)
       return !!(row.email&&row.email.replace(' ',''))

    },
    sendMsg() {
      let url=this.orderdom!='分单'?'api/ExHpoAxplineMawbDocSendEmail':'api/ExAxplineHawbDocSendEmail'
      let checkTableData=this.checkTableData.concat(this.wsLxrAllData.filter(i=>i.checked))
      let mail=checkTableData.map(i=>i.email).filter(i=>i&&i!=' ').toString();
       if(!localStorage.userEmail){
        return this.$message.error('无登录人邮箱地址');
      }
      if(!mail){
        return this.$message.error('请选择联系人');
      }
      this.$axios({
        method: "put",
        url: this.$store.state.webApi + url,
        data: { sid: this.zdsid, mail:mail,ccmail:localStorage.userEmail},
        loading: true,
        tip: false,
        noarea:true,
      }).then(results => {
            console.log(results)
            if(results.data.resultstatus==0){
               this.$message.success(results.data.resultmessage);
               this.$emit('sendEmailSuccess',true)
            }else{
               this.$message.error(results.data.resultmessage);
            }
      });
    },
    getInfoFunc() {
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExHpoAxplineRel",
        params: { sid: this.mawbguid, boguid: this.inputModelData.boguid },
        loading: false,
        tip: false
      }).then(results => {
        this.relList = results.data;
      });
    },
    tableCellEmptyFormat(row, column, cellValue, index) {
      return cellValue || "--";
    },
    saveEditingKhlxr() {
      if (!this.khlxrData[this.khlxrEditIndex].jobname) {
        return this.$message.error("请输入姓名");
      }
      if (!this.khlxrData[this.khlxrEditIndex].email) {
        return this.$message.error("请输入邮箱");
      }
      if (
        !this.khlxrData[this.khlxrEditIndex].phone &&
        !this.khlxrData[this.khlxrEditIndex].mobile
      ) {
        return this.$message.error("手机和电话必须填写其中一项");
      }

      // 新增
      if (
        this.khlxrData[this.khlxrEditIndex].addindex === this.addKhlxrIndex &&
        this.addKhlxr === true
      ) {
        // 添加到联系人数据中
        this.relList.push(this.khlxrData[this.khlxrEditIndex]);
        this.addKhlxr = false;
      } else if (this.khlxrData[this.khlxrEditIndex].guid) {
        // 修改
        this.khlxrData[this.khlxrEditIndex].operateType = "edit";
      }

      this.khlxrEditIndex = null;
    },
    deleteKhlxr(index, guid) {
      this.$confirm("是否删除客户联系人？", "删除", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.khlxrData[index].guid) {
          this.khlxrData[index].operateType = "delete";
          this.deletedKhlxr.push(this.khlxrData[index]);

          for (let i in this.relList) {
            if (this.relList[i].guid === this.khlxrData[index].guid) {
              this.relList.splice(i, 1);
              break;
            }
          }
        } else if (this.khlxrData[index].addindex) {
          for (let i in this.relList) {
            if (this.relList[i].addindex === this.khlxrData[index].addindex) {
              this.relList.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    cancelEditKhlxr() {
      this.khlxrData[
        this.khlxrEditIndex
      ].jobname = this.backupKhlxrEditData.jobname;
      this.khlxrData[
        this.khlxrEditIndex
      ].mobile = this.backupKhlxrEditData.mobile;
      this.khlxrData[
        this.khlxrEditIndex
      ].email = this.backupKhlxrEditData.email;
      this.khlxrEditIndex = null;
    },
    saveKhlxr() {
      let list = this.khlxrData
        .filter(item => item.operateType)
        .concat(this.deletedKhlxr);
      let data = { list };

      this.$axios({
        method: "post",
        url: this.$store.state.webApi + "api/CustomerRel/editOrderRelMultiple",
        data,
        loading: true,
        tip: true,
        noarea: true
      }).then(result => {
        this.getInfoFunc();
      });
    },
    addNewCon(row){
      if(row.jobname){
      this.wsLxrAllData.push({
        lxrtitle:row.post,
        jobname:row.jobname,
        mobile:row.longmobile,
        email:row.email,
        defaultChecked:true
      })
      }
    }
  },
  created() {
    this.getInfoFunc();
    this.$watch(
      () => {
        return this.wslxrData + this.xszlxrData + this.czzlxrData;
      },
      () => {
        this.wsLxrAllData = [
          ...this.wslxrData,
          ...this.xszlxrData,
          ...this.czzlxrData
        ];
      }
    );
  }
};
</script>

<style scoped lang="less">
.divItem {
  border: 1px solid #e8e8e8;
  margin-bottom: 15px;
  .nodedom:last-child {
    border-bottom: none;
  }
  /deep/ .el-date-editor--datetime .el-input__inner {
    padding: 0px;
    font-size: 12px;
    text-indent: 4px;
  }
  /deep/ .el-input__prefix,
  .el-input__suffix {
    display: none;
  }
}
.nodedom {
  display: flex;
  overflow: hidden;
  border-bottom: 1px solid #e8e8e8;
  .domtitle {
    display: flex;
    align-items: center;
    margin: 0 20px;
    font-size: 16px;
    min-width: 40px;
  }
  .item {
    i {
      margin-right: 14px;
      display: inline-block;
      font-size: 20px;
    }
    display: flex;
    align-items: center;
    margin-right: 12px;
    margin: 10px 0px;
    min-width: 170px;
  }
}

.mawbContacts {
  position: relative;
  margin-bottom: 25px;
  .rel-title {
    margin-bottom: 20px;
    h3 {
      display: inline-block;
      font-size: 18px;
      color: #999;
      margin-right: 20px;
      cursor: pointer;
    }
    .active {
      color: #0f5a8c;
    }
  }
  .customer-rel-table-c {
    margin-top: 20px;
    .rel-table-title {
      border: 1px solid #e8e8e8;
      padding: 6px;
      background-color: #f8f8f8;
      font-weight: normal;
      color: #333;
    }
    /deep/ .rel-table {
      border-left: 1px solid #e8e8e8;
      font-size: 12px;
      color: #333;
      thead {
        color: #333;
        .cell {
          font-weight: normal;
        }
      }
      td {
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
      }
      .cell {
        line-height: 15px;
      }
      .rel-table-search-input {
        // width: 150px;
        line-height: 26px;
      }
      .edit-btn-c .el-button {
        padding: 6px 20px;
      }
    }
  }
  .footer-btn-c {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
  }
}
</style>
