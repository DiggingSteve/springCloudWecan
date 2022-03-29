const getStorage = function (configdata = []) {
  //getStorage(this,['groupType']) 
  //configdata;配置需要缓存的数据，如果为空，则取全部
  let fields = [];
  let setall = configdata.length == 0;

  if (setall || configdata.includes('groupType')) {
    if (!localStorage.getItem("groupType")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubTypeCode",
        params: {
          groupid: -1
        },
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("groupType", JSON.stringify(res.data));
        let groupTypeCode = {};
        res.data.forEach(i => {
          let item = {
            ready01: i.ready01,
            typename: i.typename
          };
          if (!groupTypeCode[i.groupid]) {
            groupTypeCode[i.groupid] = [item];
          } else {
            groupTypeCode[i.groupid].push(item);
          }
        });
        localStorage.setItem("groupTypeCode", JSON.stringify(groupTypeCode));
      }))
    }

  }

  if (setall || configdata.includes('currencyData')) {
    if (!localStorage.getItem("currencyData")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubRate",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("currencyData", JSON.stringify(res.data));
      }))
    }

  }


  if (setall || configdata.includes('serviceData')) {
    if (!localStorage.getItem("serviceData")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubServiceBasic",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("serviceData", JSON.stringify(res.data));
      }))
    }

  }

  if (setall || configdata.includes('serviceDataGroup')) {
    if (!localStorage.getItem("serviceDataGroup")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/GetServiceBasicGroup",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("serviceDataGroup", JSON.stringify(res.data));
      }))
    }
  }

  if (setall || configdata.includes('fwxm')) {
    if (!localStorage.getItem("fwxm")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubServiceCode",
        params: {
          type: "all",
          comxz: 1,
          area: ""
        }
      }).then(results => {
        localStorage.setItem("fwxm", JSON.stringify(results.data));
      }))
    };

  }

  if (setall || configdata.includes('statusData')) {
    if (!localStorage.getItem("statusData")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubNodeBasic",
        params: {},
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("statusData", JSON.stringify(res.data));
      }))
    };

  }

  // if (setall || configdata.includes('out_address')) {//暂时在用到的地方取
  //   if (!localStorage.out_address) {
  //     this.$axios({
  //         method: "get",
  //         url: this.$store.state.publicWebApi + "api/PubCityName",
  //         params: "",
  //         loading: false,
  //         tip: false
  //       })
  //       .then(response => {
  //         localStorage.setItem('out_address', JSON.stringify(response.data))
  //       })
  //   }
  // }

  if (setall || configdata.includes('jjd')) {
    if (!localStorage.getItem("jjd")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubTjjd",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("jjd", JSON.stringify(res.data));
      }))
    }
  }

  if (setall || configdata.includes('cargoData')) {
    if (!localStorage.getItem("cargoData")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubWarehouse",
        params: "",
        loading: false,
        tip: false
      }).then(res => {
        localStorage.setItem("cargoData", JSON.stringify(res.data));
      }))
    }
  }

  if (setall || configdata.includes('fwlb')) {

    if (!localStorage.getItem("fwlb")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubYsServicesDeptSort",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(results => {
        localStorage.setItem("fwlb", JSON.stringify(results.data));
      }))
    }
  }

  if (setall || configdata.includes('hbinfo')) {

    if (!localStorage.getItem("hbinfo")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubAirPortArea",
        params: {},
        loading: false,
        tip: false
      }).then(results => {
        localStorage.setItem("hbinfo", JSON.stringify(results.data));
      }))
    }
  }

  if (setall || configdata.includes('comContact')) {

    if (!localStorage.getItem("comContact")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubHrManage",
        params: {}
      }).then(results => {
        localStorage.setItem("comContact", JSON.stringify(results.data));
      }))
    }
  }

  if (setall || configdata.includes('jhAddress')) {

    if (!localStorage.getItem("jhAddress")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubReportBasic",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(results => {
        localStorage.setItem("jhAddress", JSON.stringify(results.data));
      }))
    }
  }

  // if (setall || configdata.includes('thdAddress')) {
  //   if (!localStorage.getItem("thdAddress")) {
  //     fields.push(this.$axios({
  //       method: "get",
  //       url: this.$store.state.publicWebApi + "api/PubAddressBasic",
  //       params: {
  //         area: ""
  //       },
  //       loading: false,
  //       tip: false
  //     }).then(results => {
  //       localStorage.setItem("thdAddress", JSON.stringify(results.data));
  //     }))
  //   };
  // }

  if (setall || configdata.includes('airinfo')) {
    if (!localStorage.getItem("airinfo")) {
      fields.push(this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubAirCompany",
        params: {
          area: ""
        },
        loading: false,
        tip: false
      }).then(results => {
        localStorage.setItem("airinfo", JSON.stringify(results.data));
      }))
    }
  }

  //   console.log(fields)
  return fields


  //    Promise.all(promiseTask).then(() => {
  //      console.log(3333333);
  //    })

}



// 取公司
const getWtdata = function (message) {
  let works = [];
  if (
    !message &&
    getxmdata('wtkhData') &&
    getxmdata('xmdata')
  )
    return true;

  if (!getxmdata('wtkhData') || message) {
    var time = 0;

    if (message) {
      time = Math.max(
        ...getxmdata('wtkhData').map(item => {
          return item.timestamp;
        })
      );
    }
    let wtkhFunc = this.$axios({
      method: "get",
      url: this.$store.state.publicWebApi + "api/PubFCustom",
      params: {
        type: "all",
        area: "",
        timestamp: time ? time : 0,
        system: ""
      }
    }).then(results => {
      let wtkhData1 = results.data.map(i => {
        delete i.address;
        delete i.usinessno;
        delete i.salesprofiter;
        delete i.salesprofitername;
        //delete i.usr_status_cw;
        return i;
      });
      if (!message) {
        // sessionStorage.setItem("wtkhData", JSON.stringify(wtkhData));
        // this.$store.commit('setWtkhData', wtkhData)
        window.wtkhData = JSON.stringify(wtkhData1)
      } else {
        var data = window.wtkhData;
        var dataIdList = data.map(i => {
          return i.id;
        });
        if (wtkhData1) {
          wtkhData1.forEach(i => {
            if (dataIdList.indexOf(i.id) == "-1") {
              data.push(i);
            } else {
              data[dataIdList.indexOf(i.id)] = i;
            }
          });
          //  sessionStorage.setItem("wtkhData", JSON.stringify(data));
          // this.$store.commit('setWtkhData', data)
          window.wtkhData = JSON.stringify(data)

        }

      }
    });
    works.push(wtkhFunc)
  }

  //1 客户的项目  2供应商的项目
  var time2 = 0;
  if (message) {
    time2 = Math.max(
      ...getxmdata('xmdata').map(item => {
        return item.timestamp;
      })
    );
  }
  //console.log(time2)
  let wtxmFunc = this.$axios({
    method: "get",
    url: this.$store.state.publicWebApi + "api/PubCustom",
    params: {
      type: "all",
      comxz: "-1",
      area: "",
      //timestamp:0,
      timestamp: time2 ? time2 : 0,
      system: ""
    },
    loading: !message
  }).then(results => {
    //usr_status=  1有效 2无效
    let xmdata1 = results.data.filter(e => e.usr_status_cw == 1).map(i => {
      delete i.isdmdlgys;
      delete i.comhy;
      delete i.iskyydgys;
      delete i.khjcno;
      //delete i.zddlcode;
      //delete i.zddlzh;
      //delete i.zdiatacode;
      //delete i.usr_status_cw;
      return i;
    });

    if (!message) {
      //sessionStorage.setItem("xmdata", JSON.stringify(xmdata)); //缓存全部数据  //单项直接调用, getxmdata('jsxm')
      // this.$store.commit('setXmdata', xmdata)   
      window.xmdata = JSON.stringify(xmdata1)
    } else {
      var data = getxmdata('xmdata')
      var dataIdList = data.map(i => {
        return i.id;
      });
      if (xmdata1) {
        xmdata1.forEach(i => {
          if (dataIdList.indexOf(i.id) == "-1") {
            data.push(i);
          } else {
            data[dataIdList.indexOf(i.id)] = i;
          }
        });
        // sessionStorage.setItem("xmdata", JSON.stringify(data));
        // this.$store.commit('setXmdata', data)   
        window.xmdata = JSON.stringify(data)
      }
    }
    return true;
  });
  works.push(wtxmFunc);
  return works

}

const getTzxm = function () {
  if (getxmdata('tzxm')) {
    return true
  } else {
    return this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/PubCustom",
        params: {
          type: "tz",
          comxz: "-1",
          area: "",
          timestamp: 0,
          system: ""
        },
        loading: false
      })
      .then(results => {

        let xmdata1 = results.data.filter(e => e.usr_status_cw == 1).map(i => {
          delete i.isdmdlgys;
          delete i.comhy;
          delete i.iskyydgys;
          delete i.khjcno;
          delete i.zddlcode;
          delete i.zddlzh;
          delete i.zdiatacode;
          return i;
        });
        window.tzxm = JSON.stringify(xmdata1)
      })


  }
}


const getAllTemplates = function () {
  //获取全部模板数据
  return new Promise((resolve, reject) => {
    this.$axios({
        method: "get",
        url: this.$store.state.publicWebApi + "api/UserTemplet",
        params: {
          logname: localStorage.getItem("usrname"),
          project: localStorage.system == 'outside' ? "outside" : "bomanagement"
        },
        loading: false,
        tip: false
      })
      .then(results => {
        let res = results.data;
        this.$store.commit("setTableTmpAll", res);
        //console.log(
        res.filter(i => {
          return i.url == "orderSearch.vue";
        });
        //  );
        let userSettingTmpAll = [];
        // type 110：用户设置模板
        // bo用户设置模板
        let settingTmp = res.find(i => i.type == 110);
        if (settingTmp) {
          userSettingTmpAll.push({
            ...settingTmp,
            project: "bomanagement"
          });
          return userSettingTmpAll;
        } else {
          return null;
        }
      })
      .then(userSettingTmpAll => {
        if (!userSettingTmpAll || !localStorage.usrname) return;
        // 拿到bo的用户设置模板后继续获取wffmanagement的用户设置模板，并且保存到store中
        this.$axios({
          method: "get",
          url: this.$store.state.publicWebApi + "api/UserTemplet",
          params: {
            logname: localStorage.getItem("usrname"),
            project: "wffmanagement"
          },
          loading: false,
          tip: false
        }).then(result => {
          // wff用户设置模板
          userSettingTmpAll.push({
            ...result.data.find(i => i.type == 110),
            project: "wffmanagement"
          });
          this.$store.commit("setUserSettingTmpAll", userSettingTmpAll);
          resolve(userSettingTmpAll)
        });
      })
      .catch(error => {});


  })

}

export {
  getStorage,
  getWtdata,
  getAllTemplates,
  getTzxm
}
