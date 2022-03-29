<template>
<div>
    <div class="detail" style="margin-top:-10px;">
            <div class="buttonTabs">
             <el-button-group >
                  <el-button @click.native="mng=true" :class="[mng?'active':'']" >本站运单</el-button>
                  <el-button @click.native="mng=false" :class="[!mng?'active':'']" >非本站运单</el-button>
            </el-button-group>

            <div class="buttonGroup" v-if="mng">
               <el-button @click="setButton('first')" :class="[buttonGroup.first?'active':'']">正常运单</el-button>
               <el-button @click="setButton('second')" :class="[buttonGroup.second?'active':'']">预定运单</el-button>
<!--                <el-button @click="setButton('third')" :class="[buttonGroup.third?'active':'']">转移运单</el-button>
                <el-button @click="setButton('forth')" :class="[buttonGroup.forth?'active':'']">
                预警管理
                </el-button> -->
            </div>

            <div v-if="!mng" class="buttonGroup">
                <el-button @click="setButton('fifth')" :class="[buttonGroup2.fifth?'active':'']">外站运单</el-button>
                <el-button @click="setButton('sixth')" :class="[buttonGroup2.sixth?'active':'']">供应商运单</el-button>
            </div>

            </div>
            <p style="margin-bottom:12px;">
                <span class="spanTitle">
                    委托客户：<span class="titleColor">{{newRowData.wtkh}}</span>
                </span>
<!--                 <span class="spanTitle">
                <span style="text-align:right;width:110px;">航班号：</span><span class="titleColor">{{newRowData.yqhbh}}</span>
                </span> -->
                </p>
               
                <newFormCmpt
                    class="form-cmpt"
                    :view-data.sync="mawbInputView"
                    :model-data.sync="mawbInputData"
                    :search-data.sync="searchData"
                    pagetype="1">
                </newFormCmpt>
                 
                  <el-button type="primary" style="margin-top:20px;" @click="mawbSearch">查询</el-button>
                  <el-button type="primary" style="margin-top:20px;" @click="mawbDialog=true">维护</el-button>
                  <el-button size="mini" type="primary" @click="confirmMawb">确认</el-button>
                  <p v-if="mawbConfigtableData.length" style="color:red;margin-bottom:-14px;margin-top:15px;">*建议使用最早维护的运单</p>
                <commonTable :head="mawbConfigHeadNew" :table-data="mawbConfigtableData" style="margin-top:20px;height:450px;overflow-x:hidden" isRadioSelect @current-change="checkRadio" v-if="mawbConfigtableData.length">
                            
                </commonTable>
                
                <div style="margin-top:12px;margin-left:-34px" v-if="mawbConfigtableData.length">
                     <new-form-cmpt :view-data.sync="zdBasicInfoSave" :model-data.sync="objGysss" style="display: inline-flex;" :pagetype="2"></new-form-cmpt>

                     <!-- <span style="float:right;">
                        <el-button size="mini" type="primary" @click="confirmMawb">确认</el-button>
                    </span> -->
                </div>
                <div class="bottom" v-if="dialogMawb">
                <span class="alert">运单预警份数&nbsp;{{objGysss.alertpiece}}</span>
                <span style="color:#c0c9d0">|</span>
                <span class="piece">原库存数&nbsp;{{objGysss.realpiece}}</span>
                <i title="预警维护" class="el-icon-edit-outline" @click="setWarning"
                                style="font-size:20px;color:#30C76C;cursor:pointer;position:relative;left:10px;top:2px"></i>

                </div>

            </div>

    <!-- 总运单维护弹框 -->
    <el-dialog :visible.sync="mawbDialog" width="1000px" top="4%" v-if="mawbDialog" :close-on-press-escape="false" append-to-body custom-class="mawbweihu" :title="(mng?'唯凯本站':buttonGroup2.fifth?'唯凯外站':'非唯凯')+'总运单维护'" :close-on-click-modal="false">
       <!--  <iframe :src="`${this.$store.state.imgWebApi}wffbasic/basic/frmMawbAdd.aspx?addman=${getAddman()}&area=${rowData.area}`" frameborder="0" allowtransparency="true" style="width: 100%; height:700px; border: 0px none;"></iframe> -->
       <mawbAdd :visible.sync="mawbDialog" :mng="mng?'唯凯本站':buttonGroup2.sixth?'非唯凯':'唯凯外站'" type="1"></mawbAdd>
    </el-dialog>

</div>
</template>

<script>
import mawbAdd from './mawbAdd'
import {
    mawbConfigMixin
} from '@/components/mixins/mawbConfigMixin.js'
export default {
    name: "mawbConfigNew",
    mixins: [ mawbConfigMixin()],
    components: {
        mawbAdd
    },
    props:{
    rowData:{},
    pagetype:{//1正常外部 2综合查询里面
        type:[String,Number],
        default:1
    },
    visible: Boolean,
    },
    data() {
        return {
            name: "asignSearch.vue",
            //总运单配置
            dialogMawbConfig: true, //配置总运单弹框
            mawbConfigtableData: [], //配置总运单数据
            mawbInputView:{
                mawb:{title:'总运单号',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},verify: "mawb",whereStr: "like"},
                hbh:{title:'航班号',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},verify:"uppercase",whereStr: "like"},
                djdate:{title:'登记日期',type: 15,itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},begintype:6,defaultVal:true},
                bookinger:{title:'运单预定人',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},whereStr: "like" },
                djr:{title:'运单登记人',type:'1',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},whereStr: "like" },
                gysname:{title:'运单供应商',itemStyle:{'width':'300px'},titleStyle:{'marginRight':'8px'},type:20,pagetype: 3,whereStr: "like"},
                status:{title:'状态',type:15,hidden:true},
                bookingstatus:{title:'状态',type:15,hidden:true},
            },
            mawbInputData:{},
            searchData:{},
            mawbConfigHeadNew:[
                {field:'mawb',title:'总运单号'},
                {field:'bookingstatus',title:'预定状态',formatType:2,format:x=>x=='1'?'未预定':'已预定',tdStyleFunc:(x=>x=='1'?{color:'red'}:{color:'#93de6e'})},
                {field:'ydwtkh',title:'预定委托客户',formatType:3},
                {field:'aircomname',title:'运单航空公司'},
                {field:'gysname',title:'运单供应商'},
                {field:'mawbxz',title:'运单性质'},
                {field:'airtype',title:'适用机种'},
                {field:'djr',title:'登记人'},
                {field:'djdate',title:'登记日期'},
                {field:'remark',title:'备注'}
            ],
            dialogMawb: "", //配置总运单号
            objGysss: {}, //总运单单条数据
            mawbDialog: false, //总运单维护弹框
            newRowData:{},//此行数据
            mng:true,//激活按钮
            buttonGroup:{first:true,second:false,third:false,forth:false},
            buttonGroup2:{fifth:true,sixth:false},
        };
    },

    methods: {
        setButton(type){
          var buttonGroupObj=this.mng?this.buttonGroup:this.buttonGroup2
          Object.keys(buttonGroupObj).forEach(i=>{
            buttonGroupObj[i]=i==type?true:false
          })
          this.mawbConfigtableData=[]
          
        
          if(type=='first'){
            //this.$set(this.mawbInputData,'status','1')
            //this.$set(this.mawbInputData,'bookingstatus','1')
            this.$set(this.mawbInputData,'bookinger','')
            //this.searchData.status={in:'1'}
           //this.searchData.bookingstatus={in:'1'}
            
          }else if(type=='second'){
            //this.$set(this.mawbInputData,'bookingstatus','2')
            //this.searchData.bookingstatus={in:'2'}
            this.$set(this.mawbInputData,'bookinger',localStorage.usrname)
          }
 

          console.log(this.searchData)

        },
        checkRadio(index){
         console.log(index)

         this.$nextTick(()=>{
             this.$set(this.objGysss,'zddlcode',this.mawbConfigtableData[index]['zddlcode'])
             this.$set(this.objGysss,'iszddl',this.objGysss.zddlcode.includes('WFF')?1:2)
         })
         
            this.objGysss=this.mawbConfigtableData[index]
            this.dialogMawb=this.mawbConfigtableData[index]['mawb']
       
        },

        //总运单查询
            mawbSearch(){

                this.searchData.area=this.newRowData.area
                this.searchData.mdg=this.newRowData.mdg

                if(this.buttonGroup.first&&this.mng){
                delete this.searchData.bookingkhid
                  //this.searchData.gid=this.newRowData.gid
                }else if(this.buttonGroup.second&&this.mng){
                  this.searchData.bookingkhid= {in:'-1,'+this.newRowData.gid} 
                }

                this.searchData.mawbsswk={like:this.mng?'唯凯本站':this.buttonGroup2.fifth?'唯凯外站':'非唯凯'}
                
                //本站运单 正常运单
                if(this.buttonGroup.first&&this.mng){
                  this.searchData.status={in:'1'}
                  this.searchData.bookingstatus={in:'1'}
                }
                
                //本站运单 预定运单
                if(this.buttonGroup.second&&this.mng){
                  this.searchData.bookingstatus={in:'2'}
                  delete this.searchData.status
                }

                //非本站运单 外站预定运单
                if(this.buttonGroup2.fifth&&!this.mng){
                    delete this.searchData.status
                    delete this.searchData.bookingstatus
                }
                
                //非本站运单 供应商运单
                if(this.buttonGroup2.sixth&&!this.mng){
                    this.searchData.bookingkhid={in:'-1,'+this.newRowData.gid} 
                }

                var jsonArr2 = {
                where: this.searchData,
                };

                 var json = { json: JSON.stringify(jsonArr2)};
               this.$axios({
                    method: "get",
                    url: this.$store.state.BasicWebApi + "api/GetConfigMawaList",
                    params:json,
                    loading: true,
                    tip: false,
                    nofield:true,
                    nosystem:true
                })
               .then(({data})=>{

                    if(!data.length){
                        return this.$message.info('无查询信息')
                    }

                    data.forEach(i=>{
                        i.djdate=i.djdate.substring(0,10)
                        i.ydwtkh=i.bookingkhid=='-1'?'--':i.bookingkhid
                        //i.ydwtkh=JSON.parse(localStorage.)
                    })



                    this.mawbConfigtableData=data
               })
               .catch(error=>{

               })
            },
            //保存配置总运单
            confirmMawb(){
                if(this.pagetype=='1'){
                    this.mawbConfigFunc('1')
                }else{
                    this.$parent.$parent.mawbConfigFunc('1')//使用原本页面上存在的方法
                }
            },

                //设置预警
             setWarning(data,index){
                this.$prompt('请输入预警份数','提示',{
                confirmButtonText: '确定',
                inputValue:this.objGysss.alertpiece,
                cancelButtonText: '取消',
                //inputPattern:/^[1-9]\d*$/,
                closeOnClickModal:false,
                customClass:'warnClass',
                beforeClose:(action,instance,done)=>{
                  if(!/^[1-9]\d*$/.test(instance.inputValue)&&action=='confirm'){
                    return this.$message.info('请输入大于0的数字')
                  }else{
                    done()
                  }
                }
            })
            .then(({value})=>{
              
                this.$axios({method:'POST',url:this.$store.state.BasicWebApi+'api/MawbAlert',data:{aid:this.objGysss.aid,area:this.objGysss.area,alertpiece:value},loading:true,tip:false})
                .then(({data})=>{
                    if(data.resultstatus==0){
                        this.objGysss.alertpiece=value
                        this.$message.success(data.resultmessage)
                    }else{
                        this.$message.error(data.resultmessage)
                    }
                })
                .catch(error=>{

                })
                })
            .catch(()=>{
                this.$message({
                type: 'info',
                message: '取消操作'
              });      
            })

        }


 
    },
    watch: {
      dialogMawbConfig(val){
        if(!val){
         //有航班号覆盖原来列表上的
         if(this.mawbInputData.hbh){
            this.rowData.yqhbh=this.mawbInputData.hbh
          }
           //old版本为只有有值的时候才覆盖
          // if(this.rowData.yqhbh&&this.mawbInputData.hbh){
          //     this.rowData.yqhbh=this.mawbInputData.hbh
          // }  
          this.$emit("update:visible",false)
        }
      },
      mng(val){
        if(val){
            if(this.buttonGroup.second){
                 this.mawbInputData.bookinger=localStorage.usrname
            }else{
                 this.mawbInputData.bookinger=''
            }
        }else{
            this.mawbInputData.bookinger=''
        }
        this.mawbConfigtableData=[]
      }

    },
    computed: {
      

    },

    created() {
        this.newRowData={...this.rowData}

        if(this.newRowData.yqhbh){
            this.$set(this.mawbInputData,'mawb',JSON.parse(localStorage.airinfo).filter(i=>i.TwoCode==this.newRowData.yqhbh.substring(0,2))[0]['ThreeCode']+'-')
            this.$set(this.mawbInputData,'hbh',this.newRowData.yqhbh)
        }
        
        this.setButton('first') 
        
        //改变总运单号改变航班号逻辑    
        // this.$watch(
        //     function(){
        //         return this.mawbInputData.mawb
        //     },
        //     function(val){
        //          if(JSON.parse(localStorage.airinfo).filter(i=>i['ThreeCode']==val.substring(0,3)).length>0&&val.length){
        //             console.log(JSON.parse(localStorage.airinfo).filter(i=>i['ThreeCode']==val.substring(0,3))[0]['TwoCode'])
        //             this.$set(this.mawbInputData,'hbh',JSON.parse(localStorage.airinfo).filter(i=>i['ThreeCode']==val.substring(0,3))[0]['TwoCode'])
        //          }
                 
        //     }
            
        // )



        //this.mawbSearch()

    },
    mounted(){
        
            

    }

};
</script>

<style lang="less" scoped>
/deep/.mawbweihu{
    border-radius:8px;
    .el-dialog__header{
           text-align:center;
           font-weight:bold;
        }
}
.buttonTabs{
    text-align:center;
    margin-bottom:10px;
    .el-button{
        color: #4D6160;
        border: 1px solid #DFF9F6;
        background: rgba(141, 237, 223, 0.3);
        &:nth-child(1){
            border-radius:20px 0 0 20px;
        }
        &:nth-child(2) {
            border-radius: 0px 20px 20px 0px
         }
    }
    .buttonGroup{
        margin-top:20px;
        .el-button{
             border-radius:20px;
        }
    }
    .active{
        background: #8DEDDF;
        border: 1px solid #8DEDDF !important;
        color: #222;
        font-weight: 600;

    }
}
.bottom{
    margin-top:12px;
    letter-spacing: 0.1em;
    .alert{
        color:red;
        margin-right:8px;
    }
    .piece{
        color:#1a7dbf;
        margin-left:8px;
    }
}
</style>
