import { diffCodeKey } from "../../api/getBasicStorageData";
import { priceFreightView, pageMode, priceMode, pageType, specifiedFlight, allFlight, relationEditTitle, clearDataType, diffCode, zzgTitle } from "./priceFreight";








class priceFreightEditView extends priceFreightView {
  constructor(v) {
    super(v);
    this.currentPageType = v.pageType
    this.loadBasicData();
  }

  // 表格行传进来的数据
  props = null;


  /**现在选中的费用id*/
  currentFeeid = "";

  // 取出关联费用的所有费用object key为 feeid
  feeMap = {};

  airInfoArr = JSON.parse(localStorage.getItem("airinfo"));


  _currentFeeMap = null;

  /**航线分区id 从目的港得出 */



  async getWffid() {
    var arr = JSON.parse(localStorage.getItem("hbinfo"));
    var self = this;
    var matchArr = arr.filter((p) => { return p.ThreeCode == self.mdg });
    var obj = matchArr[0];
    return obj.Wffid;
  }



  get currentFeeMap() {
    return this._currentFeeMap;
  }

  get startdate() {
    if (typeof (this._timeSpan[0]) == "string") return this._timeSpan[0];
    else return this._timeSpan[0].Format("yyyy-MM-dd");
  }

  get enddate() {
    if (typeof (this._timeSpan[1]) == "string") return this._timeSpan[1];
    else return this._timeSpan[1].Format("yyyy-MM-dd");
  }

  twocodeFeeMap = {};// {"MU,CA":{feemap}}





  //当前航司对应的时间分组
  get currentAirComTimeObj() {
    return this.twocodeFeeMap[this.twoCodeArr[this._twoCodeIndexSelected]]
  }
  /**当前航司对应时间分组对时间进行排序 */
  get currentAirComTimeArr() {
    if (Object.values(this.twocodeFeeMap).length == 0) return [];
    if (!!!this.twocodeFeeMap[this.twoCodeArr[this._twoCodeIndexSelected]]) return [];
    return Object.values(this.twocodeFeeMap[this.twoCodeArr[this._twoCodeIndexSelected]])
      .sort((a, b) => {
        return Date.parse(b.basicInfo.startdate) - Date.parse(a.basicInfo.startdate)
      })

  }
  /**选中的模板 */
  selectedTemplate = ""

  /** 模板数组过滤掉本身*/
  get twocodeTemplateArr() {
    return this.twoCodeArr.filter((item, index) => {
      return index != this._twoCodeIndexSelected;
    });
  }

  /**当前选中二字码排序后保存到数据库 保证排序一致 用户添加航司先后顺序存在随意性 */
  get selectedTwocodeStr() {
    return this.sortJoinTwocodeArr(this.twoCodeArr[this._twoCodeIndexSelected].split(',').map(p => { return p }));
  }


  sortJoinTwocodeArr(arr) {
    return arr.sort().join(',');
  }

  openEditDialog(p) {
    this.props = p;
    this._currentPageMode = pageMode.pageOne;
    this.isEditMode = true;
    this.loadData(p);



  }
  // p :{sfg:"",mdg:"",zzg:""}
  async loadData(p) {

    var json = {
      where: {
        sfg: p.sfg,
        mdg: p.mdg,
        zzg: p.zzg,
        twocode: p.twocode,//字符串拼接 
      }
    };

    if (this.currentPageType == pageType.customer) {
      json.where["gid"] = p.gid;
    }
    let url = this.feeUrl + "airFreightFee/getFeeGroup";

    await this.request("get", url, { json: JSON.stringify(json) }).then(d => {
      if (Object.values(d.data.resultdata).length == 0) return;
      this.feeMap = d.data.resultdata;
      let self = this;
      for (let key in this.feeMap) {
        let twoCodeStr = this.sortJoinTwocodeArr(self.feeMap[key].twocodeArr.map(p => { return p.twocode }));
        if (!(twoCodeStr in self.twocodeFeeMap)) {
          self.twocodeFeeMap[twoCodeStr] = {};
        }
        self.twocodeFeeMap[twoCodeStr][key] = self.feeMap[key];

      }

      this.loadTwoCodeArr();
      this.currentFeeid = p.feeid;

      this.changeCurrentFeeMap();
    })

  }


  getFeeidByLastEndDate(obj) {
    let feeid = '';
    let d = null;
    for (var key in obj) {

      let enddate = new Date(obj[key].basicInfo.enddate);
      if (d == null) {
        d = enddate;
        feeid = key;
      }
      else if (d < enddate) {
        d = enddate;
        feeid = key
      }

    } return feeid;
  }

  getFirstKey(obj) {
    for (var key in obj) {
      return key;
    }
  }

  loadTwoCodeArr() {
    var self = this;
    for (var key in this.twocodeFeeMap) {

      self.twoCodeArr = key;

    }
    this.setFeeidAfterChangeTwocode();
  }
  setFeeidAfterChangeTwocode() {
    this.currentFeeid = this.getFirstKey(this.currentAirComTimeObj);
  }

  changeCurrentFeeMap() {
    this._currentFeeMap = this.twocodeFeeMap[this.twoCodeArr[this._twoCodeIndexSelected]][this.currentFeeid]
    this.updateView(this._currentFeeMap);
  }
  delCurrentFeeid() {
    this.vueInstance.$confirm("确认删除该组数据", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      let url = this.feeUrl + "airFreightFee/delete";
      this.request("post", url, { feeid: this.currentFeeid }).then(({ data }) => {
        this.vueInstance.$message.success("删除成功");
        delete this.twocodeFeeMap[this.twoCodeArr[this._twoCodeIndexSelected]][this.currentFeeid];
        this.currentFeeid = this.getFeeidByLastEndDate(this.currentAirComTimeObj)
        if (!!this.currentFeeid) {
          this.changeCurrentFeeMap();
        }
        else {

          this.vueInstance.search();
          this._currentPageMode = pageMode.search;

        }
      });
    });

  }

  /**刷新视图  
   * map:匹配的currentFeeMap */
  updateView(map) {
    var basicInfo = map.basicInfo;
    this.currentArea = !!!basicInfo.area ? null : basicInfo.area;
    this.sfg = basicInfo.sfg;
    this.mdg = basicInfo.mdg;
    this.zzg = basicInfo.zzg;
    this.vueInstance.$set(this, "zzgTitle", basicInfo.zzg == zzgTitle.direct ? zzgTitle.direct : zzgTitle.trans);
    this.jfType = basicInfo.jfType;
    this.twoCode = basicInfo.twocode
    this.tactPriceDiff = basicInfo.tactPriceDiff;
    this.minPriceMode = basicInfo.minPriceMode;
    this.vueInstance.$set(this._timeSpan, 0, new Date(basicInfo.startdate))
    this.vueInstance.$set(this._timeSpan, 1, new Date(basicInfo.enddate))
    this.hbhArr = map.hbhArr ?
      map.hbhArr.map(m => {
        return {
          hbh: m.hbh,
          schedule: m.schedule,
          remark: m.remark,
          isSelfInput: m.isSelfInput
        }
      }) : [];
    this.approvalArr = map.approvalArr ? map.approvalArr : [];
    this.vueInstance.hbhTabVal = this.hbhArr.length > 0 ? this.hbhArr[0].hbh : ""
    this.remark = basicInfo.remark;
    this.limitDay = basicInfo.limitDay;
    this.gid = basicInfo.gid;
    this.isContainGas = basicInfo.isContainGas;
    this.isContainStation = basicInfo.isContainStation;
    this.isContainWar = basicInfo.isContainWar;
    this.flightType = basicInfo.isSpecifiedFlight ? specifiedFlight : allFlight;
    this.vueInstance.wecanStandard = basicInfo.gid > 0 ? this.vueInstance.wecanStandardOpts[1].value : this.vueInstance.wecanStandardOpts[0].value;
    this.loadDiffCode(map);
    this.loadFixedPrice(map);
  }

  loadDiffCode(map) {
    var packageArr = JSON.parse(localStorage.getItem(diffCodeKey.package));
    var cusArr = JSON.parse(localStorage.getItem(diffCodeKey.cus));
    var volArr = JSON.parse(localStorage.getItem(diffCodeKey.vol));
    var weightArr = JSON.parse(localStorage.getItem(diffCodeKey.weight));
    var isSetPIndex = false;
    var isSetCIndex = false;
    if (!!map.packageTypeArr) {
      this.convertMapToCodeDiff(map.packageTypeArr, packageArr, diffCode.package)
    }
    if (!!map.cusArr) {
      this.convertMapToCodeDiff(map.cusArr, cusArr, diffCode.cus)
    }

    if (!!map.volArr) {
      this.convertMapToCodeDiff(map.volArr, volArr, diffCode.vol)
    }
    !!map.weightArr && weightArr.forEach((item, index) => {
      let code = item.code;
      let p = map.weightArr.find(f => { return f.code == code });
      if (!!p) {
        item.isDefault = p.isDefault;
        item.standardPrice = p.standardPrice.toFixed(2);
        item.diff = p.diff;
        item.isSetValue = true;
      }
      else {
        this.clearDiffRelation(item);
      }
    });
    this.packageTypeArr = packageArr;
    this.cusArr = cusArr;
    this.weightArr = weightArr;
    this.volArr = volArr;
    this.confirmPriceTabArr();

  }
  //编辑页载入详情 将数据库数据转换成基础参数
  convertMapToCodeDiff(mapArr, cacheArr, type) {
    var isSetIndex
    !!mapArr && cacheArr.forEach((item, index) => {
      let code = item.code;
      let p = mapArr.find(f => { return f.code == code });
      if (!!p) {
        item.isDefault = p.isDefault;
        item.diff = p.diff;
        item.isAdd = true;
        item.isSetValue = p.isSetValue == 1;//将数据库值初始化成Boolean
        item.isSameAsBase = p.isSameAsBase;
        if (p.isDefault == 1) {
          item.diff = "基点"
          if (type == diffCode.cus) {
            this.relationMap.cus.hasRelation = true;
            this.relationMap.cus.baseIndex = index;
          }
          else if (type == diffCode.package) {
            this.relationMap.packageType.hasRelation = true;
            this.relationMap.packageType.baseIndex = index;
          }
          else if (type == diffCode.vol) {
            this.relationMap.vol.hasRelation = true;
            this.relationMap.vol.baseIndex = index;
          }
        }
        if (!isSetIndex) {
          if (type == diffCode.cus) this.cusDisplayIndex = index;
          else if (type == diffCode.package) this.packageDisplayIndex = index;
          isSetIndex = true;
        }

      }
      else {
        item.isAdd = false;
        this.clearDiffRelation(item)
      }
    });
  }

  checkWeightStandardPrice() {
    this.weightArr.forEach(item => {
      let standardPrice = item.standardPrice;
      if (standardPrice !== null && standardPrice !== undefined && standardPrice !== "") {
        if (!Number.isFinite(standardPrice * 1)) {
          throw new Error("请输入正确的重量价格");
        }
      }
    })
  }


  loadFixedPrice(map) {
    this.priceDisplayMap = {};
    var arr = map.fixedPrice;
    !!arr && arr.forEach((item) => {
      var key = item.vol + "_" + item.weight;
      let matchTab = this.cusPackageIndexArr.find(f => {
        return f.cusTitle.indexOf(item.cus) > -1 &&
          f.pTitle.indexOf(item.packageType) > -1
      });

      matchTab.fixedMap[key] = {};
      this.fillFixedMap(item, matchTab.fixedMap[key]);
    });
  }
  fillFixedMap(item, obj) {

    obj.isActive = true;
    obj.isSetValue = true;
    obj.diff = item.diff.toFixed(2);
    obj.cus = item.cus;
    obj.vol = item.vol;
    obj.packageType = item.packageType;
    obj.weight = item.weight;
  }
  // 重写 父类方法
  changeSelectedTwoCodeIndex(index) {
    this._twoCodeIndexSelected = index;
    if (this._currentPageMode == pageMode.pageConfirm) {
      this.setFeeidAfterChangeTwocode();
      this.changeCurrentFeeMap();
    }

  }

  clickCancel() {
    if (this._currentPageMode == pageMode.pageOne) {
      this._currentPageMode = pageMode.search;
    }
    else if (this._currentPageMode == pageMode.pageConfirm) {
      this._currentPageMode = pageMode.pageOne;
    }

  }
  clickNext() {
    if (this._currentPageMode == pageMode.pageOne) {
      this.canPageOneTopageAdd();// 判断页面能否跳转 用异常中断操作 会被全局捕获
      this.checkWeightStandardPrice();
      this._currentPageMode = pageMode.pageConfirm;
      this.vueInstance.hbhTabVal = this.hbhArr.length > 0 ? this.hbhArr[0].hbh : ""
    }
  }



  async savePrice() {
    let url = this.feeUrl + "airFreightFee/save";
    let selectAirArr = this.twoCodeArr[this._twoCodeIndexSelected]
    let airComArr = this.getTwocodeArr();
    let wffid = await this.getWffid();
    let data = {
      area: this.area,
      sfg: this.sfg,
      mdg: this.mdg,
      zzg: this.zzg || "直达",
      startdate: this.startdate,
      enddate: this.enddate + " 23:59:59",
      wffAreaid: wffid,
      twocode: this.twoCode,
      threeCodeStr: this.getThreeCodeStr(this.twoCode),
      hbh: this.isSpecifiedFlight ? this.hbhStr : '',
      weightArr: this.convertDiffArr(this.weightArr.filter(f => { return (f.standardPrice * 1) > 0 })),
      volRatioArr: this.convertDiffArr(this.volArr).filter(f => { return f.isAdd==1 }),
      cusLevelArr: this.convertDiffArr(this.cusArr.filter(f => { return f.isAdd==1 })),
      packageTypeArr: this.convertDiffArr(this.packageTypeArr.filter(f => { return f.isAdd==1 })),
      aircomArr: airComArr,
      remark: this.remark,
      jfType: this.jfType,

      gid: !!this.gid ? this.gid : -1,
      fixedPriceArr: this.getFixedPriceFromMap(),
      flightArr: this.getHbh(),
      isContainGas: this.isContainGas,
      isContainStation: this.isContainStation,
      isContainWar: this.isContainWar,
      isSpecifiedFlight: this.isSpecifiedFlight,
      limitDay: this.limitDay

    }
    await this.request("post", url, data).then((d) => {
      this.ok("保存成功");
      this.currentPageMode = pageMode.search;
    });
  }

  async editPrice() {
    let url = this.feeUrl + "airFreightFee/edit";
    let selectAirArr = this.twoCodeArr[this._twoCodeIndexSelected]
    let airComArr = this.getTwocodeArr();
    let wffid = await this.getWffid();
    let data = {
      area: this.area,
      feeid: this.currentFeeid,
      sfg: this.sfg,
      mdg: this.mdg,
      zzg: this.zzg || "直达",
      startdate: this.startdate,
      enddate: this.enddate + " 23:59:59",
      wffAreaid: wffid,
      twocode: this.twoCode,
      threeCodeStr: this.getThreeCodeStr(this.twoCode),
      hbh: this.isSpecifiedFlight ? this.hbhStr : '',
      weightArr: this.convertDiffArr(this.weightArr.filter(f => { return (f.standardPrice * 1) > 0 })),
      volRatioArr: this.convertDiffArr(this.volArr).filter(f => { return f.isAdd==1 }),
      cusLevelArr: this.convertDiffArr(this.cusArr.filter(f => { return f.isAdd==1 })),
      packageTypeArr: this.convertDiffArr(this.packageTypeArr.filter(f => { return f.isAdd==1 })),
      aircomArr: airComArr,
      remark: this.remark,
      jfType: this.jfType,
      gid: !!this.gid ? this.gid : -1,
      fixedPriceArr: this.getFixedPriceFromMap(),
      flightArr: this.getHbh(),
      isContainGas: this.isContainGas,
      isContainStation: this.isContainStation,
      isContainWar: this.isContainWar,
      isSpecifiedFlight: this.isSpecifiedFlight,
      limitDay: this.limitDay
    }
    await this.request("post", url, data).then((d) => {
      this.ok("修改成功");
      this.currentPageMode = pageMode.search;
    });
  }
  convertDiffArr(arr) {
    return arr.map(m => {
      if (m.diff == "基点") {
        m.diff = 0;
      }
      if (m.diff == '--') {
        m.diff = 0;
      }
      m.isAdd = m.isAdd ? 1 : 2;
      m.isSetValue = m.isSetValue ? 1 : 2;//适应数据库
      return m;
    })
  }


  //能否新增保存
  canSave() {
    if (this.standardPrice < 0) {
      throw new Error("请输入标准价格");
    }
    if (this._timeSpan.length == 0) {
      throw new Error("请选择时间期限");
    }

  }

  clickSave() {
    this.canSave();
    if (this._currentPageMode == pageMode.pageConfirm && !this.isEditMode) {
      //新增
      this.savePrice()
    }
    else if (this._currentPageMode == pageMode.pageConfirm && this.isEditMode) {
      this.editPrice();
    }
  }

  changeTemplate() {
    if (!!!this.selectedTemplate) return;
    //此时没有选中的 currentFeeid 但是渲染视图得指定一组数据 取该航司组合第一条匹配数据
    let map = this.twocodeFeeMap[this.selectedTemplate]
    let firstKey = this.getFirstKey(map);
    this.updateView(map[firstKey]);
  }



  /**设置直达价格 */
  setDirectFeeMode() {
    if (this.priceMode != priceMode.equalDirect) return;
    var json = {
      where: {
        sfg: this.sfg,
        mdg: this.mdg,
        zzg: "直达"
      }
    };



    let url = this.feeUrl + "airFreightFee/getDirectFee"
    this.request("get", url, { json: JSON.stringify(json) }).then(d => {
      var data = d.data.resultdata;
      this.standardPrice = data.standardPrice
    }).catch(e => {

      this.priceMode = priceMode.fixed;
    });
  }



  //设置一口价默认值 默认 未设置值 diff:0,isAvtive:false 是否激活状态 激活开启编辑模式
  createDefaultDisplayPriceObj(p, c, v, w) {
    return {
      isSetValue: false,
      diff: '',
      isActive: false,
      cus: c ? c.code : "",
      packageType: p ? p.code : '',
      vol: v ? v.code : '',
      weight: w ? w.code : '',
    };
  }




  /**一口价是否激活 */
  isDisplayPriceActive(key) {
    var map = this.cusPackageIndexArr[this.tabDisplayIndex].fixedMap;
    var isExist = !!map[key];
    if (!isExist) return false;
    return map[key].isActive;
  }
  //激活一口价
  activeFixedPrice(v, w, cellValue) {
    var map = this.cusPackageIndexArr[this.tabDisplayIndex].fixedMap;
    var key = this.createFixedPriceKey(v, w);
    var isExist = !!map[key];
    if (!isExist) {
      var obj = this.createDefaultDisplayPriceObj(null, null, v, w);
      obj.isSetValue = true;
      map[key] = obj;
    }

    if (Number.isFinite(cellValue * 1)) {
      map[key].diff = cellValue;
    }
    this.vueInstance.$set(map[key], "isActive", true);

    this.vueInstance.$forceUpdate();
  }

  activeFixedPriceByImport(p, c, v, w) {
    var key = this.createFixedPriceKey(p, c, v, w);
    var isExist = !!this.priceDisplayMap[key];
    if (!isExist) {
      var obj = this.createDefaultDisplayPriceObj(p, c, v, w);
      obj.isSetValue = true;
      this.priceDisplayMap[key] = obj;
    }
    this.priceDisplayMap[key].isActive = true;
  }
  //一口价map key生成规则
  createFixedPriceKey(v, w) {
    return v.code + "_" + w.code;
  }

  // 导入数据时生成行头 或者 行列 的key 记录在 priceCopyMap中
  createHeadKey(p, c, v, w) {
    return "head" + (!!p ? p.code : "") + "_" + (!!c ? c.code : "") + "_" + (!!v ? v.code : "") + "_" + (!!w ? w.code : "");
  }


  //同步一口价
  syncFixedPrice(v, w, thisPrice) {
    this.packageTypeArr.forEach((p) => {
      this.cusArr.forEach((c) => {
        let key = this.createFixedPriceKey(p, c, v, w);
        this.priceDisplayMap[key].diff = thisPrice;
        this.priceDisplayMap[key].isActive = true;
        this.priceDisplayMap[key].isSetValue = true;
      });
    });
  }

  //将一口价取出用于保存 未选择的package cus需要整合过滤 数据库存入太多重复diff 不同key的数据 可以优化
  getFixedPriceFromMap() {
    let arr = [];//结果数组
    for (let i = 0; i < this.cusPackageIndexArr.length; i++) {
      let item = this.cusPackageIndexArr[i];
      let cArr = item.cusIndex instanceof Array ? item.cusIndex : [item.cusIndex];
      let pArr = item.pIndex instanceof Array ? item.pIndex : [item.pIndex];
      cArr.forEach((cus) => {

        pArr.forEach((p) => {
          for (let key in item.fixedMap) {
            let obj = item.fixedMap[key];
            let map = { ...obj };
            map.cus = this.cusArr[cus].title;
            map.packageType = this.packageTypeArr[p].title;
            if ((map.diff != '--')) {
              arr.push(map);
            }
          }

        })
      })
    }



    return arr;
  }

  getHbh() {
    let arr = [];
    if (!this.isSpecifiedFlight) return arr;
    return this.hbhArr;
  }

  // 航司改成了多选
  getTwocodeArr() {
    let arr = [];
    this.twoCode.split(',').reduce((innerArr, next) => {
      innerArr.push({ twocode: next, diff: 0 });
      return innerArr;
    }, arr)
    return arr;
  }


  /**重置一口价 */
  resetFixedPrice() {
    this.priceDisplayMap = {};
    this.vueInstance.$forceUpdate();
  }
  move(i, j, event) {
    var e = event;
    var refs = this.vueInstance.$refs;
    if (e.keyCode == 37) {
      j--;
      // 左箭头
    } else if (e.keyCode == 38) {
      // 上箭头
      i--;
    }
    else if (e.keyCode == 39) {
      // 右箭头
      j++;
    }
    else if (e.keyCode == 40) {
      // 下箭头
      i++;
    }
    if (i < 0 || j < 0 || i >= this.volArr.length || j >= this.weightArr.length) return;
    var dom = refs[i.toString() + j.toString()];
    var vol = this.volArr[i];
    var weight = this.weightArr[j];
    if (!!!dom || dom.length == 0) {

      this.activeFixedPrice(vol, weight);
    }
    this.vueInstance.$nextTick(() => {
      dom = refs["fixed" + i.toString() + j.toString()][0];

      dom.focus();
      this.priceDisplayMap[
        this.vueInstance.createFixedPriceKey(vol, weight)
      ].diff = e.currentTarget.value;
      this.vueInstance.$forceUpdate()
    });
  }

  getThreeCodeStr(twocodeStr) {
    if (!this.isSpecifiedFlight) return "";
    var _this = this;
    function findThreeCode(t) {
      return _this.airInfoArr.find((item) => {
        return item.TwoCode == t;
      }).ThreeCode
    }
    var arr = twocodeStr.split(',');
    return arr.reduce((acc, item, index, arr) => acc + findThreeCode(item) + (arr.length - 1 > index ? "," : ""), "");

  }

  get threeCodeArr() {
    return this.getThreeCodeStr(this.twoCode).split(",");
  }

  /**激活列 */
  activeWeightColumn(j, forceTrue) {

    var headKey = this.createHeadKey(this.currentImportPackageType, this.currentImportCus, null, this.weightArr[j]);
    this.priceCopyMap[headKey] || (this.priceCopyMap[headKey] = this.createCopyTdObj(false, 0, 0));
    this.setPriceCopyActive(headKey, forceTrue);
    for (var i = 0; i < this.volArr.length; i++) {
      var key = this.createFixedPriceKey(this.currentImportPackageType, this.currentImportCus, this.volArr[i], this.weightArr[j]);
      // 判断交点处的列头或者表头是否状态不一致 不一样的td不要改变状态
      var rowHeadKey = this.createHeadKey(this.currentImportPackageType, this.currentImportCus, this.volArr[i], null);
      if (this.priceCopyMap[rowHeadKey] && !(forceTrue instanceof Boolean)) {
        var t1 = this.priceCopyMap[rowHeadKey].isActive;
        var t2 = this.priceCopyMap[headKey].isActive;
        if (t1 && t2) {
          this.setPriceCopyActive(key, true);
        }
        else if (t1 || t2) {
          this.setPriceCopyActive(key, true);
        }
        else if (t1 == false && t2 == false) {
          this.setPriceCopyActive(key, false);
        }

      }
      else {

        this.setPriceCopyActive(key, forceTrue);
      }
    }

    this.vueInstance.$forceUpdate();
  }

  createAllKey() {
    return (this.currentImportPackageType ? this.currentImportPackageType.code : "") + "_" + (this.currentImportCus ? this.currentImportCus.code : "") + "_all";
  }

  activeAll() {
    var key = this.createAllKey();
    (this.priceCopyMap[key]) || (this.priceCopyMap[key] = this.createCopyTdObj(false, 0, 0));
    this.priceCopyMap[key].isActive = !this.priceCopyMap[key].isActive;
    this.volArr.forEach((item, i) => {
      this.activeVolRow(i, this.priceCopyMap[key].isActive);
    });

    this.weightArr.forEach((item, j) => {
      this.activeWeightColumn(j, this.priceCopyMap[key].isActive);
    })
  }

  activeTd(i, j) {
    var key = this.createFixedPriceKey(this.currentImportPackageType, this.currentImportCus, this.volArr[i], this.weightArr[j]);
    this.setPriceCopyActive(key);
    this.vueInstance.$forceUpdate();
  }
  /**激活行 */
  activeVolRow(i, forceTrue) {
    var headKey = this.createHeadKey(this.currentImportPackageType, this.currentImportCus, this.volArr[i], null);
    this.priceCopyMap[headKey] || (this.priceCopyMap[headKey] = this.createCopyTdObj(false, 0, 0));


    this.setPriceCopyActive(headKey, forceTrue);
    for (var j = 0; j < this.weightArr.length; j++) {
      var key = this.createFixedPriceKey(this.currentImportPackageType, this.currentImportCus, this.volArr[i], this.weightArr[j]);
      var columnHeadKey = this.createHeadKey(this.currentImportPackageType, this.currentImportCus, null, this.weightArr[j]);
      if (this.priceCopyMap[columnHeadKey] && !(forceTrue instanceof Boolean)) {
        var t1 = this.priceCopyMap[columnHeadKey].isActive;
        var t2 = this.priceCopyMap[headKey].isActive;
        if (t1 && t2) {
          this.setPriceCopyActive(key, true);
        }
        else if (t1 || t2) {
          this.setPriceCopyActive(key, true);
        }
        else if (t1 == false && t2 == false) {
          this.setPriceCopyActive(key, false);
        }

      }
      else {

        this.setPriceCopyActive(key, forceTrue);
      }
    }

    this.vueInstance.$forceUpdate();
  }

  setPriceCopyActive(key, foceTrue) {
    this.priceCopyMap[key].isActive = foceTrue != undefined ? foceTrue : !this.priceCopyMap[key].isActive;
  }

  cancelImport() {
    this.priceCopyMap = {};
    this.isShowImportData = false;
    this.copySeed = 0;
  }
  confirmImport() {
    var isSelectData = false//是否选择数据
    for (var key in this.priceCopyMap) {
      //行头表头全部剔除
      if (key.indexOf("head") > -1 || key.indexOf("all") > -1) continue;
      var o = this.priceCopyMap[key];
      if (!!!o.isActive) continue;
      if (!Number.isFinite(o.diff * 1)) continue;
      if (o.diff * 1 <= 0) continue;
      //不是当前页的数据剔除
      var ocCode = o.c ? o.c.code : null;
      var importCusCode = this.currentImportCus ? this.currentImportCus.code : null;
      var opCpde = o.p ? o.p.code : null;
      var importPackageCode = this.currentImportPackageType ? this.currentImportPackageType.code : null;

      if (ocCode != importCusCode || opCpde != importPackageCode) continue;
      isSelectData = true
      //目标key值
      var destObjKey = this.createFixedPriceKey(this.currentPackageType, this.currentCus, o.v, o.w);
      if (!!!this.priceDisplayMap[destObjKey]) {
        this.activeFixedPriceByImport(this.currentPackageType, this.currentCus, o.v, o.w);
      }

      var seed = this.copySeed * 1;
      if (!Number.isFinite(seed)) throw new Error("请填写正确的增减参数");
      if (!this.isCopySeedPlus) {
        seed = seed * -1;
      }
      this.priceDisplayMap[destObjKey].diff = o.diff * 1 + seed;

    }
    if (!isSelectData) throw new Error("未选择数据");
    this.isShowImportData = false;
    this.vueInstance.$forceUpdate();

  }



  initPriceCopyMap(i, j, isShowFixed, cellValue) {
    var p = this.currentImportPackageType;
    var c = this.currentImportCus;
    var v = this.volArr[i];
    var w = this.weightArr[j];
    var key = this.createFixedPriceKey(p, c, v, w);
    var fixedDiff = this.priceDisplayMap[key] ? this.priceDisplayMap[key].diff : null;

    this.priceCopyMap[key] || (this.priceCopyMap[key] = this.createCopyTdObj(isShowFixed, cellValue, fixedDiff, p, c, v, w));
  }

  createCopyTdObj(isShowFixed, cellValue, fixedDiff, p, c, v, w) {
    return {
      diff: isShowFixed ? fixedDiff : cellValue,
      isActive: false,
      p: p,
      c: c,
      v: v,
      w: w
    }
  }

  loadIataPrice() {
    for (var i = 0; i < this.threeCodeArr.length; i++) {
      ((index) => {
        var threeCode = this.threeCodeArr[index];
        var t = this.singleTwoCodeArr[index];
        var url = this.pubUrl + `api/PubIataPrice?area=${this.area}&threeCode=${threeCode}&sfg=${this.sfg}&mdg=${this.mdg}`;
        this.request("get", url, {}).then((data) => {
          var d = data.data;
          this.iataMap[t] || (this.iataMap[t] = {});
          var obj = this.iataMap[t];
          obj["M"] = d.p_a_M;
          obj["N"] = d.p_a_N;
          obj["45"] = d.p_u_45;
          obj["100"] = d.p_u_100;
          obj["300"] = d.p_u_300;
          obj["500"] = d.p_u_500;
          obj["1000"] = d.p_u_1000;
        });
      })(i)
    }
    this.isShowIataDialog = true;
    setTimeout(() => {
      this.tactTwocode = this.singleTwoCodeArr[0];
      this.vueInstance.$forceUpdate();
    }, 1000)

  }

  openRelationDialog(title) {
    if (title == this.relationMap.cus.title) {
      this.vueInstance.relationEditTitle = relationEditTitle.cus;
      this.currentRelationEditArr = this.cusArr;
      this.currentRelationMap = this.relationMap.cus;
    }

    else if (title == this.relationMap.packageType.title) {
      this.vueInstance.relationEditTitle = relationEditTitle.packageType;
      this.currentRelationEditArr = this.packageTypeArr;
      this.currentRelationMap = this.relationMap.packageType;
    }

    else if (title == this.relationMap.vol.title) {
      this.vueInstance.relationEditTitle = relationEditTitle.vol;
      this.currentRelationEditArr = this.volArr;
      this.currentRelationMap = this.relationMap.vol;
    }

    this.isShowRelationEdit = true;
  }

  /**删除基础参数
   * 当删除的基础参数为当前选中参数时 需要切换当前选中基础参数
   */
  delRelationTag(index, e) {
    this.currentRelationEditArr[index].isAdd = false;
    this.currentRelationEditArr[index].isSameAsBase = null;//切换到未选是 否状态
    this.currentRelationEditArr[index].isSetValue = false;

    e.stopPropagation();
  }




  /**编辑页选中需要加入的基础参数
   * 选中状态再次点击视为取消
   */
  selectRelationTitle(index) {
    let item = this.currentRelationEditArr[index];
    item.isAdd = !item.isAdd;

  }



  /**确认添加完毕 和 钩稽关系的相关数据 */
  confirmRelation() {
    if (!this.canConfirmRelation) return;
    // 如果取消价格间联动 则需要清空基础参数数组中 isDefault 和 diff上面的值
    if (!this.currentRelationMap.hasRelation) {
      this.currentRelationEditArr.forEach((item) => {
        this.clearDiffRelation(item);
      });
    }
    this.confirmPriceTabArr();

  }

  clearDiffRelation(item) {
    if (item.isDefault == 1) return;
    if (item.isSameAsBase) return;
    item.diff = "";
    item.isSetValue = false;
  }


  cancelRelation() {
    this.cancelSelectRelation();
    this.isShowRelationEdit = false;
  }


  // 选中参数从无到有时 一口价需要全部清空
  isNeedClearFixedMap() {

    if (this.cusDisplayIndex == -1) return true;

    if (this.packageDisplayIndex == -1) return true;
    return false;
  }

  // 删除某一个钩稽关系时 需要清空 包含该关系的key值
  delMatchFixedMap(p) {
    debugger
    for (var key in this.priceDisplayMap) {
      if (key.indexOf(p) >= 0) {
        delete this.priceDisplayMap[key];
      }
    }

    this.vueInstance.$forceUpdate();
    this.isNeedClearFixedMap() && this.clearFixedMap();
    console.log(this.priceDisplayMap)
  }

  delTitle(weightIndex, volIndex) {
    var title = "";
    if (weightIndex !== null) {
      title = this.weightArr[weightIndex].title;
      this.clearDataType = diffCode.weight;
      this.clearDataIndex = weightIndex;
    }
    if (volIndex !== null) {
      title = this.volArr[volIndex].title;
      this.clearDataType = diffCode.vol;
      this.clearDataIndex = volIndex;
    }
    this.clearDataTitle = `是否删除${title}以下全部数据`;
    this.isShowClearDialog = true;
  }
  clearData() {
    var currentP = this.packageTypeArr[this.packageDisplayIndex];
    var currentC = this.cusArr[this.cusDisplayIndex];
    this.delDataByPackageCus(currentP, currentC);//删除当前选中的
    this.isShowClearDialog = false;
    if (!this.isDelRelationSync) return;//是否同步删除其他的同位置 不同 客户 包装类型的td数据

    var otherPackageArr = this.packageTypeArr.filter((item, index) => { return item.isAdd && index != this.packageDisplayIndex });
    var otherCusArr = this.cusArr.filter((item, index) => { return item.isAdd && index != this.cusDisplayIndex });

    if (otherPackageArr.length > 0 && otherCusArr.length > 0) {
      this.packageTypeArr.forEach((p) => {
        this.cusArr.forEach(c => {
          this.delDataByPackageCus(p, c);
        })
      })
    }
    else if (otherPackageArr.length > 0 && otherCusArr.length == 0) {
      otherPackageArr.forEach((p) => {
        this.delDataByPackageCus(p, null);
      });
    }
    else if (otherCusArr.length > 0 && otherPackageArr.length == 0) {
      otherCusArr.forEach((c) => {
        this.delDataByPackageCus(null, c);
      });
    }
    this.vueInstance.$forceUpdate();
  }

  delDataByPackageCus(p, c) {
    if (this.clearDataType == diffCode.weight) {
      var w = this.weightArr[this.clearDataIndex];

      this.volArr.forEach((item, index) => {
        var v = item;
        this.clearTdData(p, c, v, w);
      });
    }
    else if (this.clearDataType == diffCode.vol) {
      var v = this.volArr[this.clearDataIndex];

      this.weightArr.forEach((item, index) => {
        var w = item;
        this.clearTdData(p, c, v, w);
      });
    }
  }
  clearTdData(p, c, v, w) {
    var key = this.createFixedPriceKey(p, c, v, w);
    var isExist = !!this.priceDisplayMap[key];
    if (!isExist) {
      var obj = this.createDefaultDisplayPriceObj(null, null, v, w);
      obj.isSetValue = true;
      this.priceDisplayMap[key] = obj;
    }
    this.priceDisplayMap[key].diff = '';
    this.vueInstance.$set(this.priceDisplayMap[key], "isActive", true);
    this.vueInstance.$set(this.priceDisplayMap[key], "isSetValue", true);
  }

  //自动填补大重量运价 后面运价追溯前面得运价 如果中间跳开 则 跳开部分追溯前面得运价
  autoFillWeightPrice(index) {

    for (let i = 0; i < this.weightArr.length; i++) {
      let cur = this.weightArr[i];
      let next = this.weightArr[i + 1];
      if (cur.code == "+0kg") {
        continue;
      }

      if (Number.isFinite(cur.standardPrice * 1) && (cur.standardPrice * 1 > 0)) {
        cur.standardPrice = (cur.standardPrice * 1).toFixed(2);
        if (!!!next) break;
        if (next.standardPrice == '' || ((next.standardPrice * 1) >= (cur.standardPrice * 1))) {
          next.standardPrice = (cur.standardPrice * 1).toFixed(2);
        }
      }
    }
  }

  //自动填补一口价
  /**
   * 
   * @param {weight对应的index} wIndex 
   * @param {当前td对应得vol 得index} vIndex
   */
  autoFillFixedPrice(wIndex, vIndex) {

    var curtable = this.cusPackageIndexArr[this.tabDisplayIndex];
    var fixedMap = curtable.fixedMap;
    for (let i = wIndex; i < this.weightArr.length; i++) {
      let curWeight = this.weightArr[i];
      if (curWeight.code == "+0kg") break;
      let curVolCode = this.tableVolArr[vIndex].code;
      let curVol = this.volArr.find(f => { return f.code == curVolCode });
      let curKey = this.createFixedPriceKey(curVol, curWeight);
      let obj = fixedMap[curKey];
      if (!!!obj) break;
      let price = obj.diff * 1;
      if (!Number.isFinite(price) || price <= 0) break;
      //可以进行往后匹配赋值 赋值逻辑是 判断有没有一口价 有没有 常规参数价 都没有则激活赋值
      let nextWeight = this.weightArr[i + 1];
      if (!!!nextWeight) break;
      let nextWeightDiff = nextWeight.standardPrice * 1;
      let isNextWeightSetValue = Number.isFinite(nextWeightDiff) && nextWeightDiff > 0;
      let isVolSetValue = curVol.isSetValue;
      // 先查找有没有激活价格
      let nextKey = this.createFixedPriceKey(curVol, nextWeight);
      let nextObj = fixedMap[nextKey];
      if (!!nextObj) {
        if ((nextObj.diff * 1) >= (obj.diff * 1)) {
          nextObj.diff = obj.diff;
        }
      }
      //有常规价格如果大于前面则替换
      if (isNextWeightSetValue && isVolSetValue) {
        var nextCellValue = this.getCellValue(curVol, nextWeight);
        if ((nextCellValue * 1) >= (obj.diff * 1)) {
          this.activeFixedPrice(curVol, nextWeight, obj.diff);
        }
        continue;
      }

      if (!!!nextObj) this.activeFixedPrice(curVol, nextWeight, obj.diff);//下一格没激活


    }
    this.vueInstance.$forceUpdate();
  }

  getCellValue(vol, weight) {
    vol = this.volArr.find((f) => {
      return f.code == vol.code;
    });
    let isVolSetValue = vol.isSetValue;
    let volDiff = vol.diff * 1;
    let weightPrice = weight.standardPrice * 1;
    let selectedIndex = this.tabDisplayIndex;
    let selectedTab = this.cusPackageIndexArr[selectedIndex];
    let cusDiff = selectedTab.cDiff * 1;
    let pDiff = selectedTab.pDiff * 1;

    if (!Number.isFinite(weightPrice) || weightPrice == 0) return "--";
    if (!isVolSetValue) return "--";
    if (weight.title == "MIN") return weightPrice;
    let val =
      (Number.isFinite(volDiff) ? volDiff : 0) +
      (Number.isFinite(weightPrice) ? weightPrice : 0) +
      (Number.isFinite(pDiff) ? pDiff : 0) +
      (Number.isFinite(cusDiff) ? cusDiff : 0);
    return val.toFixed(2);
  }

 

}
export { priceFreightEditView }
