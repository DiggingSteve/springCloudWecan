<template>
  <div>
    <div class="page-container-box">
      <!-- {{selectTableIndex}} -->
      <!-- {{inputModelData}} -->
      <!-- <hr> -->
      <!-- {{searchData}} -->
      <!-- {{inputViewData}} -->
      <!-- <newFormCmpt
        :name="name"
        :view-data.sync="inputViewData"
        :model-data.sync="inputModelData"
        :search-data.sync="searchData"
        :pageshow.sync="pageshow"
        :chinese-where.sync="chineseWhere"
        :pagetype="1"
      ></newFormCmpt> -->
      <newSearchComp :name="name" :view-data.sync="inputViewData" :model-data.sync="inputModelData"
        :search-data.sync="searchData" :chinese-where.sync="chineseWhere" :pageshow.sync="pageshow" @reset="reset" system="空进">
      </newSearchComp>
      <div class="searchForm">
        <el-button @click="search">查询</el-button>
        <!-- <el-button @click="reset">重置</el-button> -->
        <!-- <el-button @click="openMergeDialog" v-if="$store.state.ifMergeHawb">订单合并</el-button> -->
      </div>
    </div>


    <!-- transmitMsg 接收子组件点击分单详细加号的索引  用来查询子表格数据-->
    <tableCompt :name="name" :table-data-res="tableDataRes" :nestedTableType="2" :chinese-where="chineseWhere" >
      <template slot="display" slot-scope="props">
        <i class="el-icon-picture" title="本票照片" @click="showImgFunc(props.data.index)"></i>
      </template>
      <template slot="currentPiece" slot-scope="props">
          {{props.data.row.allpiece||0}}/{{props.data.row.goodspiece||0}}/{{props.data.row.hawbybpiece||0}}
      </template>
      <template slot='isabnormal' slot-scope='props'>
          {{props.data.value=='1'?'有':'无'}}
      </template>
      <template slot="jjd" slot-scope="props">
          {{getJjd(props.data.value)}}
      </template>
    </tableCompt>

    <el-dialog :visible.sync="imgShow" class="dialogImgDoc" :close-on-click-modal="false" v-if="imgShow" width="980px"
      append-to-body top="0">
      <iframe :src="imgUrl" frameborder="0" allowtransparency="true"
        style="width: 100%; height: 100%; border: 0px none;"></iframe>
    </el-dialog>

  </div>
</template>
<script>
 
  import { systemCheck, mergeFunc, openZimessage, searchCmptMixins } from '@/components/mixins/topPageMixin'
  import {
    searCondition,
    getChangeValue,
    computedWeight,
    formatDate
  } from "../api/localStorage.js";
  // let wecanlogin = require('wecanlogin')
  // console.log(wecanlogin)
  export default {
    name: "inHouseMonitor",
    mixins: [mergeFunc, openZimessage, searchCmptMixins],
    components: {
      
    },
    props: {
      isMonitor: {//是否是订单监控页面
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        name: "inHouseMonitor.vue",
        inputViewData: {
          
        },
        inputModelData: {
          hwstatus:'AO2040'
          // status: "AO5010,AO5040,AO5020,AO5060,AO5090,AO5030,AO5050,AO5025"
        },
        imgUrl:'',//图片链接地址
        imgShow:false,//图片弹框
      };
    },
    created() {

      
    },
   
    methods: {
     
      openChatRoome(row){
          //从表格列表项进入 使用下面代码
          this.$store.commit("setChat", { status: true, data: row });
      },
      search() {
        if (this.$store.state.ifLimitSearch && Object.keys(this.searchData).length == 0) {
          return this.$message.error('请输入或选择查询条件！');
        }
        this.tableDataRes = [];
        //this.searchData.hpoid='-1'
        var jsonArr2 = {
          where: this.searchData,
          order: "adddate desc"
        };
        var json = { json: JSON.stringify(jsonArr2), routerName: this.name.split('.')[0] };

        this.$axios({
          method: "get",
          url: this.$store.state.wareStoreApi + "api/ExStore",
          params: json,
          loading: true,
          tip: false
        })
          .then(results => {
            if (results.data.length == 0) {
              this.$message("无查询结果");
              return;
            } else {
              this.pageshow = false;
            }

            setTimeout(() => {

              this.tableDataRes = getChangeValue(results.data, "空出");
            }, 0);
          })
          .catch(errors => { });
      },
      getJjd(val){
        return val!='-1'?JSON.parse(localStorage.jjd).filter(i=>i.id==val)[0]['cname']:'--'
      },
      showImgFunc(index) {
        this.imgShow = true;
        let data = this.tableDataRes[index];

        let mawbtype = data.orderdom == "直单" ? 1 : 2;
        let usrname = localStorage.usrname;
        this.imgUrl = `${this.$store.state.imgWebApi}boimgCommon/#/imgpage?username=${usrname}&mawb=${data.mawb}&sid=${data.guid}&mawbtype=${mawbtype}&area=${data.area}&orderSystem=空进&hawb=${data.hawb}`;
      },

    },
    computed: {

    }
  };
</script>


<style scoped lang="less">

</style>