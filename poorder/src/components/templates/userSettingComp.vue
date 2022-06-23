<template>
  <el-dialog :title="iframeUrl?'':'设置'" width="920px" top="170px" center v-if="userSettingVisible" custom-class="user-setting-dialog"
    :close-on-click-modal="false" :visible.sync="userSettingVisible" append-to-body :before-close="isClose">

    <div style="display:flex;" v-if="!iframeUrl">
        <div class="left">
          <ul>
            <li v-for="(i,index) in leftItemList" :key="index" @click="leftActive=index" :class="[leftActive==index?'activeLeft':'normalLeft']">
              <i :class="i.icon"></i>{{i.title}}
            </li>
          </ul>
        </div>
        <div class="right" style="flex-grow:2;margin-left:40px">
          <div v-show="leftActive==0">
              <el-radio-group v-model="setType" fill="#0E5B8C">
                <el-radio-button label="1">左侧菜单默认设置</el-radio-button>
                <el-radio-button label="2">页面默认设置</el-radio-button>
              </el-radio-group>
              <div class="setting-c">
                <div v-show="setType==1" class="setting-group">
                  <div class="setting-item areaSelect" v-show="paneShow">
                    <div class="setting-info">
                      <p class="item-text">
                        左侧菜单栏默认匹配的站点
                        <explainTooltip text="查询订单时将只显示与所选站点有关的订单。"></explainTooltip>
                      </p>
                    </div>

                    <el-select v-model="areaCheckedBackup" ref="userSettingAreaSelect" multiple placeholder="请选择"
                      popper-class="userSettingAreaSelect" @visible-change="areaSelectVisibleChange">
                      <div class="el-icon-close" style="font-size: 20px;"
                        @click="changeAreaChecked=false;$refs.userSettingAreaSelect.blur()"></div>
                      <div class="title">
                        <div class="title-left">
                          <h3>区域选择</h3>
                        </div>
                        <div class="title-right">
                          <p @click="areaCheckedAll = !areaCheckedAll" :class="['check-all', {'active': areaCheckedAll}]">全选</p>
                          <p @click="changeAreaChecked=true;$refs.userSettingAreaSelect.blur()" class="confirm">确定</p>
                        </div>
                      </div>
                      <table>
                        <tr>
                          <template v-for="(group, index) in cities">
                            <td :key="group.value" v-if="index%2 == 0">
                              <el-option-group :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                                  style="width:204px;"></el-option>
                              </el-option-group>
                            </td>
                          </template>
                        </tr>
                        <tr>
                          <template v-for="(group, index) in cities">
                            <td :key="group.value" v-if="index%2 == 1">
                              <el-option-group :label="group.label">
                                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                                  style="width:204px;"></el-option>
                              </el-option-group>
                            </td>
                          </template>
                        </tr>
                      </table>
                    </el-select>
                  </div>
                  <div class="setting-item systemSelect" v-show="paneShow">
                    <div class="setting-info">
                      <p class="item-text">
                        左侧菜单栏默认匹配的系统
                        <explainTooltip text="查询订单时将只显示与所选系统有关的订单。"></explainTooltip>
                      </p>
                    </div>
                    <el-select v-model="systemCheckedBackup" ref="userSettingSystemSelect" multiple placeholder="请选择"
                      popper-class="userSettingSystemSelect" @visible-change="systemSelectVisibleChange">
                      <div class="el-icon-close" style="font-size: 20px;"
                        @click="changeSystemChecked=false;$refs.userSettingSystemSelect.blur()"></div>
                      <div class="title">
                        <div class="title-left">
                          <h3>系统选择</h3>
                        </div>
                        <div class="title-right">
                          <p @click="systemCheckedAll = !systemCheckedAll" :class="['check-all', {'active': systemCheckedAll}]">全选
                          </p>
                          <p @click="changeSystemChecked=true;$refs.userSettingSystemSelect.blur()" class="confirm">确定</p>
                        </div>
                      </div>
                      <table>
                        <tr>
                          <td v-for="(group) in systemArrList" :key="group.label">
                            <el-option-group :label="group.label">
                              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                                style="width:204px;"></el-option>
                            </el-option-group>
                          </td>
                        </tr>
                      </table>
                    </el-select>
                  </div>
                  <div class="setting-item serviceSelect" v-show="paneShow">
                    <div class="setting-info">
                      <p class="item-text">
                        左侧菜单栏默认匹配的服务
                        <explainTooltip text="查询订单时将只显示与所选服务有关的订单。"></explainTooltip>
                      </p>
                    </div>

                    <el-select v-model="serviceCheckedBackup" multiple clearable popper-class="userSettingServiceSelect"
                      ref="userSettingServiceSelect" placeholder="请选择" @visible-change="serviceSelectVisibleChange">

                      <div class="el-icon-close" style="font-size: 20px;"
                        @click="changeServiceChecked=false;$refs.userSettingServiceSelect.blur()"></div>
                      <div class="title">
                        <div class="title-left">
                          <h3>服务选择</h3>
                        </div>
                        <div class="title-right">
                          <p @click="serviceCheckedAll = !serviceCheckedAll"
                            :class="['check-all', {'active': serviceCheckedAll}]">全选</p>
                          <p @click="changeServiceChecked=true;$refs.userSettingServiceSelect.blur()" class="confirm">确定</p>
                        </div>
                      </div>

                      <el-tabs v-model="activeServiceTab" type="card" class="serviceTabCard">
                        <el-tab-pane v-for="system in Object.keys(serviceOptions)" :name="system" :label="system" :key="system">
                          <table>
                            <template v-for="portItem of serviceOptions[system]">
                              <div :key="portItem.port">
                                <tr style="color:#333;font-weight:600;font-size:15px;">{{ portItem.port }}</tr>
                                <div :style="{'font-size':'15px'}" valign="top" class="portItemDiv">
                                  <div v-for="type in getServiceType(portItem.serviceBasicList)">
                                    <span style="margin-bottom:6px;">{{type}}</span>
                                    <div>
                                      <el-option style="width: 130px"
                                        v-for="item in portItem.serviceBasicList.filter(i => i.servicetype == type)"
                                        :key="item.servicecode" :label="item.servicename" :value="item.selectValue">
                                      </el-option>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </template>
                          </table>
                        </el-tab-pane>
                      </el-tabs>
                    </el-select>
                  </div>
                  <div class="setting-item" v-show="projectIsWecan">
                    <div class="setting-info">
                      <p class="item-text">默认显示左侧菜单待处理的票数</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.showSystemCount}]">{{
                        userSettingBackup.showSystemCount ? '已开启' : '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.showSystemCount}]">
                       {{userSettingBackup.showSystemCount ? '已开启' : '已关闭' }}
                      </span>
                      <el-switch v-model="userSettingBackup.showSystemCount" active-color="#14AE00" style="margin-top:-1px"></el-switch>
                    </div>
                    
                  </div>
                  <div class="setting-item" v-show="projectIsWecan&&userSettingBackup.showSystemCount">
                      <div class="setting-info">
                        <p class="item-text" style="color:#3A3C42">自动刷新左侧菜单待处理的票数的间隔
                          <explainTooltip text="当开启‘默认显示左侧菜单待处理的票数’时，每隔一段时间自动获取最新数据"></explainTooltip>
                        </p>
                      </div>
                      <el-select v-model="userSettingBackup.refreshInterval" placeholder="请选择" style="width:150px">
                        <el-option v-for="item in timeInterval" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                  </div>
                </div>
                <div v-show="setType==2" class="setting-group">
                  <div class="setting-item">
                    <div class="setting-info">
                      <p class="item-text">查询后查询条件自动收缩</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.autoCollapse}]">{{ userSettingBackup.autoCollapse ?
                        '已开启' : '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.autoCollapse}]">{{ userSettingBackup.autoCollapse ?
                        '已开启' : '已关闭' }}</span>
                      <el-switch v-model="userSettingBackup.autoCollapse" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                    </div>
                    
                  </div>
                  <div class="setting-item">
                    <div class="setting-info">
                      <p class="item-text">列表页汇总显示</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.showSearchTotalInfo}]">{{
                        userSettingBackup.showSearchTotalInfo ? '已开启' : '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.showSearchTotalInfo}]">{{
                        userSettingBackup.showSearchTotalInfo ? '已开启' : '已关闭' }}</span>
                      <el-switch v-model="userSettingBackup.showSearchTotalInfo" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                    </div>
                   
                  </div>

                  <div class="setting-item">
                    <div class="setting-info">
                      <p class="item-text">进入页面默认查询</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.autoSearch}]">{{ userSettingBackup.autoSearch ?
                        '已开启' : '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.autoSearch}]">{{ userSettingBackup.autoSearch ?
                        '已开启' : '已关闭' }}</span>
                      <el-switch v-model="userSettingBackup.autoSearch" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                    </div>
                    
                  </div>

                  <div class="setting-item" v-show="paneShow">
                    <div class="setting-info">
                      <p class="item-text">操作提醒(AMS)</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
                        '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
                        '已关闭' }}</span>
                      <el-switch v-model="userSettingBackup.amsOpen" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                    </div>
                    
                  </div>

                  <div class="setting-item">
                    <div class="setting-info">
                      <p class="item-text">订单摘要页面显示</p>
                      <!-- <p :class="['item-status', {'active': userSettingBackup.showInfoList}]">{{ userSettingBackup.showInfoList ?
                        '已开启' : '已关闭' }}</p> -->
                    </div>
                    <div>
                      <span :class="['item-status', {'active': userSettingBackup.showInfoList}]">{{ userSettingBackup.showInfoList ?
                        '已开启' : '已关闭' }}</span>
                      <el-switch v-model="userSettingBackup.showInfoList" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                    </div>
                    
                  </div>
              </div>
              </div>
          </div>
          <div v-show="leftActive==1">
            <el-radio-group v-model="systemType" fill="#0E5B8C">
                <el-radio-button :label="i" v-for="i in systemSelectList" :key="i"></el-radio-button>
            </el-radio-group>
            <div class="setting-c">
              <div v-show="systemType=='订单'" class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                    <p class="item-text">
                      新增订单默认匹配的站点
                      <explainTooltip text="新增订单时默认选中选择的站点。"></explainTooltip>
                    </p>
                  </div>

                  <el-select v-model="userSettingBackup.mawbAddArea" placeholder="请选择" popper-class="userSettingAreaSelect">
                    <div class="title">
                      <div class="title-left">
                        <h3>区域选择</h3>
                      </div>
                    </div>
                    <table>
                      <tr>
                        <template v-for="(group, index) in cities">
                          <td :key="group.value" v-if="index%2 == 0">
                            <el-option-group :label="group.label">
                              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                                style="width:204px;"></el-option>
                            </el-option-group>
                          </td>
                        </template>
                      </tr>
                      <tr>
                        <template v-for="(group, index) in cities">
                          <td :key="group.value" v-if="index%2 == 1">
                            <el-option-group :label="group.label">
                              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                                style="width:204px;"></el-option>
                            </el-option-group>
                          </td>
                        </template>
                      </tr>
                    </table>
                  </el-select>
                </div>

                <div class="setting-item">
                  <div class="setting-info">
                    <p class="item-text">
                      新增订单默认匹配的系统
                      <explainTooltip text="新增订单时默认选中选择的系统。"></explainTooltip>
                    </p>
                  </div>

                  <el-select v-model="mawbAddSystemBackup" placeholder="请选择" popper-class="userSettingSystemSelect">
                    <div class="title">
                      <div class="title-left">
                        <h3>系统选择</h3>
                      </div>
                    </div>
                    <table>
                      <tr>
                        <td v-for="(group) in mawbAddSystemOptions" :key="group.label">
                          <el-option-group :label="group.label">
                            <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.label"
                              style="width:204px;"></el-option>
                          </el-option-group>
                        </td>
                      </tr>
                    </table>
                  </el-select>
                </div>
                <!-- <div class="setting-item">
                  <div class="setting-info">
                    <p class="item-text">新增默认匹配的订单类型</p>
                  </div>
                </div>   -->
                <div class="setting-item">
                  <div class="setting-info">
                    <p class="item-text">新增费用时默认币种</p>
                  </div>
                  <el-select v-model="userSettingBackup.defaultCurrency" placeholder="请选择币种">
                    <el-option v-for="item in currencyList" :key="item" :label="item" :value="item" style="padding:0 20px;">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div v-show="systemType=='空出'" class="setting-group">
                 <div class="setting-item" v-show="paneShow">
                  <div class="setting-info">
                    <p class="item-text">操作提醒(AMS)</p>
                    <!-- <p :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
                      '已关闭' }}</p> -->
                  </div>
                  <div>
                    <span :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
                      '已关闭' }}</span>
                    <el-switch v-model="userSettingBackup.amsOpen" style="margin-top:-1px" active-color="#14AE00"></el-switch>
                  </div>
                </div>
              </div>
            </div>  
              
          </div>
          <div v-show="leftActive==2">
            <div class="setting-c">
              <div class="setting-group">
                <div class="setting-item">
                  <div class="setting-info">
                     <p class="item-text">
                          当前登录人
                     </p>
                  </div>
                  <div>
                    <el-input placeholder="当前登录人" class="input-required" style="width:280px" disabled v-model="forgetCodeInfo.logname" ></el-input>
                  </div>
                </div>
                 <div class="setting-item">
                  <div class="setting-info">
                     <p class="item-text">
                          请输入修改后的密码
                     </p>
                  </div>
                  <div>
                    <el-input placeholder="请输入8-16位包含数字和大小写英文的密码" class="input-required" style="width:280px" v-model="forgetCodeInfo.pwd"  @blur="isCorrectPwd(false)" show-password></el-input>
                  </div>
                </div>
                <div class="setting-item">
                  <div class="setting-info">
                     <p class="item-text">
                          请确认修改后的密码
                     </p>
                  </div>
                  <div>
                    <el-input placeholder="请再次输入密码,两次须一致" class="input-required" style="width:280px" v-model="forgetCodeInfo.repwd" @blur="isCorrectPwd(true)" show-password></el-input>
                  </div>
                </div>
                <div class="setting-item">
                  <div class="setting-info">
                     <p class="item-text">
                          请输入手机验证码
                     </p>
                  </div>
                  <div style="position:relative">
                    <el-input placeholder="请输入手机验证码" class="input-required" style="width:280px" v-model="forgetCodeInfo.smscode"></el-input>
                    <span style="position:absolute;right:12px;height:20px;color:#0E5B8C;top:4px;cursor:pointer;" v-if="countdown==0" @click="getYanz">
                      发送验证码
                    </span>
                    <span v-else style="position:absolute;right:12px;height:20px;color:rgba(58, 60, 66, 0.5);top:4px;cursor:pointer;">
                      重新获取({{countdown}})
                    </span>
                  </div>
                </div>
              </div>

            </div>
            
            
          </div>
          <div v-show="leftActive==3||leftActive==4">
            <div class="setTableHead">
                <el-row>
                <el-col :span="14" class="headTitle">更新内容</el-col>
                <el-col :span="6" class="headTitle" @click.native="sortTime(3)" v-if="leftActive===3">更新时间<i class="el-icon-sort-down" v-if="isDes3"></i><i class="el-icon-sort-up" v-else></i></el-col>
                <el-col :span="6" class="headTitle" @click.native="sortTime(4)" v-if="leftActive===4">更新时间<i class="el-icon-sort-down" v-if="isDes4"></i><i class="el-icon-sort-up" v-else></i></el-col>
                <el-col :span="2" class="headTitle">版本号</el-col>
                </el-row>
            </div>
             <div class="setting-c" style="height:500px;overflow-y:auto">
              <div class="setting-group" v-if="leftActive=='3'">
                  <div class="setting-item settingHover" style="display:block;line-height:49px;" v-for="(i,index) in resultUpdate">
                    <el-row>
                    <el-col class="setting-info" :span="14">
                     <p class="item-text">
                          <span v-if="!i.isread" style="width:6px;height:6px;background:#f56c6c;border-radius:6px;display:inline-block;vertical-align:middle"></span> {{i.title}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="6">
                     <p class="item-text">
                          {{i.timestamp}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="2">
                     <p class="item-text">
                           {{i.version}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="1" style="text-align:right">
                      <i class="el-icon-arrow-right" @click="showUpdate(i,index)"></i>
                    </el-col>
                    </el-row>

                  </div>
              </div>
              <div class="setting-group" v-if="leftActive=='4'">
                  <div class="setting-item settingHover" style="display:block;line-height:49px;" v-for="i in resultUpdateOperation">
                    <el-row>
                    <el-col class="setting-info" :span="14">
                     <p class="item-text">
                          {{i.title}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="6">
                     <p class="item-text">
                         {{i.timestamp}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="2">
                     <p class="item-text">
                          {{i.version}}
                     </p>
                    </el-col>
                    <el-col class="setting-info" :span="1" style="text-align:right">
                      <a :href="i.contenturl"><i class="el-icon-arrow-right"></i></a>
                    </el-col>
                    </el-row>

                  </div>
              </div>
             </div>  
          </div>
          
        </div>
    </div>
    <div class="rightListContent" v-if="iframeUrl">
      <p>{{resultUpdate[versionActiveIndex].title}}</p>
      <p style="color:#989898;font-weight:normal;letter-spacing:0.1em;margin-top:8px;">
        <span style="font-size:14px;">更新时间:{{resultUpdate[versionActiveIndex].timestamp}}</span>
        <span style="margin-left:60px;font-size:14px;">版本号:{{resultUpdate[versionActiveIndex].version}}</span>
      </p>
      <iframe :src="iframeUrl" frameborder="0" allowtransparency="true"
        style="width: 100%; height:600px; border: 0px none;" class="iframeScroll"></iframe>
    </div>
    <div class="footer" v-if="leftActive==0||leftActive==1||leftActive==2" style="text-align:right">
        <div class="btn-c">
          <el-button type="primary" @click="updateUserSetting">保存</el-button>
          <el-button @click="userSettingVisible = false">取消</el-button>
        </div>
    </div>
    <!-- <div class="setting-c">
      <div class="setting-group">
        <h3 class="group-title">左侧菜单默认设置</h3>

        <div class="setting-item areaSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的站点
              <explainTooltip text="查询订单时将只显示与所选站点有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="areaCheckedBackup" ref="userSettingAreaSelect" multiple placeholder="请选择"
            popper-class="userSettingAreaSelect" @visible-change="areaSelectVisibleChange">
            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeAreaChecked=false;$refs.userSettingAreaSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>区域选择</h3>
              </div>
              <div class="title-right">
                <p @click="areaCheckedAll = !areaCheckedAll" :class="['check-all', {'active': areaCheckedAll}]">全选</p>
                <p @click="changeAreaChecked=true;$refs.userSettingAreaSelect.blur()" class="confirm">确定</p>
              </div>
            </div>
            <table>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 0">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 1">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
            </table>
          </el-select>

        </div>

        <div class="setting-item systemSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的系统
              <explainTooltip text="查询订单时将只显示与所选系统有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="systemCheckedBackup" ref="userSettingSystemSelect" multiple placeholder="请选择"
            popper-class="userSettingSystemSelect" @visible-change="systemSelectVisibleChange">
            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeSystemChecked=false;$refs.userSettingSystemSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>系统选择</h3>
              </div>
              <div class="title-right">
                <p @click="systemCheckedAll = !systemCheckedAll" :class="['check-all', {'active': systemCheckedAll}]">全选
                </p>
                <p @click="changeSystemChecked=true;$refs.userSettingSystemSelect.blur()" class="confirm">确定</p>
              </div>
            </div>
            <table>
              <tr>
                <td v-for="(group) in systemArrList" :key="group.label">
                  <el-option-group :label="group.label">
                    <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                      style="width:204px;"></el-option>
                  </el-option-group>
                </td>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item serviceSelect" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">
              左侧菜单栏默认匹配的服务
              <explainTooltip text="查询订单时将只显示与所选服务有关的订单。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="serviceCheckedBackup" multiple clearable popper-class="userSettingServiceSelect"
            ref="userSettingServiceSelect" placeholder="请选择" @visible-change="serviceSelectVisibleChange">

            <div class="el-icon-close" style="font-size: 20px;"
              @click="changeServiceChecked=false;$refs.userSettingServiceSelect.blur()"></div>
            <div class="title">
              <div class="title-left">
                <h3>服务选择</h3>
              </div>
              <div class="title-right">
                <p @click="serviceCheckedAll = !serviceCheckedAll"
                  :class="['check-all', {'active': serviceCheckedAll}]">全选</p>
                <p @click="changeServiceChecked=true;$refs.userSettingServiceSelect.blur()" class="confirm">确定</p>
              </div>
            </div>

            <el-tabs v-model="activeServiceTab" type="card" class="serviceTabCard">
              <el-tab-pane v-for="system in Object.keys(serviceOptions)" :name="system" :label="system" :key="system">
                <table>
                  <template v-for="portItem of serviceOptions[system]">
                    <div :key="portItem.port">
                      <tr style="color:#333;font-weight:600;font-size:15px;">{{ portItem.port }}</tr>
                      <div :style="{'font-size':'15px'}" valign="top" class="portItemDiv">
                        <div v-for="type in getServiceType(portItem.serviceBasicList)">
                          <span style="margin-bottom:6px;">{{type}}</span>
                          <div>
                            <el-option style="width: 130px"
                              v-for="item in portItem.serviceBasicList.filter(i => i.servicetype == type)"
                              :key="item.servicecode" :label="item.servicename" :value="item.selectValue">
                            </el-option>
                          </div>
                        </div>
                      </div>

                    </div>
                  </template>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-select>
        </div>

        <div class="setting-item" v-show="projectIsWecan">
          <div class="setting-info">
            <p class="item-text">默认显示左侧菜单待处理的票数</p>
            <p :class="['item-status', {'active': userSettingBackup.showSystemCount}]">{{
              userSettingBackup.showSystemCount ? '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showSystemCount"></el-switch>
        </div>

        <div class="setting-item" v-show="projectIsWecan&&userSettingBackup.showSystemCount">
          <div class="setting-info">
            <p class="item-text">自动刷新左侧菜单待处理的票数的间隔
              <explainTooltip text="当开启‘默认显示左侧菜单待处理的票数’时，每隔一段时间自动获取最新数据"></explainTooltip>
            </p>
          </div>

          <el-select v-model="userSettingBackup.refreshInterval" placeholder="请选择" style="width:150px">
            <el-option v-for="item in timeInterval" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

        </div>





      </div>

      <div class="setting-group">
        <h3 class="setting-title">各页面默认设置</h3>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">查询后查询条件自动收缩</p>
            <p :class="['item-status', {'active': userSettingBackup.autoCollapse}]">{{ userSettingBackup.autoCollapse ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.autoCollapse"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">列表页汇总显示</p>
            <p :class="['item-status', {'active': userSettingBackup.showSearchTotalInfo}]">{{
              userSettingBackup.showSearchTotalInfo ? '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showSearchTotalInfo"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">进入页面默认查询</p>
            <p :class="['item-status', {'active': userSettingBackup.autoSearch}]">{{ userSettingBackup.autoSearch ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.autoSearch"></el-switch>
        </div>

        <div class="setting-item" v-show="paneShow">
          <div class="setting-info">
            <p class="item-text">操作提醒(AMS)</p>
            <p :class="['item-status', {'active': userSettingBackup.amsOpen}]">{{ userSettingBackup.amsOpen ? '已开启' :
              '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.amsOpen"></el-switch>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">订单摘要页面显示</p>
            <p :class="['item-status', {'active': userSettingBackup.showInfoList}]">{{ userSettingBackup.showInfoList ?
              '已开启' : '已关闭' }}</p>
          </div>
          <el-switch v-model="userSettingBackup.showInfoList"></el-switch>
        </div>
      </div>

      <div class="setting-group" v-show="paneShow">
        <h3 class="setting-title">新增订单默认设置</h3>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">
              新增订单默认匹配的站点
              <explainTooltip text="新增订单时默认选中选择的站点。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="userSettingBackup.mawbAddArea" placeholder="请选择" popper-class="userSettingAreaSelect">
            <div class="title">
              <div class="title-left">
                <h3>区域选择</h3>
              </div>
            </div>
            <table>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 0">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
              <tr>
                <template v-for="(group, index) in cities">
                  <td :key="group.value" v-if="index%2 == 1">
                    <el-option-group :label="group.label">
                      <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                        style="width:204px;"></el-option>
                    </el-option-group>
                  </td>
                </template>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">
              新增订单默认匹配的系统
              <explainTooltip text="新增订单时默认选中选择的系统。"></explainTooltip>
            </p>
          </div>

          <el-select v-model="mawbAddSystemBackup" placeholder="请选择" popper-class="userSettingSystemSelect">
            <div class="title">
              <div class="title-left">
                <h3>系统选择</h3>
              </div>
            </div>
            <table>
              <tr>
                <td v-for="(group) in mawbAddSystemOptions" :key="group.label">
                  <el-option-group :label="group.label">
                    <el-option v-for="item in group.options" :key="item.label" :label="item.label" :value="item.label"
                      style="width:204px;"></el-option>
                  </el-option-group>
                </td>
              </tr>
            </table>
          </el-select>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <p class="item-text">新增费用时默认币种</p>
          </div>
          <el-select v-model="userSettingBackup.defaultCurrency" placeholder="请选择币种">
            <el-option v-for="item in currencyList" :key="item" :label="item" :value="item" style="padding:0 20px;">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="footer">
        <div class="btn-c">
          <el-button type="primary" @click="updateUserSetting">保存</el-button>
          <el-button @click="userSettingVisible = false">取消</el-button>
        </div>
      </div>
    </div> -->
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        required: true,
        type: Boolean
      },
      serviceBasic: Array,
    },
    data() {

      return {
        userSettingBackup: {},
        areaCheckedBackup: [],
        changeAreaChecked: false,

        systemCheckedBackup: [],
        changeSystemChecked: false,

        serviceCheckedBackup: [],
        changeServiceChecked: false,
        activeServiceTab: '',

        // mawbAddServiceBackup: [],
        // changeMawbAddService: false,

        mawbAddSystemOptions: [
          {
            label: "出口",
            options: [
              { label: "空出", value: "空运" },
              { label: "海出", value: "海运" },
              { label: "陆出", value: "陆运" },
              { label: "铁出", value: "铁运" }
            ]
          },
          {
            label: "进口",
            options: [
              { label: "空进", value: "空运" },
              { label: "海进", value: "海运" },
              { label: "陆进", value: "陆运" },
              { label: "铁进", value: "铁运" }
            ]
          },
          {
            label: "国内服务",
            options: [{ value: "国内服务", label: "国内服务" }]
          }
        ],
        leftActive:0,//激活的设置
        leftItemList:[{title:'功能设置',icon:'el-icon-setting'},{title:'系统设置',icon:'el-icon-setting'},{title:'修改密码',icon:'el-icon-lock'},{title:'更新日志',icon:'el-icon-tickets'},{title:'操作手册',icon:'el-icon-document'}],//设置列表
        setType:'1',//设置类型
        systemSelectList:['订单','空出','空进','海出','海进','陆出','陆进','铁出','铁进'],
        systemType:'订单',
        forgetCodeInfo: { logname: localStorage.usrname, pwd: '', smscode: '' ,repwd:''},
        countdown: 0,//验证码倒计时
        resultUpdate:[],//更新日志
        resultUpdateOperation:[],//操作手册
        iframeUrl:'',//更新日志地址
        versionActiveIndex:-1,
        isDes3:true,//更新日志降序
        isDes4:true,//操作手册降序
      }
    },
    computed: {
      cities() {
        return this.$store.state.cities
      },
      systemArrList() {
        return this.$store.state.systemArrList;
      },
      currencyList() {
        return JSON.parse(localStorage.currencyData).map(i => i.cname);
      },
      paneShow(){
            return sessionStorage.system!='outside'
      },
      timeInterval() {
        let options = [{ label: '不自动刷新', value: 0 }]
        for (let i = 1; i <= 6; i++) {
          options.push({ label: i * 10 + '分钟', value: i * 10 })
        }
        return options
      },
      userSettingVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        }
      },
      // 服务选项，根据所选系统联动
      serviceOptions() {
        let options = {}
        if (!this.userSettingBackup.systemChecked) return options

        for (let item of this.serviceBasic) {
          if (this.userSettingBackup.systemChecked.includes(item.system)) {
            if (!options[item.system]) options[item.system] = []
            options[item.system].push(item)
          }
        }

        this.activeServiceTab = Object.keys(options)[0]
        return options
      },
      // 平铺的服务选项
      serviceOptionsArr() {
        let arr = []
        if (!this.userSettingBackup.systemChecked) return arr

        for (let item of this.serviceBasic) {
          if (this.userSettingBackup.systemChecked.includes(item.system)) {
            for (let item2 of item.serviceBasicList) {
              arr.push(item2)
            }
          }
        }
        return arr
      },
      serviceOptionsLength() {
        return this.serviceOptionsArr.length
      },
      servicetypeArr() {
        let type = []
        for (let system of Object.keys(this.serviceOptions)) {
          if (system !== this.activeServiceTab) continue
          for (let item of this.serviceOptions[system]) {
            for (let item2 of item.serviceBasicList) {
              if (!type.includes(item2.servicetype)) {
                type.push(item2.servicetype)
              }
            }
          }
        }
        return type
      },
      areaCheckedAll: {
        get() {
          let length = 0;
          this.cities.forEach(item => {
            length += item.options.length
          })

          if (this.areaCheckedBackup.length === length) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          if (val) {
            this.cities.forEach(item => {
              item.options.forEach(item2 => {
                if (!this.areaCheckedBackup.includes(item2.value)) {
                  this.areaCheckedBackup.push(item2.value)
                }
              })
            })
          } else {
            this.areaCheckedBackup = []
          }
        }
      },
      systemCheckedAll: {
        get() {
          let length = 0
          this.systemArrList.forEach(i => {
            length += i.options.length
          })

          if (this.systemCheckedBackup.length === length) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          if (val) {
            this.systemArrList.forEach(item => {
              item.options.forEach(item2 => {
                if (!this.systemCheckedBackup.includes(item2.value)) {
                  this.systemCheckedBackup.push(item2.value)
                }
              })
            })
          } else {
            this.systemCheckedBackup = []
          }
        }
      },
      serviceCheckedAll: {
        get() {
          if (this.serviceCheckedBackup.length === this.serviceOptionsLength) {
            return true
          } else {
            return false
          }
        },
        set(val) {
          // console.log(22222222222)
          if (val) {
            for (let system of Object.keys(this.serviceOptions)) {
              for (let item of this.serviceOptions[system]) {
                for (let item2 of item.serviceBasicList) {
                  if (!this.serviceCheckedBackup.includes(item2.selectValue)) {
                    this.serviceCheckedBackup.push(item2.selectValue)
                  }
                }
              }
            }
          } else {
            this.serviceCheckedBackup = []
          }
        }
      },
      // mawbAddServiceCheckedAll: {
      //   get () {
      //     let length = 0
      //     length = this.service.sfg.length + this.service.mdg.length

      //     if (this.mawbAddServiceBackup.length === length) {
      //       return true
      //     } else {
      //       return false
      //     }
      //   },
      //   set (val) {
      //     if (val) {
      //       this.service.sfg.forEach(item => {
      //         if (!this.mawbAddServiceBackup.includes(item.servicecode)) {
      //           this.mawbAddServiceBackup.push(item.servicecode)
      //         }

      //         this.service.mdg.forEach(item => {
      //           if (!this.mawbAddServiceBackup.includes(item.servicecode)) {
      //             this.mawbAddServiceBackup.push(item.servicecode)
      //           }
      //         })
      //       })
      //     } else {
      //       this.mawbAddServiceBackup = []
      //     }
      //   }
      // },
      mawbAddSystemBackup: {
        get() {
          let system = ''
          let mawbAddSystem = this.userSettingBackup.mawbAddSystem
          if (mawbAddSystem && mawbAddSystem.opersystem && mawbAddSystem.opersystemdom) {
            this.mawbAddSystemOptions.forEach(item => {
              if (item.label === mawbAddSystem.opersystem) {
                item.options.forEach(option => {
                  if (option.value === mawbAddSystem.opersystemdom) {
                    system = option.label
                  }
                })
              }
            })
            return system
          } else {
            return ''
          }
        },
        set(val) {
          let opersystem = '', opersystemdom = ''
          for (let item of this.mawbAddSystemOptions) {
            for (let option of item.options) {
              if (option.label === val) {
                opersystem = item.label
                opersystemdom = option.value
              }
            }
          }
          this.userSettingBackup.mawbAddSystem = { opersystem, opersystemdom }
        }
      }
    },
    watch: {
      userSettingVisible(val) {
        if (!val) return
        this.userSettingBackup = { ...this.$store.getters.userSetting }
        this.areaCheckedBackup = this.userSettingBackup.areaChecked ? this.userSettingBackup.areaChecked.split(',') : []
        this.systemCheckedBackup = this.userSettingBackup.systemChecked ? this.userSettingBackup.systemChecked.split(',') : []
        // this.mawbAddServiceBackup = this.userSettingBackup.mawbAddService ? this.userSettingBackup.mawbAddService.split(',') : []

        if (this.userSettingBackup.serviceChecked) {
          this.setServiceCheckedBackup(this.userSettingBackup.serviceChecked.split(','))
        }
      },
      serviceOptions: {
        deep: true,
        handler() {
          if (this.serviceOptionsArr.length === 0) return
          let valueArr = this.serviceOptionsArr.map(i => i.selectValue)
          // 去除选项里没有的数据
          for (let i = 0; i < this.serviceCheckedBackup.length; i++) {
            if (!valueArr.includes(this.serviceCheckedBackup[i])) {
              this.serviceCheckedBackup.splice(i, 1)
              i--
            }
          }

          this.setServiceChecked(this.serviceCheckedBackup)
        }
      }
    },
    methods: {
      isCorrectPwd(type){//验证密码
        if(!type){
          if (!/^(?=[a-zA-Z0-9]{0,}\d{1,})(?=[a-zA-Z0-9]{0,}[a-z]{1,})(?=[a-zA-Z0-9]{0,}[A-Z]{1,}).{8,16}$/g.test(this.forgetCodeInfo.pwd)) {
            this.forgetCodeInfo.pwd=''
            return this.$message.info('请输入8-16位包含数字和大小写英文的密码');
          }
        }else{
          if(this.forgetCodeInfo.pwd!=this.forgetCodeInfo.repwd){
            this.forgetCodeInfo.repwd=''
            return this.$message.info('两次密码不一致');
          }
        }
      },
      // 获取验证码
      getYanz() {
        this.$axios({ method: "get", url: this.$store.state.publicWebApi + 'api/PubMessageSms', params: { logname: this.forgetCodeInfo.logname } }).then(results => {
          if (results.data.resultstatus == 0) {
            this.$message.success('发送成功')
            this.countdown = 30
            var time = setInterval(() => {
              this.countdown--
              if (this.countdown == 0) {
                clearInterval(time)
              }
            }, 1000)

          } else {
            this.$message.error('发送失败')
          }
        })
      },
      messagePanel() { // 打开版本更新
        //this.messagePanelShow=true;
        this.resultUpdate = []
        this.resultUpdateOperation = []
        var that = this
        this.$axios({ method: 'get', url: this.$store.state.publicWebApi + 'api/PubUpdateNoticeLog', params: { logname:localStorage.usrname }, loading: false, tip: false, noarea: 1 })
          .then(results => {
            var num = 0
            results.data.forEach(item => {
              if (!item.isread && item.noticetype == 1) {
                num += 1
              }
              if (item.noticetype == 1) {
                that.resultUpdate.push(item)
              }
              if (item.noticetype == 10) {
                that.resultUpdateOperation.push(item)
              }
            })
            that.resultUpdate.sort(function (a, b) {
              return b['version'].localeCompare(a['version'], "zh");
            })
            that.resultUpdateOperation.sort(function (a, b) {
              return b['version'].localeCompare(a['version'], "zh");
            })
            that.$nextTick(() => {
              that.resultUpdate.forEach(item => {
                item.timestamp = that.timestamp(item.timestamp)
              })
              that.resultUpdateOperation.forEach(item => {
                item.timestamp = that.timestamp(item.timestamp)
              })
              that.resultUpdateBackup = JSON.parse(JSON.stringify(that.resultUpdate))
              that.resultUpdateOperationBackup = JSON.parse(JSON.stringify(that.resultUpdateOperation))
            })
            this.leftItemList.filter(i=>i.title=='更新日志')[0]['title']=`更新日志(${num})`
          })
          .catch(error => {
          })
      },
      timestamp(time) {
        // 时间戳转换
        var date = new Date(time * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
      },
      showUpdate(data,index){//打开更新日志弹框
        if(!data.isread){
          this.$axios({ method: 'post', url: this.$store.state.publicWebApi + 'api/PubUpdateNoticeSendLog', data: { logname: localStorage.usrname, system: 'bo', id:data.id }, loading: false, tip: false, noarea: 1 })
            .then(results => {
              this.messagePanel()
            })
            .catch(error => {
            })
        }
  
        this.iframeUrl=`${this.$store.state.publicWebApi}api/PubUpdateNoticeLog?contenturl=${data.contenturl}`
        this.versionActiveIndex=index
      },
      isClose(done){//是否关闭弹框
        if(this.iframeUrl){
          this.iframeUrl=''
          this.versionActiveIndex='-1'
          return
        }else{
          done()
        }
      },
      sortTime(type){//时间升降序
       if(type===3){
         this.isDes3=!this.isDes3;
         this.resultUpdate.sort((a,b)=>{
           if(this.isDes3){
             return b.timestamp<a.timestamp?-1:1
           }else{
             return b.timestamp<a.timestamp?1:-1
           }  
         })
       }else{
         this.isDes4=!this.isDes4;
         this.resultUpdateOperation.sort((a,b)=>{
           if(this.isDes4){
             return b.timestamp<a.timestamp?-1:1
           }else{
             return b.timestamp<a.timestamp?1:-1
           }  
         })
       }
      },
      getServiceType(item) {
        return [...new Set(item.map(i => i.servicetype))]
      },
      areaSelectVisibleChange(val) {
        if (!val && this.changeAreaChecked) {
          this.userSettingBackup.areaChecked = this.areaCheckedBackup.join(',')
          this.changeAreaChecked = false
        }

        this.areaCheckedBackup = this.userSettingBackup.areaChecked ? this.userSettingBackup.areaChecked.split(',') : []
      },
      systemSelectVisibleChange(val) {
        if (!val && this.changeSystemChecked) {
          this.userSettingBackup.systemChecked = this.systemCheckedBackup.join(',')
          this.changeSystemChecked = false
        }

        this.systemCheckedBackup = this.userSettingBackup.systemChecked ? this.userSettingBackup.systemChecked.split(',') : []
      },
      serviceSelectVisibleChange(val) {
        if (!val && this.changeServiceChecked) {
          this.setServiceChecked(this.serviceCheckedBackup)
          this.changeServiceChecked = false
        }

        this.setServiceCheckedBackup(this.userSettingBackup.serviceChecked.split(','))


        this.activeServiceTab = Object.keys(this.serviceOptions)[0]
      },
      setServiceChecked(serviceCheckedBackup) {
        let serviceArr = serviceCheckedBackup.map(i => i.split('|'))
        let tempService = {}
        serviceArr.forEach(i => {
          if (!tempService[i[1]]) tempService[i[1]] = ''
          tempService[i[1]] += i[0] + '|'
        })

        let serviceCheckedArr = [], serviceCheckedSystemArr = []
        for (let servicecode of Object.keys(tempService)) {
          serviceCheckedArr.push(servicecode)
          serviceCheckedSystemArr.push(tempService[servicecode].slice(0, -1))
        }
        this.userSettingBackup.serviceChecked = serviceCheckedArr.join(',')
        this.userSettingBackup.serviceCheckedSystem = serviceCheckedSystemArr.join(',')
      },
      setServiceCheckedBackup(serviceChecked) {
        // 服务选项里需要区分系统，不同系统里存在相同的servicecode，为了区分系统，使用 "系统|服务代码" 当临时数据
        let system = this.userSettingBackup.serviceCheckedSystem ? this.userSettingBackup.serviceCheckedSystem.split(',') : []
        let serviceArr = []
        serviceChecked.forEach((servicecode, index) => {
          if (system[index]) {
            system[index].split('|').forEach(item => {
              serviceArr.push(item + '|' + servicecode)
            })
          } else {
            for (let item of this.serviceOptionsArr) {
              if (item.servicecode === servicecode) {
                serviceArr.push(item.system + '|' + servicecode)
                break
              }
            }
          }
        })
        //    console.log(1111111111)
        // console.log(serviceArr)
        this.serviceCheckedBackup = serviceArr
      },
      // mawbAddServiceVisibleChange (val) {
      //   if (!val && this.changeMawbAddService) {
      //     this.userSettingBackup.mawbAddService = this.mawbAddServiceBackup.join(',')
      //     this.changeMawbAddService = false
      //   }

      //   this.mawbAddServiceBackup = this.userSettingBackup.mawbAddService ? this.userSettingBackup.mawbAddService.split(',') : []
      // },
      updateUserSetting() {
        // console.log(JSON.parse(JSON.stringify(this.userSettingBackup)))
        // return
        if(this.leftActive==0||this.leftActive==1){
           this.$store.dispatch('updateUserSetting', this.userSettingBackup)
          .then(({ data }) => {
            if (data.resultstatus === 0) {
              this.userSettingVisible = false
              this.$emit('success', this.userSettingBackup.showSystemCount)
            }
          })
        }else{
          if(!this.forgetCodeInfo.pwd||!this.forgetCodeInfo.repwd){
            return this.$message.info('请输入您的密码')
          }
          if(!this.forgetCodeInfo.smscode){
            return this.$message.info('请输入您的验证码')
          }
          var data = { ...this.forgetCodeInfo, czman: this.forgetCodeInfo.logname }
          this.$axios({ method: "put", url: this.$store.state.publicWebApi + 'api/UserPwd', data: data, noarea: true }).then(results => {
            if (results.data.resultstatus == 0) {
              this.$message.success(results.data.resultmessage)
              this.forgetCodeInfo = { logname: '', pwd: '', smscode: '' ,repwd:''}
            } else {
              this.$message.error(results.data.resultmessage)
            }
          })
        }
      }
    },
    mounted(){
     this.messagePanel()
    }
  }
</script>

<style lang="less" scoped>
  /deep/.user-setting-dialog {
    border-radius:8px;
    .rightListContent {
      margin-top: -32px;
      padding: 10px;
      p {
        font-size: 18px;
        font-weight: bold;
        color: #0E5A8C
      }
    }
    .el-dialog__header{
      padding:40px;
      text-align:left;
      padding-bottom:23px;
      .el-dialog__title{
        font-size:18px;
        font-weight:bold;
      }
    }
     .el-dialog__body{
       padding:40px;
       padding-bottom:40px;
       padding-top:0px;
     }
    ul li{
      list-style: none;
      margin-bottom:8px;
      line-height: 40px;
      padding-left: 16px;
      cursor:pointer;
      i{
        font-size:16px;
        margin-right:8px;
      }
    }
    .normalLeft{
      width: 160px;
      height: 40px;
      background: #F8F8F8;
      border-radius: 4px;
      color:rgba(58, 60, 66, 0.5);
    }
    .activeLeft{
      width: 160px;
      height: 40px;
      background: #0E5B8C;
      border-radius: 4px;
      color:#fff
    }

    .setting-c {
      padding: 10px 0px;

      .setting-group {
        margin-bottom: 30px;

        .setting-title {
          margin-top: 30px;

          &:first-child {
            margin-top: 0;
          }
        }

        .setting-item {
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 56px;
          border-bottom: 1px solid #e8e8e8;

          .setting-info {
            .item-text {
              font-size: 14px;
            }
          }

          .item-status {
              color: #c8c8c8;
              margin-right:12px;
              &.active {
                color: #14AE00;
              }
            }

          .el-switch {
            margin-top: 10px;
          }
        }
        .settingHover{
          &:hover{
            cursor: pointer;
            color:#0E5B8C;
          }
        }
      }

      .footer {
        overflow: hidden;
        .btn-c {
          float: right;

          .el-button {
            padding: 8px 20px;
          }
        }
      }
    }
    .setTableHead{
      height:35px;
      border-bottom:1px solid #e8e8e8; 
      .headTitle{
        color:#3A3C42;
        i{
          color:#0E5B8C;
          font-weight:bold;
        }
        &:nth-child(2){
          cursor:pointer;
        }
      }
    }
  }

  .portItemDiv {
    display: flex;
    padding-left: 114px;
    transform: translateY(-30px);

    >div {
      display: flex;
      flex-direction: column;
    }

    li.el-select-dropdown__item {
      padding: 0px
    }
  }
</style>

<style lang="less">
  .userSettingAreaSelect {

    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          width: 165px !important;

          &:after {
            right: 35px !important;
          }
        }
      }
    }
  }

  .userSettingSystemSelect {
    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          width: 165px !important;

          &:after {
            right: 20px !important;
          }
        }
      }
    }
  }

  .userSettingServiceSelect {
    .el-select-dropdown__wrap {
      max-height: none;
    }

    .el-select-dropdown__list {
      position: relative;
      padding: 10px 40px;

      .el-icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #ccc;
        cursor: pointer;
      }

      .title {
        overflow: hidden;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 20px 0;
        margin-bottom: 10px;

        .title-left {
          float: left;

          h3 {
            font-size: 20px;
            color: #004f82;
          }
        }

        .title-right {
          float: right;
          padding-top: 6px;

          p {
            display: inline;
            font-size: 14px;
            margin-left: 15px;
            font-weight: bold;
            cursor: pointer;
            color: #ccc;

            &.confirm {
              color: #004f82;
            }

            &.active {
              color: #004f82;
            }
          }
        }
      }
    }

    table {
      tr {
        border-bottom: 10px solid transparent;
      }

      td {
        vertical-align: top;

        .el-select-dropdown__item {
          padding: 0;

          &:after {
            right: 20px !important;
          }
        }
      }
    }
  }
</style>