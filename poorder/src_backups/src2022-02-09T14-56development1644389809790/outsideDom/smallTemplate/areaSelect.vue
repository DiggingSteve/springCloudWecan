<template>
    <div class="areaSelect">
        <el-select v-model="value" ref="userSettingCitiesSelect" placeholder="请选择我司站点"
            popper-class="userSettingCitiesSelect" class="input-required">
            <div class="el-icon-close" style="font-size: 20px;" @click="$refs.userSettingCitiesSelect.blur()"></div>
            <div class="title">
                <div class="title-left">
                    <h3>区域选择</h3>
                </div>
                <div class="title-right">
                </div>
            </div>
            <table>
                <tr>
                    <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 0">
                        <el-option-group :label="group.label">
                            <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                :value="item.value" style="width:204px;" :disabled="item.disabled"></el-option>
                        </el-option-group>
                    </td>
                </tr>
                <tr>
                    <td v-for="(group, index) in cities" :key="group.value" v-if="index%2 == 1">
                        <el-option-group :label="group.label">
                            <el-option v-for="item in group.options" :key="item.value" :label="item.label"
                                :value="item.value" style="width:204px;" :disabled="item.disabled"></el-option>
                        </el-option-group>
                    </td>
                </tr>
            </table>
        </el-select>
        <explainTooltip text="您可委托唯凯任意一个站点,建议按照您的货物始发港就近选择站点"></explainTooltip>
    </div>
</template>

<script>


    export default {
        props: {
            model: ""
        },
        data() {
            return {
            }
        },
        computed: {
            value: {
                get() {
                    return this.model
                }, set(val) {
                    this.$emit('update:model', val)
                    this.$emit('change', val)
                }
            },
            cities() {
                let cities = [];
                let areadata = JSON.parse(sessionStorage.groupType).filter(i => i.groupid == '101')
                let areaArr = [];
                let showarea = JSON.parse(sessionStorage.storelist).map(i => i.area)
                console.log(showarea)
                areadata.forEach(i => {
                    //市场部 海外部 大客户部
                    if (!["SHICHANGBU", "HAIWAIBU", "DAKEHUBU"].includes(i.ready01)) {
                        let area = i.typename.split("丨")[0]
                        if (!areaArr.includes(i.ready04)) {
                            areaArr.push(i.ready04);
                            cities.push({
                                label: i.ready04,
                                options: [
                                    {
                                        value: area,
                                        label: i.typename,
                                        disabled: !showarea.includes(area)
                                    }
                                ]
                            });
                        } else {
                            let len = areaArr.indexOf(i.ready04);
                            cities[len].options[cities[len].options.length] = {
                                value: area,
                                label: i.typename,
                                disabled: !showarea.includes(area)
                            };
                        }
                    }
                });

                return cities

            }
        }

    }
</script>

<style lang="less" scoped>
    @import 'small.less';

    .areaSelect {
        align-items: center;

        /* /deep/ input {
            border-radius: 24px;
        } */

        /deep/ input::-webkit-input-placeholder {
            color: @contentColor;
            font-size: 14px;
        }
    }
</style>