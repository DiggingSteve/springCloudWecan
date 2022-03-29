<template>
    <div class="areaSelect">
        <el-select style="width:100%" v-model="value" ref="userSettingCitiesSelect" :placeholder="placeholder"
            popper-class="userSettingCitiesSelect" :multiple="multiple" clearable :class="{'input-required':required}"
            :disabled="disabled">
            <div class="el-icon-close" style="font-size: 20px;" @click="$refs.userSettingCitiesSelect.blur()"></div>
            <div class="title">
                <div class="title-left">
                    <h3>站点选择</h3>
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
    </div>
</template>

<script>


    export default {
        props: {
            model: "",
            required: {
                type: Boolean,
                default: false,
            },
            multiple: {
                type: Boolean,
                default: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: "请选择站点"
            },
            usedarea: {//能选择的地域，其他的禁用
                type: String,
                default: ""
            },
            pagetype: {
                type: [Number, String],
                default: 1 //查询条件页面用 2 新增页面用
            },
            valuetype: {
                type: [String, Number],
                default: 1 //1默认绑定的值只有地域中文名，如上海  2 绑定的值包括地域三字码 如宁波丨NGB
            },
            alone: {
                type: Boolean
            }

        },
        data() {
            return {
            }
        },
        computed: {
            value: {
                get() {
                    if (this.multiple) {
                        return this.model && this.model.split(',')
                    } else {
                        return this.model
                    }
                }, set(val) {
                    if (this.multiple) {
                        this.$emit('update:model', val.toString())
                        this.$emit('change', val.toString())
                    } else {
                        this.$emit('update:model', val)
                        this.$emit('change', val)
                    }

                }
            },
            cities() {
                let cities = [];
                let areadata = JSON.parse(localStorage.groupType).filter(i => i.groupid == '101')
                let areaArr = [];
                let showarea = this.usedarea || this.$store.state.areaState
                // console.log(showarea)
                areadata.forEach(i => {
                    //市场部 海外部 大客户部
                    let area = this.valuetype == 1 ? i.typename.split("丨")[0] : i.typename
                    if (!areaArr.includes(i.ready04)) {
                        areaArr.push(i.ready04);
                        cities.push({
                            label: i.ready04,
                            options: [
                                {
                                    value: area,
                                    label: i.typename,
                                    disabled: this.pagetype == 1 ? !showarea.includes(area) : false
                                }
                            ]
                        });
                    } else {
                        let len = areaArr.indexOf(i.ready04);
                        cities[len].options[cities[len].options.length] = {
                            value: area,
                            label: i.typename,
                            disabled: this.pagetype == 1 ? !showarea.includes(area) : false
                        };
                    }
                });

                return cities

            }
        },
        methods: {
            // changefunc(e){
            //     console.log(e)
            //     if(!this.multiple){
            //         this.$refs.userSettingCitiesSelect.blur()
            //     }
            // }
        },
        watch: {
            "$store.state.areaState"() {
                if (!this.alone) {
                    if (this.multiple) {
                        this.value = [];
                    } else {
                        this.value = '';
                    }
                }
            }

        }

    }
</script>

<style lang="less" scoped>
    .areaSelect {
        align-items: center;
    }

    .el-select-dropdown__item.selected::after {
        position: absolute;
        font-family: element-icons;
        right: 0;
        content: "\E6DA";
        font-size: 12px;
        font-weight: 700;
        -webkit-font-smoothing: antialiased;
    }
</style>