<template>
  <div>
    <!-- {{khjcnolist}} -->
    <!-- {{serviceSelArr}} -->
    <div v-for="(item,index) in khjcnolist" :key="index" :class="{divItem:index>0}">
      <newFormCmpt :view-data.sync="view" :model-data.sync="item" :pagetype="2">
        <template slot="volume">
          <el-input v-model="item.volume" clearable style="width:147px;"></el-input>
          <i
            class="listViewBtn"
            style="margin-top:0px;transform: translateY(2px);margin-left:0px"
            :style="{color:index!=0?'red':'#67C23A'}"
            :class="[index!=0?'el-icon-remove':'el-icon-circle-plus']"
            :title="index!=0?'删除此条进仓编号':'新增一条进仓编号'"
            v-show="btnused"
            @click="listform(1,index)"
          ></i>
        </template>
      </newFormCmpt>
      <div v-for="(soteritem,index2) in item.volumelist" :key="index2" v-show="serviceSelArr.includes('AA0510') ">
        <newFormCmpt :view-data.sync="volumelist" :model-data.sync="soteritem" :pagetype="2">
          <slot slot="piece">
            <el-input
              v-model="soteritem.piece"
              v-verify="'integer'"
              clearable
              :class="{'input-required':soteritem.packagetypename}"
            ></el-input>
          </slot>
          <template slot="zise">
            <span>长</span>
            <el-input
              v-model="soteritem.longs"
              :class="{'input-required':soteritem.packagetypename}"
              style="width:110px;margin-right:25px"
            ></el-input>
            <span>宽</span>
            <el-input
              v-model="soteritem.widths"
              :class="{'input-required':soteritem.packagetypename}"
              style="width:104px;margin-right:25px"
            ></el-input>
            <span>高</span>
            <el-input
              v-model="soteritem.heights"
              :class="{'input-required':soteritem.packagetypename}"
              style="width:100px;margin-right:24px"
            ></el-input>
            <i
              class="listViewBtn"
              style="margin-left:-24px;margin-top:0px;transform: translateY(2px);"
              :style="{color:index2!=0?'red':'#67C23A'}"
              :class="[index2!=0?'el-icon-minus':'el-icon-plus']"
              :title="index2!=0?'删除此条尺寸':'新增一条尺寸'"
              @click="listform(2,index,index2)"
              v-show="btnused"
            ></i>
          </template>
        </newFormCmpt>
      </div>
    </div>
  </div>
</template>

<script>
var storeObj = {
  packagetypename: "",
  piece: "",
  longs: "",
  widths: "",
  heights: ""
};

var khjcnoObj = {
  khjcno: "",
  piece: "",
  weight: "",
  volume: "",
  loadcardemand:'',
  bringfile:2,
  storeType: "",
  storename_yb: "",
  volumelist: [{ ...storeObj }]
};

export default {
  props: {
    hpoid:String,
    boguid:String,
    btnused:{//添加按钮在绑定或者下达的情况下不可用
      type:Boolean,
      default:true
    },
    inputModelData:Object,
    khjcnolist: {
      type: Array,
      default: () => []
    },
    serviceSelArr: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      view: {
        khjcno: {
          title: "进仓编号：",
          type: 1,
          required: true,
          titleStyle: {
            fontWeight: "700"
          },
          placeholder: "与其他业务可自动关联"
        },
        piece: {
          title: "件数：",
          type: 1,
          required: true,
          verify: "integer"
        },
        weight: {
          title: "重量：",
          type: 1,
          required: true,
          verify: "float"
        },
        volume: {
          title: "体积："
          // type: 1,
          // verify: "float"
        },
         bringfile: {
            title: "带回文件：",
            type: 3,
            options: [{
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 2
              }
            ],
            hidden:()=>!this.serviceSelArr.includes('AA0510') 
          },
        loadcardemand:{
          title:'装车要求：',
          type:1,
         // idStyle:{width:'50%'},
          itemStyle: {
              width: "817px"
            },
          hidden: () => !this.serviceSelArr.includes('AA0510') 
        }
      },
      volumelist: {
        packagetypename: {
          title: "包装类型：",
          filterable: true,
          type: 4,
          groupid: 31,
          bindValue: "typename"
        },
        piece: {
          title: "尺寸件数："
          // type: 1,
          // verify: "integer"
        },
        zise: {
          title: "尺寸(CM)：",
          idStyle: { width: "50%" },
          itemStyle: { width: "100%" }
        },
      }
      /*  khjcnolist: [
        {
          khjcno: "",
          piece: "",
          weight: "",
          volume: "",
          storeType: "",
          storename_yb: "",
          volumelist: [
            {
              packagetypename: "",
              piece: "",
              longs: "",
              widths: "",
              heights: ""
            }
          ]
        }
      ] */
    };
  },
  computed: {},
  created() {

  },
  watch: {
      khjcnolist: {
      handler(val) {
            if (this.khjcnolist.length == 0) {
              this.khjcnolist.push(JSON.parse(JSON.stringify(khjcnoObj)));
            }
            this.khjcnolist.forEach(i => {
              if (i.volumelist.length == 0) {
                i.volumelist.push({
                  packagetypename: "",
                  piece: "",
                  longs: "",
                  widths: "",
                  heights: ""
                });
              }
            });
          
         if(this.inputModelData){
            this.inputModelData.piece=this.khjcnolist.reduce((prev, i) => (prev += Number(i.piece)), 0)
            this.inputModelData.weight=this.khjcnolist.reduce((prev, i) => (prev += Number(i.weight)), 0)
            this.inputModelData.volume=this.khjcnolist.reduce((prev, i) => (prev += Number(i.volume)), 0)
         }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
   async listform(type, indexTop, indexSec) {
      if (type == 1) {
        let guid = this.khjcnolist[indexTop].guid;
        if (indexTop == 0) {
          this.khjcnolist.push(JSON.parse(JSON.stringify(khjcnoObj)));
        } else {
          if (!guid) {
            this.khjcnolist.splice(indexTop, 1);
          } else {
               let confirmDelete = await this.$confirm('将直接删除此条数据，是否继续', '删除提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(() => {})

                if (!confirmDelete) return

            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/HpoServiceKhjcno",
              data: { guid: guid,hpoid:this.hpoid, czman: localStorage.usrname,boguid:this.boguid },
              loading: false,
              tip: false
            }).then(results => {
              // console.log("删除1");
              // console.log(JSON.stringify(results.data));
              if (results.data.resultstatus == 0) {
                this.khjcnolist.splice(indexTop, 1);
              } else {
                this.$message.error(results.data.resultmessage);
              }
            });
          }
        }
      } else {
        let guid = this.khjcnolist[indexTop].volumelist[indexSec].guid;
        if (indexSec == 0) {
          this.khjcnolist[indexTop].volumelist.push(
            JSON.parse(JSON.stringify(storeObj))
          );
        } else {
          if (!guid) {
            this.khjcnolist[indexTop].volumelist.splice(indexSec, 1);
          } else {
            let confirmDelete = await this.$confirm('将直接删除此条数据，是否继续', '删除提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(() => {})

                if (!confirmDelete) return
            this.$axios({
              method: "delete",
              url: this.$store.state.webApi + "api/HpoServiceVolume",
              data: { guid: guid,hpoid:this.hpoid, czman: localStorage.usrname },
              loading: false,
              tip: false
            }).then(results => {
              console.log("删除2");
              console.log(JSON.stringify(results.data));
              if (results.data.resultstatus == 0) {
                this.khjcnolist[indexTop].volumelist.splice(indexSec, 1);
              } else {
                this.$message.error(results.data.resultmessage);
              }
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.divItem {
  margin: 12px 0px;
}
</style>
