<template>
    <div>
        <!-- <div style="height: 0px;text-align: right;">
            <el-button type="primary" icon="el-icon-plus" style="transform: translate(0px,-40px);" @click="addkhjcno()">
                新增进仓编号</el-button>
        </div> -->
        <!-- {{inputModelData.ybstoreList}} -->
        <!-- {{hasSize()}} -->
        <!-- :class="{columnNumber:!showRkType}" -->
        <div class="gooodstable">
            <div class="gooodstable-row">
                <div>删除</div>
                <div>进仓编号</div>
                <div>件数</div>
                <div>重量</div>
                <div>体积</div>
                <div>是否超规</div>
                <div v-hide="comisWaybill">所属分运单</div>
                <div>入库类型</div>
                <div>预计入库仓库</div>
                <div style="width: 175px;">预计入库日期</div>
                <div>联系人</div>
                <div>电话</div>
                <!-- <div v-if="isOutsideSystem" style="grid-column: span 2">详细尺寸录入</div> -->
            </div>
            <div v-for="(curObj,indexkhjcno) in inputModelData.ybstoreList" class="gooodstable-row" v-enterfocus>
                <div style="display: flex;justify-content: center;">
                    <span style="display: inline-block;width:20px">
                        <i class="el-icon-delete" v-show="indexkhjcno!=inputModelData.ybstoreList.length-1"
                            title="删除进仓编号" @click="delKhjcno(indexkhjcno)" style="cursor:pointer;color:red"></i>
                    </span>

                    <!-- <el-popover placement="right" trigger="manual" :value="popvisible==indexkhjcno">
                        <div style="padding: 20px 10px;background: #e8e8e8;">
                            <div>
                                <p style="text-align: right;">
                                    <el-button type="primary" size="mini" @click='popConfirm(curObj)'>确定</el-button> 
                                    <el-button type="primary" size="mini" @click='popvisible=-1'>确定</el-button>
                                </p>
                            </div>
                            <div v-enterfocus class="enterWarehouseNumber">
                                <div style="border-top:1px solid #e8e8e8;">
                                    <el-row style="display:flex;">
                                        <el-col>
                                            <span style="padding-bottom: 6px;color:#666">预报尺寸备注(可复制粘贴)</span>
                                            <el-input class="redPlaceholder input-required"
                                                v-model="curObj.storeremark_yb" type="textarea" rows="4"
                                                placeholder="请填写或复制粘贴所有尺寸信息，供航线订舱使用" clearable></el-input>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>

                        </div>

                        <i class="el-icon-edit" slot="reference" @click="popvisible=indexkhjcno" title="编辑尺寸信息"
                            style="cursor: pointer;margin-left:8px;color:red"></i>
                    </el-popover> -->

                    <!-- <el-popover placement="right" trigger="manual" :value="popvisible==indexkhjcno">
                        <div style="padding: 20px 10px;background: #e8e8e8;">
                            <div>
                                <p style="text-align: right;">
                                    <el-button type="primary" size="mini" @click='popConfirm(curObj)'>确定</el-button>
                                    <el-button type="primary" size="mini" @click='popvisible=-1'>返回</el-button>
                                </p>
                            </div>
                            <div class="girdSize">
                                <span>包装类型</span>
                                <span>包装件数</span>
                                <span>包装尺寸(长/宽/高)CM</span>
                                <span></span>
                            </div>
                            <div class="girdSize" v-for="(item, index) in curObj.ybstorevolumeList" :key="index">
                                <div>
                                    <el-select v-model="item.packagetypename" :clearable="true" filterable
                                        :class="{'input-required': isRequired(item)}">
                                        <el-option v-for="(item, index) in packageType" :key="index" :label="item"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div>
                                    <el-input v-model="item.piece" v-verify="'integer'"
                                        :class="{'input-required': isRequired(item)}" clearable
                                        @input="sizePieceChange(indexkhjcno,index,$event,)">
                                    </el-input>
                                </div>
                                <div style="display: grid;grid-template-columns: repeat(3,1fr);column-gap: 3px">
                                    <el-input v-model="item.longs" :class="{'input-required': isRequired(item)}"
                                        clearable>
                                    </el-input>

                                    <el-input v-model="item.widths" :class="{'input-required': isRequired(item)}"
                                        clearable>
                                    </el-input>


                                    <el-input v-model="item.heights" :class="{'input-required': isRequired(item)}"
                                        clearable>
                                    </el-input>

                                </div>
                                <div>
                                    <el-button type="danger" icon="el-icon-delete" size="small" title="删除尺寸信息"
                                        style="margin-left:8px" @click="packageFn(indexkhjcno,index,2)"></el-button>
                                    <el-button type="success" icon="el-icon-plus" size="small"
                                        @click="packageFn(indexkhjcno,index,1)"
                                        v-visible="index == curObj.ybstorevolumeList.length-1"></el-button>
                                </div>
                            </div>
                        </div>

                        <i class="el-icon-edit" v-if="isOutsideSystem" slot="reference" @click="popvisible=indexkhjcno;addSize(indexkhjcno)"
                            title="编辑尺寸信息" style="cursor: pointer;margin-left:8px"></i>
                    </el-popover> -->

                </div>
                <div class="divrequired">
                    <el-input v-model="curObj.khjcno" class="input-required" @change="khjcnoChange($event,indexkhjcno);"
                        clearable>
                    </el-input>
                </div>
                <div class="divrequired">
                    <el-input class="input-required" v-model="curObj.piece" v-verify="'integer'"
                        @input="inputChange($event,'piece',indexkhjcno)" clearable>
                    </el-input>
                </div>
                <div class="divrequired">
                    <el-input class="input-required" @input="inputChange($event,'weight',indexkhjcno);"
                        v-model="curObj.weight" v-verify="'float'" clearable>
                    </el-input>
                </div>
                <div class="divrequired">
                    <el-input class="input-required" v-model="curObj.volume" v-verify="'float'"
                        @input="inputChange($event,'volume',indexkhjcno)" clearable>
                    </el-input>
                </div>
                <div  class="divrequired">
                    <el-select v-model="curObj.isstorelimit" clearable filterable class="input-required">
                        <el-option v-for="(item, index) in cgoptions" :key="index" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div  v-hide="comisWaybill">
                    <el-autocomplete v-model="curObj.hawb" @select="inputChange($event,'hawb',indexkhjcno)" clearable
                        :fetch-suggestions="querySearch" @change="inputChange($event,'hawb',indexkhjcno)">
                    </el-autocomplete>
                </div>
                <div class="divrequired">
                    <el-select class="input-required" v-model="curObj.storeType"
                        @change="inputChange($event,'storeType',indexkhjcno)" clearable>
                        <el-option v-for="type of storeTypeOptions" :key="type" :value="type">{{ type }}</el-option>
                    </el-select>
                </div>
                <div>
                    <el-select 
                        v-if="curObj.storeType=='晚入库'||curObj.storeType=='入库'"
                        v-model="curObj.storename_yb" 
                        clearable filterable :class="{'input-required':curObj.storeType=='入库'}"
                        @change="inputChange($event,'storename_yb',indexkhjcno)">
                        <el-option v-for="(item, index) in getStoreArr()" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span v-else>
                        <el-input v-model="curObj.storename_yb"  placeholder="" disabled></el-input>
                    </span>
                </div>
                <div class="goDate" style="width: 175px">
                     <el-date-picker 
                        :disabled="!(curObj.storeType=='晚入库'||curObj.storeType=='入库')"
                        v-model="curObj.yjstoredate"
                        :value-format="'yyyy-MM-dd HH:mm:ss'" 
                        :type="'datetime'"
                        :placeholder="'选择日期'" 
                        :picker-options="setPickerOptions()"  
                        :default-value="nowDate" 
                        clearable>
                    </el-date-picker>
                </div>
                <div>
                    <el-input v-model="curObj.storerelname_yb" 
                        placeholder="请填写联系人姓名"></el-input>
                </div>
                <div>
                    <el-input v-model="curObj.storerelphone_yb" 
                        placeholder="请填写联系人电话"></el-input>
                </div>

                <!-- <div v-if="isOutsideSystem">
                    <div style="border-left: 1px solid #eee;width:100%;padding-left:4px;margin:5px">
                        <p v-for="item in curObj.ybstorevolumeList" v-if="isSizeComplete(item)"
                            style="line-height: 18px;font-size: 12px;display:grid;grid-template-columns: repeat(3,1fr);place-items: center">
                            <span>{{item.packagetypename}}</span><span>{{item.piece}}</span><span>{{item.longs}}*{{item.widths}}*{{item.heights}}</span>
                        </p>
                    </div>

                </div> -->


            </div>
        </div>
        
        <!-- 货物信息， 删除tah删除键，显示 原来预报尺寸 -->
        <div v-enterfocus class="enterWarehouseNumber" >
            <div style="padding-top:16px;border-top:1px solid #e8e8e8;">
                <el-row style="display:flex;">
                    <el-col>
                        <span style="padding-bottom: 6px;color:#666">预报尺寸备注(可复制粘贴)</span>
                        <el-input class="redPlaceholder"
                            :class="{'input-required':inputModelData.czlx=='自货'&&!(applicationPage==2&&hasSize)}"
                            v-model="inputModelData.ybvolumeremark" type="textarea" rows="4"
                            placeholder="请填写或复制粘贴所有尺寸信息，供航线订舱使用" clearable></el-input>
                    </el-col>
                </el-row>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        props: {
            serviceSelArr: {
                type: Array,
                default() {
                    return []
                }
            },
            inputModelData: Object,
            applicationPage: {//应用于哪里，默认bo系统；2外网系统，如果填写了尺寸信息则 预报尺寸备注不必填
                type: [String, Number],
                default: 1
            },
            isWaybill: {
                type: Boolean,
                default: false,
            }


        },
        data() {
            return {
                packageType: [],
                showSubTable: -1,
                storeTypeOptions: [],
                cgoptions: [
                    { label: '是', value: 1 },
                    { label: '否', value: 2 }
                ],
                popvisible: -1
            }
        },
        computed: {
            isOutsideSystem() {
                return sessionStorage.system == 'outside'
            },
            showRkType() {//是否显示入库仓库列            
                return this.inputModelData.ybstoreList.filter(i => i.storeType == '入库' || i.storeType == '晚入库').length > 0
            },
            hadStorename_yb() {//已选择的入库仓库
                return this.inputModelData.ybstoreList.filter(i => i.storeType && i.storename_yb).map(i => i.storename_yb) || []
            },
            hasSize() {//是否填写过一条完整的尺寸信息,如果填写过，尺寸备注不用必填
                return this.inputModelData.ybstoreList.filter(i => {
                    return (i.ybstorevolumeList.filter(item => {
                        return this.isSizeComplete(item)
                    }).length) > 0
                }).length > 0
            },
            comisWaybill() {
                return this.isWaybill;
            },
            nowDate() {
                let now = new Date();
                let year = now.getFullYear();
                let month = now.getMonth() ;
                let day = now.getDate();
                let hour = now.getHours();
                return new Date(year, month, day, hour,);
            },
        },
        created() {
            let groupData = JSON.parse(localStorage.getItem('groupType') || '[]')
            groupData.forEach(item => {
                if (item.groupid === 31) this.packageType.push(item.typename)
                if (item.groupid === 170) this.storeTypeOptions.push(item.ready01)
            })


            this.initfunc()

            // if (!this.inputModelData.guid || this.inputModelData.guid == -1) {//新增时候
            //     this.$watch(() => {
            //         return this.inputModelData.ybpiece + this.inputModelData.ybweight + this.inputModelData.ybvolume
            //     }, () => {
            //         if (this.inputModelData.ybstoreList.length == 1) {
            //             this.inputModelData.ybstoreList[0].piece = this.inputModelData.ybpiece
            //             this.inputModelData.ybstoreList[0].weight = this.inputModelData.ybweight
            //             this.inputModelData.ybstoreList[0].volume = this.inputModelData.ybvolume
            //         }
            //     })
            // }

        },
        mounted() { },
        methods: {
           
            setPickerOptions() {
                return {
                            disabledDate(time) {
                                return time.getTime() + 3600 * 1000 * 24 < Date.now();
                            }
                        }
            },
            initfunc() {
                if (this.inputModelData.ybstoreList.length) {
                    if (this.inputModelData.ybstoreList.filter(i => i.isadd).length == 0) {
                        this.inputModelData.ybstoreList = [...this.inputModelData.ybstoreList, this.initkhjcno()]
                    } else {
                        this.inputModelData.ybstoreList = this.inputModelData.ybstoreList || []
                    }
                } else {
                    this.clearCurObj()
                }
            },
            querySearch(queryString, cb) {
                // console.log(queryString)
                var restaurants = [...new Set(this.inputModelData.ybstoreList.filter(i => i.hawb && i.hawb !== queryString).map(i => i.hawb))].map(i => {
                    return { value: i, label: i }
                });
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            khjcnoChange(val, index) {
                if (this.inputModelData.ybstoreList.filter(i => i.khjcno && i.khjcno == val).length > 1) {
                    this.inputModelData.ybstoreList[index].khjcno = "";
                    this.$message.error('进仓编号不能重复！');
                    if (this.isEmptyKhjcno(this.inputModelData.ybstoreList[index], 3)) {
                        this.inputModelData.ybstoreList.splice(index, 1, this.initkhjcno())
                    }
                    return
                } else {
                    this.inputChange(val, 'khjcno', index)
                }
            },
            inputChange(val, field, index) {
                let item = this.inputModelData.ybstoreList[index];
                if (val) {
                    if (field == 'storeType' && item.storeType != '不入库' && !item.storename_yb && this.hadStorename_yb.length) {
                        this.inputModelData.ybstoreList[index].storename_yb = this.hadStorename_yb[0]
                    }
                    if (field == 'storeType' && item.storeType == '不入库') {
                        this.inputModelData.ybstoreList[index].storename_yb = '';
                        this.inputModelData.ybstoreList[index].yjstoredate = '';
                    }
                    this.inputModelData.ybstoreList[index].isadd = false
                    // console.log(this.isComplete(item))
                    if ((index == this.inputModelData.ybstoreList.length - 1) && !this.isEmptyKhjcno(item, 2) && this.isComplete(item)) {
                        this.addkhjcno()
                    }
                } else {
                    if (this.isEmptyKhjcno(this.inputModelData.ybstoreList[index], 1)) {
                        this.inputModelData.ybstoreList.splice(index, 1)
                    }
                }
                this.$emit('goodsHawbChange')

            },
            addSize(index) {
                //避免初始时候没有输入框
                if (this.inputModelData.ybstoreList[index].ybstorevolumeList.length == 0) {
                    this.inputModelData.ybstoreList[index].ybstorevolumeList.push(this.initstore())
                }
            },
            initkhjcno() {

                let obj = {
                    khjcno: '',
                    piece: '',
                    weight: '',
                    volume: '',
                    smallpiece: '',
                    isstorelimit: 2,//是否超规
                    hawb: '',
                    // done: 入库
                    storeType: this.serviceSelArr.includes('AA0410') ? '入库' : '',
                    // storeType: '',
                    storename_yb: '',
                    yjstoredate: '',
                    //ybstorevolumeList: [this.initstore()],
                    timestamp: new Date().getTime(),
                    isdel: 1,
                    storerelname_yb: '',
                    storerelphone_yb: '',
                    // storeremark_yb: '',
                    isadd: true//初始的未输入数据的列
                }
                if (this.isOutsideSystem) {
                    obj.ybstorevolumeList = [this.initstore()]
                }

                return obj

            },
            initstore() {
                return {
                    packagetypename: '',
                    smallpiece: '',
                    piece: '',
                    longs: '',
                    widths: '',
                    heights: '',
                    weight: '',
                    isdel: 1
                }
            },
            addkhjcno() {
                this.inputModelData.ybstoreList.push(this.initkhjcno())
            },
            delKhjcno(index) {//删除进仓编号
                if (this.inputModelData.ybstoreList.length == 1) {
                    this.clearCurObj()
                } else {
                    this.inputModelData.ybstoreList.splice(index, 1)
                }
                this.$emit('goodsHawbChange')

            },
            clearCurObj() {
                this.inputModelData.ybstoreList = [this.initkhjcno()]
            },
            packageFn(indexkhjcno, index, type) {//尺寸
                // console.log(indexkhjcno, index, type)
                //1新增 2删除
                let ybstorevolumeList = this.inputModelData.ybstoreList[indexkhjcno].ybstorevolumeList
                if (type == 1) {

                    if (this.isSizeComplete(ybstorevolumeList[index])) {
                        console.log(ybstorevolumeList.reduce((a, prev) => Number(prev.piece) + a, 0))
                        if (this.inputModelData.ybstoreList[indexkhjcno].piece < ybstorevolumeList.reduce((a, prev) => Number(prev.piece) + a, 0)) {
                            this.$message.error('尺寸件数之和已超过进仓件数')
                        } else {
                            ybstorevolumeList.push(this.initstore())
                        }
                    } else {
                        this.$message.error('请完善此条尺寸信息！')
                    }
                } else {
                    if (ybstorevolumeList.length == 1) {
                        // ybstorevolumeList = [this.initstore()]//无效
                        // this.inputModelData.ybstoreList[indexkhjcno].ybstorevolumeList = [this.initstore()]//有效
                        ybstorevolumeList.splice(index, 1, this.initstore())
                    } else {
                        ybstorevolumeList.splice(index, 1)
                    }
                    // this.setKhjcnoItem()
                }
            },
            sizePieceChange(indexkhjcno, index, e) {
                let ybstorevolumeList = this.inputModelData.ybstoreList[indexkhjcno].ybstorevolumeList;
                if (this.inputModelData.ybstoreList[indexkhjcno].piece < ybstorevolumeList.reduce((a, prev) => Number(prev.piece) + a, 0)) {
                    this.inputModelData.ybstoreList[indexkhjcno].ybstorevolumeList[index].piece = '';
                    this.$message.error('尺寸件数之和不能超过进仓件数！');
                }
            },
            getStatus(khjcno) {
                // return this.statusArr.includes(khjcno)
            },
            isRequired(item) {
                if (this.isOutsideSystem) {
                    return item.packagetypename || item.piece || item.longs || item.widths || item.heights
                } else {
                    return this.inputModelData.czlx == '自货'
                }
            },
            hasEmptyValue(item) {
                let empty = false
                for (let key in item) {
                    item[key] == '' ? empty = true : ''
                }
                return empty
            }
            , getStoreArr() { //入库仓库
                // let cargoData = sessionStorage.system == 'outside' ? JSON.parse(sessionStorage.out_storelist) : JSON.parse(localStorage.cargoData);
                let cargoData = [];
				
                if (sessionStorage.system == 'outside') { // outside
                    cargoData = JSON.parse(sessionStorage.out_storelist)
                } else if (this.inputModelData.sfg === 'PVG') { // 上海
                    cargoData = JSON.parse(localStorage.cargoData)
                } else { // 其它区域
                    cargoData = JSON.parse(localStorage.jjd).filter(item => item.sfg === this.inputModelData.sfg)
                        .map(item =>{ 
                                item.storename = item.cname;
                                // item.storeid=item.id;
                                return item;
                            })
                }


                let arr = [];
                let storename_yb = this.hadStorename_yb

                cargoData.map(item => {

                    // if (item.area == this.inputModelData.area || item.area == this.$store.state.areaState) {
                        if (storename_yb.length == 0) {
                            arr.push(item.storename);
                        } else {
                            if (storename_yb.includes(item.storename)) {
                                arr.push(item.storename);
                            }
                        }
                    // }
                });
                //console.log(this.inputModelData.area)
                //console.log(arr)
                return arr;
            },
            setKhjcnoItem(e, field) {
                let fieldAll = !e && !field
                this.inputModelData.ybstoreList.forEach(i => {
                    if (field == 'piece' || fieldAll) {
                        i.piece = i.ybstorevolumeList.reduce((a, b) => { return a += Number(b.piece) }, 0)
                    }
                    // if (field == 'smallpiece' || fieldAll) {
                    //     i.smallpiece = i.ybstorevolumeList.reduce((a, b) => { return a += Number(b.smallpiece) }, 0)
                    // }
                    if (field == 'weight' || fieldAll) {
                        i.weight = i.ybstorevolumeList.reduce((a, b) => { return a += Number(b.weight) }, 0)
                    }
                    if (['longs', 'widths', 'heights'].includes(field) || fieldAll) {
                        i.volume = ((i.ybstorevolumeList.reduce((a, b) => { return a += Number(b.longs * b.widths * b.heights) }, 0)) / 1000000).toFixed(3)
                    }
                })
                this.inputChange(e, field)
            },
            isComplete(item) {
                return item.khjcno && item.piece && item.weight && item.volume && item.storeType && item.isstorelimit && (item.storeType == '不入库' ? true : item.storename_yb)
            },
            isSizeComplete(item) {
                return item.packagetypename && item.piece && item.longs && item.widths && item.heights
            },
            popConfirm(curObj) {
                let ybstorevolumeList = curObj.ybstorevolumeList
                if (ybstorevolumeList.some(i => {
                    return this.isRequired(i) && !this.isSizeComplete(i)
                })) {
                    this.$message.error('请填写完整信息！');
                } else {
                    this.popvisible = -1
                }


            },
            isEmptyKhjcno(item, type) {
                //返回true 是空行
                let initkhjcno = this.initkhjcno();
                item = JSON.parse(JSON.stringify(item))
                let arr = ['khjcno', 'piece', 'weight', 'volume', 'storeType', 'isstorelimit'].filter(i => {
                    return item[i] != initkhjcno[i]
                })
                return arr.length == 0

            }
        },
        watch: {
            // done: 仓库选得空出进仓，入库类型为入库
            serviceSelArr: {
                handler(val) {
                    if (val.includes('AA0410')) {
                        for( let data of this.inputModelData.ybstoreList) {
                            data.storeType = data.storeType || '入库'
                        }
                    }
                },
                deep: true,
            },

            // note: 监听货物信息 => 预计入库时间 => yjstoredate === null || yjstoredate === 1900 => yjstoredate = ''
            'inputModelData.ybstoreList': {
                handler(val) {
                    this.inputModelData.ybstoreList.forEach( item => {
                        if (
                            item.yjstoredate === undefined ||
                            item.yjstoredate === null ||
                            item.yjstoredate.includes('1900')
                        ) {
                            item.yjstoredate = ''
                        }
                    })
                },
                immediate: true,
                deep: true,
            }
        }
    }
</script>

<style lang="less" scoped>
    .enterWarehouseNumber {
        width: 100%;
        padding: 10px;

        .el-row {
            display: grid;
            grid-auto-flow: column;
            margin-bottom: 14px;
            width: 100%;
        }



        /* >div:first-child {
            >.el-row {
                margin-bottom: 10px;
            }


        } */

        span {
            display: inline-block;
            /* width: 86px; */
            text-align: right;

            +.el-input {
                width: 50%;
            }
        }

        .size {
            display: inline-block;

            .el-input {
                width: 80px;
                margin: 0 2px 0 2px;
            }

            .el-input:last-child {
                margin-right: 0;
            }
        }

        .package-icon {
            display: inline-block;
            vertical-align: middle;
            margin-left: 20px;
            width: 18px;
            height: 18px;
            font-size: 18px;
            border-radius: 50%;
            cursor: pointer;
        }

        .el-icon-circle-plus {
            color: #f56c6c;
        }

        .el-icon-remove {
            color: #5daf34;
        }

        .table-box {
            @table-width: 900px;
            @table-border: 1px solid #e8e8e8;

            margin: 30px 16px 16px;
            width: @table-width;
            border: @table-border;

            .el-row {
                width: @table-width - 1;

                .el-col {
                    height: 28px;
                    line-height: 28px;
                    text-align: center;
                    border-right: @table-border;
                    border-top: @table-border;
                }

                .el-icon-circle-plus-outline {
                    position: absolute;
                    top: 6px;
                    left: 140px;
                    pointer-events: all;
                }

                .el-icon-circle-plus-outline,
                .el-icon-setting,
                .el-icon-delete {
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 5px;
                }
            }

            .expansion {
                .el-col {
                    border-bottom: @table-border;
                }
            }

            .table-row:last-child>.el-row .el-col {
                border-bottom: @table-border;
            }

            .title {
                +.el-row .el-col {
                    border-top: none;
                }

                +.table-row>.el-row .el-col {
                    border-top: none;
                }

                .el-col {
                    border-top: none;
                    border-bottom: @table-border;
                }
            }

            .sub-table {
                width: @table-width * 0.7;

                .el-row {
                    width: (@table-width * 0.7) - 1;

                    .el-col:last-child {
                        border-right: @table-border;
                    }
                }
            }
        }
    }

    .redColor {
        color: red;

        /deep/ input {
            color: red
        }
    }

    .redPlaceholder {
        /deep/ textarea::-webkit-input-placeholder {
            color: red;
        }
    }

    .gooodstable {
        /* display: grid; */
        padding: 10px;
        /* grid-auto-flow: column; */

        .gooodstable-row {
            min-height: 32px;
            display: grid;
            grid-auto-flow: column;
            place-items: center;
            grid-template-columns: 70px repeat(11, 1fr);
            >div {
                border-left: 1px solid #e8e8e8;
                border-top: 1px solid #e8e8e8;
                width: 100%;
                height: 100%;
                display: grid;
                place-items: center;

                /deep/ input {
                    border: none !important;
                }
            }

            >div:last-child {
                border-right: 1px solid #e8e8e8;
            }

        }

        .gooodstable-row:last-child {
            >div {
                border-bottom: 1px solid #e8e8e8;
            }
        }
    }

    .columnNumber {
        .gooodstable-row {
            grid-template-columns: 80px repeat(10, 1fr) !important;
        }
    }

    .girdSize {
        display: grid;
        grid-template-columns: 110px 100px 300px 150px;
        margin-bottom: 10px;
        column-gap: 10px
    }

    .divrequired {
        background-color: #FFF8EF;
    }

    .goDate {
        /deep/ .el-date-editor.el-input{
            width: 100% !important;
        }
    }
</style>