<template>
<div class="assignwz">
  <div>
    <div class="item">
      <span>请选择地区：</span>
      <div>
        <el-select v-model="assignData.assignarea" class="input-required">
          <el-option v-for="(item, index) in area_option" :value="item" :label="item" :key="index"></el-option>
        </el-select>
      </div>
    </div>
    <div class="item currency">
      <span>币种：</span>
      <div>
        <!-- <el-radio v-model="assignData.profitcurrency" :label="'人民币'">人民币（CNY）</el-radio>
        <el-radio v-model="assignData.profitcurrency" :label="'港币'">港币（HKD）</el-radio>
        <el-radio v-model="assignData.profitcurrency" :label="'美元'">美元（USD）</el-radio>
        <el-radio v-model="assignData.profitcurrency" :label="'日元'">日元（JPY）</el-radio> -->
        
        <el-select v-model="assignData.profitcurrency" class="input-required">
          <el-option v-for="(item,index) in currency_option"
          :key="index"
          :label="item"
          :value="item">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="item price">
      <span>报关费：</span>
      <div>
        <el-input v-model="assignData.profitprice" class="input-required" v-verify="'float'"></el-input>
        <span>总价</span>
      </div>
    </div>
    <!-- <div class="fpbl">
      <span>分泡比例：</span>
      <div>
        <p>
          销售站<el-input v-model="assignData.self_profitvalue" class="input-required"></el-input>
          操作站<el-input v-model="assignData.cus_profitvalue" class="input-required"></el-input>
        </p>
      </div>
    </div> -->
  </div>
</div>  
</template>

<script>
export default {
  props: {
    assignData: {
      type: Object,
      default () {
        return {
          assignarea: '',// 分配区域
          assigndom: '',// 分配部门
          system: '报关',// 分配系统
          profitcurrency: '人民币',// 运费币种
          profitprice: '',// 价格
          profitmode: 'Co-Load模式',// 分配模式
          self_profitvalue: '',// 销售站利润分配比例
          cus_profitvalue: ''// 操作站利润分配比例
        }
      }
    },
    visible: Boolean
  },
  data () {
    return {
      area_option: [],
      currency_option: []
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.area_option = []
        for(let j in this.PubTypecode){
          if (this.PubTypecode[j].typename.includes(this.$store.state.areaState)) continue
          if(this.area_option.indexOf(this.PubTypecode[j].typename)==-1){
            this.area_option.push(this.PubTypecode[j].typename)
          }
        }
      }
    }
  },
  created () {
    let currencyData=JSON.parse(localStorage.getItem('currencyData'))
    currencyData.forEach(item=>{
        this.currency_option.push(item.cname)
    })

    this.$axios({method:'get',url:this.$store.state.publicWebApi+'api/PubTypecode',params:{groupid:101},loading:false,tip:false})
    .then(response=>{
      this.PubTypecode = response.data
      this.area_option = []
      for(let j in this.PubTypecode){
        if (this.PubTypecode[j].typename.includes(this.$store.state.areaState)) continue
        if(this.area_option.indexOf(this.PubTypecode[j].typename)==-1){
          this.area_option.push(this.PubTypecode[j].typename)
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.assignwz {
  .item {
    margin-bottom: 20px;
    > span:first-child {
      float: left;
      width: 110px;
      line-height: 26px;
      text-align: right;
      + div {
        margin-left: 120px;
      }
    }
  }
  .currency {
    > span + div {
      .el-radio {
        width: 125px;
      }
      .el-radio:nth-child(3) {
        margin-left: 0;
      }
    }
  }
  .price {
    .el-input {
      margin-right: 8px;
      width: 150px;
    }
  }
  .fpbl {
    .el-input {
      width: 60px;
      margin: 0 10px;
    }
  }
}
</style>
