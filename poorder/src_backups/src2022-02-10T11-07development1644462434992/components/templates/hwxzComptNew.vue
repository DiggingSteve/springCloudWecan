<template>
  <!-- <div class="hwxzform elitem" style="position: relative;"> -->
    <div class="hwxzform" style="position: relative;">
    <!-- <div v-if="!hidehwxz" style="position: absolute;top: 11px;left: 110px;background: #fff;z-index: 999;">
      <el-radio v-model="natureGoods" label="1">普货</el-radio>
      <el-radio v-model="natureGoods" label="2">非普货</el-radio>
    </div> -->
    <new-form-cmpt :view-data="hawbViewData" :model-data="inputModelData">
      <template slot="hwlx">
        <el-checkbox-group v-model="hwl">
          <el-checkbox v-for="(radioitem,index) in hwlxOptions" :disabled="radioitem.disabled"
            :class="{hwlxoptionsDisabled:radioitem.disabled}" v-show="!radioitem.hidden" :label="radioitem.typename"
            :key="index">
            {{$i18n.locale=='Chinese'?radioitem.typename:radioitem.entypename}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template slot="batterymodel">
        <el-checkbox-group v-model="bat" :disabled="disabled">
          <el-checkbox v-for="(radioitem,index) in batterymodelOp" :label="radioitem.typename" :key="index">
            {{$i18n.locale=='Chinese'?radioitem.typename:radioitem.entypename}}</el-checkbox>
        </el-checkbox-group>
      </template>
    </new-form-cmpt>
    <!-- <div v-if="outGuageString&&showGuageString" style="padding-left:108px;color:red">{{outGuageString}}</div> -->
  </div>

</template>

<script>



  export default {
    props: {
      inputModelData: {
        type: Object,
        default() {
          return {}
        }
      }
      , pagetype: { //1 新增页面  2修改页面
        type: Number,
        default: 1
      },
      hidehwxz: { //是否隐藏货物性质，分单里面需要隐藏
        type: Boolean,
        default: false
      },
      gooodsOutgauge: { //是否有货物超限，如果有货物超限，要在订舱信息的货物类型中显示对应的24小时选项
        type: Boolean,
        default: false
      },
      showGuageString: { 
        type: Boolean,
        default: false
        },
      disabled: Boolean
    },
    data() {
      return {
        natureGoods: '1',//货物性质前置选项；显示“普货、非普货”，选择非普货后再显示“危险品、冷冻品等等选项”
        hawbViewData: {
          hwxz: {
            "title": "货物性质",
            type: 3,
            "groupid": 115,
            idStyle: { width: '100%' },
            itemStyle: { width: '100%' },
            options: [],
            contentStyle: {
              // 'padding-left': '106px'
            },
            default:'普货'
          },
          hwlx: {
            "title": "货物类型", idStyle: { width: '100%' }, itemStyle: { width: '100%' }
          },
          batterymodel: {
            "title": "锂电池型号", idStyle: { width: '100%' }, itemStyle: { width: '100%' }
          }
        },
        hwlxOptions: [],
        batterymodelOp: []
      }
    },
    created() {
      this.$nextTick(() => {
        this.$watch(() => {
          return this.inputModelData.hwlx + this.gooodsOutgauge
        }, () => {
          this.hwlxOptions.forEach(i => {
            if (this.inputModelData.hwlx) {
              i.hidden = i.typename.includes('24小时') ? (this.gooodsOutgauge ? !this.inputModelData.hwlx.includes(i.typename.substr(4)) : true) : false
            } else {
              i.hidden = i.typename.includes('24小时')
            }
          })
        }, { immediate: true })
      })
    },

    watch: {
      disabled: {
        handler(val) {
          this.hawbViewData.hwxz.disabled = val
        },
        immediate: true
      },
      hidehwxz: {
        handler(val) {
          if (val) {
            this.hawbViewData.hwxz.itemStyle = { display: 'none' }
          }
        }, immediate: true
      },
      "inputModelData.hwxz": {
        handler(val) {
          var hwlxOptions = []
          var groupData = JSON.parse(localStorage.getItem('groupType'));

          groupData.forEach(i => {
            if ((i.groupid) == 115 && (i.typename == val)) {
              var ready02 = i.id
              groupData.forEach(m => {
                if ((m.ready02 == ready02) && (m.groupid == 109)) {
                  //  hwlxOptions.push({label:m.typename,value:m.typename})
                  hwlxOptions.push({
                    typename: m.typename,
                    entypename: m.entypename,
                    hidden: m.typename.includes('24小时'),
                    disabled: m.typename.includes('24小时')
                  })
                }
              })
              if (this.pagetype == 1) {
                // this.inputModelData.hwlx = hwlxOptions[0].typename
              } else {
                this.inputModelData.hwlx = this.inputModelData.hwlx || hwlxOptions[0].typename
              }
            }
          });

          this.hwlxOptions = hwlxOptions
          this.hawbViewData.hwlx.hidden = !val
          
        }, immediate: true

      },
      "inputModelData.hwlx": {
        handler(val) {
          //console.log(val)
          var batterymodelOp = []
          var groupData = JSON.parse(localStorage.getItem('groupType'));
          // if(val=="锂电池"){
          if (val && val.indexOf("锂电池") >= 0) {
            groupData.forEach(i => {
              if ((i.groupid) == 109 && (i.typename == '锂电池')) {
                var ready02 = i.id
                batterymodelOp = []
                groupData.forEach(m => {
                  if ((m.ready02 == ready02) && (m.groupid == 114)) {
                    // batterymodelOp.push({label:m.typename,value:m.typename})
                    batterymodelOp.push({ typename: m.typename, entypename: m.typename })
                  }
                })
                this.inputModelData.batterymodel = this.inputModelData.batterymodel || batterymodelOp[0].typename
              }
            });

            this.hawbViewData.batterymodel.hidden = false
            this.batterymodelOp = batterymodelOp

          } else {
            this.hawbViewData.batterymodel.hidden = true
            this.batterymodelOp = []
          }
          // if(batterymodelOp.length>0){
          //     this.hawbViewData[2].hidden=false
          //     this.batterymodelOp=batterymodelOp
          // }else{
          //   this.hawbViewData[2].hidden=true
          //   this.batterymodelOp=[]
          // }
        }, immediate: true
      }
      ,
      natureGoods: {
        handler(val) {
          // this.hawbViewData.hwxz.contentStyle = { display: val == 1 ? 'none' : 'inline-block', 'padding-left': '106px' }
          // this.inputModelData.hwxz = val == 1 ? '普货' : '危险品'
        }, immediate: true
      }

    },
    computed: {
      bat: {
        get() {
          return (this.inputModelData.batterymodel && this.inputModelData.batterymodel.split(',')) || []
        }, set(val) {
          this.inputModelData.batterymodel = val.length > 0 && val.toString()
        }
      }
      , hwl: {
        get() {
          // console.log(this.inputModelData.hwlx)
          return (this.inputModelData.hwlx && this.inputModelData.hwlx.split(',')) || []
        }, set(val) {
          this.inputModelData.hwlx = val.length > 0 && val.toString()
        }
      },
      outGuageString() {
        let data = this.inputModelData
        return [this.gooodsOutgauge?'超规':'非超规', data.hwlx.includes('锂电池') ? data.batterymodel : '', data.hwlx, data.hwxz].filter(i => !!i).join('--')
      }

    },
    methods: {

    },

  }
</script>

<style lang='less' scoped>
  .hwxzform {
    /deep/ label {
      min-width: 70px;
    }
  }

  .hwlxoptionsDisabled {
    /deep/ .el-checkbox__input {
      display: none;
    }

    /deep/ .el-checkbox__label {
      font-weight: bold;
      color:#000!important;
    }
  }
</style>