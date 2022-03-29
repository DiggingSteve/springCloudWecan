<template>
  <div style="position:relative;display:inline-block">
    <!-- {{mawbinfo.pageSign}} -->
    <!-- {{tableDataN}} -->
    <!-- 委托项目 -->
    <div @click.stop=";">
      <el-input v-model.trim="tableDataName" @focus="hawbShuJu" @keyup.native.stop="filter2" @blur="clearNowValue"
        style="width:280px;" :placeholder="type=='2'?'收货人查询':'发货人查询'">
        <i slot="prefix" class="el-input__icon el-icon-search" style="margin-top:-5px;"></i>
      </el-input>
      <el-button style="margin-left:10px;" @click="saveFunc" v-show="!hideBtn">保存</el-button>
      <el-button style="margin-left:10px;" @click="assignmentData()" v-show="!hideBtn">清除</el-button>
    </div>

    <!--     <el-button type="primary" @click="openData">展示数据</el-button>   -->

    <div v-show="showDetail" class="infoPane" @click.stop=";">
      <el-table :data="tableDataN" border height="262" @row-click="select2" id="receiveTable">
        <el-table-column label="操作" width="50" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click.stop="delRowData(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column prop="usr_code" :label="type=='2'?'收货人':'发货人'" width="180"></el-table-column>
        <el-table-column prop="companytitle" label="抬头" width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" label="地址" width="276" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="companycode" label="国家二字码" width="90"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5,10,30,50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      area: {
        type: String,
        default: ""
      },
      gid: [Number, String],
      type: [Number, String], //2收货人 1发货人
      dom: [Number, String], //1总单 2分单
      mawbinfo: Object,
      model: [Number, String],
      hideBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        tableData: [],
        tableDataName: "", //加载时此值为数据model值
        tableDataN: [],
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        filterTableDataEnd: [],
        flag: false,
        showDetail: false,
        searchField: {}
      };
    },

    methods: {
      //失去焦点没有数据清空
      clearNowValue() {
        if (this.tableDataN.length == 0) {
          this.tableDataName = '';
          this.showDetail = false;
          this.filter2();
        }
      },

      select2(row, event, column) {
        this.tableDataName = row.usr_code;
        this.assignmentData(row);
        this.showDetail = false;
      },
      closeDetail() {
        this.showDetail = false;
      },
      filter2() {
        if (!this.tableDataName) {
          //console.log(this.tableDataName)
          this.flag = false;
        } else {
          this.tableDataN = [];
          this.filterTableDataEnd = [];
          this.tableData.forEach((value, index) => {
            if (value.usr_code) {
              if (
                value.usr_code.indexOf(this.tableDataName.toUpperCase()) >= 0 ||
                value.address.indexOf(this.tableDataName.toUpperCase()) >= 0 ||
                value.companytitle.indexOf(this.tableDataName.toUpperCase()) >= 0
              ) {
                this.filterTableDataEnd.push(value);
              }
            }
          });
          ////console.log( JSON.stringify(this.filterTableDataEnd))

          this.currentPage = 1;
          this.totalItems = this.filterTableDataEnd.length;
          // this.tableDataN= this.filterTableDataEnd
          this.tableDataN = this.filterTableDataEnd.slice(
            (this.currentPage - 1) * this.pageSize,
            this.currentPage * this.pageSize
          );
          if (this.tableDataN.length > 0) {
            this.flag = true;
          } else {
            this.flag = false;
            // this.assignmentData()
          }
        }
      },

      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        //console.log((this.currentPage - 1) * this.pageSize)
        //console.log(val)
        if (!this.flag) {
          this.tableDataN = this.tableData.slice(
            (this.currentPage - 1) * val,
            val * this.currentPage
          );
        } else {
          this.tableDataN = this.filterTableDataEnd.slice(
            (this.currentPage - 1) * val,
            val * this.currentPage
          );
        }
      },
      handleCurrentChange(val) {
        this.currentPage = val;

        if (!this.flag) {
          this.tableDataN = this.tableData.slice(
            (val - 1) * this.pageSize,
            this.pageSize * val
          );
        } else {
          this.tableDataN = this.filterTableDataEnd.slice(
            (val - 1) * this.pageSize,
            this.pageSize * val
          );
        }
      },
      async hawbShuJu() {
        this.showDetail = true;
        let search = this.searchField;

        if (!search.mdg || !search.gid || search.mdg.length < 2) {
          // console.log('无始发港,委托客户,地域')
          return;
        }
        await this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubCustomZd",
          params: search,
          loading: false,
          tip: false
        })
          .then(response => {
            this.tableData = response.data;
            this.totalItems = this.tableData.length;

            // //console.log(that.tableData)
            if (this.totalItems > this.pageSize) {
              for (let index = 0; index < this.pageSize; index++) {
                this.tableDataN.push(this.tableData[index]);
              }
            } else {
              this.tableDataN = this.tableData;
            }
            ////console.log()
            // this.tableDataName = tableData.usr_code;
          })
      },
      saveFunc() {
        if (this.tableDataName && this.tableDataN.length == 0) {
          this.hawbShuJu().then(res => {
            this.hawbData();
          });
        } else {
          this.hawbData();
        }
      },
      hawbData() {
        //保存
        var hw = this.mawbinfo;

        var json = {};
        var method;
        if (this.tableDataName) {
          method = "put";
        } else {
          method = "post";
        }
        //发货人 codetype:1  收货人codetype:2 ,ready01: 1总单 2分单
        if (this.type == 2) {
          if (this.dom == 1) {
            json = {
              codetype: this.type,
              ready01: this.dom,
              mdg: hw.mdg,
              gid: this.gid,
              companytitle: hw.companytitle_shr_mawb,
              address: hw.address_shr_mawb,
              city: hw.city_shr_mawb,
              postcode: hw.postcode_shr_mawb,
              companycode: hw.companycode_shr_mawb,
              state: hw.state_shr_mawb,
              lxr: hw.lxr_shr_mawb,
              phone: hw.phone_shr_mawb,
              email: hw.email_shr_mawb,
              fax: hw.fax_shr_mawb,
              taxcode: hw.taxcode_shr_mawb
            };
          } else {
            json = {
              codetype: this.type,
              ready01: this.dom,
              mdg: hw.mdg,
              gid: this.gid,
              companytitle: hw.companytitle_shr_hawb,
              address: hw.address_shr_hawb,
              city: hw.city_shr_hawb,
              postcode: hw.postcode_shr_hawb,
              companycode: hw.companycode_shr_hawb,
              state: hw.state_shr_hawb,
              lxr: hw.lxr_shr_hawb,
              phone: hw.phone_shr_hawb,
              email: hw.email_shr_hawb,
              fax: hw.fax_shr_hawb,
              taxcode: hw.taxcode_shr_hawb
            };
          }
        } else {
          if (this.dom == 1) {
            json = {
              codetype: this.type,
              ready01: this.dom,
              mdg: hw.sfg,
              gid: this.gid,
              companytitle: hw.companytitle_fhr_mawb,
              address: hw.address_fhr_mawb,
              city: hw.city_fhr_mawb,
              postcode: hw.postcode_fhr_mawb,
              companycode: hw.companycode_fhr_mawb,
              state: hw.state_fhr_mawb,
              lxr: hw.lxr_fhr_mawb,
              phone: hw.phone_fhr_mawb,
              email: hw.email_fhr_mawb,
              fax: hw.fax_fhr_mawb,
              taxcode: hw.taxcode_fhr_mawb
            };
          } else {
            json = {
              codetype: this.type,
              ready01: this.dom,
              mdg: hw.sfg,
              gid: this.gid,
              companytitle: hw.companytitle_fhr_hawb,
              address: hw.address_fhr_hawb,
              city: hw.city_fhr_hawb,
              postcode: hw.postcode_fhr_hawb,
              companycode: hw.companycode_fhr_hawb,
              state: hw.state_fhr_hawb,
              lxr: hw.lxr_fhr_hawb,
              phone: hw.phone_fhr_hawb,
              email: hw.email_fhr_hawb,
              fax: hw.fax_fhr_hawb,
              taxcode: hw.taxcode_fhr_hawb
            };
          }
        }

        if (method == "put") {
          json.modifyman = localStorage.getItem("usrname");

          json.id = this.tableDataN.filter(i => i.usr_code == this.CurCode)[0].id;
        } else if (method == "post") {
          json.id = "-1";
        }
        json.area = this.area || this.$store.state.areaState;

        // alert(json.gid)
        if (!json.gid) {
          this.$message.error("请填写委托客户");
          return false;
        }
        if (json.gid == -1 || (json.gid && String(json.gid).includes(','))) {
          this.$message.error("不能保存,委托项目不同！");
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
                  //   this.hawbShuJu();
                  if (data.usr_code == this.CurCode) {
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
        row = row || {};
        if (this.type == 2) {
          if (this.dom == 1) {
            this.mawbinfo.code_shr_mawb = row.usr_code || "";
            this.mawbinfo.companytitle_shr_mawb = row.companytitle || "";
            this.mawbinfo.address_shr_mawb = row.address || "";
            this.mawbinfo.city_shr_mawb = row.city || "";
            this.mawbinfo.postcode_shr_mawb = row.postcode || "";
            this.mawbinfo.companycode_shr_mawb = row.companycode || "";
            this.mawbinfo.state_shr_mawb = row.state || "";
            this.mawbinfo.lxr_shr_mawb = row.lxr || "";
            this.mawbinfo.phone_shr_mawb = row.phone || "";
            this.mawbinfo.email_shr_mawb = row.email || "";
            this.mawbinfo.fax_shr_mawb = row.fax || "";
            if (this.mawbinfo.pageSign != "海关联系单") {
              this.mawbinfo.taxcode_shr_mawb = row.taxcode || "";
            }
          } else {
            this.mawbinfo.code_shr_hawb = row.usr_code || "";
            this.mawbinfo.companytitle_shr_hawb = row.companytitle || "";
            this.mawbinfo.address_shr_hawb = row.address || "";
            this.mawbinfo.city_shr_hawb = row.city || "";
            this.mawbinfo.postcode_shr_hawb = row.postcode || "";
            this.mawbinfo.companycode_shr_hawb = row.companycode || "";
            this.mawbinfo.state_shr_hawb = row.state || "";
            this.mawbinfo.lxr_shr_hawb = row.lxr || "";
            this.mawbinfo.phone_shr_hawb = row.phone || "";
            this.mawbinfo.email_shr_hawb = row.email || "";
            this.mawbinfo.fax_shr_hawb = row.fax || "";
            if (this.mawbinfo.pageSign != "海关联系单") {
              this.mawbinfo.taxcode_shr_hawb = row.taxcode || "";
            }
          }
        } else {
          if (this.dom == 1) {
            this.mawbinfo.code_fhr_mawb = row.usr_code || "";
            this.mawbinfo.companytitle_fhr_mawb = row.companytitle || "";
            this.mawbinfo.address_fhr_mawb = row.address || "";
            this.mawbinfo.city_fhr_mawb = row.city || "";
            this.mawbinfo.postcode_fhr_mawb = row.postcode || "";
            this.mawbinfo.companycode_fhr_mawb = row.companycode || "";
            this.mawbinfo.state_fhr_mawb = row.state || "";
            this.mawbinfo.lxr_fhr_mawb = row.lxr || "";
            this.mawbinfo.phone_fhr_mawb = row.phone || "";
            this.mawbinfo.email_fhr_mawb = row.email || "";
            this.mawbinfo.fax_fhr_mawb = row.fax || "";
            if (this.mawbinfo.pageSign != "海关联系单") {
              this.mawbinfo.taxcode_fhr_mawb = row.taxcode || "";
            }
          } else {
            this.mawbinfo.code_fhr_hawb = row.usr_code || "";
            this.mawbinfo.companytitle_fhr_hawb = row.companytitle || "";
            this.mawbinfo.address_fhr_hawb = row.address || "";
            this.mawbinfo.city_fhr_hawb = row.city || "";
            this.mawbinfo.postcode_fhr_hawb = row.postcode || "";
            this.mawbinfo.companycode_fhr_hawb = row.companycode || "";
            this.mawbinfo.state_fhr_hawb = row.state || "";
            this.mawbinfo.lxr_fhr_hawb = row.lxr || "";
            this.mawbinfo.phone_fhr_hawb = row.phone || "";
            this.mawbinfo.email_fhr_hawb = row.email || "";
            this.mawbinfo.fax_fhr_hawb = row.fax || "";
            if (this.mawbinfo.pageSign != "海关联系单") {
              this.mawbinfo.taxcode_fhr_hawb = row.taxcode || "";
            }
          }
        }
        //this.$emit('rsdata',this.mawbinfo)
      }
    },
    computed: {
      CurCode() {
        if (this.type == 2) {
          if (this.dom == 1) {
            return this.mawbinfo.code_shr_mawb;
          } else {
            return this.mawbinfo.code_shr_hawb;
          }
        } else {
          if (this.dom == 1) {
            return this.mawbinfo.code_fhr_mawb;
          } else {
            return this.mawbinfo.code_fhr_hawb;
          }
        }
      }
    },

    mounted() { },
    created() {
      this.$watch(
        function () {
          return this.mawbinfo.mdg + this.mawbinfo.sfg + this.gid;
        },
        function (val) {
          // console.log(this.mawbinfo.mdg)
          this.searchField = {
            type: this.dom,
            mdg: this.type == 1 ? this.mawbinfo.sfg : this.mawbinfo.mdg,
            gid: this.gid,
            codetype: this.type,
            area: this.area || this.$store.state.areaState
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
      tableDataName(value) {
        if (!value) {
          // this.assignmentData();
        }
      },
      model(value) {
        //设默认值
        this.tableDataName = value;
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
    width: 800px;
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
    width: 800px !important;
  }

  #receiveTable .el-table__body,
  #receiveTable .el-table__footer,
  #receiveTable .el-table__header {
    table-layout: fixed !important;
  }
</style>