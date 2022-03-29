<template>
<div class="enterWarehouseWithHawb">
  <el-row v-for="(hawb_item, hawb_index) in hawbybstorelist" :key="hawb_index" style="margin-bottom: 20px;">
    <el-col :span="4">
      <p>分运单号</p>
      <el-input v-model="hawb_item.hawb"></el-input>
      <i @click="edit_item('hawb',hawb_index)" :class="['edit-icon',{'el-icon-circle-plus': hawb_index == 0}, {'el-icon-remove': hawb_index != 0}]"></i>
    </el-col>

    <el-col :span="20">
      <el-row v-for="(ybstore_item, ybstore_index) in hawb_item.ybstoreList" :key="ybstore_index" style="margin-bottom: 10px;">
        <el-col :span="5">
          <p>进仓编号</p>
          <el-input v-model="ybstore_item.khjcno"></el-input>
        </el-col>
        <el-col :span="5" class="multiple-input">
          <p>件 / 重(KG) / 体(m³)</p>
          <el-input v-model="ybstore_item.piece"></el-input>
          <el-input v-model="ybstore_item.weight"></el-input>
          <el-input v-model="ybstore_item.volume"></el-input>
          <i @click="edit_item('ybstore',hawb_index,ybstore_index)" :class="['edit-icon',{'el-icon-circle-plus': ybstore_index == 0}, {'el-icon-remove': ybstore_index != 0}]"></i>
        </el-col>

        <el-col :span="14">
          <el-row v-for="(ybstorevolume_item, ybstorevolume_index) in ybstore_item.ybstorevolumeList" :key="ybstorevolume_index">
            <el-col :span="8">
              <p>包装类型</p>
              <el-select v-model="ybstorevolume_item.packagetypename" class="packagetypeselect">
                <el-option
                  v-for="(item, index) in packageType"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="7" :offset="1" class="multiple-input">
              <p>件 / 重(KG)</p>
              <el-input v-model="ybstorevolume_item.piece"></el-input>
              <el-input v-model="ybstorevolume_item.weight"></el-input>
            </el-col>
            <el-col :span="8" class="multiple-input">
              <p>长(m) / 宽(m) / 高(m)</p>
              <el-input v-model="ybstorevolume_item.longs"></el-input>
              <el-input v-model="ybstorevolume_item.widths"></el-input>
              <el-input v-model="ybstorevolume_item.heights"></el-input>
              <i @click="edit_item('ybstorevolume',hawb_index,ybstore_index,ybstorevolume_index)" :class="['edit-icon',{'el-icon-circle-plus': ybstorevolume_index == 0}, {'el-icon-remove': ybstorevolume_index != 0}]"></i>
            </el-col>
          </el-row>
        </el-col>

      </el-row>
    </el-col>

  </el-row>
</div>
</template>

<script>
export default {
  props: {
    hawbybstorelist: {
      type: Array,
      // required: true,
      default: () => []
    }
  },
  data () {
    return {
      packageType: []
    }
  },
  created () {
    let groupData = JSON.parse(localStorage.getItem('groupType') || '[]')
    
    groupData.forEach(item => {
      if (item.groupid == 31) this.packageType.push(item.typename)
    })

    this.hawbybstorelist.push({
      hawb: '',
      ybstoreList: [{
        khjcno: '',
        piece: '',
        weight: '',
        volume: '',
        ybstorevolumeList: [{
          longs: '',
          widths: '',
          heights: '',
          packagetypecode: '',
          packagetypename: ''
        }]
      }]
    })
  },
  methods: {
    edit_item (type, hawb_index, ybstore_index, ybstorevolume_index) {
      switch (type) {
        case 'hawb':
          if (hawb_index == 0) {
            this.hawbybstorelist.push({
              hawb: '',
              ybstoreList: [{
                khjcno: '',
                piece: '',
                weight: '',
                volume: '',
                ybstorevolumeList: [{
                  longs: '',
                  widths: '',
                  heights: '',
                  packagetypecode: '',
                  packagetypename: ''
                }]
              }]
            })
          } else {
            this.hawbybstorelist.splice(hawb_index, 1)
          }
          break
        case 'ybstore':
          if (ybstore_index == 0) {
            this.hawbybstorelist[hawb_index].ybstoreList.push({
              khjcno: '',
              piece: '',
              weight: '',
              volume: '',
              ybstorevolumeList: [{
                longs: '',
                widths: '',
                heights: '',
                packagetypecode: '',
                packagetypename: ''
              }]
            })
          } else {
            this.hawbybstorelist[hawb_index].ybstoreList.splice(ybstore_index, 1)
          }
          break
        case 'ybstorevolume':
          if (ybstorevolume_index == 0) {
            this.hawbybstorelist[hawb_index].ybstoreList[ybstore_index].ybstorevolumeList.push({
              longs: '',
              widths: '',
              heights: '',
              packagetypecode: '',
              packagetypename: ''
            })
          } else {
            this.hawbybstorelist[hawb_index].ybstoreList[ybstore_index].ybstorevolumeList.splice(ybstorevolume_index, 1)
          }
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.enterWarehouseWithHawb {
  .el-row {
    .el-col {
      p {
        margin-bottom: 5px;
        margin-left: 2px;
      }
      .el-input {
        width: 75%;
      }
      .edit-icon {
        vertical-align: text-bottom;
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
    }
    .packagetypeselect {
      width: 80%;
    }
    .multiple-input {
      .el-input {
        width: 40px;
        margin-right: 5px;
      }
    }
  }
}
</style>
