<template>
<!-- grid-template-columns: 750px 1fr; -->
  <div style="display: grid;gap:8px;grid-template-columns: 600px 1fr;">
    <div v-for="(item,indexT) in serviceDataGroup" :key="indexT"
      :style="[setItemStyle(item,1),{'background-color':system!='国内服务'?'#F8F8F8':''}]"
      style="padding:8px;margin:0 8px 8px">
      <h3>{{item.port}}</h3> 
      <div class="portItemDiv" :style="[setItemStyle(item,2)]">
        <div v-for="type in getServiceType(item.serviceBasicList)" :style="[setItemStyle(type,3)]">
          <!-- v-if="(opersystem!='进口')||(opersystem=='进口'&&!item.serviceBasicList.filter(i=>i.servicetype==type).map(i=>i.servicecode).includes('OA0010'))" -->
          <span style="margin:8px;margin-left:0px;font-size:15px;color:#000;font-weight:600" >{{type}}</span>
          <template v-for="code in item.serviceBasicList.filter(i=>i.servicetype==type)">
            <div class="service" :code="code.servicecode" v-if="newService[code.servicecode]" :key="code.servicecode">
              <serviceItem :servicedata="newService[code.servicecode]" v-if="code.servicecode!='OA0010'" :system="system"></serviceItem>
              <template v-else>
                <serviceItem :servicedata="newService[code.servicecode]" :czlx="czlx" :system="system" type=1></serviceItem>
                <serviceItem :servicedata="newService[code.servicecode]" :czlx="czlx" :system="system" type=2></serviceItem>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import serviceItem from "../templates/serviceItem";

  export default {
    props: {
      system: {
        type: String,
        default: "空出"
      },
      opersystem: {
        type: String,
        default: "国内服务"
      },
      czlx: {
        type: String,
        default: ""
      },
      newService: {
        type: Object,
        default: () => { }
      },
      orderguid: {
        type: [Number, String],
        default: -1
      },
      orderdom: {
        type: String,
        default: '总单'
      },
      serviceList: {
        type: Array,
        default: () => []
      },
      pagetype: {
        type: [Number, String],//1新增页面 2修改页面
        default: 1
      },
      danhaoConfirmd:{//单号是否确认,确认后需要显示信息发送
         type:Boolean,
         default:false
      },
      ysfs:{
        type:String,
        default:''
      }
    },
    components: {
      serviceItem
    },
    computed: {
      serviceDataGroup() {
        return JSON.parse(localStorage.serviceDataGroup).filter(e => e.system == this.system)
      }
    },
    methods: {
      showFunc(item) {
        if (item.indexOf("订舱") >= 0) {
          return this.opersystem == "出口";
        }
        if (item == "到货通知") {
          return this.opersystem == "进口";
        }

        return true;
      },

      initFunc(serviceList = []) {
        //  alert(this.opersystem + "=========11")
        if (!this.system) return;
        console.log(this.ysfs == "外仓货")
        this.$emit('update:newService', {})
        // if(this.$parent.mawbdetail.hawbList.length){
        //            this.$parent.mawbdetail.hawbList[this.$parent.hawblistChecked].newService={}
        // }
       
        this.$nextTick(() => {
          let serviceData = []
          this.serviceDataGroup.forEach(i => {
            serviceData.push(...i.serviceBasicList)
          })
          serviceList =
            serviceList.length > 0
              ? serviceList
              : this.serviceList.length > 0
                ? this.serviceList
                : [];

          serviceData.forEach(item => {
            
            if (item.dom == "总单") {
              //console.log(this.ysfs =='外仓货')
              if (serviceList.length == 0) {
                //新增页面
                this.$set(this.newService, item.servicecode, {
                  port: item.port,
                  title: item.servicename,
                  // servicetype: item.servicetype,
                  model:
                    ((item.servicecode == "OB0020"  && this.system == "空进")|| ( item.servicecode=='AB0420' && ((this.opersystem == '进口'&&this.ysfs != "外仓货") || this.opersystem == "国内服务" )  )),
                  model2:'',  //空进出港服务主营唯凯代操作
                  //  model:false,
                  oprequest: "",
                  disabled: (this.orderdom == '直单' && item.servicecode == 'AA0120') || item.servicecode == 'AA0150' || item.servicecode == 'AA0140'|| (item.servicecode == "OB0020" && this.system == "空进")||item.servicecode == 'AA0160',
                  servicecode: item.servicecode,
                  assignstatus: 0
                });
                
              } else {
                //修改页面
                let guid = -1;
                let sid = -1;
                let model = false;
                //let model2=false;//空进出港服务主营唯凯代操作
                var oprequest = "";
                let disabled = false;
                let profitmode = "";
                let pgid = "";
                let orderpgid = "";
                let childpgid = "";
                let title = ""

                // if (this.orderguid != -1) {
                //   disabled = true;
                // }

                if (this.orderdom == "直单" && item.servicecode == "AA0120") {
                  disabled = true;
                }

                if (item.servicecode == "OA0010" && this.system!='空进' || item.servicecode == 'AA0150' || item.servicecode == 'AA0140' || item.servicecode == 'AA0160') {
                  disabled = true;
                }
                serviceList.forEach(se => {
                  if (se.servicecode == item.servicecode) {
                    model = se.isdel == 1 ? true : false;
                    //model2= se.isdel != 1&&this.system=='空进' ? true : false;
                    oprequest = se.oprequest;
                    guid = se.guid;
                    sid = se.sid;
                    profitmode = se.profitmode;
                    pgid = se.pgid;
                    orderpgid = se.orderpgid;
                    childpgid = se.childpgid;
                    title = this.getTitleName(item.servicename, se.assignarea)
                  }
                });
                this.$set(this.newService, item.servicecode, {
                  port: item.port,
                  guid: guid,
                  sid: sid,
                  //  servicetype: item.servicetype,
                  title: title?title:this.getTitleName(item.servicename, ''),
                  id: item.id,
                  model: model,
                  oprequest: oprequest,
                  disabled: disabled,
                  servicecode: item.servicecode,
                  profitmode: profitmode,
                  pgid: pgid,
                  orderpgid: orderpgid,
                  childpgid: childpgid
                });
              }
            }
          });
        })

      },
      getServiceType(item) {
        return [...new Set(item.map(i => i.servicetype))]
      },
      getTitleName(name, area) {

        let areaList = JSON.parse(localStorage.groupType).filter(i => i.groupid == 53)

        let threeCode = area ? areaList.filter(i => i.typename == area)[0]['ready06'] : '本站'
        // console.log(threeCode)
        return `${name},${threeCode}`
      },
      setItemStyle(item, type = 1) {
        if (type == 1) {
          if (item.port == '出港操作') {
            return {
              'z-index': '1'
            }
          }
          if (item.port == '进港服务') {
            return {
              'grid-column': 'span 2',
            }
          }
        }

        if (type == 2) {
          if (item.port == '出港配套服务') {
            return {
              display: 'grid',
              'grid-auto-flow': 'column dense'
            }
          }
        }

        if (type == 3) {
          if (item == '仓库' || item == '鉴定') {
            return {
              'grid-row': 'span 2'
            }
          }

          if (item == '信息发送'&&!this.danhaoConfirmd) {
            return {
              'display': 'none'
            }
          }

        }


      }
    },
    created() {
      if (this.pagetype == 1 || this.serviceList.length > 0) {
        this.initFunc();
      }
    },
    watch: {
      
      orderguid: {
        handler(val) {
          if (this.pagetype == 2 && val != -1) {
            this.initFunc();
          }
        }, immediate: true
      },
      orderdom: {
        handler(val) {
          
          this.initFunc();
        }
      },

      system: {
        handler(val) {
          console.log(val)
          if (val) {
            console.log(this.ysfs == "外仓货",3)
            this.initFunc();
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  h3 {
    margin-top: 12px;
    margin-bottom: 6px;
  }

  /deep/.servicediv {
    display: flex;
    align-items: center;
    border: 1px solid #eee;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
  }

  /deep/ .serviceItem {
    width: 150px;
  }

  /deep/.servicediv-title {
    // height:100;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 15px;
    padding-right: 15px;
    width: 30px;
    word-wrap: break-word;
    line-height: 16px;
  }

  .portItemDiv {
    display: flex;
    /* padding-left:114px;
  transform: translateY(-27px); 
  border-bottom:1px solid #e1e1e1;*/
    border-bottom: none;
    padding-bottom: 14px;
    padding-left: 0px;
    transform: translateY(0px);
  }
</style>