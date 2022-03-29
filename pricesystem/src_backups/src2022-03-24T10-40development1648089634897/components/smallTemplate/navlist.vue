<template>
    <div>
        <div class="list-item" v-for="(item, index) in list" :key="index" v-if="!item.hidden">
            <div class="item-name">
                <div :level="item.level" :style="{color:getSystemBgColor(item.autname,item.level)}" :id="item.level==1?item.autname:''"
                    :class="`level-${item.level}`" :idNumber="item.id">
                    <div class="titlediv">
                        <span v-if="item.level>1" style="display:inline-block;width:14px">
                            <i v-if="item.children&&item.children.length>0"
                                :class="item.ifShow?'el-icon-minus':'el-icon-plus'"
                                @click.self="item.ifShow=!item.ifShow"></i>
                        </span>
                        <el-popover placement="bottom-start" trigger="click" :disabled="!item.description">
                            <div v-html="item.description" style="max-width:280px;line-height:18px;font-size:12px;">
                            </div>
                            <span v-if="item.level>1" slot="reference" style="display:inline-block;width:22px">
                                <i v-if="item.description" class="el-icon-info" style="color:#B4C4CB;margin:0 4px"></i>
                            </span>
                        </el-popover>
                        <span class="title">
                            <span v-if="item.children&&item.children.length>0" :key="item.id"
                                @click="item.ifShow=!item.ifShow">
                                {{item.autname}}             
                            </span>
                            <router-link v-else tag="span" :to="{name:item.temp,params: {id: item.id,ready08:item.ready08}}" :key="item.id">
                                {{item.autname}}
                            </router-link>

                            <i class="tup" :class="{greenTup:item.level>2}"
                                v-if="getRecorderNumber(item)>0">
                                {{getRecorderNumber(item)||''}}
                            </i>
                        </span>
                    </div>

                    <i :class="[item.ifShow?'el-icon-arrow-down':'el-icon-arrow-up']" v-if="item.level==1" @click.self="item.ifShow=!item.ifShow"
                        style="margin-right:15px;"></i>
                </div>
            </div>
            <el-collapse-transition>
                <div v-show="item.ifShow">
                    <div v-if="item.children" class="children-item">
                        <list :list="item.children" :recorderNumberNew="recorderNumberNew"></list>
                    </div>
                </div>
            </el-collapse-transition>
        </div>
    </div>
</template>
<script>
    export default {
        name: "List",
        props: {
            list: Array,
            recorderNumberNew: {
                type: Object,
                default: () => { }
            },
        },
        data() {
            return {
                levelStyle: {//定义每一层级的样式
                    1: {
                        idName: '',//id名
                        className: 'level-1',//类名
                        style: {

                        },//样式
                        iconName: '',//图标名
                        hoverStyle: {},//鼠标移入样式
                        checkedStyle: {},//选中样式
                    }
                }
            }
        },
        created() {
        },
        methods: {
            getSystemBgColor(name, level) {
                if(sessionStorage.system=='outside'){
                    return '#fff'
                };
                if (name && level == 1) {
                    if (name.includes("订单")) {
                        return "rgba(101, 192, 253, 1)";
                    }
                    if (name.includes("对账")) {
                        return "rgba(235, 219, 132, 1)";
                    }
                    if (name.includes("基础数据") || name.includes("统计")) {
                        return "rgba(157, 169, 255, 1)";
                    }
                    return "rgba(142, 237, 222, 1)";
                }
            },
          getRecorderNumber(item){
              if(item.level<2) return;
              if(item.children&&item.children.length>0){
                   let number=0;
                   item.children.forEach(i=>{
                       if(i.children&&i.children.length){
                           number += this.getRecorderNumber(i)
                       }else{
                           number += this.recorderNumberNew[i.recorderName] || 0
                       }
                   })
                   return number
              }else{
                   return this.recorderNumberNew[item.recorderName]||0
              }
          }
        },
    };
</script>
<style scoped lang="less">
    .list-item {
        div {
            cursor: pointer;
        }

        div[level]:hover {
            background: #32414a;
        }
    }



    .titlediv {
        display: flex;
        width: 100%
    }

    .level {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        user-select: none;
        background-color: #384954;

        span.title {
            width: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            padding-right: 10px;

            >span {
                flex: 1;
            }
        }
    }

    .level-1 {
        .level;
        font-size: 18px;
        color: rgb(101, 192, 253);
        font-weight: bold;
        background: none;//屏蔽上面的背景颜色
        padding-left: 16px;

        span.title::before {
            content: "";
            display: inline-block;
            background: #9cd7ff;
            width: 4px;
            height: 10px;
            border-radius: 2px;
            margin-right: 5px;
        }

    }


    .level-2 {
        color: #c5ff9a;
        padding-left: 22px;
        .level;
    }

    .level-3 {
        color: #fff;
        .level;
        padding-left: 40px;
    }

    .level-4 {
        color: #bfcbd9;
        padding-left: 40px;
        .level;
    }

    .tup {
        display: inline-block;
        border-radius: 10px;
        width: 30px;
        height: 16px;
        background-color: #f56c6c;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        color: #fff;
        margin-left: auto;
    }

    .greenTup {
        background-color: green;
        cursor: none;
    }

    .router-link-exact-active {
        background-color: #32414a;
        border-radius: 4px;
        background-color: #32414a;
        height: 28px;
        line-height: 28px;
        /* margin-right: 12px; */
    }
</style>