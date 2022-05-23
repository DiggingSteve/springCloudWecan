
import {
    Message,
    MessageBox
} from 'element-ui';
import { result } from 'lodash';
import { error } from 'shelljs';
import { diffCodeKey } from '../../api/getBasicStorageData';
import { BaseService } from '../js/base';

const pageMode = { search: "查询", pageOne: "选择始发港目的港", pageConfirm: "确认页面" }

// 1 随直达价 2 固定价格
const priceMode = { equalDirect: 1, fixed: 2 }
//1 以TACT 加值 2 同TACT价格 
const minPriceMode = { diffByTACT: 1, equalTACT: 2 }

const pageType = { normal: "普通应收运费维护", customer: "客户应收运费维护" }
//一口价类型 没有选择任何card时 为全覆盖
const coverType = { all: "all", single: "single" }

const allFlight = "所有航班";

const specifiedFlight = "特定航班";

const zzgTitle = { direct: "直达", trans: "中转" };

const relationEditTitle = { cus: "客户参数编辑", packageType: "包装参数编辑", vol: "货型参数编辑" }

const diffCode = { vol: "vol", weight: "weight", cus: "cus", package: "package" }



class priceFreightView extends BaseService {
    constructor(v) {
        super(v);
    }
    // vue实例的axios


    //存储参数框数据
    packageTypeArr = []
    weightArr = []
    volArr = []

    tableVolArr = [];

    cusArr = []
    approvalArr = [];


    // 一口价dom引用的key
    createFixedPriceRef(head, i, j) {
        return head + i.toString() + j.toString();
    }


    /**二维数组 用于记录一口价 */
    priceDisplayArr = [];

    /**记录 packagetype_cus 组成的key 对应的一口价 */
    priceDisplayMap = {};
    /**记录用于导入价格的map 被选中的价格最终会复制到 priceDisplayMap */
    priceCopyMap = {};


    //记录钩稽参数相关信息
    relationMap = {
        cus: { title: diffCode.cus, hasRelation: false, baseIndex: 0 },
        packageType: { title: diffCode.package, hasRelation: false, baseIndex: 0 },
        vol: { title: diffCode.vol, hasRelation: false, baseIndex: 0 }
    };

    priceTabArr = [];//运价切换tab整合数组


    limitDay = 1;//清关后多少天承诺完成

    currentCoverType = coverType.all;

    _cusDisplayIndex = -1

    /**运价展示tab的索引 */
    get cusDisplayIndex() {
        var arr = this.cusArr.filter((item) => { return item.isAdd });
        if (arr.length == this.cusArr.length) return -1;
        return this._cusDisplayIndex;
    }

    set cusDisplayIndex(v) {
        this._cusDisplayIndex = v;
    }
    _packageDisplayIndex = -1;

    get packageDisplayIndex() {
        var arr = this.packageTypeArr.filter((item) => { return item.isAdd });
        if (arr.length == this.packageTypeArr.length) return -1;
        return this._packageDisplayIndex;
    }

    set packageDisplayIndex(v) {
        this._packageDisplayIndex = v;
    }

    cusImportIndex = -1;

    packageImportIndex = -1;

    // 清除数据的方式 weight 或者 vol
    clearDataType = diffCode.weight;

    clearDataIndex = -1;

    get isAddSomeParam() {
        return !!this.currentRelationEditArr.find(f => { return f.isAdd && f.isDefault == 2 });
    }

    /**当前选中的包装类型 */
    get currentPackageType() {
        return this.packageTypeArr[this.packageDisplayIndex];
    }

    get currentCus() {
        return this.cusArr[this.cusDisplayIndex];
    }

    /**当前导入页面选中的包装类型 */
    get currentImportPackageType() {
        if (this.packageImportIndex < 0) return null;
        return this.packageTypeArr[this.packageImportIndex];
    }
    /**当前导入页面选中的客户类型 */
    get currentImportCus() {
        if (this.cusImportIndex < 0) return null;
        return this.cusArr[this.cusImportIndex];
    }

    /**当前钩稽关系维护数组 将在打开编辑窗口 */
    currentRelationEditArr = [];


    currentRelationMap = {};

    /**复制增减种子 */
    copySeed = 0;
    // 复制种子增或
    isCopySeedPlus = true;

    get hbhStr() {
        return this.hbhArr.map(m => { return m.hbh }).join(",");
    }

    hbhArr = [];


    //燃油费附加费
    isContainGas = true;

    // 战争附加费
    isContainWar = true;

    //货站地面费
    isContainStation = true;

    //是否显示删除数据快捷操作
    isShowClearDialog = false;

    //删除数据标题
    clearDataTitle = "";

    //是否同步删除参数
    isDelRelationSync = false;

    //是否特定航班
    get isSpecifiedFlight() {
        return this.flightType == specifiedFlight;
    }

    flightType = allFlight;


    get hbhOptionCondition() {
        return {
            twocode: this.twoCode,
            sfg: this.sfg,
            mdg: this.mdg
        }
    }

    // 始发港 二字码 同时设置了才会展示航班号
    get isSfgTwocodeSetted() {
        return (!!this.sfg) && (!!this.twoCode) && (!!this.mdg);
    }




    _currentPageMode = pageMode.search;

    /**当前页面类型 公布运费和客户运费共用页面 所以需要区分类型 */
    currentPageType = null;



    get isShowCustomerWrap() {
        return this.currentPageType == pageType.customer;
    }


    dialogTitle = "新增公布运费";
    // 当前页面展示的分组航司二字码 ["MU,KL","CK"]
    _twoCodeArr = [];

    _timeSpan = [];

    _sfg = "";

    get sfg() {
        if (!this.isEditMode && this._sfg == "") {
            //新增 直接带入选择站点
            let area = this.area;
            let index = this.vueInstance.$store.state.areaState.split(',').findIndex(f => { return f == area });
            return this.vueInstance.$store.state.areaStateCode.split(',')[index];
        }
        return this._sfg;
    }
    set sfg(val) {
        this._sfg = val;
    }

    mdg = "";


    _twocode = "";

    get twoCode() {
        return this._twocode;
    }
    set twoCode(v) {
        this._twocode = v;
        this.queryMatchTruck();
    }

    tactTwocode = "";

    iataMap = {};

    zzgTitle = zzgTitle.direct;



    zzg = zzgTitle.direct;


    _standardPrice = -1;
    get standardPrice() {
        if (this._standardPrice < 0) return '--';
        else return this._standardPrice
    }

    set standardPrice(v) {
        var num = v * 1;
        if (isNaN(num)) {
            this._standardPrice = 0;
            throw new Error("请输入数字");
        }
        this._standardPrice = v;
    }

    _minPrice = -1;
    get minPrice() {
        if (this._minPrice <= 0) return '--';
        else return this._minPrice
    }

    set minPrice(v) {
        var num = v * 1;
        if (isNaN(num)) {
            this._minPrice = 0;
            throw new Error("请输入有效数字");
        }
        this._minPrice = v;
    }

    //直达价格
    directPrice = 0;

    // tact价格差值
    tactPriceDiff = 0



    jfType = '计重';

    gid = -1;

    /**
     * 能否修改客户关系参数 在gid>0时不能选择 cus关系
     */
    get canEditCus() {
        return this.gid < 0 || (!Number.isFinite(this.gid));
    }


    remark = "";

    isEditMode = false;

    // 选中的二字码分组数组索引默认选第一条
    _twoCodeIndexSelected = 0;

    //最初是几个二字码组成一组数据 后来改成了二字码固定的形式 所以这个数组格式为["ck,cz"] 类似只有一个元素的数组
    get twoCodeArr() {
        return this._twoCodeArr;
    }
    set twoCodeArr(v) {

        if (typeof (v) === "string") {
            let arr = v.split(',');
            if (!!!v) {
                throw new Error("请选择航司")
            }
            let isLegal = true;
            arr.forEach((item) => {
                if (!!this._twcodeGroupMap[item]) {

                    isLegal = false;
                }
            });
            if (isLegal === false) return;
            else {
                arr.forEach((item) => {
                    this._twcodeGroupMap[item] = v;
                });
            }
        }

        this._twoCodeArr.push(v);
    }

    get singleTwoCodeArr() {
        return this.twoCode.split(",");
    }
    // key twocode:{对应的分组} 为了加入分组的时候判断该航司是否加入过当前分组
    _twcodeGroupMap = {}




    get isSHowDialogPage() {
        return this._currentPageMode != pageMode.search;
    }

    //dialog 组件点×的时候会调用赋值 因为 设置了双向同步 一定要有形参 v
    set isSHowDialogPage(v) {
        this._currentPageMode = pageMode.search;
    }

    set currentPageMode(v) {
        this._currentPageMode = v;
        if (this._currentPageMode == pageMode.pageConfirm) {

        }
    }
    get currentPageMode() {
        return this._currentPageMode;
    }

    get isShowNextBtn() {
        return this._currentPageMode == pageMode.pageOne;
    }

    get isShowConfirmBtn() {
        return (this._currentPageMode == pageMode.pageConfirm);
    }
    get isShowSaveAs() {
        return this.isEditMode && this._currentPageMode == pageMode.pageConfirm;
    }
    get isShowDelBtn() {
        return this.isEditMode && this._currentPageMode == pageMode.pageConfirm;
    }
    get isShowCancelBtn() {
        return this._currentPageMode == pageMode.pageConfirm
    }

    //始发港页面
    get isShowPageOne() {
        return this._currentPageMode == pageMode.pageOne;
    }

    get isShowPageAddOrEdit() {
        return this._currentPageMode == pageMode.pageConfirm
    }

    get isShowUnSelectedWrap() {
        var hasCus = this.cusArr.filter(item => { return item.isAdd }).length > 1;
        var hasPackage = this.packageTypeArr.filter(item => { return item.isAdd }).length > 1;
        return hasCus || hasPackage;
    }

    //是否展示基点勾稽关系维护
    get isShowBasePointEdit() {
        let item = this.currentRelationEditArr.find(f => { return (f.isSameAsBase == false) && f.isDefault == 2 })
        return !!item;
    }

    //是否添加参数后没有选择是否和基点一致
    get canConfirmRelation() {
        let item = this.currentRelationEditArr.find(f => { return f.isAdd && f.isDefault == 2 && f.isSameAsBase == null })
        return !!!item;
    }

    //当前基点
    get currentBasePoint() {
        return this.currentRelationEditArr.find(f => { return f.isDefault == 1 });

    }


    /**是否展示导入数据弹框 */
    isShowImportData = false;

    /**是否展示iata运价 */
    isShowIataDialog = false;


    //是否显示勾稽关系编辑框
    isShowRelationEdit = false;



    changeSelectedTwoCodeIndex(index) {
        this._twoCodeIndexSelected = index;
    }

    loadBasicData() {
        this.packageTypeArr = JSON.parse(localStorage.getItem(diffCodeKey.package));
        this.weightArr = JSON.parse(localStorage.getItem(diffCodeKey.weight));
        this.volArr = JSON.parse(localStorage.getItem(diffCodeKey.vol));
        this.cusArr = JSON.parse(localStorage.getItem(diffCodeKey.cus));
        this.relationMap.cus.baseIndex = this.cusArr.findIndex(f => { return f.isDefault == 1 });
        this.relationMap.packageType.baseIndex = this.packageTypeArr.findIndex(f => { return f.isDefault == 1 });
        this.relationMap.vol.baseIndex = this.volArr.findIndex(f => { return f.isDefault == 1 });

        this.tableVolArr = JSON.parse(localStorage.getItem(diffCodeKey.vol)).sort((a, b) => {
            return a.tableSeq - b.tableSeq;
        })

        this.confirmPriceTabArr();

    }

    // 和基点相同的index为一组 不同的拆散 然后 packageType 和 cus 之间笛卡尔积 为排列组合总数
    cusIndexArr = []

    packageIndexArr = []

    cusPackageIndexArr = [];

    tabDisplayIndex = 0;
    //载入基点tab组合 数组第一个元素记载和基点相同的索引 
    loadBasePriceTabArr() {
        var cusIndex = this.cusArr.findIndex(f => { return f.isDefault });

        var packageIndex = this.packageTypeArr.findIndex(f => { return f.isDefault });

        this.cusIndexArr[0] = [];
        this.cusIndexArr[0].push(cusIndex);


        this.packageIndexArr[0] = [];
        this.packageIndexArr[0].push(packageIndex);

    }


    //确认 组合tab以及相关勾稽关系
    confirmPriceTabArr() {
        this.cusIndexArr = [];
        this.packageIndexArr = [];
        this.tabDisplayIndex = 0;
        this.loadBasePriceTabArr();
        for (let i = 0; i < this.cusArr.length; i++) {
            var cus = this.cusArr[i];
            if (cus.isDefault == 1) continue;
            if (!cus.isAdd) continue;
            this.cusIndexArr[0] = this.cusIndexArr[0] || [];

            if (cus.isSameAsBase) {
                this.cusIndexArr[0].push(i);
                cus.isSetValue = true;
                cus.diff = 0;
            }
            else {
                this.cusIndexArr.push(i);
            }
        }
        for (let j = 0; j < this.packageTypeArr.length; j++) {
            var p = this.packageTypeArr[j];
            if (p.isDefault == 1) continue;
            if (!p.isAdd) continue;
            this.packageIndexArr[0] = this.packageIndexArr[0] || [];

            if (p.isSameAsBase) {
                this.packageIndexArr[0].push(j);
                p.isSetValue = true;
                p.diff = 0;
            }
            else {
                this.packageIndexArr.push(j);
            }
        }

        for (let k = 0; k < this.volArr.length; k++) {
            var vol = this.volArr[k];
            if (vol.isDefault == 1) continue;
            if (!vol.isAdd) continue;
            if (vol.isSameAsBase) {
                vol.isSetValue = true;
                vol.diff = 0;
            }
        }

        for (let i = 0; i < this.cusIndexArr.length; i++) {
            let cusIndex = this.cusIndexArr[i];
            let cusTitle = cusIndex instanceof Array ? this.getTitle(this.cusArr, cusIndex) : this.cusArr[cusIndex].title
            for (let j = 0; j < this.packageIndexArr.length; j++) {
                let pIndex = this.packageIndexArr[j];
                let pTitle = pIndex instanceof Array ? this.getTitle(this.packageTypeArr, pIndex) : this.packageTypeArr[pIndex].title
                var matchObj = this.cusPackageIndexArr.find(f => { return (f.cusTitle == cusTitle) && (f.pTitle == pTitle) });
                let cDiff = this.getDiff(this.cusArr, cusIndex);
                let pDiff = this.getDiff(this.packageTypeArr, pIndex);
                var obj = {
                    cusIndex: cusIndex,
                    pIndex: pIndex,
                    cusTitle: cusTitle,
                    pTitle: pTitle,
                    cDiff: cDiff, //记录对应勾稽参数差值
                    pDiff: pDiff,
                    fixedMap: {},//记录一口价 此一口价key无需加上cus package
                    isRemain: true
                } // 组合tab对象
                if (!!!matchObj) {
                    this.cusPackageIndexArr.push(obj);
                }
                else {
                    matchObj.cusIndex = cusIndex;
                    matchObj.pIndex = pIndex;
                    matchObj.cusTitle = cusTitle;
                    matchObj.pTitle = pTitle;
                    matchObj.cDiff = cDiff;
                    matchObj.pDiff = pDiff;
                    matchObj.isRemain = true;
                }
            }
        }
        this.cusPackageIndexArr = this.cusPackageIndexArr.filter(f => { return f.isRemain });
        this.cusPackageIndexArr.forEach((item) => {
            item.isRemain = false;
        })
        this.vueInstance.$forceUpdate();
    }

    getDiff(arr, indexOrArr) {
        if (indexOrArr instanceof Array) {
            return arr[indexOrArr[0]].diff;
        }
        else return arr[indexOrArr].diff;
    }

    getTitle(arr, indexArr) {
        return indexArr.reduce((pre, cur, index) => {
            return pre + (index > 0 ? "," : "") + arr[cur].title;
        }, '')
    }




    // 第一页能否跳转第二页
    canPageOneTopageAdd() {
        if (!!!(this.sfg)) {
            throw new Error("始发港未填");
        }

        if (!!!this.mdg) {
            throw new Error("目的港未填");
        }
        if (!!!this.twoCode) {
            throw new Error("未选择航司二字码");
        }

        if (this.vueInstance.wecanStandard == this.vueInstance.wecanStandardOpts[1].value && this.gid <= 0) {
            throw new Error("请选择客户");
        }


    }



    checkNum(val) {

        if (isNaN(val * 1)) {
            throw new Error("请输入数字");
        }
    }


    formatStandardPrice() {
        var num = this.standardPrice * 1;
        if (isNaN(num)) {
            this.standardPrice = 0;
        }
        else {
            this.standardPrice = num.toFixed(2);
        }
    }

    formatMinPrice() {
        var num = this.minPrice * 1;
        if (isNaN(num)) {
            this.minPrice = 0;
        }
        else {
            this.minPrice = num.toFixed(2);
        }
    }

    //匹配卡车路线 从而进行提示中转港到目的港有卡车路线 可以不必维护这条线路 从而省钱

    //匹配的卡车路线
    truckAlertArr = [];
    queryMatchTruck() {
        this.truckAlertArr = [];
        let twocodeArr = this.twoCode.split(',');
        if (twocodeArr.length == 0) return;
        let task=[];
        twocodeArr.forEach((item) => {
           task.push (this.getMatchTruck(this.zzg, this.mdg, item));
        });
        let twocodeStr = "";

        Promise.all(task).then(()=>{
            if (this.truckAlertArr.length > 0) {
                //提示
                twocodeStr = this.truckAlertArr.reduce((pre, cur) => {
                    return pre.twocode + "," + cur.twocode;
                })
                let txt = `${this.zzg}至${this.mdg}的航司二字码${twocodeStr}已维护卡车转运费，具体可至"目的港卡车转运费"页面中查看`;
                this.vueInstance.$alert(txt, '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
    
                    }
                });
            }
        });
      
    }

 async   getMatchTruck(zzg, mdg, twocode) {
        if (!!!twocode) return;
        var jsonArr = {
            where: {
                mdg: zzg, ddg: mdg, twocodeStr: { like: twocode }, wageinout: 2
            },
        };
        let url = this.vueInstance.$store.state.feeWebApi + "TruckFee/getList";

    return    this.request("get", url, { json: JSON.stringify(jsonArr) })
            .then(({ data }) => {
                var d = data.resultdata;
                if (d.length > 0) {
                    //将数据加到提示框中
                    var obj = {
                        twocode: twocode,
                        zzg: zzg,
                        mdg: mdg
                    };
                    this.truckAlertArr.push(obj);
                }
            });
    }




}

export { priceFreightView, pageMode, editMode, priceMode, pageType, coverType, specifiedFlight, allFlight, zzgTitle, relationEditTitle, diffCode }

