<template>
    <div>
        <el-select placeholder="请选择" multiple v-model="khjcno" size="mini" style="width:166px;" @change="hawbSelFunc"
            class="input-required">
            <li @click="selmultiAll()" style="font-weight: bold;"
                :style="{color:khjcno.length == saveNumberList.length?'#409EFF':''}">
                <span style="cursor:pointer;user-select: none;;display:block;margin:5px 0px 5px 20px;">全选<i
                        style="margin-left:5px" class="el-icon-check"></i></span>
            </li>
            <li>
                <span style="float: left;margin-left:20px;">进仓编号</span>
                <span style="float: right;margin-right:30px;">
                    <i class="imul">件</i>/
                    <i class="imul">重</i>/
                    <i class="imul">体</i>
                </span>
            </li>
            <el-option v-for="numitem in saveNumberList" :key="numitem.khjcno" :label="numitem.khjcno"
                :value="numitem.khjcno" style="width:300px;">
                <!-- v-if="!selOptionShow(numitem.khjcno)" -->

                <span style="float: left">{{ numitem.khjcno }}</span>
                <span style="float: right;margin-right:10px;">
                    <i class="imul">{{ numitem.piece }}</i>/
                    <i class="imul">{{ numitem.weight }}</i>/
                    <i class="imul">{{ numitem.volume }}</i>
                </span>
            </el-option>
        </el-select>

    </div>
</template>

<script>
    export default {
        props: {
            saveNumberList: Array,
            value: String
        },
        computed: {
            khjcno: {
                get() {
                    let arr= this.value && this.value.split(',') || []
                    if(arr.length){
                        this.hawbSelFunc(arr)
                    }
                    return arr
                },
                set(val) {
                    this.$emit('update:value', val.toString())
                }

            }
        },
        methods: {
            hawbSelFunc(val) {
                // console.log(val)
                //选中进仓编号
                let smallpiece = 0;
                let piece = 0;
                let weight = 0;
                let volume = 0;
                val.forEach(item => {
                    this.saveNumberList.forEach(element => {
                        if (item == element.khjcno) {
                            smallpiece += Number(element.smallpiece);
                            piece += Number(element.piece);
                            weight += Number(element.weight);
                            volume += Number(element.volume);
                        }
                    });
                });

                this.$emit('select', { piece: piece, weight: Number(weight).toFixed(2), volume: Number(volume).toFixed(3), smallpiece: smallpiece })
            },
            selmultiAll() {
                //下拉全选
                let saveNumberList = this.saveNumberList
                if (this.khjcno.length == saveNumberList.length) {
                    this.khjcno = [];
                } else {
                    this.khjcno = saveNumberList.map(i => i.khjcno);
                }
            },
        },

    }
</script>

<style lang="less" scoped>

</style>