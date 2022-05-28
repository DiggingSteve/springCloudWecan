<template>
    <div>
        <div class="list-item" v-for="(item, index) in list" :key="index" v-if="!item.hidden">
            <div class="item-name">
                <div :level="item.level" :style="{color:getSystemBgColor(item.autname,item.level)}" :id="item.level==1?item.autname:''"
                    :class="`level-${item.level}`" :idNumber="item.id">
                    <div class="titlediv">
                        <span v-if="item.level>1&&item.children&&item.children.length>0" style="display:inline-block;width:14px;position: relative; margin-right: 5px;"
                            :style="{left: item.children&&item.children.length>0&&item.description?'10px':'0px'}"
                            >
                            <i v-if="item.children&&item.children.length>0"
                                :class="item.ifShow?'el-icon-minus':'el-icon-plus'"
                                @click.self="item.ifShow=!item.ifShow"></i>
                        </span>
                      
                        
                        <!-- 说明及视频 -->
                        <span style="width: 58px; margin-left: -20px;"
                  
                            v-show="item.level>1&&!item.children"
                           >
                           <!-- JSON -->
                            <span  v-if="item.level>1&&item.description&&isJSON(item.description)"
                                 style="display: flex; align-items: center;justify-content: end; height: 40px;">

                                 <el-tooltip content="操作指南" placement="bottom-start" effect="light"
                                    popper-class="common-tooltip"
                                     v-if="item.description&&JSON.parse(item.description).book">
                                    <span v-if="item.level>1" style="display:flex;width:22px">
                                    <i class="common-i active-book" v-if="item.description&&JSON.parse(item.description).book"
                                        @click="handleContent(item.description, 1)"
                                        > </i>
                                    </span>
                                 </el-tooltip>

                                 <el-tooltip content="操作视频" placement="bottom-start" effect="light"
                                     v-if="item.description&&JSON.parse(item.description).video" popper-class="common-tooltip"
                                     
                                     >
                                    <span v-if="item.level>1"  style="display:flex;width:22px" 
                                         @click="handleContent(item.description, 2)"
                                           >
                                        <i  class="common-i active-video" v-if="item.description&&JSON.parse(item.description).video"
                                            
                                        > </i>
                                    </span>
                                </el-tooltip>   

                                <el-popover placement="bottom-start" trigger="click" :disabled="!item.description" 
                                v-if="item.description&&isJSON(item.description)&&JSON.parse(item.description).title">
                                <div v-html="item.description&&JSON.parse(item.description).title&&JSON.parse(item.description).title.content" style="max-width:280px;line-height:18px;font-size:12px;">
                                </div>
                                <span v-if="item.level>1" slot="reference" style="display:flex;width:22px">
                                        <i class="common-i active-info" v-if="item.description&&isJSON(item.description)&&JSON.parse(item.description).title"
                                    > </i>
                                </span>
                                </el-popover>
                            </span>
                         
                            <!-- STRING -->
                             <span  v-if="item.level>1&&item.description&&!isJSON(item.description)"
                                 style="display: flex; align-items: center;justify-content: end; height: 40px;">
                                <el-popover placement="bottom-start" trigger="click" :disabled="!item.description"
                                    v-if="item.description&&!isJSON(item.description)">
                                    <div v-html="item.description" style="max-width:280px;line-height:18px;font-size:12px;">
                                    </div>
                                    <span v-if="item.level>1" slot="reference" style="display:inline-block;width:22px">
                                        <i v-if="item.description&&!isJSON(item.description)" class="el-icon-info" style="color:#B4C4CB;margin:0 4px"></i>
                                    </span>
                                </el-popover>
                            </span>


                        </span>
                        <!-- 说明及视频end-->

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
        <el-dialog
            title=""
            :visible.sync="dialogVisible"
            width="1250px"
            append-to-body
            :before-close="dialogBeforeClose"
            top="60px"
           >
           <video-player
                v-if="contentType == 2"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions">
            </video-player>

             <embed 
             v-if="contentType == 1"
             :src="bookUrl" 
             style="width:100%; height: 680px;"

            >
            <!-- <div slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div> -->
        </el-dialog>
    </div>
</template>
<script>
import 'video.js/dist/video-js.css'
 
import { videoPlayer } from 'vue-video-player'

    export default {
        name: "List",
        props: {
            list: Array,
            recorderNumberNew: {
                type: Object,
                default: () => { }
            },
        },

        components: {
            videoPlayer
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
                },
                dialogVisible: false, // 显示书和视频，弹出框
                contentType: 0, // 1:书 2:视频
                playerOptions: {
                    playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                    autoplay: false, // 如果为true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 是否视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/mp4", // 类型
                        src: '' // url地址
                    }],
                    poster: '', // 封面地址
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true, // 当前时间和持续时间的分隔符
                        durationDisplay: true, // 显示持续时间
                        remainingTimeDisplay: false, // 是否显示剩余时间功能
                        fullscreenToggle: true // 是否显示全屏按钮
                    }
                },
                bookUrl: '',
            }
        },
        created() {
        },
        methods: {
            dialogBeforeClose() {
                this.$refs.videoPlayer && this.$refs.videoPlayer.player.pause() // 暂停
                this.dialogVisible = false;
            },
            isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        var obj=JSON.parse(str);
                        if(typeof obj == 'object' && obj ){
                            return true;
                        }else{
                            return false;
                        }
                    } catch(e) {
                        console.log('error：'+str+'!!!'+e);
                        return false;
                    }
                }
            },

            handleContent(data, type) {
                this.dialogVisible = true;
                this.contentType = type;
                let content = JSON.parse(data)
                if (type == 1) {
                    this.bookUrl =  content.book.url
                } else {
                    this.playerOptions.sources[0].src = content.video.url;
                }
            },

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
        padding-left: 20px;
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

    .common-i {
        display: inline-block;
        width: 16px;
        height:16px;
        margin-right: 4px; 
        opacity: 0.7;       
    }

    .active-book {
        background: url('../../../boStatic/images/icon_book.png') center no-repeat;
        background-size: cover;
        &:hover {
             opacity: 1;     
        }
    }

    .active-video {
        background: url('../../../boStatic/images/icon_video.png') center no-repeat; 
        background-size: cover;
        &:hover {
             opacity: 1;     
        }
    }

     .active-info {
        background: url('../../../boStatic/images/icon_info.png') center no-repeat; 
        background-size: cover;
        &:hover {
             opacity: 1;     
        }
    }

    /deep/.video-js .vjs-big-play-button {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<style lang="less">
    .common-tooltip {
        color: #606266 !important;
        background-color: #fff !important;
        border-color: #fff !important;

        .popper__arrow {
            border-bottom-color: #fff !important;
        }
    }
</style>