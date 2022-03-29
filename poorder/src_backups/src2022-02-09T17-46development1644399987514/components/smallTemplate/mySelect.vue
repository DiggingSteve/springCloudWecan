<template>

           <div >
               <div class="input-item" :style="itemstyle">
                      <div class="input-title" v-show="title" :style="titlestyle">{{title}}</div>
                      <div  class="input-content">

                              <!-- <label :key='item.value'><input type="radio"  name="radio" :value="item.value"   v-on:change="updateValue(item.value)"><span>{{item.label}}</span></label> -->


                      <el-select v-model="valArray"  placeholder="请选择" @change="$emit('update:value',$event)" :disabled="disabled" :clearable="clearable"  :style="selstyle">
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
                ,selstyle:String //样式
                ,titlestyle:String //样式
                ,groupid:Number
                ,options:{ //如果外面传了options,就用外面的，否则通过groupid去取数据
                  type:Array,
                    default(){
                      return []
                    }
                },
                disabled:{
                    type:Boolean,
                    default:false
                },
                clearable: {
                type: Boolean,
                default: true
              },
          },
           components: {

        },
        data () {
            return {
               // options:[]
               valArray:""
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


        },
        watch:{
             valArray(value){
                 this.$emit('input', value)
             },
             value:{
               handler(val){
                  this.valArray=val;
               },immediate:true

             }

        }

    }


</script>
<style  lang='less' scoped>

@import 'small.css';

</style>
