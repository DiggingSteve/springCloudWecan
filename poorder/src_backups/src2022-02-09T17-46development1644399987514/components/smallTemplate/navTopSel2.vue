<template>
    <div style="width:220px;margin:0px 0px 20px 16px">
        <!-- 区域选择 -->
        <!-- {{cities}} -->

        <p style="cursor:pointer;">
            <span style="color:#fff;display:inline-block;font-size:14px;margin-top:12px;">站点选择</span>
            <span
                style="color:#ACB8C1;display:inline-block;font-size:14px;margin-top:12px;width:150px;text-align:right">
                <span v-if="checkedCitiesThreeCode.length!=allCitys.length">已选{{checkedCities.length}}</span>
                <span v-else>已全选</span>
                <i class="el-icon-arrow-right"></i>
            </span>
        </p>
        <p class="normal">
            <span
                style="color:#F4F5F6;display:inline-block;width:210px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                v-if="checkedCitiesThreeCode.length!=allCitys.length">{{checkedCitiesThreeCode.join(',')}}</span>
            <span v-else>已全选</span>
            <el-select v-model="checkedCities" ref="citiesSelect" multiple placeholder="请选择"
                popper-class="mainLeftCitiesSelect"
                style="width:220px;position:absolute;left:0;top:-38px;height:50px;opacity:0" collapse-tags>
                <div class="el-icon-close" style="font-size: 20px;" @click="$refs.citiesSelect.blur()"></div>
                <div class="title">
                    <div class="title-left">
                        <h3>区域选择</h3>
                    </div>
                    <div class="title-right">
                        <p @click="checkAll = !checkAll" :class="['checkAll', {'active': checkAll}]">全选</p>
                        <p @click="$refs.citiesSelect.blur()" class="confirm">确定</p>
                    </div>
                </div>
                <table>
                    <tr>
                        <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 0">
                            <el-option-group :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value" style="width:204px;"></el-option>
                            </el-option-group>
                        </td>
                    </tr>
                    <tr>
                        <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 1">
                            <el-option-group :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value" style="width:204px;"></el-option>
                            </el-option-group>
                        </td>
                    </tr>
                </table>
            </el-select>
        </p>
        <!-- 系统选择 -->
        <p style="cursor:pointer;">
            <span style="color:#fff;display:inline-block;font-size:14px;margin-top:12px;">系统选择</span>

            <span
                style="color:#ACB8C1;display:inline-block;font-size:14px;margin-top:12px;width:150px;text-align:right">
                <span v-if="systemChecked.length!=allSystem.length">已选{{systemChecked.length}}</span>
                <span v-else>已全选</span>
                <i class="el-icon-arrow-right"></i>
            </span>
        </p>

        <p class="normal">
            <span
                style="color:#F4F5F6;display:inline-block;width:210px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                v-if="systemChecked.length!=allSystem.length">{{systemChecked.join(',')}}</span>
            <span v-else>已全选</span>
            <el-select v-model="systemChecked" ref="systemSelectT" multiple placeholder="请选择"
                popper-class="mainLeftCitiesSelect2"
                style="width:220px;position:absolute;left:0;opacity:0;top:-38px;height:50px;" collapse-tags>
                <div class="el-icon-close" style="font-size: 20px;" @click="$refs.systemSelectT.blur()"></div>
                <div class="title">
                    <div class="title-left">
                        <h3>系统选择</h3>
                    </div>
                    <div class="title-right">
                        <p @click="checkAll3 = !checkAll3" :class="['checkAll3', {'active': checkAll3}]">全选</p>
                        <p @click="$refs.systemSelectT.blur()" class="confirm">确定</p>
                    </div>
                </div>
                <table>
                    <tr>
                        <td v-for="(group, index) in systemArrList" :key="group.value">
                            <el-option-group :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                    :value="item.value" style="width:204px;"></el-option>
                            </el-option-group>
                        </td>
                    </tr>
                </table>
            </el-select>
        </p>

        <!-- 服务选择 -->
        <p style="cursor:pointer;">
            <span style="color:#fff;display:inline-block;font-size:14px;margin-top:12px;">服务选择</span>

            <span
                style="color:#ACB8C1;display:inline-block;font-size:14px;margin-top:12px;width:150px;text-align:right">
                <span
                    v-if="serviceChecked_backup.length!=serviceOptionsLength">已选{{serviceChecked_backup.length}}</span>
                <span v-else>已全选</span>
                <i class="el-icon-arrow-right"></i>
            </span>
        </p>

        <p class="normal">
            <span
                style="color:#F4F5F6;display:inline-block;width:210px;overflow: hidden; text-overflow: ellipsis;white-space: nowrap;"
                v-if="serviceChecked_backup.length!=serviceOptionsLength">{{serviceCheckedText.join(',')}}</span>
            <span v-else>已全选</span>

            <el-select v-model="serviceChecked_backup" ref="serviceSelectT" multiple placeholder="请选择"
                popper-class="mainLeftCitiesSelect3"
                style="width:220px;position:absolute;left:0;opacity:0;top:-38px;height:50px;" collapse-tags
                @visible-change="serviceSelectVisibleChange">
                <div class="el-icon-close" style="font-size: 20px;"
                    @click="changeServiceSelect=false;$refs.serviceSelectT.blur()"></div>
                <div class="title" style="margin-bottom:20px;">
                    <div class="title-left">
                        <h3>服务选择</h3>
                    </div>
                    <div class="title-right">
                        <p @click="checkAll2 = !checkAll2" :class="['checkAll2', {'active': checkAll2}]">全选</p>
                        <p @click="changeServiceSelect=true;$refs.serviceSelectT.blur()" class="confirm">确定</p>
                    </div>
                </div>
                <el-tabs v-model="activeServiceTab" type="card" class="serviceTabCard">
                    <el-tab-pane v-for="system in Object.keys(serviceOptions)" :name="system" :label="system"
                        :key="system">
                        <table>
                            <template v-for="portItem of serviceOptions[system]">
                                <div :key="portItem.port">
                                    <tr style="color:#333;font-weight:600;font-size:15px;">{{ portItem.port }}</tr>
                                    <div :style="{'font-size':'15px'}" valign="top" class="portItemDiv">
                                        <div v-for="type in getServiceType(portItem.serviceBasicList)">
                                            <span style="margin-bottom:6px;">{{type}}</span>
                                            <div>
                                                <el-option style="width: 130px"
                                                    v-for="item in portItem.serviceBasicList.filter(i => i.servicetype == type)"
                                                    :key="item.servicecode" :label="item.servicename"
                                                    :value="item.selectValue">
                                                </el-option>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </table>
                    </el-tab-pane>
                </el-tabs>
            </el-select>
        </p>

    </div>
</template>
<script>
    export default {
        name: "navTopSel",
        props: {
            cities: Array,
            serviceBasic: Array,
        },
        data() {
            return {
                systemArrList: this.$store.state.systemArrList,
                checkedCities: [],
                systemChecked: [],
                serviceChecked: [],
                serviceCheckedSystem: [],
                serviceChecked_backup: [],
                changeServiceSelect: false,
                activeServiceTab: "",
            }
        },
        created() {
            this.$watch(() => {
                return this.$store.state.areaState + this.$store.state.systemCheck
            }, () => {
                this.checkedCities = this.$store.state.areaState && this.$store.state.areaState.split(',') || []
                this.systemChecked = this.$store.state.systemCheck && this.$store.state.systemCheck.split(',') || []
            })

        },
        methods: {
            serviceSelectVisibleChange(val) {
                if (val) {
                    this.activeServiceTab = Object.keys(this.serviceOptions)[0];
                } else {
                    if (this.changeServiceSelect) {
                        this.setServiceChecked(this.serviceChecked_backup);
                        this.changeServiceSelect = false;
                    }
                }

                this.setServiceCheckedBackup(this.serviceChecked);
            },

            setServiceChecked(serviceCheckedBackup) {
                let serviceArr = serviceCheckedBackup.map(i => i.split("|"));
                let tempService = {};
                serviceArr.forEach(i => {
                    if (!tempService[i[1]]) tempService[i[1]] = "";
                    tempService[i[1]] += i[0] + "|";
                });

                let serviceCheckedArr = [],
                    serviceCheckedSystemArr = [];
                for (let servicecode of Object.keys(tempService)) {
                    serviceCheckedArr.push(servicecode);
                    serviceCheckedSystemArr.push(tempService[servicecode].slice(0, -1));
                }
                this.serviceChecked = serviceCheckedArr;
                this.serviceCheckedSystem = serviceCheckedSystemArr;
                // console.log(1)
            },
            setServiceCheckedBackup(serviceChecked) {
                // 服务选项里需要区分系统，不同系统里存在相同的servicecode，为了区分系统，使用 "系统|服务代码" 当临时数据
                let system = this.serviceCheckedSystem || [];
                let serviceArr = [];
                serviceChecked.forEach((servicecode, index) => {
                    if (system[index]) {
                        system[index].split("|").forEach(item => {
                            if (!this.systemChecked.includes(item)) return;
                            serviceArr.push(item + "|" + servicecode);
                        });
                    } else {
                        for (let item of this.serviceOptionsArr) {
                            if (item.servicecode === servicecode) {
                                serviceArr.push(item.system + "|" + servicecode);
                                break;
                            }
                        }
                    }
                });
                // console.log(serviceArr)
                this.serviceChecked_backup = serviceArr;
            },

            getServiceType(item) {
                return [...new Set(item.map(i => i.servicetype))];
            },

        },
        computed: {
            allCitys() {
                return this.cities.map(i => i.options).flat()
            },
            allSystem() {
                return this.systemArrList && this.systemArrList.map(i => i.options).flat()
            },
            // 所选区域三字码
            checkedCitiesThreeCode() {
                let threeCode = [];
                this.cities.map(i => i.options).flat().forEach(i => {
                    if (this.checkedCities.includes(i.value)) {
                        threeCode.push(i.label.split("丨")[1])
                    }
                })
                this.$store.commit("setAreaStateCode", threeCode.toString());
                return threeCode;
            },

            // 左侧菜单服务选项，根据所选系统联动
            serviceOptions() {
                let options = {};
                for (let item of this.serviceBasic) {
                    if (this.systemChecked.includes(item.system)) {
                        if (!options[item.system]) options[item.system] = [];
                        options[item.system].push(item);
                        for (let item2 of item.serviceBasicList) {
                            item2.selectValue = item2.system + "|" + item2.servicecode;
                        }
                    }
                }
                return options;
            },
            // 平铺的服务选项
            serviceOptionsArr() {
                let arr = [];
                if (!this.systemChecked) return arr;
                for (let item of this.serviceBasic) {
                    if (this.systemChecked.includes(item.system)) {
                        for (let item2 of item.serviceBasicList) {
                            arr.push(item2);
                        }
                    }
                }
                return arr;
            },
            serviceOptionsLength() {
                let length = 0;
                let valueArr = [];
                for (let system of Object.keys(this.serviceOptions)) {
                    for (let item of this.serviceOptions[system]) {
                        length += item.serviceBasicList.length;
                    }
                }
                return length;
            },

            serviceCheckedText() {
                let text = [];
                this.serviceChecked.forEach(value => {
                    for (let system of Object.keys(this.serviceOptions)) {
                        for (let item of this.serviceOptions[system]) {
                            for (let item2 of item.serviceBasicList) {
                                if (
                                    value === item2.servicecode &&
                                    !text.includes(item2.servicename)
                                ) {
                                    text.push(item2.servicename);
                                }
                            }
                        }
                    }
                });
                return text;
            },
            checkAll: {
                get() {
                    return this.checkedCities.length == this.allCitys.length
                },
                set(val) {
                    if (val) {
                        this.checkedCities = this.allCitys.map(i => i.value)
                    } else {
                        this.checkedCities = [];
                    }
                }
            },

            checkAll3: {
                get() {
                    return this.systemChecked.length == this.allSystem.length
                },
                set(val) {
                    if (val) {
                        this.systemChecked = this.allSystem.map(i => i.value)
                    } else {
                        this.systemChecked = [];
                    }
                }
            },
            checkAll2: {
                get() {
                    let flag =
                        this.serviceChecked_backup.length == this.serviceOptionsLength;
                    this.$store.commit("setifServicesAllChecked", flag);
                    return flag;
                },
                set(val) {
                    if (val) {
                        for (let system of Object.keys(this.serviceOptions)) {
                            for (let item of this.serviceOptions[system]) {
                                for (let item2 of item.serviceBasicList) {
                                    if (!this.serviceChecked_backup.includes(item2.selectValue)) {
                                        this.serviceChecked_backup.push(item2.selectValue);
                                    }
                                }
                            }
                        }
                    } else {

                        this.serviceChecked_backup = [];
                    }
                }
            },


        },
        watch: {

            "$store.getters.userSetting": {
                handler(val, oldval) {
                    // console.log({ ...this.$store.getters.userSetting })
                    this.userSetting = { ...this.$store.getters.userSetting };
                    if (this.userSetting.areaChecked) {
                        this.checkedCities = this.userSetting.areaChecked.split(",");
                    }
                    if (this.userSetting.systemChecked) {
                        this.systemChecked = this.userSetting.systemChecked.split(",");
                    }
                    if (this.userSetting.serviceChecked) {
                        this.serviceChecked = this.userSetting.serviceChecked.split(",");
                        this.serviceCheckedSystem = this.userSetting.serviceCheckedSystem.split(
                            ","
                        );
                        this.setServiceCheckedBackup(this.serviceChecked);
                    }


                },
                immediate: true
            },
            serviceOptions: {
                deep: true,
                handler() {
                    if (this.serviceOptionsArr.length === 0) return;
                    let valueArr = this.serviceOptionsArr.map(i => i.selectValue);
                    // 去除选项里没有的数据
                    for (let i = 0; i < this.serviceChecked_backup.length; i++) {
                        if (!valueArr.includes(this.serviceChecked_backup[i])) {
                            this.serviceChecked_backup.splice(i, 1);
                            i--;
                        }
                    }

                    this.setServiceChecked(this.serviceChecked_backup);
                }
            },
            systemChecked(val, oldval) {
                this.$store.commit("setSystemCheck", val.toString());
                if (val.length == 0) {
                    this.serviceChecked = []
                }
            },
            checkedCities: {
                handler(val) {
                    this.$store.commit("setAreaState", val.toString());
                },
                immediate: true
            },
            serviceChecked: {
                handler(val) {
                    this.$store.commit("setServiceState", val.toString());
                },
                immediate: true
            },
        }
    };
</script>
<style lang="less" scoped>
    .normal {
        //border: 1px solid rgba(255, 255, 255, 0.2);
        background: #748795;
        color: #fff;
        border-radius: 5px;
        display: inline-block;
        //width: 38px;
        //text-align: center;
        margin-right: 6px;
        margin-top: 6px;
        height: 20px;
        line-height: 20px;
        padding-left: 5px;
        padding-right: 5px;
        position: relative;
        width: 220px;
        cursor: pointer;

        &:hover {
            //background: rgba(255, 255, 255, 0.3);
            //border: 1px solid rgba(255, 255, 255, 0.3);
        }
    }








    .mainLeftCitiesSelect {
        top: 60px !important;
        left: 275px !important;

        .el-select-dropdown__wrap {
            max-height: none;
        }

        .popper__arrow {
            left: -7px !important;
            top: 34px !important;
            border-left-width: 0 !important;
            border-right-color: #ebeef5 !important;
            border-top-width: 6px !important;
            border-bottom-color: transparent !important;

            &:after {
                top: -6px !important;
                margin-left: 1px !important;
                border-left-width: 0 !important;
                border-right-color: #fff !important;
                border-top-width: 6px !important;
                border-bottom-color: transparent !important;
            }
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                vertical-align: top;

                .el-select-dropdown__item {
                    width: 165px !important;

                    &:after {
                        right: 35px !important;
                    }
                }
            }
        }
    }

    .mainLeftCitiesSelect2 {
        top: 110px !important;
        left: 275px !important;

        .el-select-dropdown__wrap {
            max-height: none;
        }

        .popper__arrow {
            left: -7px !important;
            top: 34px !important;
            border-left-width: 0 !important;
            border-right-color: #ebeef5 !important;
            border-top-width: 6px !important;
            border-bottom-color: transparent !important;

            &:after {
                top: -6px !important;
                margin-left: 1px !important;
                border-left-width: 0 !important;
                border-right-color: #fff !important;
                border-top-width: 6px !important;
                border-bottom-color: transparent !important;
            }
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                vertical-align: top;

                .el-select-dropdown__item {
                    width: 165px !important;

                    &:after {
                        right: 20px !important;
                    }
                }
            }
        }
    }

    .mainLeftCitiesSelect3 {
        top: 130px !important;
        left: 275px !important;

        .el-select-dropdown__wrap {
            max-height: none;
        }

        .popper__arrow {
            left: -7px !important;
            top: 34px !important;
            border-left-width: 0 !important;
            border-right-color: #ebeef5 !important;
            border-top-width: 6px !important;
            border-bottom-color: transparent !important;

            &:after {
                top: -6px !important;
                margin-left: 1px !important;
                border-left-width: 0 !important;
                border-right-color: #fff !important;
                border-top-width: 6px !important;
                border-bottom-color: transparent !important;
            }
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                //height: 90px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                //vertical-align: text-top;

                .el-select-dropdown__item {

                    // width: 140px !important;
                    &:after {
                        right: 18px !important;
                    }
                }
            }
        }

        .hoverService {
            &:hover {
                color: #409eff;
            }
        }
    }

    .userSettingCitiesSelect {
        .el-select-dropdown__wrap {
            max-height: none;
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                vertical-align: top;

                .el-select-dropdown__item {
                    width: 165px !important;

                    &:after {
                        right: 35px !important;
                    }
                }
            }
        }
    }

    .userSettingServiceSelect {
        .el-select-dropdown__wrap {
            max-height: none;
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                vertical-align: top;

                .el-select-dropdown__item {
                    &:after {
                        right: 20px !important;
                    }
                }
            }
        }
    }

    .userSettingSystemSelect {
        .el-select-dropdown__wrap {
            max-height: none;
        }

        .el-select-dropdown__list {
            position: relative;
            padding: 10px 40px;

            .el-icon-close {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #ccc;
                cursor: pointer;
            }

            .title {
                overflow: hidden;
                height: 60px;
                border-bottom: 1px solid #e6e6e6;
                padding: 20px 0;
                margin-bottom: 10px;

                .title-left {
                    float: left;

                    h3 {
                        font-size: 20px;
                        color: #004f82;
                    }
                }

                .title-right {
                    float: right;
                    padding-top: 6px;

                    p {
                        display: inline;
                        font-size: 14px;
                        margin-left: 15px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #ccc;

                        &.confirm {
                            color: #004f82;
                        }

                        &.active {
                            color: #004f82;
                        }
                    }
                }
            }
        }

        table {
            tr {
                border-bottom: 10px solid transparent;
            }

            td {
                vertical-align: top;

                .el-select-dropdown__item {
                    width: 165px !important;

                    &:after {
                        right: 20px !important;
                    }
                }
            }
        }
    }

    .colorBlue {
        color: #c5ff9a;
    }

    .level-link3 {
        padding-left: 6px;
    }

    .portItemDiv {
        display: flex;
        padding-left: 114px;
        transform: translateY(-30px);

        >div {
            display: flex;
            flex-direction: column;
        }
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