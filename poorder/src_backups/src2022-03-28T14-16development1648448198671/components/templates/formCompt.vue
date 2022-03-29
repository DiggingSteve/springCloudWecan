<template>

  <div class="page-container-main formCompt-c" v-enterfocus>
    <!-- 基本信息模板 -->
    <template v-for="(item,itemIndex) in inputViewData">


      <div
        :style="[{'width':item.width==50?'560px':item.width+'%','height':item.height&&item.type!=15?item.height+'px':''},item.idStyle]"
        :key="item.id" :id="item.id" v-if="!item.hidden">
        <div class="input-item" :class="[item.class,{disabled:item.disabled}]" :style="[item.itemStyle]">


          <div class="input-title" :style="[item.titleStyle]"
            v-show="item.type!=13&&item.type!=14&&item.type!=15&&item.title&&!item.hidden">
            <!-- {{item.title}} -->
            {{ $t(item.title) }}
            <!-- {{ $t(item.title) }} -->
            <!-- {{$t(`message.${item.id}`).indexOf('message.')>=0?item.title:$t(`message.${item.id}`)}} -->
          </div>
          <div class="input-content" :class="[item.required==true?'input-required':'']"
            :style="[{'margin-left':item.left? item.left+'px':'0px','padding-top':item.paddingTop?item.paddingTop:''},item.contentStyle]">

            <template v-if="item.type==1">
              <el-input v-model.trim="item.model" :placeholder="item.placeholder" clearable
                v-if="item.id == 'sfg' || item.id == 'mdg'" v-verify="'sfgmdg'" :disabled="item.disabled"></el-input>
              <el-input v-model.trim="item.model" :placeholder="item.placeholder" clearable v-verify="item.verify"
                :disabled="item.disabled" v-else></el-input>
            </template>


            <template v-else-if="item.type==2">
              <el-checkbox-group v-model="item.model">
                <el-checkbox v-for="checkitem in item.options" :label="checkitem" :key="checkitem"
                  :disabled="item.disabled">{{checkitem}}</el-checkbox>
              </el-checkbox-group>
            </template>

            <template v-else-if="item.type==3">
              <el-radio v-model="item.model" :disabled="item.disabled" v-for="(radioitem,radioIndex) in item.options"
                :label="radioitem.value" :key="radioIndex"
                :style="{'min-width':item.minW+'px','margin-left':item.minW+'px'}">{{radioitem.label}}</el-radio>
            </template>


            <template v-else-if="item.type==4">
              <el-select v-model="item.model" placeholder="请选择" :disabled="item.disabled"
                :style="{'width':item.selectWidth?item.selectWidth+'%':''}">
                <el-option v-for="(selitem,cindex) in item.options" :key="cindex" :label="selitem.label"
                  :value="selitem.value">
                </el-option>
              </el-select>
            </template>

            <template v-else-if="item.type==5">
              <el-select v-model="item.model" multiple placeholder="请选择" size="mini" :disabled="item.disabled">
                <li class="el-select-dropdown__item" @click="selmultiAll(item.title)"><span>全部</span></li>
                <el-option v-for="selMulitem in item.options" :key="selMulitem.value" :label="selMulitem.label"
                  :value="selMulitem.value">
                </el-option>
              </el-select>
            </template>

            <template v-else-if="item.type==6">
              <el-date-picker v-model="item.model" :type="item.datetype || 'date'"
                :value-format="item.format || 'yyyy-MM-dd'" :placeholder="item.placeholder || '选择日期'"
                :editable="item.editable" :disabled="item.disabled">
              </el-date-picker>
            </template>

            <template v-else-if="item.type==7">
              <el-date-picker v-model="item.model" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" :disabled="item.disabled">
              </el-date-picker>
            </template>

            <template v-else-if="item.type==8">
              <div style="position:relative">
                <i class="el-icon-edit" @click="textareaShow(itemIndex)"
                  style="cursor:pointer;position:absolute;top:-4px" :style="{color:item.model?'red':''}"></i>
                <span v-show="item.ifconShow" @click.stop="item.ifconShow=true"
                  style="cursor:pointer;position:absolute;left:30px">
                  <el-input type="textarea" v-model="item.model" :disabled="item.disabled"></el-input>
                </span>
              </div>
            </template>

            <!-- 分泡 -->
            <template v-else-if="item.type==9">
              <div v-for="inputItem in item.options" style="display:inline-block;width:160px;white-space:nowrap;">
                <span style="display:inline-block;width:50px;text-align:right">{{inputItem.title}}</span>
                <el-input v-model="inputItem.model" type="text"
                  @change="fpChange(inputItem.id,item.seque,inputItem.model)" style="width:50px;"></el-input>
              </div>
            </template>

            <!-- 委托项目 -->
            <template v-else-if="item.type==10">
              <el-select v-model="item.model" filterable @change="wtdata" @blur="wtxmBlur" :disabled="item.disabled"
                ref="wtxm">
                <el-option v-for="selitem in wtxmOptions" :key="selitem.id" :label="selitem.usr_name"
                  :value="selitem.id">
                </el-option>
              </el-select>
              <customerRel ref="customerRel" v-if="item.showCustomerRel" :fid="inputModelData.fid || ''"
                :gid="inputModelData.gid || ''" @changeRelData="handleChangeRelData">
              </customerRel>
            </template>
            <!-- 委托客户 -->
            <template v-else-if="item.type==11">
              <pageSelect :pagetype="8" :modelval.sync="item.model" @change="getWtkhMsg" :disabled="item.disabled">
              </pageSelect>
            </template>

            <template v-else-if="item.type==12">

              <el-date-picker v-model="item.model" type="datetime" placeholder="选择日期时间"
                :format="item.format || 'yyyy-MM-dd HH:mm' " :value-format="item.format || 'yyyy-MM-dd HH:mm'"
                :disabled="item.disabled">
              </el-date-picker>
            </template>


            <!-- 特殊 -->
            <!-- 贸易方式 -->
            <template v-else-if="item.type==16">
              <div v-for="(radioitem,radioIndex) in item.options" style="margin-top:5px">
                <span
                  style="min-width:120px;margin-left:12px;display:inline-block;font-size:14px;">{{radioitem.title}}</span>
                <span style="display:inline-block;min-width:550px">
                  <el-radio v-model="item.model" v-for="(radioitem2,radioIndex2) in radioitem.detailS"
                    :label="radioitem2" :key="radioIndex2" :style="{'min-width':item.minW+'px'}">{{radioitem2}}
                  </el-radio>
                </span>
                <span style="color:red;font-size:14px"
                  v-if="projectIsWecan&&radioIndex==0&&item.model&&(item.model=='CIF'||item.model=='C&F'||item.model=='DDP'||item.model=='DAP'||item.model=='DAT')">{{`选择${item.model}不会进入海外D/N账单流程!`}}</span>
                <span style="color:red;font-size:14px"
                  v-if="projectIsWecan&&radioIndex==1&&item.model&&(item.model=='FOB'||item.model=='FCA'||item.model=='EXW')">{{`选择${item.model}会进入海外D/N账单流程!`}}</span>
              </div>
            </template>



            <template v-else-if="item.type==17">
              <el-input type="textarea" v-model="item.model" :disabled="item.disabled" v-verify="item.verify">
              </el-input>
            </template>





            <template v-else-if="item.type==18">
              <div :style="item.style" style="text-indent:8px" :disabled="item.disabled">{{item.model}}</div>
            </template>

            <template v-else-if="item.type==20">
              <pageSelect :pagetype="item.pagetype" :modelval.sync="item.model" :disabled="item.disabled"></pageSelect>
            </template>




            <template v-else>
              <slot :name="item.id" :data="item.model" :disabled="item.disabled"></slot>
            </template>



          </div>
        </div>
      </div>

      <template v-if="item.type==19">
        <slot :name="item.id"></slot>
      </template>

    </template>

  </div>


</template>
<script>

  import { filterGroupid } from '../../api/localStorage.js'

  // type 1简单输入框 2.多选 3单选 4下拉 5下拉多选 6单日期 7.双日期 8操作要求 9分泡 嵌套输入框  10委托项目  11委托客户
  //12完整时间(时分秒)  16贸易方式  17纯textarea 18直接显示数据 19插入新的表单组件
  //20 组合网格  pagetype 类型值
  //width是输入框组件在每行所占的百分比
  //class 是输入框占父级的宽度
  import { Notification } from 'element-ui';
  import customerRel from './customerRel'

  export default {
    props: {
      inputViewData: Array,
      inputModelData: {
        type: Object,
        default() {
          return {}
        }
      },
      area: String,
      sfgfpmsv: String
    },
    components: {
      customerRel
    },
    data() {
      return {
        extarShow: -1,
        hwlxR: "",
        batteryR: -1,
        showHwlx: true,
        showBattery: false,
        wtxmOptions: [],
        wtkhRowdata: {},
        wtxmRowdata: {},
        //hwlxR:
      }

    },
    methods: {
      selmultiAll(name) { //下拉全选
        let condition = this.inputViewData
        //console.log(name)
        for (let i in condition) {
          if (name == condition[i].title) {
            if (condition[i].options.length != condition[i].model.length) {
              condition[i].model = []
              let res2 = condition[i].options
              for (let j in res2) {
                //if(res2.indexOf())
                condition[i].model.push(res2[j].value)
              }
              //
            } else {
              condition[i].model = []
            }
          }
        }
      }
      , getWtkhMsg(val) {
        this.wtkhRowdata = val
        let inputViewData = this.inputViewData;
        for (let i in inputViewData) {
          if (inputViewData[i].type == 10) {
            inputViewData[i].model = ''
          }
        }

        this.setWtxmOptions(val.id)
      },
      wtxmBlur() {
        setTimeout(() => { this.$refs.wtxm[0].blur() }, 100)
      },
      setWtxmOptions(id) {
        // alert(id)
        var wtxmOptions = []

        var wtxm = getxmdata('wtxmNoname')
        //  console.log(id)

        //     console.log(JSON.stringify(wtxm))

        var area = this.area || this.$store.state.areaState
        /*  if(area=='市场部'||area=='海外部'){
           area='香港'
         } */
        wtxm = wtxm.filter(i => {
          return i.usr_status == 1 && i.comxz.split(',').includes('1') && (i.area == -1 || i.area == '全部' || i.area.split(',').includes(area)) && i.iscommit == 2 && (i.system == -1 || i.system == '全部' || i.system.split(',').includes('380')) && i.customxz != 2
        })
        //    console.log(JSON.stringify(wtxm))
        var wtkh = getxmdata('wtkhUseful')
        wtkh.forEach(i => {
          if (i.id == id) {
            this.wtkhRowdata = i
          }
        })
        wtxm.forEach(i => {
          if (i.fid == id) {
            wtxmOptions.push(i)
          }
        })
        let inputViewData = this.inputViewData;
        for (let i in inputViewData) {
          if (inputViewData[i].type == 10) {
            if (wtxmOptions.length == 1) {
              inputViewData[i].model = wtxmOptions[0].id;
              this.wtxmRowdata = wtxmOptions[0]
            } else {
              wtxmOptions.forEach(m => {
                if (m.id == inputViewData[i].model) {
                  this.wtxmRowdata = m
                }
              })
            }

          }
        }



        if (Object.keys(this.wtkhRowdata).length > 0) {
          this.$emit('wtdataP', { wtkhname: this.wtkhRowdata.usr_name, wtkhcode: this.wtkhRowdata.usr_code, wtxmname: this.wtxmRowdata.usr_name, wtxmcode: this.wtxmRowdata.usr_code });
        }


        //console.log(wtxmOptions)
        this.wtxmOptions = wtxmOptions
      }
      , textareaShow(index) {

        this.extarShow = index;
        let inputViewData = this.inputViewData;
        if (inputViewData[index].ifconShow == true) {
          document.body.removeEventListener('click', this.closeMenu);
          inputViewData[index].ifconShow = !inputViewData[index].ifconShow;
          document.body.addEventListener('click', this.closeMenu)
        } else {

          setTimeout(() => {
            inputViewData[index].ifconShow = !inputViewData[index].ifconShow;
          }, 0);
        }


      }
      , closeMenu() {
        let index = this.extarShow;
        let inputViewData = this.inputViewData;
        for (let i in inputViewData) {
          if (inputViewData[i].type == 8) {
            inputViewData[i].ifconShow = false;
          }
        }
      },
      wtdata(val) {
        getxmdata('wtxm').forEach(i => {
          if (i.id == val) {
            this.$emit('wtdataP', { wtkhname: this.wtkhRowdata.usr_name, wtkhcode: this.wtkhRowdata.usr_code, wtxmname: i.usr_name, wtxmcode: i.usr_code });
          }
        })
      },
      fpChange(id, val2, model) {
        console.log(model)
        var inputData = this.inputViewData;

        console.log(this.inputModelData)
        if (model) {
          if (model.length == '1' && this.sfgfpmsv && this.sfgfpmsv == '利润分配模式') {
            var reg = /^([1-9]+([.]{1}[0-9]{0,1})?)$/
          } else {
            var reg = /^([0-9]+([.]{1}[0-9]{0,1})?)$/
          }

          if (!reg.test(Number(model)) || Number(model) > 10) {

            this.$message.error('请输入1-10的小数')
            //格式不正确清空
            for (var i in inputData) {
              if (inputData[i].type == 9 && inputData[i].seque == val2) {
                var optionsData = inputData[i].options
                for (var j in optionsData) {
                  if (optionsData[j].id == id) {
                    optionsData[j].model = ""
                  }
                }
              }
            }

            return false;
          }
          for (var i in inputData) {
            if (inputData[i].type == 9 && inputData[i].seque == val2) {
              var optionsData = inputData[i].options
              for (var j in optionsData) {
                if (optionsData[j].id != id) {
                  // debugger;
                  optionsData[j].model = Number(10 - Number(model))
                  if (String(optionsData[j].model).indexOf('.') != '-1') {
                    optionsData[j].model = Number(optionsData[j].model).toFixed(1)
                  }
                }
              }
            }
          }
          //console.log()
        } else {

          for (var i in inputData) {
            if (inputData[i].type == 9 && inputData[i].seque == val2) {
              var optionsData = inputData[i].options
              for (var j in optionsData) {
                if (this.sfgfpmsv && this.sfgfpmsv == '利润分配模式') {

                } else {
                  if (optionsData[j].id != id) {
                    optionsData[j].model = 10
                  } else {
                    optionsData[j].model = 0
                  }
                }


              }
            }
          }
        }

        ////console.log(id)
      }
      , evaluationModel() {

        var val = this.inputModelData
        for (let i in this.inputViewData) {
          let item = this.inputViewData[i]
          // 分泡比例
          if (item.type == 9) {
            item.options.forEach(option => {
              option.model = val[option.id] || option.model
            })
          }
          if (item.id) {
            item.model = val[item.id] || item.defaultModel || ""
            if ((item.type == 6 || item.type == 12) && val[item.id] && (val[item.id].indexOf('1900') >= 0 || val[item.id].indexOf('0001') >= 0)) {
              item.model = ""
            }



          }
        }
      },
      handleChangeRelData($event) {
        this.$emit('changeRelData', $event)
      }
    }
    , created() {
      //var groupType=localStorage.getItem('groupType')
      var inputData = this.inputViewData
      for (var i in inputData) {
        if (inputData[i].type == 13) {
          //if()

          for (var j in inputData[i].options) {
            if (inputData[i].options[j].label == inputData[i].model) {

              this.hwlxR == inputData[i].options[j].id


            }
          }
        }
      }
      // hwlxR(){
      //   var groupType=localStorage.getItem('groupType')
      //   var inputData=this.inputViewData
      //   for(var i in inputData){
      //    for(var j in groupType){
      //     if(groupType[j].groupid==115){
      //      if(groupType[j].)
      //     }
      //    }
      //   }
      // }
      ////console.log(groupid)
      // let inputViewData=this.inputViewData;
      // for(let i in inputViewData){
      //    if(inputViewData[i].groupid){
      //      for(let j in groupid){
      //        if(inputViewData[i].groupid==groupid[j].groupid){
      //          //console.log(groupid[j].name)
      //          inputViewData[i].options.push(groupid[j].name)
      //        }
      //      }
      //    }
      // }

      this.inputViewData.forEach((item) => {
        if (item.model && item.type == 11) {
          this.$nextTick(() => {
            this.setWtxmOptions(item.model)
          })

        }
        if (item.type == 16) {
          item.options[0].detailS = []
          item.options[1].detailS = []
          JSON.parse(localStorage.getItem('groupType')).forEach(i => {
            if (i.groupid == 133) {
              if (i.ready02 == 'PP') {
                item.options[0].detailS.push(i.ready01)
              } else {
                item.options[1].detailS.push(i.ready01)

              }
            }
          });
        }
      })

    },
    computed: {

    },
    mounted() {
      //  this.evaluationModel()
      //  filterGroupid(this.inputViewData)
      let groupData = JSON.parse(localStorage.getItem('groupType'))
      let currencyData = JSON.parse(localStorage.getItem('currencyData'))

      var inputData = this.inputViewData

      for (let i in inputData) {
        var index = 0
        for (let j in groupData) {
          if (inputData[i].groupid) {
            if (inputData[i].groupid == groupData[j].groupid) {
              //inputData[i].options.push({ 'value': groupData[j].typename, 'label': groupData[j].typename })
              this.$set(this.inputViewData[i].options, index, { 'value': groupData[j].ready01, 'label': groupData[j].typename })
              index += 1;
            }
          }
        }

        if (inputData[i].id == 'currency' || inputData[i].id == 'currency_out') {
          this.inputViewData[i].options=[];
          for (let j in currencyData) {
            this.$set(this.inputViewData[i].options, j, { 'value': currencyData[j].cname, 'label': currencyData[j].cname })
          }
        }

      }




    },
    watch: {
      extarShow(index) {
        document.body.addEventListener('click', this.closeMenu)
      },
      inputViewData: {
        handler(curVal, oldVal) {

          this.inputViewData.forEach((item) => {
            if (item.id) {
              this.$set(this.inputModelData, item.id, item.model);
            }
            if (item.type == 9) {
              this.$set(this.inputModelData, item.options[0].id, item.options[0].model);
              this.$set(this.inputModelData, item.options[1].id, item.options[1].model);
            }
            if (item.model && item.type == 11) {
              this.$nextTick(() => {
                this.setWtxmOptions(item.model)
              })

            }

          })

        },
        deep: true
      },
      inputModelData: {
        handler() {
          this.evaluationModel()
        },
        immediate: true,
        deep: true

      }

    }

  }


</script>
<style scoped lang='less'>
  .formCompt-c .el-date-editor .el-range__icon,
  .formCompt-c .el-date-editor .el-icon-date {
    line-height: 8px;
  }

  .formCompt-c {
    .input-item {
      width: 280px;
      min-width: 280px;
      margin: 4px 0;
      display: flex;
      align-items: center;
    }

    .input-title {
      color: #333;
      width: 110px;
      text-align: right;
      flex-shrink: 0;
      padding-right: 5px;
      height: 28px;
      line-height: 28px;
      white-space: nowrap;
      font-weight: normal;
    }

    .input-content {
      flex-grow: 1;
    }

    .input-content .el-select {
      width: 100%;
    }

    h2 {
      font-size: 16px;
      color: #444;
    }
  }

  #gid {
    .input-content {
      display: flex;

      /deep/ .el-button {
        height: 28px;
        margin-left: 10px;
      }
    }
  }
</style>