<template>
  <div class="address">
<!-- {{address}} -->
<!-- {{addresstype}} -->
    <el-row class="search">
      <el-col :span="2" class="address-title">
        <span>{{ addresstype == '1' ? '提货地信息' : '送货地信息' }}</span>
      </el-col>
      <el-col :span="7" class="collect-select">
        <el-select
          v-model="collectGuid"
          filterable
          clearable
          :filter-method="filterFunc"
          placeholder="搜索地址"
          size="mini">
          <span class="el-icon-search" slot="prefix"></span>
          <div class="select-title">
            <span>单位名称</span>
            <span>收藏地址</span>
            <span>联系人</span>
          </div>
          <el-option
            :style="elOptionStyle(index, curPageData.length)"
            v-for="(item, index) in curPageData"
            :key="index"
            :label="item.address"
            :value="item.guid"
            class="select-option">
            <span :title="item.addressname">{{ item.addressname }}</span>
            <span>{{ item.address }}</span>
            <span :title="item.linkman">{{ item.linkman }}</span>
          </el-option>
          <div style="position:absolute;bottom:0px;background:#fff;width:100%">
            <div class="block">
              <el-pagination
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="collectData.length">
              </el-pagination>
            </div>
          </div>
        </el-select>
      </el-col>
    </el-row>

    <el-row class="addressname">
      <el-col :span="2">
        <span>{{ addresstype == '1' ? '提货单位：' : '送货单位：' }}</span>
      </el-col>
      <el-col :span="7">
        <el-input v-model="address.addressname" placeholder="单位名称" class="input-required"></el-input>
      </el-col>
    </el-row>

    <el-row class="addressjson">
      <el-col :span="2">
        <span>{{ addresstype == '1' ? '提货地址：' : '送货地址：' }}</span>
      </el-col>
      <el-col :span="20">
        <el-col :span="4">
          <el-input v-model="address.addressjson.country" placeholder="国家"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="address.addressjson.pro" placeholder="州/省/県"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="address.addressjson.city" placeholder="城市/县"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="address.addressjson.areade" placeholder="区/街道"></el-input>
        </el-col>
        <el-col :span="6">
          <!-- <el-input v-model="address.addressjson.addressjson" placeholder="详细地址" class="input-required"></el-input> -->
        </el-col>
      </el-col>
    </el-row>
    <el-row>
          <el-input style="width:718px;margin-left:110px" v-model="address.addressjson.addressjson" type="textarea" placeholder="详细地址" class="input-required"></el-input>
    </el-row>

    <el-row class="contact">
      <el-col :span="2">
        <span>联系方式：</span>
      </el-col>
      <el-col :span="20">
        <el-col :span="4" class="linkman">
          <el-input v-model="address.linkman" clearable placeholder="联系人" ></el-input>
        </el-col>
        <el-col :span="4" class="phone">
          <el-input v-model="address.phone" clearable placeholder="电话" ></el-input>
        </el-col>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  props: {
    addresskey: {
      type: Object,
      default () {
        return {
          addressname:'addressname',
          address: 'address',
          linkman: 'linkman',
          phone: 'phone',
          addressjson: 'addressjson'
        }
      }
    },
    addressData: {
      type: Object,
      default() {
        return {
          addressname:'',
          address: "",
          linkman: "",
          phone: "",
          addressjson: '{"country":"","pro":"","city":"","areade":"","addressjson":""}'
        }
      }
    },
    gid: {
      type: [Number, String],
      required: true
    },
    // 1、提货地址  2、送货地址
    addresstype: {
      type: [String, Number],
      default: () => '1'
    },
    hideSearchLabel: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      address: {
        addressname: "",
        address: "",
        linkman: "",
        phone: "",
        addressjson: {
          country: "",
          pro: "",
          city: "",
          areade: "",
          addressjson: ""
        }
      },

      allData: [],  // 所有数据
      filterStr: '',
      // collectData: [],  // 筛选和过滤后的数据
      collectGuid: '',
      pageSize: 10,
      currentPage: 1
    }
  },
  created() {
    this.getAddressData()
  },
  watch: {
    addressData :{
      handler(newVal){
              for (let key in this.addresskey) {
        this.address[key] = newVal[this.addresskey[key]]
        if (key == 'addressjson') {
          this.address[key] = newVal[this.addresskey[key]] ? JSON.parse(newVal[this.addresskey[key]]) : {}
        }
      }
      },immediate:true
    },
    address: {
      handler (newVal) {
        this.address.address = Object.values(this.address.addressjson).join('')

        let data = {}
        for (let key in this.addresskey) {
          data[this.addresskey[key]] = this.address[key]
          if (key == 'addressjson') {
            data[this.addresskey[key]] = JSON.stringify(this.address[key])
          }
        }
        this.$emit('update:addressData', data)
      },
      deep: true
    },
    collectGuid (guid) {

      if (guid === '') {
        this.address = {
          addressname:'',
          address: "",
          linkman: "",
          phone: "",
          addressjson: {
            country: "",
            pro: "",
            city: "",
            areade: "",
            addressjson: ""
          }
        }
        return
      }

      this.address =Object.assign( {
        addressname: '',
        address: '',
        linkman: '',
        phone: '',
        addressjson:''
      }, {...this.getAddressByGuid(guid)})
 console.log(this.address)
      try {
        this.address.addressjson = JSON.parse(this.address.addressjson)

      } catch (error) {

        this.address.addressjson = {
          country: "",
          pro: "",
          city: "",
          areade: "",
          addressjson: ""
        }
      }
    }
  },
  computed: {
    collectData () {
      let result = [];
      if (this.collectGuid) {
        result = this.allData.filter(i => i.guid == this.collectGuid)
      } else {
        for (let item of this.allData) {          
        if (item.gid == this.gid && this.gid) {
          if (item.linkman&&item.linkman.toUpperCase().includes(this.filterStr) ||
            item.address&&item.address.toUpperCase().includes(this.filterStr) ||
            (item.addressname && item.addressname.toUpperCase().includes(this.filterStr))) {
            result.push(item)
          }
        }
      }
    }
      return result
    },
    curPageData () {
      return this.collectData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
    }
  },
  methods: {
    clear () {
      this.collectGuid = ''
      this.address.addressname = ''
    },
    checkInputRequired () {
      if (!this.address.address) {
        return false
      } else {
        return true
      }
    },
    findAddress () {
      for (let i in this.collectData) {
        if (this.addressData[this.addresskey.address] == this.collectData[i].address &&
            this.addressData[this.addresskey.linkman] == this.collectData[i].linkman &&
            this.addressData[this.addresskey.phone] == this.collectData[i].phone) {
          this.collectGuid = this.collectData[i].guid
          break
        }
      }
    },
    getAddressData () {
      // if (!localStorage.thdAddress) {
        this.$axios({method:'get',url:this.$store.state.publicWebApi+"api/PubAddressBasic",params:{area:''},loading:false,tip:false}).then(results=>{
          //console.log('提货地地址')
          // localStorage.setItem('thdAddress',JSON.stringify(results.data))
          this.thdAddress = results.data
          this.allData = this.thdAddress.filter(item => {
            return item.addresstype == this.addresstype
          })
        })
      // } else {
      //   this.thdAddress = JSON.parse(localStorage.thdAddress)
      //   this.allData = this.thdAddress.filter(item => {
      //     return item.addresstype == this.addresstype
      //   })
      // }
    },
    collectAddress () {
      // if (!this.gid) {
      //   return this.$message.error('请补全订单项目信息')
      // }
      // !this.address.addressname ||

/* console.log(this.address.address)
console.log(this.address.linkman)
console.log(this.address.phone)
 */
     /*  if (!this.address.address || !this.address.linkman || !this.address.phone) {
        return this.$message.error('请填写完整的信息！')
      }
 */
  // if (!this.address.addressname) {
  //       return this.$message.error('请填写完整的信息！')
  //     }

      let cur_address = this.getAddressByGuid(this.collectGuid)

      if (this.collectGuid != '') {
        if (cur_address &&
          this.address.address == cur_address.address &&
          this.address.linkman == cur_address.linkman &&
          this.address.phone == cur_address.phone) {

          // 如果没有修改过信息
          // this.$message.error('无数据更新')
          return
        }
      }

      let save_data = {
        addressname: this.address.addressname,
        address: this.address.address,
        linkman: this.address.linkman,
        phone: this.address.phone,
        addressjson: typeof this.address.addressjson == 'object' ? JSON.stringify(this.address.addressjson) : this.address.addressjson
      }
      let method = 'post'

      if (this.collectGuid !== '') {
        save_data.guid = cur_address.guid
        method = 'put'
      } else {
        save_data.adddate = new Date().toLocaleString('chinese',{hour12:false})
        save_data.addman = localStorage.usrname
        save_data.addresstype = String(this.addresstype)
        save_data.gid = this.gid
      }

      //console.log(save_data)
      this.$axios({method: method, url: this.$store.state.publicWebApi + "api/PubAddressBasic", data: {...save_data}, loading: false, tip: false})
      .then((result) => {
        if (typeof result.data == 'string') {
          result.data = JSON.parse(result.data)
        }

        if (result.data.resultstatus == 0) {
          if (method == 'put') {
            for (let i in this.thdAddress) {
              if (this.thdAddress[i].guid == this.collectGuid) {
                for (let key in save_data) {
                  this.thdAddress[i][key] = save_data[key]
                }
              }
            }
            localStorage.setItem('thdAddress', JSON.stringify(this.thdAddress))
          } else {
            let addData = {
              ...save_data,
              guid: result.data.resultguid,
              id: result.data.resultid
            }
            setTimeout(() => {
              this.getAddressData()

              this.allData.push(addData)
              this.thdAddress.push(addData)
              localStorage.setItem('thdAddress', JSON.stringify(this.thdAddress))
            }, 0)

            this.collectGuid = ''
          }
        }
      })
    },
    getAddressByGuid (guid) {
      if (guid == '') return null
      for (let i in this.collectData) {
        if (this.collectData[i].guid == guid) return this.collectData[i]
      }
      return null
    },
    filterFunc (val) {
      this.filterStr = val
    },
    elOptionStyle (index, length) {
      if (index == 0 && length == 1) {
        return {'margin-top': '24px', 'margin-bottom': '40px'}
      }
      if (index == 0) {
        return {'margin-top': '24px'}
      } else if (index == length - 1) {
        return {'margin-bottom': '40px'}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.address {
  .el-row {
    margin-bottom: 10px;
    .el-col {
      line-height: 28px;
    }
    > .el-col:first-child {
      text-align: right;
      padding-right: 5px;
      width: 110px;
      color: #333;
      &.address-title {
        span {
          display: inline-block;
          width: 75px;
          border-bottom: 2px solid #0f5a8c;
          // padding-bottom: 4px;
          margin-right: 12px;
        }
      }
    }
  }
  .search {
    margin-bottom: 25px;
    .collect-select {
      .el-icon-search {
        font-size: 16px;
        line-height: 29px;
        margin: 0 3px;
      }
      .el-select {
        width: 250px;
      }
    }
  }
  .addressname {
    .el-input {
      width: 250px;
    }
  }
  .addressjson, .contact {
    .el-col {
      .el-input {
        width: 90%;
      }
    }
  }
  .contact {
    margin-bottom: 0;
  }
}
.select-option {
  width:auto;
  min-width: 510px;
  display:flex;
  justify-content:space-between;
}
.select-title {
  position:absolute;
  top:0px;
  width: 100%;
  font-size:14px;
  color:#333;
  background:#fff;
  height:30px;
  line-height:30px;
  display:flex;
  justify-content:space-between;
  z-index:10;
  padding:0px 20px;
}
.select-option, .select-title {
  span {
    display: block;
    text-align: center;
    padding: 0 5px;
    &:first-child, &:last-child {
      width: 130px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
