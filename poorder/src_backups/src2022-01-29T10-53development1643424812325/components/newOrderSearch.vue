<template>
  <div class="rootdiv">
    <!-- {{opersystem}}
    {{opersystemdom}} -->
    <!-- {{orderdom}}
    {{activeName}}-->
    <!-- {{$store.state.cities}} -->
    <!-- {{$store.state.systemCheck}} -->
    <!-- {{$store.state.areaState}}
    {{area}}-->

    <!-- {{mawbAddSystemOptions}}
    {{mawbAddSystemBackup}} -->
    <!-- {{$store.getters.userSetting.mawbAddSystem}} -->
    <newOrderAdd></newOrderAdd>
    <div style="display: none;">
      <div v-show="systemSelPane" style="margin-left:20px;margin-bottom:20px;">
        <h3 style="color:#333;margin-bottom:20px;">所属站点</h3>
        <el-select v-model="area" ref="userSettingCitiesSelect" placeholder="请选择" popper-class="userSettingCitiesSelect"
          class="input-required">
          <div class="el-icon-close" style="font-size: 20px;"
            @click="changeCitiesSelect=false;$refs.userSettingCitiesSelect.blur()"></div>
          <div class="title">
            <div class="title-left">
              <h3>区域选择</h3>
            </div>
            <div class="title-right">
              <!-- <p @click="checkAll = !checkAll" :class="['checkAll', {'active': checkAll}]">全选</p> -->
              <!-- <p @click="changeCitiesSelect=true;$refs.userSettingCitiesSelect.blur()" class="confirm">确定</p> -->
            </div>
          </div>
          <table>
            <tr>
              <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 0">
                <el-option-group :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                    style="width:204px;"></el-option>
                </el-option-group>
              </td>
            </tr>
            <tr>
              <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 1">
                <el-option-group :label="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                    style="width:204px;"></el-option>
                </el-option-group>
              </td>
            </tr>
          </table>
        </el-select>
      </div>

      <div v-show="systemSelPane&&area" style="margin-left:20px;">
        <h3 style="color:#333;margin-bottom:20px;">所属系统</h3>
        <!-- <div class="systemDiv">
        <div class="bdiv" v-for="(item,index) in systemArr" :key="index">
          <div
            class="systemItem"
            @click="setOperSystem(item.title)"
            :class="{active:opersystem==item.title}"
          >
            <span :class="item.class"></span>
            <span>{{item.title}}</span>
          </div>
        </div>
        <div style="width:20px"></div>
      </div>

      <div
        class="systemDiv"
        v-show="opersystem"
        style="height:100px;background-color:#F8F8F8;border:1px solid #EAEAEA;justify-content:space-around;margin-bottom:10px"
        v-if="opersystem!='国内服务'"
      >
        <div class="bdiv" v-for="(item,index) in modularArr" :key="index">
          <div
            class="systemItem modularItem"
            @click="opersystemdom=item.title"
            :class="{active:opersystemdom==item.title}"
          >
            <span :class="item.class"></span>
            <span>{{item.title}}</span>
          </div>
        </div>
      </div> -->


        <el-select v-model="mawbAddSystemBackup" placeholder="请选择" class="input-required"
          popper-class="userSettingSystemSelect">
          <div class="title">
            <div class="title-left">
              <h3>系统选择</h3>
            </div>
          </div>
          <table>
            <tr>
              <td v-for="(group) in mawbAddSystemOptions" :key="group.label">
                <el-option-group :label="group.label">
                  <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.label"
                    style="width:204px;"></el-option>
                </el-option-group>
              </td>
            </tr>
          </table>
        </el-select>
      </div>

      <!-- <div v-show="(opersystem&&opersystem!=='国内服务')&&systemSelPane&&opersystemdom&&area" style="margin-left:20px;">
      <h3 style="color:#333;margin:20px 0px;">上榜类型</h3>
                  <el-radio v-model="orderdom" label="总单">总单上榜</el-radio>
                  <el-radio v-model="orderdom" label="直单">直单上榜</el-radio>
                  <el-radio v-model="orderdom" label="分单" v-if="$store.state.ifMergeHawb">分单上榜</el-radio>
    </div> -->

      <!-- <el-form
      size="medium"
      v-show="(opersystem&&opersystem!=='国内服务')&&systemSelPane&&opersystemdom&&area"
      class="orderdomRadio"
    >
      <el-form-item label="选择新增上榜类型">
        <el-radio v-model="orderdom" label="总单">总单上榜</el-radio>
        <el-radio v-model="orderdom" label="直单">直单上榜</el-radio>
        <el-radio v-model="orderdom" label="分单" v-if="$store.state.ifMergeHawb">分单上榜</el-radio>
      </el-form-item>
    </el-form> -->

      <div style="margin-top:15px;margin-left:20px">
        <el-button type="primary" v-show="area&&mawbAddSystemBackup&&!serviceShow" @click="serviceShow=true">确认
        </el-button>
      </div>

      <div style="max-width:1450px;padding-top:0px;margin-top:15px" class="el-dialog__body"
        v-show="paneShow&&serviceShow">
        <mawbAdd :area="area" :opersystem="opersystem" :orderdom.sync="orderdom" :opersystemdom="opersystemdom"
          @success="successfunc" :systemSelPane.sync="systemSelPane"></mawbAdd>
      </div>
    </div>
  </div>
</template>

<script>
  import mawbAdd from "./orderDetails/mawbAddNew";
  import newOrderAdd from '@/components/newOrderAdd'

  import { searCondition } from "../api/localStorage.js";
  export default {
    name: "newOrderSearch",
    components: {
      mawbAdd, newOrderAdd
    },
    data() {
      return {
        name: "newOrderSearch.vue",
        activeName: "first",
        orderdom: "",
        systemArr: [
          { title: "出口", class: "exit" },
          { title: "进口", class: "imported" },
          { title: "国内服务", class: "domestic" }
        ],
        modularArr: [
          { title: "空运", class: "airtrans" },
          { title: "海运", class: "ocean" },
          { title: "陆运", class: "landtrans" },
          { title: "铁运", class: "irontrans" }
        ],
        mawbAddSystemOptions: [
          {
            label: "出口",
            options: [
              { label: "空出", value: "空运" },
              { label: "海出", value: "海运" },
              { label: "陆出", value: "陆运" },
              { label: "铁出", value: "铁运" }
            ]
          },
          {
            label: "进口",
            options: [
              { label: "空进", value: "空运" },
              { label: "海进", value: "海运" },
              { label: "陆进", value: "陆运" },
              { label: "铁进", value: "铁运" }
            ]
          },
          {
            label: "国内服务",
            options: [{ value: "国内服务", label: "国内服务" }]
          }
        ],
        mawbAddSystem: this.$store.getters.userSetting.mawbAddSystem,
        opersystem: "",
        opersystemdom: "",
        systemSelPane: true,
        serviceShow: false,
        area: '',
        cities: this.$store.state.cities
      };
    },
    methods: {
      search() {

      },
      tabclick(val) {
        this.orderdom = val.index == 1 ? "直单" : "总单";
      },
      successfunc(val) {
        /*   this.orderdom=''
                    setTimeout(() => {
                       // this.orderdom=val
                     //  this.orderdom=val.index==1?'直单':'总单'
                    }, 0);
   */
      },
      setOperSystem(title) {
        this.opersystem = title;
      }
    },
    watch: {
      //  '$store.getters.userSetting.mawbAddType':{
      //    handler(val){
      //      this.opersystem=val
      //      if(val!=='国内服务'){
      //        this.opersystemdom='空运'
      //      }
      //    },immediate:true
      //  },
    },
    created() {
         window.opener.queueObj.subscribe("运价查询订舱",function(dd){
         console.log("订阅111");
       })
      if (this.$store.getters.userSetting.mawbAddArea) {
        this.area = this.$store.getters.userSetting.mawbAddArea
      } else if (this.$store.state.areaState && this.$store.state.areaState.split(',').length === 1) {
        this.area = this.$store.state.areaState
      }
      if (this.$store.getters.userSetting.mawbAddSystem) {
        this.opersystem = this.$store.getters.userSetting.mawbAddSystem.opersystem || ''
        this.opersystemdom = this.$store.getters.userSetting.mawbAddSystem.opersystemdom || ''
      } else {
        let systemCheck = this.$store.state.systemCheck;
        if (systemCheck.length == 2) {
          this.opersystem = systemCheck[1] + "口";
          this.opersystemdom = systemCheck[0] + "运";
        }
        if (systemCheck.length == 4) {
          this.opersystem = "国内服务";
        }
      }

      this.$watch(() => {
        return this.area + this.mawbAddSystemBackup
      }, () => {
        if (this.area && this.mawbAddSystemBackup) {
          //  this.$alert('请确认所属站点与所属系统！', '操作提示', {
          //   confirmButtonText: '确定',
          //   callback: action => {               
          //   }
          // });
          this.serviceShow = false
        }
      })
 
    },
    computed: {
      mawbAddSystemBackup: {//系统选择
        get() {
          let system = ''
          let mawbAddSystem = this.mawbAddSystem

          if (mawbAddSystem && mawbAddSystem.opersystem && mawbAddSystem.opersystemdom) {
            this.mawbAddSystemOptions.forEach(item => {
              if (item.label === mawbAddSystem.opersystem) {
                item.options.forEach(option => {
                  if (option.value === mawbAddSystem.opersystemdom) {
                    system = option.label
                  }
                })
              }
            })
            return system
          } else {
            return ''
          }
        },
        set(val) {
          let opersystem = '', opersystemdom = ''
          for (let item of this.mawbAddSystemOptions) {
            for (let option of item.options) {
              if (option.label === val) {
                opersystem = item.label
                opersystemdom = option.value
              }
            }
          }
          this.opersystem = opersystem;
          this.opersystemdom = opersystemdom;
          this.mawbAddSystem = { opersystem, opersystemdom }
        }
      },
      paneShow() {
        // if (this.opersystem !== "国内服务") {
        //   return this.opersystemdom && this.orderdom;
        // }
        return this.opersystemdom && this.opersystem && this.area
      }
    },
    destroyed() { }
  };
</script>

<style scoped lang="less">
  .orderdomRadio {
    margin: 10px 0px;

    /deep/ .el-form-item__label {
      font-weight: 700;
    }

    /deep/ label {
      margin-left: 20px;
    }

    /deep/ .el-radio__inner {
      border-radius: 0px;
    }
  }

  .systemDiv {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 500px;
    margin: 20px 0px;
    font-size: 16px;
    font-weight: bold;

    .bdiv {
      overflow: hidden;
    }

    .active {
      color: #0e5a8c;

      span {
        filter: drop-shadow(140px 0 #0e5a8c);
        position: relative;
        left: -140px;
      }
    }
  }

  .modularItem {
    height: 60px;
    flex-direction: column;
    font-size: 14px;
    font-weight: normal;

    span:first-child {
      height: 30px !important;
      margin-right: 0px !important;
    }
  }

  .systemItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    span:first-child {
      display: inline-block;
      width: 36px;
      background-size: 100% 100%;
      height: 16px;
      margin-right: 10px;
    }

    .exit {
      background: url("/boStatic/images/exit.png") no-repeat left center;
    }

    .imported {
      background: url("/boStatic/images/imported.png") no-repeat left center;
    }

    .domestic {
      background: url("/boStatic/images/domestic.png") no-repeat left center;
      background-size: 24px 100% !important;
    }

    .airtrans {
      background: url("/boStatic/images/airtrans.png") no-repeat center center;
    }

    .ocean {
      background: url("/boStatic/images/ocean.png") no-repeat center center;
    }

    .landtrans {
      background: url("/boStatic/images/landtrans.png") no-repeat center center;
    }

    .irontrans {
      background: url("/boStatic/images/irontrans.png") no-repeat center center;
    }
  }

</style>

<style>
  .batch-print-dialog .el-dialog__close{
    position: relative !important;
    left: -26vw;
  }
</style>