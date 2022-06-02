<template>
  <div>
    <div style="text-align: right;height: 0px;transform: translate(-112px,-52px);z-index: 600;position: relative">
      <el-button
        type="primary"
        @click="addHawb()"
      >新增分单</el-button>
    </div>

    <commonTabs
      deletetype=2
      :list="mawbdetail.hawbList"
      showClose
      :showContent="showContent"
      :checkedIndex.sync="hawblistChecked"
      titlefield="hawb"
      :showTooltip="false"
    >
      <div
        v-for="(hawb,index) in mawbdetail.hawbList"
        v-show="hawblistChecked==index"
      >
        <hawbInfoNewAdd
          :hawbdata.sync="hawb"
          :mawbdetail="mawbdetail"
        ></hawbInfoNewAdd>
      </div>
    </commonTabs>
    
  </div>
</template>

<script>
    import hawbInfoNewAdd from '@/components/orderDetails/hawbInfoNewAdd'


    export default {
        props: {
            mawbdetail: Object,
            showContent:Boolean
        },
        components: { hawbInfoNewAdd },
        data() {
            return {
                hawblistChecked: 0,
                hawbListBackup:[]
            }
        },

        methods: {
            addHawb(data = {}) {
                this.mawbdetail.hawbList.push(
                    Object.assign({}, this.fetch_hawb_data(), data)
                )
                this.hawblistChecked = this.mawbdetail.hawbList.length - 1
            },
            fetch_hawb_data(hawb = {}) {
                var obj = {
                    "guid": -1,
                    "isdel":1,
                    "hawb": "",
                    "sfg": "",
                    "mdg": "",
                    "ybpiece": '',
                    "ybweight": '',
                    "ybvolume": '',
                    "smallpiece": '',
                    "hwxz": "",
                    "hwlx": "",
                    "batterymodel": "",
                    "chinesepm": "",
                    "englishpm": "",
                    "isinwageallin": -1,
                    "inwageallinprice": 0,
                    "currency": "",
                    "companytitle_fhr_hawb": "",
                    "address_fhr_hawb": "",
                    "companycode_fhr_hawb": "",
                    "state_fhr_hawb": "",
                    "city_fhr_hawb": "",
                    "postcode_fhr_hawb": "",
                    "lxr_fhr_hawb": "",
                    "phone_fhr_hawb": "",
                    "fax_fhr_hawb": "",
                    "email_fhr_hawb": "",
                    'taxcode_fhr_hawb': "",
                    "companytitle_shr_hawb": "",
                    "address_shr_hawb": "",
                    "companycode_shr_hawb": "",
                    "state_shr_hawb": "",
                    "city_shr_hawb": "",
                    "postcode_shr_hawb": "",
                    "lxr_shr_hawb": "",
                    "phone_shr_hawb": "",
                    "fax_shr_hawb": "",
                    "email_shr_hawb": "",
                    'taxcode_shr_hawb': "",
                    'ybstoreList': []
                }
                obj.hwxz = hawb.hwxz || this.mawbdetail.hwxz
                obj.hwlx = hawb.hwlx || this.mawbdetail.hwlx
                obj.batterymodel = hawb.batterymodel || this.mawbdetail.batterymodel
                obj.sfg = hawb.sfg || this.mawbdetail.sfg
                obj.mdg = hawb.mdg || this.mawbdetail.mdg
                obj.gid = hawb.gid || this.mawbdetail.gid
                obj.area = hawb.area || this.mawbdetail.area
                // if (this.$store.state.areaState == '市场部' || this.$store.state.areaState == '海外部') {
                //     obj.tradeterm = 'FOB'
                // }
                return obj;
            },
             async getHawbNum() {
                //获取分单号
                await this.$axios({
                    method: "get",
                    url: this.$store.state.webApi + "api/ExAxpline",
                    params: {
                        hpoidHawbGroup: this.mawbdetail.guid
                    },
                    loading: false,
                    tip: false
                }).then(results => {
                    //  console.log("分单号");
                    //   console.log(JSON.stringify(results.data));
                    this.hawbListBackup = JSON.parse(JSON.stringify(results.data));
                    this.mawbdetail.hawbList = results.data;
                });


                return this.hawbListBackup;
            },
        }

        , computed: {

        },
        watch: {

        },
        mounted() {

        },
        created() {
            // if(this.mawbdetail.guid){
            //     this.getHawbNum()
            // }
            this.$watch(
                () => {
                    return this.mawbdetail.hwxz + this.mawbdetail.hwlx + this.mawbdetail.batterymodel + this.mawbdetail.sfg + this.mawbdetail.mdg + this.mawbdetail.gid + this.mawbdetail.area
                }, () => {
                    this.mawbdetail.hawbList.forEach(hawb => {
                        hawb.hwxz = hawb.hwxz || this.mawbdetail.hwxz
                        hawb.hwlx = hawb.hwlx || this.mawbdetail.hwlx
                        hawb.batterymodel = hawb.batterymodel || this.mawbdetail.batterymodel
                        hawb.sfg = hawb.sfg || this.mawbdetail.sfg
                        hawb.mdg = hawb.mdg || this.mawbdetail.mdg
                        hawb.gid = hawb.gid || this.mawbdetail.gid
                        hawb.area = hawb.area || this.mawbdetail.area
                    })
                })
        }
    }
</script>

<style lang="less" scoped>
</style>