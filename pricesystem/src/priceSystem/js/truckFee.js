// 对于应付中转卡车费如何带到应收，具体体现如下： 1).新增/修改卡车费时,
//当保存完成后,询问"是否需要将此到达港的卡车费同步到应收",选择"是"/"否"，如果选择"是"，
//再显示卡车运价列表，默认值首次为+0，并可进行做加权填写，保存完毕后，则根据航空公司+到达港同步到应收
//，同步时判断如果数据库中没有，则新增，否则为更新。注意，数据库中是需要保留其加权关系的，也就是下次再次同步可以继承.

// 2).在应付中转卡车费列表中，在修改列右侧增加一个同步的图标
// ，用以执行第1点的逻辑。列名更改为“修改/同步到应收”，点击该图标，
// 显示此条的卡车费列表,默认值首次为+0，并可进行做加权填写，保存完毕后,则根据航空公司+到达港同步到应收，
// 同步时判断如果数据库中没有，则新增，否则为更新。

// 应收航线卡车中转费 1).新增/修改卡车费时,当选择完基港，
// 航空公司和到达港后，判断有无对应的应付条件为(基港+航空公司+到达港），如果有，
//   则询问"是否需要带入此到达港的应付卡车费"，选择"是",则显示应付的值，并可进行加权，并将加权关系记录到数据库。如果没有则直接过
// 注意：只要手动更改过应收的值，则视为加权无效。
import {
  Message,
  MessageBox
} from 'element-ui';

import { BaseService } from '../js/base';
import localStorageKey from "../js/cacheKey";

const pagemode = { add: "新增", edit: "编辑", search: "查询" };
class TruckFee extends BaseService {
  constructor(v) {
    super(v);
    this.init();
  }

  currentPageMode = pagemode.search;


  /**编辑页数据[{ddg:"卡车从基港运往的最终地",zzg:"到达港","twocodeStr":"航司逗号拼接",min:1,flat:2,codeArr:[{code:"+45kg",diff:0,guid:1231223}]}] */
  feeArr = [];

  currentFeeid = "";

  dialogTitle = "新增卡车中转费";

  seed = 0;

  isShowSyncDialog = false;

  isShowImportDialog = false;

  isShowDuplicate = false;

  fileList = [];
  //重复数据数组
  duplicateArr = [];

  //是否已载入编辑页
  isLoaded = false;


  get isShowDialog() {
    return (
      this.currentPageMode == pagemode.add ||
      this.currentPageMode == pagemode.edit
    );
  }

  get isSaveMode() {
    return this.currentPageMode == pagemode.add;
  }

  get isEditMode() {
    return this.currentPageMode == pagemode.edit;
  }

  /**是否显示行内新增小图标 只在最后一行显示 */
  isShowAddBtn(index) {
    return index + ((this.vueInstance.currentPage - 1) * 10) == this.feeArr.length - 1;
  }
  tableHeadArr = (() => {
    var arr = JSON.parse(localStorage.getItem(localStorageKey.weightDiff));
    return arr.filter((p) => { return p.code != "+0kg" }).map((item) => {
      return item.code;
    });
  })();

  init() {
    var obj = {
      mdg: "",
      twocodeStr: "", mdg: "", min: 0, minDiff: 0, fixedMin: 0, flat: 0, flatDiff: 0, fixedFlat: 0
    };

    var arr = new Array(this.tableHeadArr.length);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = {
        diff: 0,
        wageinDiff: 0,//应收的参数差,
        fixedDiff: 0//一口价
      };
    }
    obj.codeArr = arr;
    this.feeArr[0] = obj;
  }
  addRow(index) {
    var obj = { mdg: this.feeArr[index].mdg, ddg: this.feeArr[index].ddg, twocodeStr: this.feeArr[index].twocodeStr, flatDiff: 0, fixedFlat: 0, minDiff: 0, fixedMin: 0 };
    obj.min = this.feeArr[index].min;
    obj.flat = this.feeArr[index].flat;
    obj.codeArr = JSON.parse(JSON.stringify(this.feeArr[index].codeArr));
    this.feeArr.push(obj);
  }
  delRow(index) {
    this.feeArr.splice(index, 1);
  }
  getDuplicateData(data) {
    var map = {};
    var duplicateArr = [];
    data.forEach((item) => {
      var mdg = item.mdg;
      var ddg = item.ddg;
      var twocode = item.twocodeStr;
      var key = mdg + ddg + twocode;
      if (map[key]) {
        duplicateArr.push(item);
      }
      else map[key] = true;
    });
    return duplicateArr;
  }
  async save() {
    this.checkCanSave();
    let url = this.feeUrl + "TruckFee/save";
    let data = [];

    this.feeArr.forEach((fee) => {
      var obj = this.createPostData(fee, this.vueInstance.wageinout)
      data.push(obj);
    });
    this.duplicateArr = this.getDuplicateData(this.feeArr);
    if (this.duplicateArr.length > 0) {
      this.isShowDuplicate = true;
      return;
    }
    await super.request("post", url, data).then((d) => {
      if(!d.data.resultsuccess){
        this.duplicateArr=d.data.resultdata;
        this.isShowDuplicate = true;
        return;
      }
      this.ok("保存成功");
      // 应付需要弹框提示
      this.vueInstance.wageinout == 2 && this.vueInstance.$confirm("是否将应付费用同步到应收", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //同步过去

        this.isShowSyncDialog = true;
        this.feeArr.forEach((item, index) => {
          item.wageoutId = d.data.resultdata[index].guid;//应付的guid为应收的wageoutId
          item.guid = item.wageoutId;
        });
      })
      
      this.currentPageMode = pagemode.search;
      this.vueInstance.search();
    });
  }

  /**
   * 绑定应付的应收数据 载入 mindiff flatdiff wageinDiff 等数据
   * @param {Long} wid 
   */
  loadWageinFromWageout(wid) {
    var url = this.feeUrl + "TruckFee/getFeeDetail";
    var jsonData = {
      where: {
        wageoutId: wid, wageinout: 1
      },
    };
    super.request("get", url, { json: JSON.stringify(jsonData) })
      .then((d) => {
        if (!!!d.data.resultdata) return;
        var data = d.data.resultdata.fee;
        var codeArr = d.data.resultdata.codeArr;
        var d = this.feeArr[0];
        d.flatDiff = data.flatDiff;
        d.minDiff = data.minDiff;
        d.codeArr.forEach((item, index) => {
          item.wageinDiff = codeArr[index].wageinDiff//应收的参数差,
        });
      });

  }

  /**应收编辑时载入匹配的应付数据 */
  async loadWageout(mdg, ddg, twocodeStr, i) {
    //    if(!this.isLoaded)return;
    if (this.isShowDialog == false) return;
    var url = this.feeUrl + "TruckFee/getFeeDetail";
    var jsonData = {
      where: {
        mdg: mdg, ddg: ddg, twocodeStr: twocodeStr, wageinout: 2
      },
    };
    var matchData;
    await super.request("get", url, { json: JSON.stringify(jsonData) }).then((d) => {
      matchData = d;
      if (!!!d.data.resultdata) return;
      this.vueInstance.$confirm("检测到有匹配应付费用是否需要导入", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //导入应付费用
        var data = matchData.data.resultdata.fee;

        var codeArr = matchData.data.resultdata.codeArr;
        var dd = this.feeArr[i];
        dd.isNeedSync = true;
        dd.flat = data.flat;
        dd.min = data.min;
        dd.isLoadWageout = true;
        dd.codeArr.forEach((item, index) => {
          item.diff = codeArr[index].diff//应收的参数差,
        });
      }).catch(() => {

      });

    });
  }
  /**同步到应收 */
  async syncToWageIn() {
    let url = this.feeUrl + "TruckFee/syncToWagein";
    let data = [];
    debugger;
    this.feeArr.forEach((fee) => {
      var obj = this.createPostData(fee, this.vueInstance.wageinout);
      obj.wageinout = 1;
      data.push(obj);
    });
    await super.request("post", url, data).then((d) => {
      this.ok("保存成功");
      this.isShowSyncDialog = false;
      this.currentPageMode = pagemode.search;
      this.vueInstance.search();
    });
  }

  async loadEditInfo(data) {
    this.currentFeeid = data.feeid;
    this.currentArea = data.area;
    var result = false

    if (this.vueInstance.wageinout == 1) { result = await this.loadWageInEditInfo(); }
    /**编辑页数据[{mdg:"",ddg:"到达港","twocodeStr":"航司逗号拼接",min:1,flat:2,codeArr:[]}] */
    if (!result) {
      this.feeArr = [
        {
          guid: data.feeid,
          wageoutId: this.vueInstance.wageinout == 2 ? data.feeid : data.wageoutId,
          mdg: data.mdg,
          twocodeStr: data.twocodeStr,
          ddg: data.ddg,
          mdg: data.mdg,
          min: data.min,
          flat: data.flat,
          flatDiff: 0,
          minDiff: 0,
          fixedFlat: 0,
          fixedMin: 0,
          isNeedSync: false,
          codeArr: data.codeArr.map((item) => {
            return { guid: item.guid, diff: item.diff, wageinDiff: 0, fixedDiff: 0 };
          }),
        },
      ];
    }


  }
  /**载入应收的数据 需要从后台取出diff详细参数 */
  async loadWageInEditInfo() {
    let url = this.feeUrl + "TruckFee/getFeeDetail";
    var where = {
      where: {
        guid: this.currentFeeid,
        wageoutId: { not: this.currentFeeid }
      }
    }
    return await super.request("get", url, { json: JSON.stringify(where) }).then(d => {
      if (!!!d.data.resultdata) return false
      var data = d.data.resultdata.fee;
      var codeArr = d.data.resultdata.codeArr;
      var d = this.feeArr[0];
      d.mdg = data.mdg;
      d.twocodeStr = data.twocodeStr;
      d.flatDiff = data.flatDiff;
      d.ddg = data.ddg;
      d.flat = data.flat;
      d.fixedFlat = data.fixedFlat;
      d.min = data.min;
      d.fixedMin = data.fixedMin;
      d.minDiff = data.minDiff;
      d.wageoutId = data.wageoutId;
      d.isNeedSync = true;
      d.codeArr.forEach((item, index) => {
        item.wageinDiff = codeArr[index].wageinDiff//应收的参数差,
        item.diff = codeArr[index].diff;
        item.fixedDiff = codeArr[index].fixedDiff

      });
      return true
    }).catch((e) => {
      return false
    });
  }
  edit() {
    this.checkCanSave();
    let url = this.feeUrl + "TruckFee/edit";
    let data = [];
    this.feeArr.forEach((fee) => {
      var obj = this.createPostData(fee, this.vueInstance.wageinout)
      if (this.vueInstance.wageinout == 2) obj.wageoutId = null;

      data.push(obj);
    });

    super.request("post", url, data).then((d) => {
      if(!d.data.resultsuccess){
        this.duplicateArr=d.data.resultdata;
        this.isShowDuplicate = true;
        return;
      }
      this.ok("保存成功");
      this.vueInstance.wageinout == 2 && this.vueInstance.$confirm("是否将应付费用同步到应收", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //同步过去
        this.loadWageinFromWageout(d.data.resultdata[0].guid);
        this.isShowSyncDialog = true;
      })
      this.currentPageMode = pagemode.search;
      this.vueInstance.search();
    });
  }
  del() {
    let url = this.feeUrl + "TruckFee/del";
    let data = [];
    this.feeArr.forEach((fee) => {
      var obj = {
        feeid: this.currentFeeid,
        ddg: fee.ddg,
        mdg: this.mdg,
        twocodeStr: this.twocodeStr,
        min: fee.min,

        codeArr: fee.codeArr.map((item, index) => {
          return {
            guid: item.guid,
            code: this.tableHeadArr[index],
            diff: item.diff,
          };
        }),
      };
      data.push(obj);
    });

    super.request("post", url, data).then((d) => {
      this.ok("删除成功");
      this.currentPageMode = pagemode.search;
      this.vueInstance.search();
    });
  }
  handleSeed(type) {
    var currentRow = this.feeArr[this.feeArr.length - 1];
    var seed = this.seed;
    switch (type) {
      case "increase":
        currentRow.codeArr.forEach((item, index) => {
          item.diff = item.diff * 1 + seed * index * 1;
        })
        break;
      case "decrease":
        currentRow.codeArr.forEach((item, index) => {
          item.diff = item.diff * 1 - seed * index * 1;
        })
        break;
      case "copy":
        currentRow.codeArr.forEach((item, index) => {
          item.diff = seed * 1;
        })
        break;
    }
  }

  createPostData(fee, wageinout) {
    var obj = {
      wageoutId: wageinout == 2 ? fee.guid : fee.wageoutId,
      area: this.area,
      mdg: fee.mdg,
      ddg: fee.ddg,
      twocodeStr: fee.twocodeStr,
      min: fee.min,
      flat: fee.flat,
      addman: this.addman,
      addtime: this.currentDate,
      wageinout: wageinout,//应付同步到应收 这边固定为应收1
      flatDiff: fee.flatDiff,
      fixedFlat: fee.fixedFlat,
      minDiff: fee.minDiff,
      fixedMin: fee.fixedMin,
      codeArr: fee.codeArr.map((item, index) => {
        return {
          code: this.tableHeadArr[index], diff: item.diff, wageinDiff: item.wageinDiff,//应收的参数差,
          fixedDiff: item.fixedDiff
        };
      }),
    };
    if (this.currentPageMode == pagemode.edit) {
      obj.feeid = this.currentFeeid;
    }
    if (!!!obj.wageoutId) obj.wageoutId = null;
    return obj;
  }

  checkCanSave() {
    this.feeArr.forEach((item) => {
      var mdg = item.mdg;
      var ddg = item.ddg;
      var twocodeStr = item.twocodeStr;
      if (!!!mdg || !!!ddg || !!!twocodeStr) {
        throw new Error("请完善数据");
      }
    })
  }

  /**将excel导入到feeArr */
  setExcelToFeeArr(fileData) {
    var currency = this.vueInstance.currentCurrency;
    this.feeArr = [];
    var groupLength = this.getExcelGroupLength(fileData)// 有多少行数据 
    for (var i = 0; i < groupLength; i++) {
      let key = i + 2;
      if (!!!fileData["A" + key]) { throw new Error("基港三字码必填") }
      var mdg = fileData["A" + key].v;
      if (!!!fileData["B" + key]) { throw new Error("航司二字码必填") }
      var twocodeStr = fileData["B" + key].v;
      if (!!!fileData["C" + key]) { throw new Error("到达港必填") }
      var ddg = fileData["C" + key].v;
      var min = !!!fileData["D" + key] ? "0.00" : (fileData["D" + key].v / currency).toFixed(2);
      var n45 = !!!fileData["E" + key] ? "0.00" : (fileData["E" + key].v / currency).toFixed(2);
      var p45 = !!!fileData["F" + key] ? "0.00" : (fileData["F" + key].v / currency).toFixed(2);
      var p100 = !!!fileData["G" + key] ? "0.00" : (fileData["G" + key].v / currency).toFixed(2);
      var p300 = !!!fileData["H" + key] ? "0.00" : (fileData["H" + key].v / currency).toFixed(2);
      var p500 = !!!fileData["I" + key] ? "0.00" : (fileData["I" + key].v / currency).toFixed(2);
      var p1000 = !!!fileData["J" + key] ? "0.00" : (fileData["J" + key].v / currency).toFixed(2);
      var p2000 = !!!fileData["K" + key] ? "0.00" : (fileData["K" + key].v / currency).toFixed(2);
      var p3000 = !!!fileData["L" + key] ? "0.00" : (fileData["L" + key].v / currency).toFixed(2);
      var p5000 = !!!fileData["M" + key] ? "0.00" : (fileData["M" + key].v / currency).toFixed(2);
      var codeArr = [];
      codeArr.push(n45)
      codeArr.push(p45);
      codeArr.push(p100);
      codeArr.push(p300);
      codeArr.push(p500);
      codeArr.push(p1000);
      codeArr.push(p2000);
      codeArr.push(p3000);
      codeArr.push(p5000);

      var flat = !!!fileData["N" + key] ? "0.00" : (fileData["N" + key].v / currency).toFixed(2);
      this.mdg = mdg;
      this.twocodeStr = twocodeStr;
      var obj = {
        mdg: mdg,
        twocodeStr: twocodeStr,
        ddg: ddg,
        min: min,
        flat: flat,
        addman: this.addman,
        addtime: this.currentDate,
        wageinout: 2,//应付同步到应收 这边固定为应收1
        flatDiff: 0,
        fixedFlat: 0,
        minDiff: 0,
        fixedMin: 0,
        codeArr: codeArr.map((item, index) => {
          return {
            code: this.tableHeadArr[index], diff: item, wageinDiff: 0,//应收的参数差,
            fixedDiff: 0
          };
        }),
      };
      this.feeArr.push(obj)
    }
    this.isShowImportDialog = false;
  }

  // 通过A列最后一行编号获得有多少行数据
  getExcelGroupLength(fileData) {
    var count = 1;
    var key = "A" + count;
    while (fileData[key]) {
      count++;
      key = "A" + count
    }
    return count - 2;
  }
}



export { pagemode, TruckFee }

