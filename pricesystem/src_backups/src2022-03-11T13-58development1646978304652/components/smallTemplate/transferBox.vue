<template>
  <div
    class="pageSelect"
    v-bind:class="{
      noborder: type == 'inline',
      required: required != '',
    }"
    style="width: 100%; display: flex; align-items: center; position: relative;"
  >
    <span
      class="input_title"
      v-if="type == 'inline'"
    >{{ title }}</span>
    <div
      @click.stop="visible=!visible"
      style="width: 83%"
    >
      <div style="width: 100%; height: 24px;">
        <el-tag
          v-for="(tag, index) in value"
          :key="index"
          closable
          type="info"
          size="medium"
          @close="handleClose(tag)"
          style="margin-right: 5px;"
        >
          {{tag}}
        </el-tag>
      </div>

      <span class="el-input__suffix">
        <span class="el-input__suffix-inner">
          <i
            class="el-select__caret el-input__icon el-icon-arrow-up          "
            :class="{'is-reverse': visible}"
          >
          </i>
        </span>
      </span>
    </div>
    <el-collapse-transition>
      <div
        class="content-wrapper"
        v-if="visible"
        @click.stop
      >
        <v-transfer
          filterable
          :filter-method="filterFunc"
          filter-placeholder="请输入"
          v-model="value"
          :data="dataAll"
          :titles="titles"
          :props="{
          key: 'airnum',
          label: 'airnum'
        }"
          @enter="handleEnter"
          @change="handleChange"
        >

          <div slot-scope="{ option }" style="display: flex;">
            <span style="margin-right: 15px;">
              {{ option.airnum}}
            </span>
            <el-checkbox-group v-model="option.weekList" @change="handleChange">
              <el-checkbox
              @change="handleChange"
                :label="item.value"
                v-for="item in weekEnum"
                :key="item.value"
                v-if="option.weekList.includes(item.value)||option.isSelfInput == '1'"
                :disabled="!(option.isSelfInput == '1')"
              >{{item.label}}</el-checkbox>

            </el-checkbox-group>
            <!-- <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注"
              v-model="option.remark"
              @change="handleChange"
            >
            </el-input> -->

          </div>

        </v-transfer>
      </div>
    </el-collapse-transition>

  </div>
</template>
<script>

import { hbhinfo } from "../../api/getBasicStorageData";
import Transfer from './transferPanelMain'
export default {
  props: {
   required: {
      //传任何字符串都为必须将更改背景色
      type: String,
      default: () => "",
    },
    titles:{
      type:Array,
      default:()=>["航班号列表","已选择"]
    },
    type: {
      // 默认样式
      //"default"左输入框标题右el-select
      //"inline" 标题内嵌在边框内部去掉了el-input__inner的边框改到pageselect外部
      type: [String],
      default: () => "default",
    },
    pagetype: {
      //可以直接选择的组件类型 1委托客户(公司) 2 委托项目 ，3供应商项目  4.结算项目  指定类型之后不用传pagedata
      type: [Number, String],
      default: -1,
    },
    pagedata: {
      //传入的分页数据
      type: Array,
      default: () => [],
    },
    //过滤条件 120 hbh下需要通过twocode sfg 取出航班号并且去重
    filterObj: {
      type: Object,
      default: () => {},
    },
    allowCreate:{
      type:Boolean,
      default:()=>false
    },
    viewdata: {
      type: Array,
      default() {
         if (this.pagetype == 120) {
          return [
            { title: "airnum", field: "airnum" }, //配置绑定label 和 value 字段名
            { title: "航班号", field: "airnum" }, //配置绑定label 和 value 字段名
          ];
        } 
      },
    },
    modelval: [String, Array], //传入的值
    disabled: {
      // 是否禁用
      type: Boolean,
      default: () => false,
    },
    title: String,
    placeholder: {
      type: String,
      default: () => {
        return this.placeholder;
      },
    },
  },
  components: {
    'v-transfer': Transfer
  },

  mounted() {
    const self = this;

     this.setpagedata()

     document.addEventListener('click', 
      function() {
        self.visible = false
      }
     )
  },

  data() {
    return {
      dataAll: [], //初始和过滤后的数据
      pageSize: 10,
      pageDataBackups: [], //备份的全部数据
      isFilterBlock: false, // 查询时阻塞filter-method 重入
      value: this.changeType(this.modelval),  
      visible: false,
       weekEnum: [
         {
           value: '1',
           label: '周一',
         },
         {
           value: '2',
           label: '周二'
         },
         {
           value: '3',
           label: '周三'
         },
         {
           value: '4',
           label: '周四'
         },
         {
           value: '5',
           label: '周五'
         },
         {
           value: '6',
           label: '周六'
         },
         {
           value: '7',
           label: '周日'
         },
       ],
       addData: [],
    };

   
  },
  methods: {
    // 穿梭框改变值
    changeType(data) {
      if ( typeof data == 'string') {
        return data ? data.split(',') : [];
      } else if ( typeof data == 'object'){
        return data.map(item=> item.hbh)
      }
      return []
    },

    // 删除tag
    handleClose(tag) {
       this.value.splice(this.value.indexOf(tag), 1);
    },

    handleEnter(val) {
      if (this.addData.every(item => item.airnum != val)) {
        this.addData.unshift({
        airnum: val,
        weekList: [],
        remark: '',
        isSelfInput: '1',
      })
      this.dataAll = [...this.addData, ...this.dataAll]
      }
      
    },

    filterFunc(val, item, type) {

      if(val) {
        return item.airnum.toUpperCase().indexOf(val.toUpperCase()) > -1;
      } else {
        return true
      }
    },
  
    setpagedata() {
      var val = this.pagetype;

      let infoname = "";
      
      if (val == 120) {
        infoname = hbhinfo;
      }
      let pageDataBackups =
        JSON.parse(localStorage.getItem(infoname)) ||
        JSON.parse(sessionStorage.getItem(infoname)) ||
        getxmdata(infoname) ||
        [];

      if (val == 120) {
        var con = this.filterObj;
        var sfg = con.sfg;
        var mdg = con.mdg;
        var twocode = con.twocode;
        if(!sfg||!mdg||!twocode) return;
        let url =
          this.$store.state.publicWebApi + "api/AirFlight/GetDetailList";
        this.$axios({
          method: "get",
          url: url,
          params: { sfg: sfg, mdg: mdg, twocode: twocode },
          loading: false,
          tip: false,
        }).then((result) => {
          pageDataBackups = result.data;
          pageDataBackups = pageDataBackups.filter((p) => {
            return (
              p.sfg == sfg &&
              p.mdg == mdg &&
              twocode.indexOf(p.airnum.slice(0, 2)) > -1
            );
          });
          var obj = {};
          pageDataBackups = pageDataBackups.reduce((item, next) => {
            obj[next.airnum]
              ? ""
              : (obj[next.airnum] = true && item.push(next));
            return item;
          }, []);
           pageDataBackups.forEach(item => {
             item.remark = ''; //航班号
             item.weekList = item.airweek.split('/').filter(item => item)
           });

          let handleData = [ ...this.addData, ...pageDataBackups]
          let modelval = JSON.parse(JSON.stringify(this.modelval));
          modelval.forEach(item => {
            item.airnum = item.hbh;
            item.airweek = item.schedule.replace(/,/g, '/');
            item.weekList = item.schedule.split(',');
          })
          for (let data of handleData) {
            if(!modelval.some(item => item.hbh == data.airnum)) {
              modelval.push(data)
            }
          } 
          this.dataAll = modelval
        });
      }

    },

    handleChange() {
       let arr = [];
        for(let hbh of this.value) {
          for(let item of this.dataAll) {
            if (item.airnum === hbh) {
              let obj = {}
              obj.remark = item.remark;
              obj.hbh = item.airnum;
              obj.schedule = item.weekList.join(',');
              obj.isSelfInput = item.isSelfInput || '2';
              arr.push(obj)
            }
          }
        }
        this.$emit("update:modelval", arr);
    }
  },
  computed: {
  },
  watch: {
    visible(val) {
      if (val) {
        this.setpagedata()
      }
    },

    modelval: {
      handler(val) {
        this.value = this.changeType(val);
      }
    },

    filterObj: {
      handler(val, oldValue) {
        if (JSON.stringify(val) != JSON.stringify(oldValue))
         this.setpagedata()
      }
    }
  },
};
</script>
<style lang="less" scoped>
.mulFlex {
  width: auto;
  min-width: 510px;
  display: flex;
  justify-content: space-between;
  span {
    flex: 1;
    text-align: center;
    min-width: 130px;
  }
  span:last-child {
    text-align: right;
  }
  span:first-child {
    text-align: left;
  }
  &::after {
    display: none;
  }
}
.mulSelPane-title {
  font-size: 14px;
  color: #333;
  position: absolute;
  top: 0px;
  background: #fff;
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  padding: 0px 20px;
}
.input_title {
  padding: 5px;
}
.required {
  background: #fffcf0;
}

/deep/.el-checkbox {
  margin-right: 12px;
}

/deep/.el-checkbox:last-of-type {
  margin-right: 12px;
}

/deep/.el-checkbox-group {
  white-space: initial;
}

/deep/.el-tag--medium {
  height: 25px;
  line-height: 25px;
}

/deep/.el-tag .el-icon-close {
  top: -1px;
}
</style>
<style>
/*隐藏 el-input__inner边框 改造原控件样式*/
.pageSelect.noborder .el-input__inner {
  border: 0 !important;
}
.pageSelect.noborder {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-input__inner {
  background-color: transparent !important;
}

.content-wrapper {
  position: absolute;
  top: 32px;
  left: 0px;
  width: 880px;
  background: white;
  box-shadow: 0 4px 9px grey;
  z-index: 999;
  padding: 10px;
  border-radius: 5px;
  max-height: 500px;
}
</style>

