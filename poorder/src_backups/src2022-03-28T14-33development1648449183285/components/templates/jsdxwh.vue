<template>
  <div style="display:inline-flex;height:28px;align-items:center;vertical-align:-4px">

    <i class="el-icon-edit-outline" title="结算对象维护" @click="jjdDialogFunc"
      style="font-size:20px;color:#30C76C;cursor:pointer"></i>
    <!-- <i class="el-icon-refresh" title="刷新" @click="saveFunc" style="font-size:20px;;color:#30C76C;cursor:pointer;margin-left:12px;"></i> -->
    <el-dialog title="结算对象维护" :visible.sync="dialogDoc" width="680px" append-to-body>
      <el-form label-width="110px">
        <!-- {{fid}} -->
        <!-- {{restaurants}} -->

        <el-form-item label="结算对象名称：">
          <!-- <el-input v-model="usr_name"  class="input-required" clearable placeholder="请输入结算对象名称" @blur="ifrepeat($event,'usr_name')"></el-input> -->
          <el-autocomplete v-model="usr_name" style="width:530px" class="input-required" clearable
            placeholder="请输入结算对象名称" :fetch-suggestions="querySearchAsync" :trigger-on-focus="false"
            @select="handleSelect"></el-autocomplete>
          <!-- <el-select
   v-model="usr_name"
     style="width:350px"
     filterable
    allow-create
    default-first-option
    clearable
    @change="handleSelect"
     placeholder="请选择或输入并选择">
    <el-option
      v-for="item in restaurants"
      :key="item.usr_name"
      :label="item.usr_name"
      :value="item.usr_code">
    </el-option>
  </el-select> -->
        </el-form-item>

        <el-form-item label="结算对象代码：">
          <el-input v-model="usr_code" class="input-required" clearable placeholder="请输入结算对象代码"
            @blur="ifrepeat($event,'usr_code')"></el-input>
        </el-form-item>

        <el-form-item label="税号：">
          <el-input v-model="taxCode" class="input-required" clearable placeholder="请输入税号"
            @blur="ifrepeat($event,'taxCode')"></el-input>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="name" class="input-required" clearable placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="phone" class="input-required" clearable placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="email" class="input-required" clearable placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="申请原因：">
          <el-input v-model="settlerequestreason" :class="usr_status==2?'input-required':''" clearable
            placeholder="请输入申请原因"></el-input>
        </el-form-item>
        <hr v-if="this.createman" style="height: 1px;background-color: #EEEEEE;margin:15px 0;">
        <h4 style="color:red" v-if="this.createman">该结算对象已由以下人员创建过,信息如下,请核对信息,如有疑问可联系创建人</h4>
        <div v-if="this.createman">
          <div class="pane pane1">
            <span style="flex:1.2">财务编码</span>
            <span style="flex:0.8">站点</span>
            <span style="flex:.8">创建人</span>
            <span style="flex:1.2">创建日期</span>
            <!-- <span style="flex:1.5">邮箱</span> -->
          </div>
          <div class="pane pane2">
            <span style="flex:1.2">{{createmanaccountno}}</span>
            <span style="flex:0.8">{{createarea}}</span>
            <span style="flex:.8">{{createman}}</span>
            <span style="flex:1.2">{{createdate | formatDate('yyyy-MM-dd HH:mm')}}</span>
            <!-- <span style="flex:1.5">{{createmanemail}}</span> -->
          </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="reset">重 置</el-button>
        <el-button @click="dialogDoc = false">取 消</el-button>
        <el-button type="primary" @click="saveFunc">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    props: {
      fid: [Number, String],
      area: String
    },
    data() {
      return {
        dialogDoc: false,
        taxCode: '',
        usr_code: '',
        usr_name: '',
        name: '',
        phone: '',
        email: '',
        restaurants: '',
        timeout: 0,
        createarea: '',//区域
        createman: '',//人
        createdate: '',//时间
        createmanemail: '',//邮箱
        createmanaccountno: '',//财务编码
        usr_status: 1,//有效无效状态
        settlerequestreason: '',//申请原因
      }
    },
    methods: {
      blurFunc() {
      },
      handleSelect(row) {
        this.ifrepeat({ target: { value: row.value } }, 'usr_name')
      },
      sortBy: function (name, type) {
        return function (o, p) {

          var a, b;
          if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
              return 0;
            }
            if (typeof a === typeof b) {
              if (type === 1) {
                return a < b ? -1 : 1;
              } else {
                return a > b ? -1 : 1;
              }

            }
            if (type == 1) {
              return typeof a < typeof b ? -1 : 1;
            } else {
              return typeof a > typeof b ? -1 : 1;
            }

          }
          else {
            throw ("error");
          }
        }
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)).sort(this.sortBy('probability', 2)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 10 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return this.matchFunc(state, queryString)
        };
      },
      matchFunc(state, queryString) {
        let Kq = 2;
        let Kr = 1;
        let Ks = 1;
        let ss = queryString.toLowerCase();
        let st = state.value.toLowerCase();
        let q = 0  //获取交集数量
        let arr = [];
        for (let i in ss) {
          if (st.indexOf(ss[i]) >= 0) {
            arr.push(ss[i])
          }
        }
        q = arr.length
        let s = ss.length - q;
        let r = st.length - q;
        let probability = (Kq * q / (Kq * q + Kr * r + Ks * s));
        if (st.indexOf(ss) >= 0) {
          probability = 1
        }
        state.probability = probability
        return probability >= 0.8 && probability <= 1
      },
      jjdDialogFunc() {
        this.dialogDoc = true;
        this.getWtkh()

      },
      ifrepeat(e, name) {
        if (!e.target.value) {
          return
        }
        var json = { taxCode: (name == 'taxCode' ? this.taxCode.trim() : ''), usr_code: (name == 'usr_code' ? this.usr_code.trim() : ''), usr_name: (name == 'usr_name' ? this.usr_name.trim() : ''), name: (name == 'name' ? this.name.trim() : ''), phone: (name == 'phone' ? this.phone.trim() : ''), email: (name == 'email' ? this.email.trim() : '') }
        this.$axios({ method: 'get', url: this.$store.state.BasicWebApi + 'api/ExSettlement', params: json, loading: true, tip: false, noarea: true }).then(res => {
          if (res.data.length >= 1) {
            this.taxCode = res.data[0].taxCode;
            this.usr_code = res.data[0].usr_code;
            this.usr_name = res.data[0].usr_name;
            this.name = res.data[0].name;
            this.phone = res.data[0].phone;
            this.email = res.data[0].email;
            this.createarea = res.data[0].createarea;//区域
            this.createman = res.data[0].createman;//人
            this.createdate = res.data[0].createdate;//时间
            this.createmanemail = res.data[0].createmanemail;//邮箱
            this.createmanaccountno = res.data[0].createmanaccountno;//财务编码
            this.usr_status = res.data[0].usr_status;//
            this.settlerequestreason = res.data[0].settlerequestreason;//
          } 
        })

      },
      reset() {
        this.taxCode = '';
        this.usr_code = '';
        this.usr_name = '';
        this.name = '';
        this.phone = '';
        this.email = '';
        this.createarea = '';
        this.createman = '';
        this.createdate = '';
        this.createmanemail = '';
        this.createmanaccountno = '';
        this.usr_status = '';//
        this.settlerequestreason = '';//
      },
      saveFunc() {
        let taxCode = this.taxCode && this.taxCode.trim();
        let usr_code = this.usr_code && this.usr_code.trim();
        let usr_name = this.usr_name && this.usr_name.trim();
        let name = this.name && this.name.trim();
        let phone = this.phone && this.phone.trim();
        let email = this.email && this.email.trim();
        let createarea = this.area
        let createmanemail = localStorage.email
        let usr_status = this.usr_status || 1;
        let settlerequestreason = this.settlerequestreason && this.settlerequestreason.trim();

        if (!taxCode || !usr_code || !usr_name || !name || !phone || !email) {
          this.$message.error('请填写完成信息！'); return;
        }
        var json = { fid: this.fid, taxCode: taxCode, usr_code: usr_code, usr_name: usr_name, name: name, phone: phone, email: email, czman: localStorage.usrname, area: '-1', createarea: createarea, createmanemail: createmanemail, usr_status: usr_status, settlerequestreason: settlerequestreason }
        this.$axios({ method: 'post', url: this.$store.state.BasicWebApi + 'api/ExSettlement', data: json, loading: true, tip: false, noarea: true }).then(res => {
          if (res.data.resultstatus == 0) {
            this.$message.success(res.data.resultmessage)
            this.reset()
            this.getbasicinfo()
            this.dialogDoc = false;
          } else {
            this.$message.error(res.data.resultmessage)
          }

        })

      }, getbasicinfo() {
        this.$store.dispatch('updateXmdata').then(() => {
          this.$emit('success', true)
        })
        // this.$axios({method:"get",url:this.$store.state.publicWebApi+"api/PubCustom",params:{type:'all',comxz:"-1",area:'',timestamp:0,system:''}}).then(results=>{
        // let xmdata=results.data.map(i=>{
        //      delete i.isdmdlgys;
        //      delete i.comhy;
        //      delete i.iskyydgys;
        //      delete i.khjcno;
        //      delete i.zddlcode;
        //      delete i.zddlzh;
        //      delete i.zdiatacode;
        //      delete i.usr_status_cw;
        //      return i
        // })
        //    this.$store.commit('setXmdata',xmdata)
        //     this.$emit('success',true)
        //   })
      }
      , getWtkh() {
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/PubFCustom",
          params: { type: "all", area: "", timestamp: 0, system: "" }
        }).then(results => {
          this.restaurants = results.data.filter(i => {
            // return i.usr_status == 1 && i.iscommit == 2 ;
            return i.iscommit == 2;
          }).map(i => {
            return { value: i.usr_name }
          })
        });




      }

    },
    computed: {

    }
    , mounted() {


    },

  }
</script>

<style lang="less" scoped>
  .dialogImgDoc {
    /deep/ .el-dialog__body {
      padding: 0px;
      height: calc(100% - 40px);
    }
  }

  .pane {
    display: flex;

    span {
      // flex:1;
      margin-top: 7px;
    }
  }

  .pane1 {
    span {
      color: #999;
    }
  }

  .pane2 {
    span {
      color: #37688D;
    }
  }
</style>