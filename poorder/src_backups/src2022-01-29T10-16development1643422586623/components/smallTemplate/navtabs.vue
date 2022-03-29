<template>
    <div class="tabNav">
        <div class="tabNavConter">
            <div style="padding:0 15px;">
                <i :class="navDisplayMode==1?'el-icon-menu':'el-icon-s-unfold'" style="cursor: pointer;"
                    :title="navDisplayMode==1?'导航分类展示模式':'导航平铺展示模式'"
                    @click="navDisplayMode=(navDisplayMode==1?2:1)"></i>
            </div>
            <div class="classification" v-if="tabRel.length>0&&navDisplayMode==1">
                <template v-for="(value,name,index) in classification"
                    v-if="classification[name]&&classification[name].length>0">
                    <el-tooltip class="item" effect="white"
                        :content="value.map(i=>$store.state.navDataById[i].autname).join(' | ')"
                        placement="bottom-start" :key="index">
                        <span @click="classificationChecked=name;toggleZiNav(value[0]);positionClassific(name)"
                            :class="{checked:name==classificationChecked}" :key="index"
                            :style="{backgroundColor:getSystemBgColor(name)}">
                            {{name}}
                            <div :style="{backgroundColor:getSystemBgColor(name)}">
                                <i @click.stop="closeTags(7,name)" class="el-icon-error" style="color:#fff"></i>
                            </div>
                        </span>
                    </el-tooltip>
                </template>
            </div>
            <div class="tabnavcon">
                <router-link :to="{name:item.temp,params: {id: item.text}}" replace v-for="(item,index) in tabRel"
                    v-show="navDisplayMode==1?item.othername==classificationChecked:true"
                    @contextmenu.prevent.native="openMenu(item.text,index,$event)" :key="item.text"
                    :title="item.othername">
                    <span @click="changeTab(item.text)"
                        v-bind:class="{'tabChecked animate__animated animate__pulse':item.text==tabIndex}">
                        {{item.autname}}
                        <i @click.stop.prevent="closeTab(item.text,item,index)"
                            @mouseover.passive="hoverClose(item.text)" @mouseout.passive="hoverClose('')"
                            :class="[item.text==ifClose?'el-icon-close bgnone':'tab-close']"></i>
                    </span>
                </router-link>
            </div>

            <!-- <div style="margin-left:auto">-->
            <div class="tabcover" style="margin-left:auto"></div>
            <div class="changetab" style="margin-left:auto">
                <i @click="changeTabPosit(1)"></i>
                <i @click="changeTabPosit(2)"></i>
            </div>
            <!-- </div> -->


            <ul class="contextmenu" v-if="visible&&classificationChecked" :style="{left:left+'px',top:top+'px'}">
                <li @click="closeTags(1)"
                    v-show="navDisplayMode==1?(classification[classificationChecked]&&classification[classificationChecked].length>(selectedTagIndex+1)):(selectedTagIndex+1<tabRel.length)">
                    关闭右侧标签</li>
                <li @click="closeTags(2)" v-show="selectedTagIndex>0">关闭左侧标签</li>
                <li @click="closeTags(3)"
                    v-show="navDisplayMode==1?(classification[classificationChecked]&&classification[classificationChecked].length>=2):tabRel.length>=2">
                    关闭其他标签
                </li>
                <li @click="closeTags(4)">关闭全部标签</li>
                <!-- <li @click="closeTags(5)">关闭当前标签</li> -->
            </ul>
        </div>
    </div>

</template>
<script>
    import { cassifyObj } from "@/common/fields"

    export default {
        name: "navtabs",
        props: {
            tabRelKeep: Array
        },
        data() {
            return {
                navDisplayMode: 1, //导航显示模式，1分类 2平铺
                tabRel: [],
                tabIndex: "", //显示的标签页,实际是id,是唯一的
                classification: {}, //导航分层显示
                classificationChecked: "",
                ifClose: "", //标签页关闭按钮hover样式
                visible: false, //右键标签页关闭菜单
                top: 0,
                left: 0,
            }
        },
        methods: {

            toggleZiNav: function (val) {
                //console.log(temp)
                /* if(temp=='newOrderSearch'&&(!this.$store.state.areaState||this.$store.state.areaState.split(',').length!=1)){
                  this.$message.error('请选择指定区域！');return
                } */
                // let curNav=JSON.parse(sessionStorage.nav).find(i=>i.id==val)
                let curNav = this.$store.state.navDataById[val];
                if (!curNav) return;
                let temp = curNav.temp;
                let autname = curNav.autname;
                let othername = curNav.othername;
                //  console.log(val,temp,autname);
                let tabRel = this.tabRel;
                // this.currentView = this.getCurentView(val); //切换显示模板
                this.tabIndex = val;
                this.$router.push({
                    name: temp,
                    params: {
                        id: val
                    }
                });
                // console.log(this.currentView)
                // console.log(this.tabIndex)
                // this.ziIndex = val; //二级导航
                let n = tabRel.filter(i => i.text == val);

                this.$nextTick(function () {
                    let tabnavconWidth = $(".tabnavcon").width();
                    let tabscrollLeft = $(".tabnavcon").scrollLeft();

                    if (n.length == 0) {
                        this.tabRel.push({
                            text: val,
                            temp: temp,
                            autname: autname,
                            othername: othername
                        }); //增加标签页
                        this.$nextTick(() => {
                            // this.setWorkUnFinishSearchData(temp); // 增加标签页时，根据被控数据设置页面查询条件
                        })
                    }
                    this.$nextTick(function () {
                        let prevAll = 0;
                        $(".router-link-active")
                            .prevAll("a:visible")
                            .each(function () {
                                prevAll = prevAll + $(this).width();
                            });
                        $(".tabnavcon").scrollLeft(prevAll);
                    });
                });
            },
            redirectRoute(type) {
                //重定向路由
                //this.$store.state.mainSearch=false
                let showTab;
                // this.ziIndex = ""; //去除二级导航选中状态
                if (!type && type != 0 && this.tabRel.length > 0) {
                    //  showTab = this.tabRel[this.tabRel.length - 1];
                    if (this.navDisplayMode == 1) {
                        showTab = this.classification[this.classificationChecked]
                            ? this.$store.state.navDataById[
                            this.classification[this.classificationChecked].slice(-1)
                            ]
                            : this.tabRel[this.tabRel.length - 1];
                    } else {
                        showTab = this.tabRel[this.tabRel.length - 1];
                    }
                } else {
                    // console.log( this.tabRel)
                    showTab = this.tabRel[type];
                }
                // console.log(showTab)
                if (this.tabRel.length == 0) {
                    // this.currentView = "";
                    this.tabIndex = "";
                    //   this.ziIndex = "";
                    setTimeout(() => {
                        this.$router.push({ name: "index" });
                    }, 0);
                } else {
                    // this.currentView = this.getCurentView(showTab.text);
                    this.tabIndex = showTab.text;
                    // this.ziIndex = showTab.text;
                    this.$router.push({
                        name: showTab.temp,
                        params: { id: showTab.text }
                    });
                    // this.$router.go(-1)
                }
            },
            getSystemBgColor(name) {
                if (name.includes("订单")) {
                    return "rgba(101, 192, 253, 1)";
                }
                if (name.includes("对账")) {
                    return "rgba(235, 219, 132, 1)";
                }
                if (name.includes("基础数据")) {
                    return "rgba(157, 169, 255, 1)";
                }
                return "rgba(142, 237, 222, 1)";
            },
            changeTabPosit(type) {
                //type 1 left 2 right
                let leftPos = parseInt($(".tabnavcon").scrollLeft());
                if (type == 1) {
                    if (leftPos == 0) {
                        layer.msg("It's top");
                        return;
                    }
                } else {
                    let childWith = 0;
                    $(".tabnavcon")
                        .find("a:visible")
                        .each(function () {
                            childWith = childWith + $(this).width();
                        });
                    let widthCha = childWith - $(".tabnavcon").width();
                    if (widthCha <= 0) {
                        return;
                    }
                    if (leftPos == widthCha) {
                        layer.msg("It's end");
                        return;
                    }
                }
                let num = 0;
                let timer = setInterval(() => {
                    if (num <= 300) {
                        num += 10;
                        if (type == 1) {
                            $(".tabnavcon").scrollLeft(leftPos - num);
                        } else {
                            $(".tabnavcon").scrollLeft(leftPos + num);
                        }
                    } else {
                        clearInterval(timer);
                    }
                }, 10);
            },
            changeTab: function (val) {
                //this.currentView = this.getCurentView(val); //切换显示模板
                this.tabIndex = val;
                // this.ziIndex = val;
            },
            closeTab: function (val, item, index) {
                //  console.log(index)
                if (this.navDisplayMode == 1) {
                    this.selectedTagIndex = this.classification[
                        this.classificationChecked
                    ].indexOf(val);
                } else {
                    this.selectedTagIndex = index;
                }

                this.closeTags(5);
                return;

                this.$store.state.mainSearch = false;
                //console.log(item)
                /*         if(this.tabRel.length==1){
                  return
                } */

                let tabRel = this.tabRel;
                for (let i in tabRel) {
                    if (val == tabRel[i].text) {
                        tabRel.splice(i, 1);
                    }
                }

                // this.recorder.forEach((i, index) => {
                //     if (i.name == item.temp) {
                //         this.recorder.splice(index, 1);
                //     }
                // });

                // this.recorderArea.forEach((i, index) => {
                //     if (i == item.temp) {
                //         this.recorderArea.splice(index, 1);
                //     }
                // });

                this.redirectRoute();
            },
            hoverClose(text) {
                //标签页关闭按钮
                this.ifClose = text;
            },
            closeTags(type, systemtab) {
                //1 右侧 2左侧 3其他 4当前系统标签下全部 5当前标签 6全部tab 7系统tab
                // console.log(type, systemtab)
                this.$store.state.mainSearch = false;

                let index = this.selectedTagIndex;
                //console.log(index)
                let tabRel = this.tabRel;
                if (this.navDisplayMode == 1) {
                    let arr = [];
                    if (this.classificationChecked && this.classification) {
                        arr = this.classification[this.classificationChecked];
                    }
                    if (type == 1) {
                        arr = arr.slice(index + 1, arr.length);
                    }

                    if (type == 2) {
                        arr = arr.slice(0, index);
                    }
                    if (type == 3) {
                        arr = arr.filter((i, k) => k != index);
                    }
                    if (type == 5) {
                        arr = [arr[index]];
                    }
                    if (type == 6) {
                        arr = tabRel.map(i => i.text);
                    }
                    if (type == 7 && systemtab) {
                        arr = this.classification[systemtab] || [];
                    }
                    //console.log(arr)
                    let tempArr = arr.map(i => this.$store.state.navDataById[i].temp);
                    this.tabRel = tabRel.filter(i => !arr.includes(i.text)) || [];

                    // this.recorder.forEach((i, index) => {
                    //     if (tempArr.includes(i.name)) {
                    //         this.recorder.splice(index, 1);
                    //     }
                    // });

                    // this.recorderArea.forEach((i, index) => {
                    //     if (tempArr.includes(i)) {
                    //         this.recorderArea.splice(index, 1);
                    //     }
                    // });
                } else {
                    if (type == 1) {
                        this.tabRel = tabRel.slice(0, index + 1);
                    }

                    if (type == 2) {
                        this.tabRel = tabRel.slice(index, tabRel.length);
                    }
                    if (type == 3) {
                        this.tabRel = [tabRel[index]];
                    }
                    if (type == 4 || type == 6) {
                        this.tabRel = [];
                    }
                    if (type == 5) {
                        this.tabRel.splice(index, 1);
                    }
                    if (type == 7) {
                        this.tabRel = tabRel.filter(i => i.othername != systemtab);
                    }
                }

                //console.log(this.tabRel)
                this.$nextTick(() => {
                    this.visible = false;
                    this.redirectRoute();
                });
            },
            openMenu(text, index, e) {
                // console.log(index)
                this.visible = true;
                if (this.navDisplayMode == 1) {
                    this.selectedTagIndex = this.classification[
                        this.classificationChecked
                    ].indexOf(text);
                } else {
                    this.selectedTagIndex = index;
                }
                console.log(e)
                console.log(e.offsetX)
                this.left = e.clientX;
                this.top = e.clientY + 16;
            },
            closeMenu() {
                this.visible = false;
            },
            positionClassific(name) {//锚定左侧的导航模块
                if (name) {
                    if (!name.includes('层')) {
                        name = name + '层'
                    }
                    document.getElementById(name) && document.getElementById(name).scrollIntoView();
                }
            },

        },
        computed: {
            currentView() {
                //显示的模板
                if (this.tabIndex && this.tabRel && this.tabRel.length > 0) {
                    let curtab = this.$store.state.navDataById[this.tabIndex];
                    //  this.classificationChecked=curtab.othername;
                    return curtab.temp;
                }
            },
        },
        watch: {
            '$store.state.areaState'() {
                if (localStorage.usrname != 'admin') {
                    this.closeTags(6);//切换地域重置导航
                }
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener("click", this.closeMenu);
                } else {
                    document.body.removeEventListener("click", this.closeMenu);
                }
            },
            tabRel(val) {
                this.classification = {};
                val.forEach(i => {
                    if (!this.classification[i.othername]) {
                        this.classification[i.othername] = [i.text];
                    } else {
                        this.classification[i.othername].push(i.text);
                    }
                });
                //注意：客服费用确认和航线费用确认被拦截了，需要替换实际的组件name使其缓存
                let tabRelKeep = this.tabRel.map(i => {
                    // if (i.temp == 'costConfirmationkf') {
                    //     return 'kfCostCassify'
                    // } else if (i.temp == 'costConfirmationhx') {
                    //     return "hxCostCassify"
                    // } else if (i.temp == 'costConfirmFob'){
                    //     return "hwzzCostCassify"
                    // } else if(i.temp == 'costCheckFob'){
                    //     return "hwshCostCassify"
                    // } else if(i.temp == 'reconMngFirFob'){
                    //     return "hwkjCostCassify"
                    // }else if(i.temp == 'tZsearch'){
                    //     return "tzSearchClassify"
                    // }else if(i.temp == 'gnCostConfirm'){
                    //     return "gnCostCassify"
                    // }else{
                    //     return i.temp
                    // }
                    return (cassifyObj[i.temp] && cassifyObj[i.temp].routername) || i.temp
                });

                if (val.length == 0) {
                    this.classificationChecked = ''
                }

                this.$emit('update:tabRelKeep', tabRelKeep || [])


            },
            tabIndex(val) {
                if (val) {
                    this.classificationChecked = this.$store.state.navDataById[
                        this.tabIndex
                    ].othername || '';
                }
            },
            $route: {
                handler(val) {
                    this.toggleZiNav(val.params.id);
                    setCookie('routerid', val.params.id)
                }
            }
        }
    };
</script>
<style scoped lang="less">
    // @first-nav-bg:#4B616F; //一级导航
    // @zi-nav-bg:#3A4C58; //顶部栏 二级导航 导航标签
    // @zi-nav-hover-bg:#2C3B43; //子导航hover

    @first-nav-bg: #384954; //一级导航
    @zi-nav-bg: #384954; //顶部栏 二级导航 导航标签
    @zi-nav-hover-bg: #021629; //子导航hover

    @first-nav-font-color: #9cd7ff;
    @zi-nav-font-color: rgb(191, 203, 217);
    @zi-nav-text-color: #fff; //子导航选中颜色
    //@zi-nav-text-color:#fff; //子导航选中颜色



    li {
        list-style: none;
    }




    .top {
        display: flex;
        justify-content: space-between;
        align-content: center;
        width: 420px;
        position: absolute;
        right: 0px;
        height: 48px;
        line-height: 48px;
        text-align: left;
        font-weight: 999;
        text-indent: 15px;
        color: #333;
        //width:auto;
        z-index: 1100;

        /deep/.el-badge__content {
            padding: 0 !important;
            width: 10px;
            height: 10px;
            text-indent: 0em;
            line-height: 18px;
            border-radius: 18px;
        }

        /deep/.el-badge__content.is-fixed {
            top: 8px;
        }
    }


    .checked {
        display: block;
    }


    .tabNav {
        width: 100%;
        box-shadow: 0px 0px 8px #ccc;
        background-color: #fff;
    }

    .tabNavConter {
        display: flex;
        align-items: center;
        width: calc(100% - 350px);
        text-align: left;
        height: 48px;
        line-height: 48px;
        /* padding-right: 50px; */
        // margin-bottom: 8px;
        //position: fixed;
        overflow: hidden;
        white-space: nowrap;
        //  z-index: 1000;
        -webkit-touch-callout: none;
        /* iOS Safari */
        -webkit-user-select: none;
        /* Chrome/Safari/Opera */
        -khtml-user-select: none;
        /* Konqueror */
        -moz-user-select: none;
        /* Firefox */
        -ms-user-select: none;
        /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
not supported by any browser */
    }

    .tabNav .classification {
        display: inline-flex;
        //padding-left: 20px;
        // padding-left: 10px;
        margin-right: 16px;

        span {
            min-width: 50px;
            margin: 0px;
            border-radius: 0px;
            padding: 0 6px;
            color: #000;
            position: relative;
            border-radius: 4px;
            margin-right: 2px;
            opacity: 0.4;
            border: none;
            display: flex;
            align-items: center;

            >div {
                display: none;
                position: absolute;
                right: -20px;
                z-index: 2000;
                width: 24px;
                height: 28px;
                border-radius: 0 4px 4px 0;

                >i {
                    margin-left: -4px;
                }
            }
        }

        span.checked {
            opacity: 1;
            color: #444;
        }

        span:hover {
            opacity: 1;
            color: #444;

            >div {
                display: block;
            }
        }

        span:first-child {
            // border-radius: 6px 0 0 6px;
        }

        span:last-child {
            // border-radius: 0px 6px 6px 0px;
        }

        // span:not(:last-child) {
        //   border-right: none;
        // }
    }



    .changetab {
        margin-right: 20px;
        height: 100%;
        background-color: #fff;
        display: flex;
        align-items: center;
        /* flex-grow: 1; */
        position: relative;
    }

    .changetab:before {
        content: "";
        position: absolute;
        left: 64px;
        bottom: 20%;
        width: 1px;
        height: 60%;
        background-color: #e8e8e8;
    }

    .changetab i {
        display: inline-block;

        width: 24px;
        height: 24px;
        margin-right: 3px;
        cursor: pointer;
    }

    .changetab i:nth-child(1) {
        background: url("../../../boStatic/images/tableft.png") no-repeat 0 0;
    }

    .changetab i:nth-child(2) {
        background: url("../../../boStatic/images/tabright.png") no-repeat 0 0;
    }

    .tabcover {
        // width:18px;
        width: 30px;
        height: 100%;
        background: url("../../../boStatic/images/tabcover.png") no-repeat 0 0;
        // background-size: 100%;
    }



    .tabnav-right {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1000;
        background: #fff;
        // border-bottom:1px solid #e8e8e8;
    }


    .tabnavcon {
        overflow: hidden;

        >a {
            animation: blink 2s;
        }
    }

    .tabNav span {
        min-width: 108px;
        height: 28px;
        line-height: 24px;
        display: inline-block;
        color: #999;
        text-align: center;
        cursor: pointer;
        padding-left: 15px;
        padding-right: 15px;
        background-color: #f8f8f8;
        border-radius: 14px;
        border: 1px solid #e8e8e8;
        box-sizing: border-box;
        margin-right: 10px;
        font-size: 14px;
    }

    .tabNav span i {
        width: 12px;
        height: 12px;
        display: inline-block;
        margin-left: 3px;
        position: relative;
        top: 2px;
        cursor: pointer;
    }

    .bgnone {
        transform: scale(1.2, 1.2);
    }

    .tabNav .tabChecked .bgnone {
        background-color: #506979;
    }

    .tab-close {
        border-radius: 50%;
        // background-color: #e8e8e8;
        background-color: #ccc;
    }

    .level-first-ul .Zichecked {
        color: @zi-nav-text-color  !important;
    }

    .Zichecked {
        color: @zi-nav-text-color  !important;
    }

    .level-first-ul span.textSpan {
        width: calc(100% - 10px);
        display: inline-block;
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
        margin: 5px 0px;

        p {
            display: inline;
        }

        .tup {
            position: relative;
            top: 7px;
        }
    }

    // .level-first-ul span:hover {
    //   background-color: #32414a;
    // }
    .level-first-ul .Zichecked span {
        background-color: #32414a;
    }

    .tabNav .tabChecked {
        background: #506979;
        border-radius: 15px;
        color: #fff;
        border: 1px solid #3a4c58;
    }

    .tabNav .tabChecked i {
        background-color: #fff;
    }







    .tup {
        display: inline-block;
        border-radius: 10px;
        width: 30px;
        height: 16px;
        background-color: #f56c6c;
        float: right;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
        font-style: normal;
        color: #fff;
    }

    .greenTup {
        background-color: green;
        cursor: none;
    }

    .contextmenu {
        margin: 0;
        background: #eee;
        z-index: 2;
        position: fixed;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 2000;
    }

    .contextmenu li {
        margin: 0;
        padding: 0px 16px;
        cursor: pointer;

        &:hover {
            background: #ccc;
        }
    }


    .level-first a {
        color: #bfcbd9;
    }







    @keyframes blink {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 50;
        }

        100% {
            opacity: 100;
        }
    }


    .el-icon-plus {
        transition: all 0.5s;
        transform: rotate(180deg);
    }

    .el-icon-minus {
        transition: all 0.5s;
        transform: rotate(360deg);
    }

    .el-icon-arrow-up {
        transition: all 0.5s;
        transform: rotate(180deg);
    }

    .el-icon-arrow-down {
        transition: all 0.5s;
        transform: rotate(-180deg);
    }
</style>