//新增页面外网数据
export const orderAddMixin = function (type = 1) {
  return {
    data() {
      return {
        panelDisplay: {
          clause: false, //条款
          thdinfo: false, //提货地信息
          lxrShow: false, //联系人
          expressShow: false //仓库地图
        },
        ckmapUrl: '',
        selServicecode: '',
        reader: false
      }
    },
    methods: {
      async saveMawbInfoOut() {

        let mawbInfo = this.getInfo();
        // console.log(11111111111);
        // console.log(mawbInfo); return;
        if (!mawbInfo) {
          return;
        }

        if (this.pagetype == 1) {
          if (mawbInfo.system == "空出" && mawbInfo.area == '上海') {
            mawbInfo.nodecode = "AO5025";
          } else {
            mawbInfo.nodecode = "AO5020";
          }
          console.log(mawbInfo);
          await this.$axios({
            method: "post",
            url: this.$store.state.webApi + "api/ExHpoAxplineOutsideInsert",
            data: mawbInfo,
            loading: true,
            tip: false
          }).then(results => {
            if (results.data.resultstatus == 0) {
              let str = '';
              if (mawbInfo.isimperfect == 2) {
                str = "预订舱成功" + "，订舱编号为：" + results.data.resultno + ",待唯凯确认后请在\"订单未完善\"页面中完善订舱信息。"
              } else {
                str = "订舱成功" + "，订舱编号为：" + results.data.resultno + "。"
              }
              this.$alert(str, "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.panelDisplay.clause = false;
                  this.outPagestep = 3;
                }
              });
              return true
            } else {
              this.$message.error(results.data.resultmessage);
              return false

            }
          })

        } else {
          await this.$axios({
              method: "put",
              url: this.$store.state.webApi + "api/ExHpoAxplineOutsideUpdate",
              data: mawbInfo,
              loading: true,
              tip: false
            })
            .then(results => {
              if (results.data.resultstatus == 0) {
                this.$message.success(results.data.resultmessage);
                if (this.frompage == 4) {
                  // setTimeout(() => {
                  //     this.getMawbdetail()
                  // }, 8000);
                  this.$emit('success', true)
                } else {
                  this.$emit('success', 2)
                }
                return true
              } else {
                this.$message.error(results.data.resultmessage);
                return false

              }
            })

        }
      },
      areaChange(e) {
        if (this.inputModelData.ysservice) {
          this.inputModelData.ysservice.store_thr = '';
        }

        if (e) {
          let options = JSON.parse(localStorage.groupType).filter(i => i.groupid == '101' && i.typename.includes(e))
          if (options.length) {
            this.inputModelData.sfg = options[0].typename.split('丨')[1]
          }
        }
        let options = JSON.parse(sessionStorage.out_storelist).filter(i => i.area == this.inputModelData.area) || []
        if (options.length) {
          if (this.inputModelData.ysservice) {
            this.inputModelData.ysservice.store_thr = options[0].storename;
          }
          //   this.ckmapUrl = 'http://erp.wecanintl.com/outsidewebapi/api/ExAiraxpCheckBillPchUnFinishImage?sid=1272932&fid=1719&accountcomname=德迅（中国）货运代理有限公司'
          if (options[0].isexistmap == 1) { //有图片
            this.ckmapUrl = `${this.$store.state.webApi}api/PubStoreMapImage?area=${e}&storename=${options[0].storename}`
          } else {
            this.ckmapUrl = ''
          }

        }
      },
      thdDialog(type) {
        //1 确认 2取消
        let data = this.inputModelData.ysservice
        if (type == 1) {
          if (this.selServicecode == 'AA0510') {
            if (!data.company_thr_org || !data.address_thr_org || !data.pickupdate_org || !data.lxr_thr_org || !data.phone_thr_org || !data.khjcno || !data.piece || !data.weight) {
              this.$message.error('请填写完整信息！');
              return false;
            }
          }
          if (this.selServicecode == 'AA0410') {
            if (!data.yqfinishdate_org) {
              this.$message.error('请填写完整信息！');
              return false;
            }
          }
          this.newService[this.selServicecode].model = true
          this.panelDisplay.thdinfo = false;

        }
        if (type == 2) {
          this.panelDisplay.thdinfo = false;
        }

      },
      pageChange(outPagestep) {
        if (outPagestep == 3) {
          this.saveMawbInfoOut().then(res => {
            if (res) {
              this.panelDisplay.clause = false;
              this.outPagestep = outPagestep;
            }
          })
        } else {
          if (this.getInfo()) {
            this.outPagestep = outPagestep;
            if (outPagestep == 2) {
              this.reader = this.inputModelData.isimperfect == 2
            }
          } else {
            return
          }
        }
        this.scrollTop(0);
      },
      datePickerChange(e) {
        console.log(e)
        console.log(this.selServicecode)
        if (this.selServicecode == 'AA0410') {
          this.inputModelData.ysservice.yqfinishdate_org = e
        }
        if (this.selServicecode == 'AA0510') {
          this.inputModelData.ysservice.pickupdate_org = e
        }
      },
      exInfo(data) {
        if (data && data.code) {
          this.panelDisplay.thdinfo = true
          this.selServicecode = data.code
        }
      }
    },
    computed: {
      elStepsArr() {
        //客户不报价的情况下,节点改为 订舱成功->唯凯报价->客户确认报价->唯凯操作中->唯凯操作完成
        if (this.inputModelData.isimperfect == 2) {
          return [{
              class: 'el-icon-addsuccess',
              title: '预订舱成功',
              index: 0
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯确认',
              color: '#DADEE3',
              index: 1
            },
            {
              class: 'el-icon-dengdeng',
              title: '客户完善订舱信息',
              color: '#DADEE3',
              index: 2
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯操作',
              color: '#DADEE3',
              index: 3
            },
          ]
        } else {

          let arr = [{
              class: 'el-icon-addsuccess',
              title: '订舱成功',
              index: 0
            },
            {
              class: 'el-icon-nodetime',
              title: '唯凯受理',
              color: '#6D7D95',
              index: 1
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯报价',
              color: '#DADEE3',
              index: 2
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯确认',
              color: '#DADEE3',
              index: 3
            },
            {
              class: 'el-icon-dengdeng',
              title: '客户确认',
              color: '#DADEE3',
              index: 4
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯操作中',
              color: '#DADEE3',
              index: 5
            },
            {
              class: 'el-icon-dengdeng',
              title: '唯凯操作完成',
              color: '#DADEE3',
              index: 6
            },
          ]
          let showIndex = [];
          if (!this.serviceSelArr.includes('OA0010')) { //代操作
            showIndex = [0, 1, 5, 6]
          } else {
            if (!this.inputModelData.inwageallinprice) {
              showIndex = [0, 2, 4, 5, 6]
            } else {
              showIndex = [0, 3, 5, 6]
            }
          }
          return showIndex.length ? showIndex.map(i => arr[i]) : arr

        }

      },
    }

  }
}
