<template>
    <div>
        <!-- {{allList.length}} -->
        <div class="checklist">
            <p style="font-size:12px;margin-bottom:2px">选中文件列表：</p>
            <div class="mytable" v-mydrag="dragEnd">
                <div class="mytable-row" style="font-weight: bold;">
                    <div>删除 | 预览</div>
                    <div>文档名</div>
                    <div>文档类型</div>
                    <div>客户进仓编号</div>
                    <div>进仓序号</div>
                    <div>上榜工作号</div>
                    <div>总运单号</div>
                    <div>分运单号</div>
                    <div>创建人</div>
                    <div>创建时间</div>
                </div>
                <div class="mytable-row" v-for="(item,index) in allList" v-if="item.checked" :key="item.id">
                    <div>
                        <i class="el-icon-delete tdi" title="删除,取消选中" @click="item.checked=false"></i>
                        <i class="el-icon-view tdi" title="预览"
                            @click="previewFileaddress=item.fileaddress;previewVisible=true"></i>
                    </div>
                    <div>{{item.filename||'--'}}</div>
                    <div>{{item.source||'--'}}</div>
                    <div>{{item.khjcno||'--'}}</div>
                    <div>{{item.jcno||'--'}}</div>
                    <div>{{item.jobno||'--'}}</div>
                    <div>{{item.mawb||'--'}}</div>
                    <div>{{item.hawb||'--'}}</div>
                    <div>{{item.addman||'--'}}</div>
                    <div>{{item.adddate||'--'}}</div>
                </div>
            </div>
        </div>

        <div class="bottomgroup" style="text-align:right;padding:12px;margin-bottom: 30px;">
            <el-button @click="clearChecked" type="primary" size="small">清空选中
            </el-button>
            <el-button @click="piliangDel()" type="primary" size="small" v-if="system=='bo'">批量删除</el-button>
            <a :href="sendMail" type="primary" class="mybutton" @click="getMail()" v-if="system=='bo'">批量发送</a>
            <el-button @click="piliangDownload()" type="primary" size="small">批量下载</el-button>
        </div>

        <el-dialog v-if="previewVisible&&previewFileaddress" center :visible.sync="previewVisible" width="80%" top="2%"
            append-to-body>
            <embed :src="previewFileaddress" style="width:100%"
                :style="{height:(previewFileaddress.includes('pdf')||previewFileaddress.includes('txt'))?'800px':'100%'}">
        </el-dialog>
    </div>
</template>
<script>
    import { docUploadMixin } from '@/components/mixins/docUploadMixin'
    export default {
        props: {
            // allList: {
            //     type: Array,
            //     default: () => []
            // },
            imgList: {
                type: Array,
                default: () => []
            },
            docList: {
                type: Array,
                default: () => []
            },
            system: String,
            boguid: [String, Number],
            deleteIds: {//被删除文件的id
                type: Array,
                default: () => []
            }
        },
        mixins: [docUploadMixin(1)],
        data() {
            return {
                previewVisible: false,
                previewFileaddress: '',
                sendMail: '',
            }
        },

        methods: {
            dragEnd(ev, innerText) {//拖拽事件
                //  console.log(ev)
                let pclass = ev.target.parentNode.className
                //  console.log(pclass)
                //  console.log(innerText)
                if (pclass == 'mytable-row' || pclass == 'checklist') {
                    this.allList.forEach(i => {
                        if (i.id == innerText) {
                            // console.log(1111111111)
                            i.checked = true
                        }
                    })
                }
                //  console.log(innerText)
            },
        },
        computed: {
            allList: {
                get() {
                    return [...this.imgList, ...this.docList]
                },
                set() {

                }
            }
        }

    }
</script>
<style scoped>
    .mybutton {
        width: 76px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        background: #0F5A8C;
        margin-left: 10px;
        margin-right: 12px;
        cursor: pointer;
        display: inline-block;
        color: #fff;
        border-radius: 3px;
        text-decoration: none;
        user-select: none;
    }

    .mytable {
        padding: 10px;
        min-height: 126px;
    }

    .mytable-row {
        display: grid;
        /* grid-template-columns: 150px minmax(300px, 2fr) repeat(8, 1fr); */
        grid-template-columns: 150px minmax(300px, 2fr) 82px 110px 100px 165px 111px 112px 100px 150px;
    }

    .mytable-row div {
        height: 34px;
        line-height: 34px;
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

    }

    .mytable .mytable-row:last-child {
        border-bottom: 1px solid #ddd;
    }

    .mytable .mytable-row div:last-child {
        border-right: 1px solid #ddd;
    }

    .tdi {
        font-size: 16px;
        cursor: pointer;
        margin: 0 6px;
    }
</style>