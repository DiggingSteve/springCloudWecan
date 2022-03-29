<template>
    <div class="elitem">
        <div class="input-title">{{view.title}}
                <explainTooltip :text="view.explain" v-if="view.explain"></explainTooltip>
        </div>
        <div class="input-content" :class="[{disabled:view.disabled},{'input-required':view.required}]" :style="view.contentStyle">
            <el-input v-model.trim="value" placeholder="请输入" 
                clearable v-if="view.type==1"  v-verify="view.verify"></el-input>
            <el-radio-group v-model="value" size="small" v-if="view.type==3">
                <el-radio-button v-for="item in view.options" :label="item.value" :key="item.value" :disabled="item.disabled">
                    {{item.label}}</el-radio-button>
            </el-radio-group>
            <template v-if="view.type==4">
                <el-select v-model="value" :placeholder="$t('outside.select')" clearable>
                    <el-option v-for="(selitem,index) in view.options" :key="index" :label="selitem.label"
                        :value="selitem.value"></el-option>
                </el-select>
            </template>
            <el-input type="textarea" v-model="value" v-if="view.type==17" :disabled="view.disabled"
                v-verify="view.verify">
            </el-input>
            <pageSelect :pagetype="view.pagetype" v-if="view.type==20" :modelval.sync="value" :disabled="view.disabled">
            </pageSelect>

            <slot></slot>
        </div>
    </div>
</template>

<script>


    export default {
        props: {
            model: "",
            view: Object,
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
                }
            }
        }

    }
</script>

<style lang="less" scoped>
    @import 'small.less';

    /deep/ .el-input__suffix {
        display: flex;
        align-items: center;
    }
</style>