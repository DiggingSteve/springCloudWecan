<template>

           <div >
               <div class="input-item" :style="itemstyle">
                      <div class="input-title" v-show="title">{{title}}</div>
                      <div  class="input-content">

                              <!-- <label :key='item.value'><input type="radio"  name="radio" :value="item.value"   v-on:change="updateValue(item.value)"><span>{{item.label}}</span></label> -->


                      <el-select v-model="valArray" multiple placeholder="请选择" :disabled="disabled">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>




                         <!-- <label><input type="radio"   name="radio" value="two"   v-on:change="updateValue('two')"><span>two</span></label> -->
                      </div>
               </div>

         </div>


</template>
<script>



// type 1简单输入框 2.多选 3单选 4下拉 5下拉多选 6单日期 7.双日期 8操作要求 9分泡 嵌套输入框  10委托项目  11委托客户 12完整时间(时分秒)  13货物性质 14货物类型 15锂电池型号（13-15为联动） 16贸易方式  17纯textarea 18直接显示数据
//width是输入框组件在每行所占的百分比
//class 是输入框占父级的宽度


    export default {

        // model: {
        //   event: 'change'
        // },
          props:{
                title:{
                  type:String,
                  default:""
                }, //标题
                value:String,//绑定的值
                clear:{
                  type:Boolean,
                  default:false
                }//是否有清空按钮
                ,itemstyle:String //样式
                ,groupid:Number
                ,options:{ //如果外面传了options,就用外面的，否则通过groupid去取数据
                  type:Array,
                    default(){
                      return []
                    }
                }
                ,
                disabled:{
                    type:Boolean,
                    default:false
                }
          },
           components: {

        },
        data () {
            return {
               // options:[]
               valArray:[]
            }

        },
        methods: {



        }
        ,created(){


        },
        computed:{


        },
        mounted(){



                             if(this.options.length>0) return;
                  let groupData = JSON.parse(localStorage.getItem('groupType'))
                    if(this.groupid){
                       for (let i in groupData) {
                         let item=groupData[i]
                           if(item.groupid==this.groupid){
                               this.options.push({ 'value': item.typename, 'label': item.typename, ready02: item.ready02, id: item.id, key: item.typename + item.ready02  })
                           }
                       }
                    }
                if(this.value){
             this.valArray=this.value.split(',')
          }

        },
        watch:{
             valArray(value){
                 this.$emit('input', value.toString())
             }
             ,value(val){
               if(val){
                 //console.log(val)
                    this.valArray=val.split(',')
               }else{
                  this.valArray=[]
               }

             }

        }

    }


</script>
<style  lang='less' scoped>

@import 'small.css';

</style>
