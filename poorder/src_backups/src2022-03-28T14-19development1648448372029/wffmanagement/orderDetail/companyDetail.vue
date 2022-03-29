<template>
  <div class="companyDatail">
    <h3 class="commitlb">{{ basicInfo.ready10 }}</h3>

    <div class="detail apply">
      <div class="detail-title">
        <p>申请信息</p>
      </div>
      <div class="detail-c">
        <el-row>
          <el-col :span="5">
            <span class="label">状态：</span>
            <span class="content">{{ basicInfo.commitstatus | commitstatusCN }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">申请人：</span>
            <span class="content">{{ basicInfo.commitman }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">申请日期：</span>
            <span class="content">{{ basicInfo.commitdate | dateFormat }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <span class="label">申请地：</span>
            <span class="content">{{ basicInfo.commitplace }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">审核人：</span>
            <span class="content">{{ basicInfo.examineman }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">审核日期：</span>
            <span class="content">{{ basicInfo.examinedate | dateFormat }}</span>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="detail basic">
      <div class="detail-title">
        <p>基本信息</p>
      </div>
      <div class="detail-c">
        <el-row>
          <el-col :span="15">
            <span class="label">公司名称：</span>
            <span class="content">{{ basicInfo.isename == 1 ? '' : basicInfo.usr_name }}</span>
          </el-col>
          <el-col :span="9">
            <span class="label">公司代码：</span>
            <span class="content">{{ basicInfo.usr_code }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <span class="label">公司英文名称：</span>
            <span class="content">{{ basicInfo.ename }}</span>
          </el-col>
          <el-col :span="9">
            <span class="label">邮编：</span>
            <span class="content">{{ basicInfo.postalcode }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="label">公司地址：</span>
            <span class="content">{{ basicInfo.address }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="label">申请类型：</span>
            <span class="content">{{ basicInfo.comxz | comxzCN }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">财务状态：</span>
            <span class="content">{{ basicInfo.usr_status_cw | usr_statusCN }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">业务状态：</span>
            <span class="content">{{ basicInfo.usr_status | usr_statusCN }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="label">所属系统：</span>
            <span class="content">{{ basicInfo.system | systemCN }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="label">公司性质：</span>
            <span class="content">{{ basicInfo.comlbcn }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">所属行业：</span>
            <span class="content">{{ basicInfo.comhycn }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">销售负责人：</span>
            <span class="content">{{ basicInfo.salesprofitername }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <span class="label">销售负责人部门：</span>
            <span class="content">{{ basicInfo.salesprofiternamedp }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">销售负责人区域：</span>
            <span class="content">{{ basicInfo.salesprofiternamear }}</span>
          </el-col>
          <el-col :span="5">
            <span class="label">销售负责人职位：</span>
            <span class="content">{{ basicInfo.salesprofiternamepo }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="label">开始日期：</span>
            <span class="content">{{ basicInfo.begindate | dateFormat }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 只有commitstatus等于2时才能修改信控信息并显示驳回、通过按钮 -->
    <div class="detail credit">
      <div class="detail-title">
        <p>信控信息<span style="color:red;">(必填)</span></p>
      </div>
      <div class="detail-c">
        <el-row>
          <el-col :span="24">
            <span class="label">信用等级：</span>
            <span class="content">
              <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlevel" label="A"></el-radio>
              <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlevel" label="B"></el-radio>
              <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlevel" label="C"></el-radio>
            </span>
          </el-col>
        </el-row>
        <template v-if="basicInfo.creditlevel == 'B'">
          <el-row>
            <el-col :span="15">
              <span class="label">每月信用额度(元)：</span>
              <span class="content">
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlimit" :label="50000">&lt;5万</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlimit" :label="100000">5万&lt;10万</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlimit" :label="200000">10万&lt;20万</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlimit" :label="300000">20万&lt;30万</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditlimit" :label="600000">30万&lt;60万</el-radio>
              </span>
            </el-col>
            <el-col :span="9">
              <span class="label">预警百分比：</span>
              <span class="content">
                <el-input :disabled="disableCreditForm" v-model="basicInfo.creditlimit_remind"></el-input>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <span class="label">信用期限：</span>
              <span class="content">
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays" :label="30">30天</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays" :label="45">45天</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays" :label="60">60天</el-radio>
              </span>
            </el-col>
            <el-col :span="5">
              <span class="label">其他天数：</span>
              <span class="content">
                <el-input :disabled="disableCreditForm" v-model="basicInfo.creditdays"></el-input>
              </span>
            </el-col>
            <el-col :span="5">
              <span class="label">预警天数：</span>
              <span class="content">
                <el-input :disabled="disableCreditForm" v-model="basicInfo.creditdays_remind"></el-input>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label">结算方式：</span>
              <span class="content">
                <el-radio :disabled="disableCreditForm" v-model="jsfsRadio" :label="2">单票</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="jsfsRadio" :label="3">月结</el-radio>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label">账单到期日：</span>
              <span class="content" v-if="basicInfo.creditdays_dom == 3">
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays_date" :label="15">每月15号</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays_date" :label="30">月底</el-radio>
              </span>
              <span class="content" v-else>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays_dom" :label="1">航班日期</el-radio>
                <el-radio :disabled="disableCreditForm" v-model="basicInfo.creditdays_dom" :label="2">开票日期</el-radio>
              </span>
            </el-col>
          </el-row>
        </template>
      </div>
    </div>
    
    <div class="footer" v-if="!disableCreditForm">
      <div class="btn-c">
        <el-button type="danger" @click="backOrderVisible = true">驳回</el-button>
        <el-button type="danger" @click="pass">通过</el-button>
      </div>
    </div>

    <el-dialog 
      width="800px"
      top="4%"
      center
      :visible.sync="backOrderVisible"
      v-if="backOrderVisible"
      append-to-body
      custom-class="reason">

      <div>
        <h3>驳回原因</h3>
        <p class="orderNo">
          <span>{{ basicInfo.isename == 1 ? basicInfo.ename : basicInfo.usr_name }}</span>
        </p>
        <ul>
          <li>申请类型</li>
          <li>公司性质</li>
          <li>所属行业</li>
          <li>销售负责人</li>
          <li>所属系统</li>
        </ul>
        <ul style="margin-top:3px;">
          <li>{{ basicInfo.comxz | comxzCN }}</li>
          <li>{{ basicInfo.comlbcn }}</li>
          <li>{{ basicInfo.comhycn }}</li>
          <li>{{ basicInfo.salesprofitername }}</li>
          <li :title="basicInfo.system | systemCN">{{ basicInfo.system | systemCN }}</li>
        </ul>

        <el-input type="textarea" v-model="backOrderReason" class="input-required" :autosize="{minRows:4}" style="margin-top:12px;color:#c8c8c8" placeholder="驳回原因输入框"></el-input>

        <p style="margin-top:18px;text-align:right">
          <el-button type="primary" @click="backOrder">确定</el-button>
          <el-button @click="backOrderVisible = false">取消</el-button>
        </p>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  filters: {
    dateFormat (date) {
      if (!date) return ''
      if (date.includes('1900')) return ''
      return new Date(date).Format('yyyy-MM-dd')
    },
    commitstatusCN (val) {
      let text = ''
      switch (val) {
        case 1:
          text = '待申请'
          break
        case 2:
          text = '老板待审'
          break
        case 3:
          text = '老板通过'
          break
        case 4:
          text = '老板驳回'
          break
        case 5:
          text = '已删除'
          break
        case 6:
          text = '法务待审'
          break
        case 7:
          text = '法务通过'
          break
        case 8:
          text = '法务驳回'
          break
      }
      return text
    },
    comxzCN (val) {
      // 1.客户  2.供应商  1,2.客户,供应商
      let text = ''
      switch (val) {
        case '1':
          text = '客户'
          break
        case '2':
          text = '供应商'
          break
        case '1,2':
          text = '客户，供应商'
          break
      }
      return text
    },
    usr_statusCN (val) {
      // 1有效  2无效
      let text = ''
      switch (val) {
        case 1:
          text = '有效'
          break
        case 2:
          text = '无效'
          break
      }
      return text
    },
    systemCN (val) {
      if (!val) return ''
      let groupSystem = JSON.parse(localStorage.groupType).filter(i => i.groupid == 57)
      let systemID = val.split(',')
      
      return groupSystem.reduce((p, v) => {
        if (systemID.includes(String(v.id))) p += `${v.typename}，`
        return p
      }, '').slice(0, -1)
    }
  },
  data () {
    return {
      backOrderVisible: false,
      backOrderReason: '',

      basicInfo: {}
    }
  },
  computed: {
    jsfsRadio: {
      get () {
        if (!this.basicInfo.creditdays_dom || this.basicInfo.creditdays_dom == 3) return 3
        return 2
      },
      set (val) {
        if (val == 3) {
          return this.basicInfo.creditdays_dom = 3
        }
        this.basicInfo.creditdays_dom = 1
      }
    },
    disableCreditForm () {
      return !(this.basicInfo.commitstatus == 2)
    }
  },
  watch: {
    backOrderVisible (val) {
      if (val) this.backOrderReason = ''
    }
  },
  created () {
    this.$axios({method:'get',url:this.$store.state.customWebApi+'api/BasicExFCustomCommit',params:{id: this.id},loading:true,tip:false})
    .then(result=>{
      if (result.data == null) {
        return this.$message.error('获取信息出错')
      }
      this.basicInfo = result.data
    })
  },
  methods: {
    backOrder () {
      if (!this.backOrderReason) return this.$message.error('请填写驳回原因')

      let data = {
        commitstatus: 4,
        id: this.basicInfo.id,
        oid: this.basicInfo.oid,
        examineman: localStorage.usrname,
        commitcontent: this.backOrderReason,
        creditlevel: this.basicInfo.creditlevel,
        creditlimit: this.basicInfo.creditlimit,
        creditlimit_temp: 0,
        creditlimit_remind: this.basicInfo.creditlimit_remind,
        creditdays: this.basicInfo.creditdays,
        creditdays_type: 2,
        creditdays_dom: this.basicInfo.creditdays_dom,
        creditdays_date: this.basicInfo.creditdays_date,
        creditdays_temp: 0,
        creditdays_remind: this.basicInfo.creditdays_remind,
        creditweight: 0,
        creditweightall: 0,
        crediteditman: localStorage.usrname,
        creditlimit_month: this.basicInfo.creditlimit,
        month_startday: "2014-08-01",
        month_cycle: "1"
      }
      
      this.$axios({method:'put',url:this.$store.state.customWebApi+'api/BasicExFCustomApproval',data,loading:true,tip:true,noarea:true})
      .then(result=>{ 
        if (result.data.resultstatus == 0) {
          // 公司申请commitxs等于1
          this.$emit('closeDialog', 1)
        }
      })
    },
    pass () {
      let data = {
        commitstatus: 3,
        id: this.basicInfo.id,
        oid: this.basicInfo.oid,
        examineman: localStorage.usrname,
        commitcontent: '',
        creditlevel: this.basicInfo.creditlevel,
        creditlimit: this.basicInfo.creditlimit,
        creditlimit_temp: 0,
        creditlimit_remind: this.basicInfo.creditlimit_remind,
        creditdays: this.basicInfo.creditdays,
        creditdays_type: 2,
        creditdays_dom: this.basicInfo.creditdays_dom,
        creditdays_date: this.basicInfo.creditdays_date,
        creditdays_temp: 0,
        creditdays_remind: this.basicInfo.creditdays_remind,
        creditweight: 0,
        creditweightall: 0,
        crediteditman: localStorage.usrname,
        creditlimit_month: this.basicInfo.creditlimit,
        month_startday: "2014-08-01",
        month_cycle: "1"
      }
      
      this.$axios({method:'put',url:this.$store.state.customWebApi+'api/BasicExFCustomApproval',data,loading:true,tip:true,noarea:true})
      .then(result=>{
        if (result.data.resultstatus == 0) {
          // 公司申请commitxs等于1
          this.$emit('closeDialog', 1)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.companyDatail {
  .commitlb {
    margin-bottom: 10px;
    text-indent: 13px;
  }
  .detail {
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    .detail-title {
      height: 36px;
      line-height: 36px;
      text-indent: 12px;
      font-size: 14px;
      font-weight: bolder;
      color: #0f5a8c;
      border-bottom: 1px solid #e8e8e8;
      p {
        display: inline;
      }
    }
    .detail-c {
      padding: 20px;
      .el-row {
        margin-bottom: 10px;
        height: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        .label, .content {
          display: inline-block;
        }
        /deep/ .content .el-input__inner {
          height: 20px;
          line-height: 20px;
          width: 80%;
        }
      }
    }
  }
  .apply .detail-c .label {
    width: 60px;
  }
  .basic .detail-c .label {
    width: 100px;
  }
  .credit .detail-c .label {
    width: 110px;
  }
  .footer {
    overflow: hidden;
    .btn-c {
      float: right;
    }
  }
}
.reason{
  .el-dialog__body{
    padding: 8px 40px;
  }
  h3{
    font-size: 18px;
    color: #004d84;
  }
  .orderNo{
    margin-top: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    margin-bottom: 12px;
    span {
      float: left;
      color: #004d84;
      font-weight: bold;
    }
    &:after{
      content: '';
      display: block;
      clear: both;
    }
  } 
  ul li{
    display: inline-block;
    width: 100px;
    text-align: left;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
