import { BaseService } from "../../base/base";
import BusinessError from "../../base/baseError";

class priceRouting extends BaseService {
  constructor(v) {
    super(v);
    this.loadBasicData();
  }

  volArr = [];

  weightArr = [];

  cusArr = [];

  packageTypeArr = [];

  isShowHbhDetail=false;

  // 加载航班号数组
  hbhArr = [];
  // 航班号分组map 根据hbh enddate分组
  hbhMap = {};

  selectedHbhKey = "";


  async openHbhDialog(twocode, sfg, mdg, hbh) {
    var url = this.vueInstance.$store.state.publicWebApi + "api/AirFlight/GetDetailList";
    var query = {
      twocode: twocode,
      sfg: sfg,
      mdg: mdg
    };
    if (!!hbh) {
      query["hbh"] = hbh;
    }

    await this.request("get", url, query).then((d) => {
      if (d.data.length == 0) throw new BusinessError("不存在航班信息");
      var data = d.data;
      console.log(data);
      this.hbhArr = data;
      this.hbhArr.forEach((item,index,arr) => {
        var key = item.airnum + item.enddate+item.begindate;
        if (!!!this.hbhMap[key]) {
          this.hbhMap[key]={};
          this.hbhMap[key]["detailArr"] = [];
          this.hbhMap[key]["hbh"] = item.airnum;
          this.hbhMap[key]["enddate"] = item.enddate;
          this.hbhMap[key]["aircompanyname"]=item.aircompanyname;//航司中文名
          this.hbhMap[key]["jjdname"]=item.jjdname;// 交接地名称
          this.hbhMap[key]["sfg"]=item.sfg;
          this.hbhMap[key]["planeid"]=item.planeid;// 机种 116货机 115 客机
          this.hbhMap[key]["jx"]=item.jx;// 机型
          this.hbhMap[key]["begindate"]=item.begindate;// 开始日期
          this.hbhMap[key]["modifyman"]=item.modifyman;// 维护人
          this.hbhMap[key]["modifydate"]=item.modifydate;// 维护日期
          this.selectedHbhKey=key;
        }


        this.hbhMap[key]["detailArr"].push(item);
        if(index==arr.length-1){
          
          this.hbhMap[key]["detailArr"]= this.hbhMap[key]["detailArr"].sort((a,b)=>{return a.airweekdetail-b.airweekdetail});}
      });
      
      this.isShowHbhDetail = true;
    });
  }


  loadBasicData() {
    this.volArr = JSON.parse(localStorage.getItem("volDiff"));
    this.weightArr = JSON.parse(localStorage.getItem("weightDiff"));
    this.cusArr = JSON.parse(localStorage.getItem("cusDiff"));
    this.packageTypeArr = JSON.parse(localStorage.getItem("packageDiff"));
    this.volArr.forEach((item) => { item.diff = 0 });
    this.weightArr.forEach((item) => { item.diff = 0 });
  }




}

export { priceRouting }
