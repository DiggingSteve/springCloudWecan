<template>
    <div class="top">
        <div>
            <div></div>
            <div class="tabnav-right" style="margin-right:24px;">
                <div class="user-setting"
                    v-if="system!='priceSystem'" style="display: grid;grid-auto-flow: column;margin-right: 18px;">
                    <i style="font-size:18px;cursor:pointer;" class="el-icon-setting"
                        @click="userSettingVisible=true" title="用户设置"></i>
             
                    <i class="el-icon-edit-outline" v-if="usrname=='admin'"
                        style="font-size:18px;cursor:pointer;" @click="ue=true"></i>
                    <i style="font-size:18px;cursor:pointer;" class="el-icon-refresh"
                        @click="updateProductionVersion" title="更新线上版本号" v-if="showUpdateVersion"></i>
                </div>
                <div style="display: inline-flex;align-items: center;">
                    <span class="nameBac"></span>
                    <span style="max-width: 185px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">{{usrname}}</span>
                </div>
                <div @click="Logout" v-if="system=='bo'" style="cursor:pointer">注销登录</div>
                <i class="el-icon-location-outline" style="cursor: pointer;font-size: 18px;" v-if="islocal&&system=='bo'"
                    title="重新登录并跳转到当前路由页;目前只在本地开发使用" @click="relogin"></i>
                <div @click="$emit('backindex',true)" v-if="system=='outside'" style="cursor:pointer">返回首页</div>
            </div>
        </div>

        <!-- 富文本编辑 -->
        <el-dialog width="1100px" top="4%" height="800px" center :visible.sync="ue" v-if="ue" append-to-body
            :close-on-click-modal="false">
            <ue v-if="ue"></ue>
        </el-dialog>

        <userSettingComp :visible.sync="userSettingVisible" :serviceBasic="serviceBasic"  @success="$emit('success',true)">
        </userSettingComp>
    </div>

</template>
<script>
    import ue from "@/components/templates/ue";
    import userSettingComp from "@/components/templates/userSettingComp";
    import { Logout } from "@/api/localStorage";

    export default {
        name: "navSetting",
        components: {
            ue,
            userSettingComp,
        },
        props: {
            system: String,
            userSetting: Object,
            serviceBasic: Array,
        },
        data() {
            return {
                usrname:"",
                userSettingVisible: false,
                ue: false
            }
        },
        methods: {
            Logout,
            relogin(){
                setCookie('isrelogin',2);//2是点击重载入
                setCookie('systemTitle', document.title);//保存当前系统
                this.Logout()
            },
            async updateProductionVersion() {//更新线上版本号
                let confirm = await this.$confirm("将更新线上版本号为当前最新版本，是否继续？", "提示", {
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                if (!confirm) return;

                //打包后更新版本号
                this.$axios({
                    method: 'post',
                    url: this.$store.state.publicWebApi + `api/PubSystemVersion`,
                    data: {
                        system: sessionStorage.system,
                        version: process.env.buildVersionNumber,
                        addman: window.location.host
                    },
                    loading: true,
                    tip: false,
                    noarea: true
                })
                    .then(response => {
                        // console.log(response);
                        if (response.data.resultstatus == 0) {
                            this.$message.success(response.data.resultmessage)
                        } else {
                            this.$message.error('新增版本号失败')
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            },

        },
        mounted() {
           this.usrname=sessionStorage.system=='outside'?sessionStorage.out_uname:localStorage.getItem("usrname")
        },
        computed: {
            showUpdateVersion() {
                return this.projectIsWecan && process.env.buildVersionNumber && process.env.NODE_ENV == 'production' && sessionStorage.system != 'priceManagement' && localStorage.usrname == 'admin'
            },
            islocal(){
                   return window.location.hostname=='localhost'
            }

            
        },
        watch: {
            // userSettingVisible() {
            //     this.$emit("update:userSetting", { ...this.$store.getters.userSetting })
            // },
        }
    };
</script>
<style scoped lang="less">
    .top {
        width: 350px;
        position: absolute;
        right: 0px;
        z-index: 1100;

        >div {
            display: flex;
            justify-content: space-between;
            align-content: center;
            height: 48px;
            line-height: 48px;
            text-align: left;
            font-weight: 999;
            text-indent: 15px;
            color: #333;
        }

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

    .tabnav-right {
        position: relative;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1000;
        background: #fff;
    }

    .nameBac {
        background: url("../../../boStatic/images/usrname.png");
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: -4px;
        margin-right: 10px;
        background-size: 16px 16px;
    }
</style>