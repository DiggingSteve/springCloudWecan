import { docUploadMixin } from '@/components/mixins/docUploadMixin';
<template>
  <div>
    <ul class="section-container">
      <!-- 节点联系人 -->
      <li class="navContainer" v-for="item in nodeContact" :key="item.area">
        {{ item.area }}
        <i class="el-icon-arrow-up down"></i>
        <el-collapse-transition name="el-fade-in-linear" :duration="2000">
          <ul class="personalContainer">
            <li
              v-for="(obj, index) in item.nodemanList"
              :key="index"
              @click="getLogname(obj.nodeman)"
            >
              <el-tooltip
                popper-class="contactTip"
                effect="dark"
                :content="obj.tip"
                placement="right"
              >
                <span><i class="el-icon-user"></i> {{ obj.nodeman }}</span>
              </el-tooltip>

              <span class="contactTo">@TA</span>
            </li>
          </ul>
        </el-collapse-transition>
      </li>
      <!-- 城市部门联系人 -->
      <!-- <li
        v-for="(item, index) in partList"
        :key="index"
        :class="['navContainer']"
        @click="showPart(index)"
      >
        {{ item.city }}
        <i class="el-icon-arrow-up down"></i>
        <el-collapse-transition name="el-fade-in-linear"
          :duration="2000"
          v-if="item.part.length && activeNavCityIndex == index && navCityIndexStatus"
        >
          <ul class="navContainer section">
            <li
              v-for="(partItem, i) in item.part"
              :key="partItem.section"
              @click.stop="getSection(i)"
              class="sectionLiStyle"
            >
              {{ partItem.section }}
               <i class="el-icon-arrow-up down"></i>
              <el-collapse-transition
                :duration="2000"
                v-if="
                  partItem.sectionCrewList.length > 0 && activeNavPartIndex == i && navPartIndexStatus
                "
              >
                <ul class="personalContainer">
                  <li
                    v-for="(people, val) in partItem.sectionCrewList"
                    :key="val"
                    @click="getLogname(people.logname)"
                  >
                    <i class="el-icon-user"></i>
                    {{ people.logname }}

                    <span class="contactTo">@TA</span>
                  </li>
                </ul>
              </el-collapse-transition>
            </li>
          </ul>
        </el-collapse-transition>
      </li> -->
    </ul>
  </div>
</template>

<script>
export default {
  inject: ["orderFormInfo"],
  data() {
    return {
      // 节点联系人
      activeNavStatus: false,
      activeNavNodeIndex: 2,
      activeNavCityIndex: -1, //选中的城市索引
      navCityIndexStatus: false,
      activeNavPartIndex: -1,
      navPartIndexStatus: false,
      partList: [],
      show: false,
      nodeContact: []
    };
  },
  watch: {
    'orderFormInfo.data.guid'(val){
      this.nodeContact = []
       this.getCargoNode()
    }
  },
  mounted() {
    const contact = JSON.parse(localStorage.getItem("comContact"));
    const obj = {};
    contact.forEach(item => {
      if (!obj[item.area]) {
        this.partList.push({ city: item.area, part: [] });
        obj[item.area] = true;
      }
    });

    const partObj = {};
    contact.forEach(item => {
      this.partList.forEach(obj => {
        if (item.area === obj.city && !partObj[item.department]) {
          obj.part.push({ section: item.department, sectionCrewList: [] });
          partObj[item.department] = true;
        }
      });
    });

    contact.forEach(item => {
      this.partList.forEach(obj => {
        obj.part.forEach(part => {
          if (item.area === obj.city && item.department === part.section) {
            // item.logname
            part.sectionCrewList.push({ logname: item.logname });
          }
        });
      });
    });

    this.getCargoNode();


   
  },
  methods: {
    showPart(val) {
      this.activeNavCityIndex = val;
      this.navCityIndexStatus = !this.navCityIndexStatus;
    },
    getSection(i) {
      this.activeNavPartIndex = i;
      this.navPartIndexStatus = !this.navPartIndexStatus;
    },
    getLogname(val) {
      const obj = { tag: "add", logname: val };

      this.$emit("toParent", obj);
      // console.log(this.$store.state.contactList)
    },

    distinct1(arr, key) {
      var newobj = {},
        newArr = [];
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        if (!newobj[item[key]]) {
          newobj[item[key]] = newArr.push(item);
        }
      }
      return newArr;
    },

    // 获取节点联系人
    getCargoNode() {
      // 获取节点联系人传递的数据
      const obj = {
        guid: this.orderFormInfo.data.guid
        // boguid: this.orderFormInfo.data.boguid,
        // area:this.orderFormInfo.data.area,
        // system:this.orderFormInfo.data.system,
      };

     
      // 存放area
      var areaList = [];
      // 存放 nodeman
      var nodemanArray = [];
      // 存放 节点成员对象
      var nodeNumberList = [];
      this.$axios({
        method: "get",
        url: this.$store.state.webApi + "api/ExAiraxpNode",
        params: obj,
        loading: true,
        tip: false
      })
        .then(results => {
          console.log("结果数据-----------------------");
          console.log(results.data);

          results.data.forEach(item => {
            areaList.push(item.area);
            nodemanArray.push({
              nodeman: item.nodeman,
              area: item.area,
              nodename: item.nodename
            });
          });

          Array.from(new Set(areaList)).forEach(item => {
            this.nodeContact.push({ area: item, nodemanList: [] });
          });
          console.log(this.nodeContact);
          var obj = {};
          const resultArr = [];
          for (var i = 0; i < nodemanArray.length; i++) {
            if (!obj[nodemanArray[i].nodeman]) {
              resultArr.push(nodemanArray[i]);
              obj[nodemanArray[i].nodeman] = true;
            }
          }
          console.log(nodemanArray);
          // resultArr  去重后的 联系人列表
          // 存入@列表 节点联系人， @ 时的列表
          this.$store.commit("setnodemanList", {
            status: "add",
            data: resultArr
          });

          nodemanArray.forEach(item => {
         

            nodeNumberList.push({ logname: item.nodeman });

            this.nodeContact.forEach(obj => {
              if (item.area === obj.area) {
                obj.nodemanList.push({ nodeman: item.nodeman, tip: "" });
              }
            });
          });

          this.$store.commit("setorderNodenameList", { data: nodeNumberList });

          nodemanArray = [];
          areaList = [];
          nodeNumberList = [];

        
          for (let item of this.nodeContact) {
            item.nodemanList = this.distinct1(item.nodemanList, "nodeman");
          }
        
          results.data.forEach(res => {
            this.nodeContact.forEach(item => {
              item.nodemanList.forEach(obj => {
                if (res.area === item.area && res.nodeman === obj.nodeman) {
                  obj.tip += res.nodename + " | ";
                }
              });
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.section-container {
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 8px 8px;
  .search {
    width: 164px;
    height: 28px;
    margin: 4px 0px;
  }

  .navContainer {
    line-height: 28px;
    font-size: 12px;
    background: white;
    margin: 4px 0px;
    padding: 0px 7px;
    position: relative;
    .down {
      position: absolute;
      right: 9px;
      top: 10px;
    }
    .sectionLiStyle {
      background: white;
      margin: 5px 0px;
      position: relative;
      .down {
        position: absolute;
        right: 9px;
        top: 10px;
      }
    }
    .personalContainer {
      margin: 5px 0px;
      padding: 0px 16px;
      display: flex;

      justify-content: center;
      flex-direction: column;

      li {
        display: flex;
        align-items: center;
        position: relative;
        .contactTo {
          width: 34px;
          height: 16px;
          line-height: 16px;
          border-radius: 8px;
          color: white;
          font-size: 8px;
          text-align: center;
          background: #0f5a8c 0% 0% no-repeat padding-box;
          position: absolute;
          right: -5px;
        }
      }
    }
  }

  .section {
    background: #f8f8f8 0% 0% no-repeat padding-box;
    border-radius: 4px;
    opacity: 1;
    padding-left: 8px;
  }
}
</style>
