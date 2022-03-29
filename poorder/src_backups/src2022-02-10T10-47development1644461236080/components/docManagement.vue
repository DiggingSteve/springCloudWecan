<template>
  <div>
    <div class="page-container-box">
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :pageshow.sync="pageshow" :chinese-where.sync="chineseWhere" :pagetype="1"
        @reset="reset"></newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <el-button @click="openDialog(-1)">文档上传</el-button>
        <!-- <el-button @click="send()">预发送</el-button> -->
        <a :href="sendMail"
          style="width:76px;height:28px;text-align:center;line-height:28px;background:#0f5a8c;margin-left: 10px;display:inline-block;color:#fff;border-radius:3px;"
          @click="getMail()">预发送</a>

      </div>
    </div>
    <tableCompt :name="name" :table-data-res="tableDataRes" @transSelIndex="openDialog" :nestedTableType="2"
      v-on:transmitMsg="getZimessage" expansionSubcolumn="batchno" :ziTableData="ziTableData"
      :chinese-where="chineseWhere" showZiConfig :showTotal="showTotal">
      <template slot="operate" slot-scope="props">
        <span>
          <!-- <i class="el-icon-delete" title="删除"
            :icondisabled="autouploadArr.includes(props.data.row.typename)||props.data.row.docstatusNumber==2"
            @click="piliangDel(props.data.row.batchno)"></i> -->
          <i class="el-icon-delete" title="删除" :icondisabled="props.data.row.bgguid>0"
            @click="piliangDel(props.data.row.batchno)"></i>
          <i class="el-icon-download" title="下载" @click="piliangDownload(props.data.row.id)"></i>
        </span>
      </template>
      <template slot="rel_filename" slot-scope="props">
        <span style="cursor:pointer;color:#1a7dbf" :class="{underlineRred:props.data.index==selectTableIndex}"
          @click="openDialog(props.data.index)">{{props.data.value}}</span>
      </template>

      <template slot="batchno" slot-scope="props">
        <span style="cursor:pointer;color:#1a7dbf" :class="{underlineRred:props.data.index==selectTableIndex}"
          @click="openDialog(props.data.index)">{{props.data.value}}</span>
      </template>
      <!-- <template slot="docstatus" slot-scope="props">
        {{props.data.value}}<i v-if="props.data.row.bgguid>0" class="el-icon-s-promotion"></i>
      </template> -->
    </tableCompt>
    <!-- <docImage></docImage> -->
    <docUpload :dialogShow.sync="dialogShow" :modelData.sync="tableDataRes[selectTableIndex]" pagetype="1"
      :selectTableIndex="selectTableIndex" v-if="dialogShow" @success="search"></docUpload>
  </div>
</template>
<script>
  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate,
    getValByGrouid,
  } from "../api/localStorage.js";

  import { docUploadMixin } from '@/components/mixins/docUploadMixin'
  import { openZimessage, searchCmptMixins } from "@/components/mixins/topPageMixin";

  export default {
    name: "docManagement",
    components: {  },
    mixins: [docUploadMixin(2), openZimessage, searchCmptMixins],
    data() {
      return {
        name: "docManagement.vue",
        dialogShow: false,
        tableDataRes: [],
        ziTableData: [],
        inputViewData: {
          adddate: {
            title: "创建日期",
            type: 15,
            fieldtype: 2,
            defaultVal: true,
          },
        },
        inputModelData: {},
        autouploadArr: [],
        selectTableIndex: -1,
        sendMail: 'javascript:void(0)',//outlook地址
      };
    },

    methods: {
      search() {
        this.tableDataRes = [];
        this.ziTableData = [];
        this.selectTableIndex = -1;
        this.searchData.docstatus = { 'unequal': 2 }
        let jsonArr2 = {
          where: this.searchData,
          // order: "adddate desc,khjcno asc",
          order: "khjcno desc,adddate desc",
        };
        jsonArr2.where.dom = "kcdoc";

        let json = { json: JSON.stringify(jsonArr2) };

        this.$axios({
          method: "get",
          url: this.$store.state.imageWebApi + "api/RankDoc",
          params: json,
          loading: true,
          tip: false,
          nofield: true,
        })
          .then((results) => {
            //console.log(results)
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }
            // let data = results.data.map(i => {
            //   if (!i.bggys) {
            //     i.checkDisabled = true;
            //   }
            //   return i
            // })

            this.tableDataRes = getChangeValue(results.data, "空出");
          })
          .catch((errors) => { });
      },
      openDialog(indexData) {
        // alert(indexData);
        if (!this.$store.state.areaState || this.$store.state.areaState.includes(",")) {
          return this.$message.error('请选择有且仅有一个站点！');
        }
        this.selectTableIndex = indexData;
        this.dialogShow = true;
      },
      getZimessage(data) {
        // console.log(data)
        let list = this.tableDataRes[data.index].list
        list.forEach(i => {
          i.docstatus = i.docstatus == 1 ? '已上传' : '已预发送'
        })
        this.ziTableData = list
      },
      piliangDel(id) {
        let ids = "";
        if (!id) {
          ids = this.docList
            .filter((i) => i.checked)
            .map((i) => i.batchno)
            .toString();
          if (!ids) {
            this.$message.error("请先选择文件!");
            return false;
          }
        } else {
          ids = id;
        }

        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            method: "delete",
            url: this.$store.state.imageWebApi + "api/PdDoc",
            data: {
              batchno: ids
            },
            loading: true,
            tip: false,
          }).then((results) => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              this.search()
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        });
      },

    },
    watch: {},
    created() {
      this.$axios({
        method: "get",
        url: this.$store.state.imageWebApi + "api/RankDoc",
        params: {},
        loading: true,
        tip: false,
      }).then((res) => {
        // console.log(res);
        let arr = []
        res.data.forEach(i => {
          i.typelist.forEach(e => {
            if (e.autoupload == 1) {
              arr.push(e.typename)
            }
          })
        })
        this.autouploadArr = arr
      });
    },
    computed: {
      checkedids() {
        return this.tableDataRes.filter(i => i.checked).map(i => i.id).toString()
      }
    }
  };
</script>


<style scoped lang="less">
  a:hover {
    background: #0d4c77 !important
  }
</style>