export const docUploadMixin = function (pagetype = 1) {
  //pageype 1 图片文档合并的表格imgdocTable.vue  2文档管理的查询页面docManagement
  return {
    data() {
      return {

      }
    },
    methods: {
      getApiIds(id, type = 1) {//@type 是否需要判断进仓编号 1不需要 2需要

        let ids = "";
        if (!id) {
          let list = pagetype == 1 ? this.allList : this.tableDataRes;
          ids = list
            .filter((i) => i.checked)
            .map((i) => i.id)
            .toString();

          if (type == 2) {
            if ([...new Set(list.filter(i => i.checked).map(i => i.khjcno))].length > 1) {
              this.$message.error("进仓编号相同才能发送！");
              return false;
            }
            if (pagetype == 2) {
              ids = list
                .filter((i) => i.checked)
                .map(i => i.list.map(e => e.id)).flat().toString();
            }
          }

          if (!ids) {
            this.$message.error("请先选择文件!");
            return false;
          }
        } else {
          ids = id;
        }
        return ids
      },
      piliangDel(id) {
        let ids = this.getApiIds(id);
        if (!ids) return;
        let api=this.pagetype==1?"api/RankImg":"api/RankDoc";

        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$axios({
            method: "delete",
            url: this.$store.state.imageWebApi + api,
            data: {
              ids: ids
            },
            loading: true,
            tip: false,
          }).then((results) => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage);
              if (pagetype == 1) {
                // this.getDocList();
                // this.ifNeedRefresh = true;
                this.$emit("update:deleteIds",ids.split(','));
                // this.allList=this.allList.filter(i=>!i.checked);
                // this.clearChecked();
              } else {
                this.search()
              }
            } else {
              this.$message.error(results.data.resultmessage);
            }
          });
        });
      },
      piliangDownload(id) {
        console.log(id)
        let ids = this.getApiIds(id);
        if (!ids) return;

        window.open(
          `${this.$store.state.imageWebApi}api/DownLoad?ids=${ids}`,
          "_blank"
        );

      },
      send(id) {

        let ids = this.getApiIds(id, 2);
        if (!ids) return;


        this.$axios({
          method: "POST",
          data: {
            czman: localStorage.usrname,
            ids: ids
          },
          url: this.$store.state.webApi + "api/PdMailPre",
          loading: true,
          tip: false,
          nofield: true,
        }).then((results) => {
          if (results.data.resultstatus == 0) {
            this.$message.success(results.data.resultmessage);
            if (pagetype == 1) {
              // this.getDocList();
              // this.ifNeedRefresh = true;
            } else {
              this.search()
            }
          } else {
            this.$message.error(results.data.resultmessage);
          }
        });
      },
      getMail(id) {
        let ids = this.getApiIds(id,pagetype);
        if (!ids){
          this.sendMail = 'javascript:void(0)'
          this.$message.error('请先选择！');
          return;
        } 
        if(pagetype==1){
          this.sendMail = `mailpro:[{datatype:'本票照片',docid:'${ids}',czman:'${localStorage.usrname}',boguid:'${this.boguid}'}]`
        }else{
          this.sendMail = `mailpro:[{datatype:'配单预发送',docid:'${ids}',czman:'${localStorage.usrname}'}]`
        }

      },
      clearChecked() {
        this.allList.forEach(i => {
          i.checked = false
        })
      }
    }
  }
}
