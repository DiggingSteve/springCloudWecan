<template>
  <div style="position:relative;display:inline-block" class="wtxmColor">
    <!-- 委托项目 -->
    <!-- {{mawbinfo.zdtzrId}} -->

    <div @click.stop=";">
      <el-input v-model="tableDataName2" @focus="hawbShuJu" @keyup.native="filter2" style="width:280px;"
        @blur="clearNowValue" :placeholder="type=='1'?'收货人查询':type=='2'?'发货人查询':'通知人查询'">
        <i slot="prefix" class="el-input__icon el-icon-search" style="margin-top:-5px;"></i>
      </el-input>

      <el-button style="margin-left:10px;" @click="hawbData" v-show="!hideBtn">保存</el-button>
      <el-button style="margin-left:10px;" @click="assignmentData()" v-show="!hideBtn">清除</el-button>
    </div>
    <!--     <el-button type="primary" @click="openData">展示数据</el-button>   -->

    <div v-show="showDetail" class="infoPane" @click.stop=";">
      <el-table :data="tableDataN2" border height="262" :fit="false" 
        @row-click="select2" id="receiveTable">
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click.stop="delRowData(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="usr_code" label="通知人" width="180"></el-table-column>
        <el-table-column prop="companytitle" label="抬头" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" label="地址" width="276" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="companycode" label="国家二字码" width="90"></el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
          :current-page="currentPage2" :page-sizes="[10, 30, 50]" :page-size="pageSize2"
          layout="total, sizes, prev, pager, next, jumper" :total="totalItems2"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { Notification } from "element-ui";

  export default {

    props: {
      area: {
        type: String,
        default: ""
      },
      gid: [Number, String],
      type: Number,
      mawbinfo: Object,
      model: [Number, String],
      hideBtn: {
        type: Boolean,
        default: false
      },
      dom: {
        type: String | Boolean,
        default: 1
      }
    },
    data() {
      return {
        tableDataS2: [],
        tableDataName2: "", //加载时此值为数据model值
        tableDataN2: [],
        currentPage2: 1,
        pageSize2: 10,
        totalItems2: 0,
        filterTableDataEnd2: [],
        flag2: false,
        showDetail: false,
        searchField: {}
      };
    },

    methods: {
      //是去焦点没有数据清空
      clearNowValue() {
        if (this.tableDataN2.length == 0) {
          this.tableDataName2 = "";
          this.showDetail = false;
          this.filter2();
        }
      },
      getField(field) {
        return this.dom == 1 ? field : field.replace('_mawb', '_hawb')
      },
      select2(row, event, column) {

        this.tableDataName2 = row.usr_code;

        // this.$emit('rsdata',row)
        this.assignmentData(row)

        this.showDetail = false;
      },
      closeDetail() {
        this.showDetail = false;
      },
      filter2() {
        if (this.tableDataName2 == " ") {
          //console.log(this.tableDataName2)
          this.flag2 = false;
        } else {
          this.tableDataN2 = [];
          this.filterTableDataEnd2 = [];
          this.tableDataS2.forEach((value, index) => {
            if (value.usr_code) {
              if (
                value.usr_code.indexOf(this.tableDataName2.toUpperCase()) >= 0 ||
                value.address.indexOf(this.tableDataName2.toUpperCase()) >= 0 ||
                value.companytitle.indexOf(this.tableDataName2.toUpperCase()) >= 0
              ) {
                this.filterTableDataEnd2.push(value);
              }
            }
          });
          ////console.log( JSON.stringify(this.filterTableDataEnd))

          this.currentPage2 = 1;
          this.totalItems2 = this.filterTableDataEnd2.length;
          // //console.log(this.totalItems)
          // this.tableDataN= this.filterTableDataEnd
          this.tableDataN2 = this.filterTableDataEnd2.slice(
            (this.currentPage2 - 1) * this.pageSize2,
            this.currentPage2 * this.pageSize2
          );

          this.flag2 = true;
        }
      },

      handleSizeChange2(val) {
        ////console.log(`每页 ${val} 条`);
        this.pageSize2 = val;
        //console.log((this.currentPage2 - 1) * this.pageSize2)
        //console.log(val)
        if (!this.flag2) {
          this.tableDataN2 = this.tableDataS2.slice(
            (this.currentPage2 - 1) * val,
            val * this.currentPage2
          );
        } else {
          this.tableDataN2 = this.filterTableDataEnd2.slice(
            (this.currentPage2 - 1) * val,
            val * this.currentPage2
          );
        }
      },
      handleCurrentChange2(val) {
        this.currentPage2 = val;

        if (!this.flag2) {
          this.tableDataN2 = this.tableDataS2.slice(
            (val - 1) * this.pageSize2,
            this.pageSize2 * val
          );
        } else {
          this.tableDataN2 = this.filterTableDataEnd2.slice(
            (val - 1) * this.pageSize2,
            this.pageSize2 * val
          );
        }
      },
      hawbShuJu() {
        // console.log(this.searchField);
        //alert(type)
        this.showDetail = true;

        var that = this;
        var search = this.searchField;

        if (!search.mdg || !search.gid || !search.area || search.area.split(',').length != 1 || search.mdg.length < 2) {
          return;
        }

        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubCustomZd",
          params: search,
          loading: false,
          tip: false
        })
          .then(response => {
            // console.log(response.data);

            that.tableDataS2 = response.data;
            that.totalItems2 = that.tableDataS2.length;
            // //console.log(that.tableDataS2)
            if (that.totalItems2 > that.pageSize2) {
              for (let index = 0; index < that.pageSize2; index++) {
                that.tableDataN2.push(that.tableDataS2[index]);
              }
            } else {
              that.tableDataN2 = that.tableDataS2;

              ////console.log(this.hawbInfo[this.type].model)
            }
            ////console.log()
            that.tableDataName2 = tableDataS2.usr_code;
          })
          .catch(error => { });
        //that.hawbInfo[0].model
      },
      hawbData() {
        //保存
        var hw = this.mawbinfo;

        var json = {};
        var method;
        if (this.tableDataName2) {
          method = "put";
        } else {
          method = "post";
        }

        json = {
          codetype: 3,
          ready01: 1,
          mdg: hw.mdg,
          gid: this.gid,
          companytitle: hw[this.getField('companytitle_tzr_mawb')],
          address: hw[this.getField('address_tzr_mawb')],
          city: hw[this.getField('city_tzr_mawb')],
          postcode: hw[this.getField('postcode_tzr_mawb')],
          companycode: hw[this.getField('companycode_tzr_mawb')],
          state: hw[this.getField('state_tzr_mawb')],
          lxr: hw[this.getField('lxr_tzr_mawb')],
          phone: hw[this.getField('phone_tzr_mawb')],
          email: hw[this.getField('email_tzr_mawb')],
          fax: hw[this.getField('fax_tzr_mawb')]
        };

        if (method == "put") {
          json.modifyman = localStorage.getItem("usrname");
          json.id = this.tableDataN2.filter(
            i => i.usr_code == this.mawbinfo[this.getField('code_tzr_mawb')]
          )[0].id;
        } else if (method == "post") {
          json.id = "-1";
        }
        json.area = this.area || this.$store.state.areaState;
        if (!json.gid) {
          this.$message.error("请填写委托客户");
          return false;
        }

        if (!json.mdg) {
          this.$message.error("请填写港口");

          return false;
        }

        if (!json.companytitle) {
          this.$message.error("请输入抬头");

          return false;
        }

        if (!json.address) {
          this.$message.error("请输入地址");

          return false;
        }

        if (!json.companycode) {
          this.$message.error("请输入二字码");

          return false;
        }

        if (!json.city) {
          this.$message.error("请输入城市名");

          return false;
        }

        this.$axios({
          method: method,
          url: this.$store.state.publicWebApi + "api/PubCustomZd",
          data: json,
          loading: true,
          tip: true
        })
          .then(results => {
            //console.log(results.data.resultstatus)
            if (results.data.resultstatus == 0) {
              //  this.hawbShuJu();
            }
          })
          .catch(error => { });
      },
      delRowData(data) {
        //console.log(data)
        this.$confirm("是否删除此数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios({
              method: "put",
              url: this.$store.state.publicWebApi + "api/PubCustomZd",
              data: {
                id: data.id,
                isdel: "2",
                area: this.area || this.$store.state.areaState
              }
            })
              .then(results => {
                if (results.data.resultstatus == 0) {
                  this.$message.success("删除成功");
                  // this.hawbShuJu();
                  if (data.usr_code == this.mawbinfo[this.getField('code_tzr_mawb')]) {
                    this.assignmentData();
                  }
                }
              })
              .catch(error => { });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      assignmentData(row) {
        row = row || {}
        this.mawbinfo[this.getField('code_tzr_mawb')] = row.usr_code || "";
        this.mawbinfo[this.getField('companytitle_tzr_mawb')] = row.companytitle || "";
        this.mawbinfo[this.getField('address_tzr_mawb')] = row.address || "";
        this.mawbinfo[this.getField('city_tzr_mawb')] = row.city || "";
        this.mawbinfo[this.getField('postcode_tzr_mawb')] = row.postcode || "";
        this.mawbinfo[this.getField('companycode_tzr_mawb')] = row.companycode || "";
        this.mawbinfo[this.getField('state_tzr_mawb')] = row.state || "";
        this.mawbinfo[this.getField('lxr_tzr_mawb')] = row.lxr || "";
        this.mawbinfo[this.getField('phone_tzr_mawb')] = row.phone || "";
        this.mawbinfo[this.getField('email_tzr_mawb')] = row.email || "";
        this.mawbinfo[this.getField('fax_tzr_mawb')] = row.fax || "";
        this.mawbinfo[this.getField('taxcode_tzr_mawb')] = row.taxcode || "";
      }
    },
    computed: {},

    mounted() { },
    created() {
      this.$watch(
        function () {
          return this.mawbinfo.mdg + this.gid;
        },
        function (val) {
          this.searchField = {
            type: 1,
            mdg: this.mawbinfo.mdg,
            gid: this.gid,
            codetype: 3,
            area: this.area
          };
          //  this.hawbShuJu();
        },
        { immediate: true }
      );
    },
    watch: {
      showDetail(value) {
        if (value) {
          document.body.addEventListener("click", this.closeDetail);
        } else {
          document.body.removeEventListener("click", this.closeDetail);
        }
      },
      tableDataName2(value) {

        if (!value) {
          // this.assignmentData();
        }
      },
      model(value) {
        //设默认值
        this.tableDataName2 = value;
      }
    }
  };
</script>
<style scoped lang="less">
  .infoPane {
    position: absolute;
    top: 30px;
    left: 0px;
    height: 300px;
    z-index: 99;
    max-width: 800px;
    border: 1px solid #e8e8e8;
    background: #fff;
    box-shadow: 4px 5px 5px #ccc;
    font-size: 12px;
    overflow: hidden;
  }

  .infoPane>div {
    font-size: 12px;
  }

  .input-content input {
    min-width: 80px;
  }

  .el-pagination__editor {
    width: 20px;
  }

  .el-pagination {
    height: 40px;
    padding: 5px 5px;
  }

  .pagination input {
    box-shadow: none;
    border: 1px solid #20a0ff;
  }

  .pagination .el-pagination .el-select .el-input {
    width: 80px;
  }

  .pagination .page-container-box .el-input__inner {
    width: 80px !important;
  }

  #receiveTable .el-table__body-wrapper,
  #receiveTable .el-table__footer-wrapper,
  #receiveTable .el-table__header-wrapper {
    max-width: 800px !important;
  }

  #receiveTable .el-table__body,
  #receiveTable .el-table__footer,
  #receiveTable .el-table__header {
    table-layout: fixed !important;
  }
</style>