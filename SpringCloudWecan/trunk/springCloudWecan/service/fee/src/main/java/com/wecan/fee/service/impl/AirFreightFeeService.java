/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/18 13:51
 */
package com.wecan.fee.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wecan.commonutils.commonClass.exception.BusinessException;
import com.wecan.commonutils.commonClass.mybatis.GetQueryWrapper;
import com.wecan.commonutils.commonClass.util.LambdaUtil;
import com.wecan.daofee.mapper.ViewFixedFreightFeeMapper;
import com.wecan.daofee.mapper.ViewFreightFeeMapper;
import com.wecan.daofee.mapper.ViewFreightRoutingMapper;
import com.wecan.daofee.service.impl.*;
import com.wecan.fee.cache.CustomerCache;
import com.wecan.fee.model.dto.MycMscDto;
import com.wecan.fee.rabbitmq.Sender;
import com.wecan.fee.service.IAirFreightFee;
import com.wecan.modeldbo.SnowflakeIdWorker;
import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.modeldbo.airfreight.fee.enums.ApprovalStatusEnum;
import com.wecan.modelview.model.mapper.fee.*;
import com.wecan.modelview.model.vo.customer.output.OutputFidCache;
import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.modelview.model.vo.fee.input.InputApprovalRecord;
import com.wecan.modelview.model.vo.fee.input.InputCodeDiff;
import com.wecan.modelview.model.vo.fee.input.InputDelFee;
import com.wecan.modelview.model.vo.fee.output.OutputCodeDiff;
import com.wecan.modelview.model.vo.fee.output.OutputFreightFeeList;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import com.wecan.modelview.model.vo.fee.view.ViewFixedFreightFee;
import com.wecan.modelview.model.vo.fee.view.ViewFreightFee;
import com.wecan.modelview.model.vo.fee.view.ViewFreightRouting;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Primary
public class AirFreightFeeService implements IAirFreightFee {
    public final static String packageTypeDiff = "packateTypeDiff";

    public final static String cusDiff = "cusDiff";

    public final static String weightDiff = "weightDiff";

    public final static String volDiff = "volDiff";

    @Autowired
    FreightFeeServiceImpl feeDao;

    @Autowired
    FreightFeePendingServiceImpl feePendingDao;

    @Autowired
    FeeAircompanyServiceImpl airCompanyDao;

    @Autowired
    FeeCuslevelServiceImpl cuslevelDao;

    @Autowired
    FeePackageTypeServiceImpl packageTypeDao;

    @Autowired
    FeeVolServiceImpl volDao;

    @Autowired
    FeeWeightServiceImpl weightDao;

    @Autowired
    ViewFreightFeeMapper viewFreightFeeDao;

    @Autowired
    ViewFreightRoutingMapper routingDao;

    @Autowired
    FixedFreightFeeSerivceImpl fixedFeeDao;

    @Autowired
    ViewFixedFreightFeeMapper viewFixedFeeDao;

    @Autowired
    FeeAirFlightServiceImpl flightDao;

    @Autowired
    TruckFeeWeightServiceImpl truckWeightDao;

    @Autowired
    Sender mqSender;

    @Autowired
    FeeApprovalRecordServiceImpl approvalDao;

    @Autowired
    CustomerCache cusCache;

    @Autowired
    EmailNotifyServiceImpl emailNotifyDao;


    /**
     * 新增或者编辑费用时将进入审批阶段
     * @param data
     */
    @Override
    @Transactional
    public void saveFee(InputAirFreightFee data) {
        checkDuplicateTimespan(data, 0L, data.getGid() > 0 ? data.getGid() : 0);
        // 费用主表
        FreightFeePending fee = InputAirFreightFeeMapper.INSTANCES.toFreightFeePending(data);

        fee.setApprovalStatus(ApprovalStatusEnum.PendingApproval.getCode());
        //航司参数
        List<FeeAircompany> feeAircompanyList = InputCodeDiffMapper.INSTANCES.toFeeAircompany(data.getAircomArr(), fee.getGuid());
        // 客户等级
        List<FeeCuslevel> feeCuslevelList = InputCodeDiffMapper.INSTANCES.toFeeCuslevel(data.getCusLevelArr(), fee.getGuid());
        //包装类型
        List<FeePackageType> feePackageTypeList = InputCodeDiffMapper.INSTANCES.toPackageType(data.getPackageTypeArr(), fee.getGuid());
        //体积
        List<FeeVolRatio> feeVolList = InputCodeDiffMapper.INSTANCES.toVol(data.getVolRatioArr(), fee.getGuid());
        //重量
        List<FeeWeight> feeWeightList = InputCodeDiffMapper.INSTANCES.toWeight(data.getWeightArr(), fee.getGuid());

        List<FixedFreightFee>fixedFeeList= InputFixedFreightFeeMapper.INSTANCES.toFixedPrice(data.getFixedPriceArr(),fee.getGuid());

        List<FeeAirFlight>flightList=InputFeeAirFlightMapper.INSTANCES.toFlight(data.getFlightArr(),fee.getGuid());

        feePendingDao.save(fee);
        airCompanyDao.saveBatch(feeAircompanyList);
        cuslevelDao.saveBatch(feeCuslevelList);
        packageTypeDao.saveBatch(feePackageTypeList);
        volDao.saveBatch(feeVolList);
        weightDao.saveBatch(feeWeightList);
        fixedFeeDao.saveBatch(fixedFeeList);
        if(data.getIsSpecifiedFlight()) {
            flightDao.saveBatch(flightList);
        }

//        mqSender.sendMsg(makeUpdateMscMsg(fee.getGuid(),data.getArea(),data.getThreeCodeStr(),data.getSfg(),data.getMdg()));

    }

    @Override
    @Transactional
    public void editFee(InputAirFreightFee data) {
        canEdit(data.getFeeid());
        checkDuplicateTimespan(data, data.getFeeid(), data.getGid() > 0 ? data.getGid() : 0);
        // 费用主表
        FreightFeePending fee = InputAirFreightFeeMapper.INSTANCES.toFreightFeePending(data);
        fee.setGuid(data.getFeeid());
        fee.setApprovalStatus(ApprovalStatusEnum.PendingApproval.getCode());
        delRelatedData(data.getFeeid());
        //航司参数
        List<FeeAircompany> feeAircompanyList = InputCodeDiffMapper.INSTANCES.toFeeAircompany(data.getAircomArr(), fee.getGuid());
        // 客户等级
        List<FeeCuslevel> feeCuslevelList = InputCodeDiffMapper.INSTANCES.toFeeCuslevel(data.getCusLevelArr(), fee.getGuid());
        //包装类型
        List<FeePackageType> feePackageTypeList = InputCodeDiffMapper.INSTANCES.toPackageType(data.getPackageTypeArr(), fee.getGuid());
        //体积
        List<FeeVolRatio> feeVolList = InputCodeDiffMapper.INSTANCES.toVol(data.getVolRatioArr(), fee.getGuid());
        //重量
        List<FeeWeight> feeWeightList = InputCodeDiffMapper.INSTANCES.toWeight(data.getWeightArr(), fee.getGuid());

        List<FixedFreightFee>fixedFeeList= InputFixedFreightFeeMapper.INSTANCES.toFixedPrice(data.getFixedPriceArr(),fee.getGuid());
        List<FeeAirFlight>flightList=InputFeeAirFlightMapper.INSTANCES.toFlight(data.getFlightArr(),fee.getGuid());
        feePendingDao.updateById(fee);
        airCompanyDao.saveBatch(feeAircompanyList);
        cuslevelDao.saveBatch(feeCuslevelList);
        packageTypeDao.saveBatch(feePackageTypeList);
        volDao.saveBatch(feeVolList);
        weightDao.saveBatch(feeWeightList);
        fixedFeeDao.saveBatch(fixedFeeList);
        if(data.getIsSpecifiedFlight()) {
            flightDao.saveBatch(flightList);
        }
        //发送消息
//        mqSender.sendMsg(makeUpdateMscMsg(fee.getGuid(),data.getArea(),data.getThreeCodeStr(),data.getSfg(),data.getMdg()));

    }

    private void delRelatedData(Long feeid){
        LambdaQueryWrapper<FeeAircompany> delAircomQuery = new LambdaQueryWrapper<FeeAircompany>()
                .eq(FeeAircompany::getFeeid, feeid);
        airCompanyDao.remove(delAircomQuery);

        LambdaQueryWrapper<FeeCuslevel> delCusQuery = new LambdaQueryWrapper<FeeCuslevel>()
                .eq(FeeCuslevel::getFeeid, feeid);
        cuslevelDao.remove(delCusQuery);

        LambdaQueryWrapper<FeePackageType> delPackageQuery = new LambdaQueryWrapper<FeePackageType>()
                .eq(FeePackageType::getFeeid, feeid);
        packageTypeDao.remove(delPackageQuery);

        LambdaQueryWrapper<FeeVolRatio> delVolQuery = new LambdaQueryWrapper<FeeVolRatio>()
                .eq(FeeVolRatio::getFeeid, feeid);
        volDao.remove(delVolQuery);

        LambdaQueryWrapper<FeeWeight> delWeightQuery = new LambdaQueryWrapper<FeeWeight>()
                .eq(FeeWeight::getFeeid, feeid);
        weightDao.remove(delWeightQuery);

        LambdaQueryWrapper<FixedFreightFee> delFiexedFeeQuery = new LambdaQueryWrapper<FixedFreightFee>()
                .eq(FixedFreightFee::getFeeid, feeid);
        fixedFeeDao.remove(delFiexedFeeQuery);

        LambdaQueryWrapper<FeeAirFlight> delFlightQuery = new LambdaQueryWrapper<FeeAirFlight>()
                .eq(FeeAirFlight::getFeeid, feeid);
        flightDao.remove(delFlightQuery);
    }

    private void canEdit(Long feeid){
        var pendingFee=feePendingDao.getById(feeid);
        if(pendingFee.getApprovalStatus().equals(ApprovalStatusEnum.PendingApproval.getCode())){
            throw new BusinessException("经理审批中请勿再次修改");
        }

    }



    @Override
    @Transactional
    public void deleteFee(Long feeid) {
        feeDao.removeById(feeid);
    }

    @Override
    @Transactional
    public void deleteFee(String json) {
        var wrap = GetQueryWrapper.getQueryWrapperByJsonStr(json, InputDelFee.class);
        feeDao.remove(wrap);
    }

    @Override
    public List<OutputFreightFeeList> getList(String json) {
        var list = getListByjson(json);
        return list;
    }

    @Override
    public List<OutputFreightFeeList> getList(String json, String pageType) {

        var list = getListByjson(json);
        return list;

    }

    /**
     * 维护页面查询功能
     * @param json
     * @return
     */
    private List<OutputFreightFeeList> getListByjson(String json) {
        List<OutputFreightFeeList> result = new ArrayList<>();
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, ViewFreightFee.class);
        var order = new QueryWrapper<ViewFreightFee>().orderByAsc("feeid");
        //新增了经理审批功能 审批前数据将转移到 FreightFeePending表
        List<ViewFreightFee> list = viewFreightFeeDao.getDefaultFreightFee(query);//
        // 根据费用id分组
        list.stream().collect(
                Collectors.groupingBy(t -> getFeeMaintainKey(t))
        ).forEach(
                (key, feeList) ->
                {
                    OutputFreightFeeList p = new OutputFreightFeeList();
                    ViewFreightFee fee = feeList.get(0);
                    var feeid=fee.getFeeid();
                    p.setMdg(fee.getMdg());
                    p.setSfg(fee.getSfg());
                    p.setZzg(fee.getZzg());
                    p.setFeeid(feeid);
                    p.setEnddate(fee.getEnddate());
                    p.setStartdate(fee.getStartdate());
                    p.setCusLevel(fee.getCusLevel());
                    p.setEnddate(fee.getEnddate());
                    p.setWeight(fee.getWeight());
                    p.setVolRatio(fee.getVolRatio());
                    p.setPackageType(fee.getPackageType());
                    p.setStandardPrice(getRealPrice(fee));
                    p.setArea(fee.getArea());
                    p.setAddman(fee.getAddman());
                    p.setAddtime(fee.getAddtime());
                    p.setGid(fee.getGid());
                    p.setJfType(fee.getJfType());
                    p.setRemark(fee.getRemark());
                    p.setRealgid(fee.getGid());
                    p.setTwocode(fee.getTwocode());
                    p.setHbh(fee.getHbh());
                    p.setEnddate(fee.getEnddate());
                    p.setApprovalStatus(fee.getApprovalStatus());
                    result.add(p);
                }
        );
//        result.addAll(getFixedPrice(json));
        return result;
    }

    private List<OutputFreightFeeList> getFixedPrice(String json){
        List<OutputFreightFeeList> result = new ArrayList<>();
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, ViewFixedFreightFee.class);

        List<ViewFixedFreightFee> list = viewFixedFeeDao.getFeeList(query);
        list.stream().collect(
                Collectors.groupingBy(t -> getFeeMaintainKey(t))
        ).forEach(
                (key, feeList) ->
                {
                    OutputFreightFeeList p = new OutputFreightFeeList();
                    ViewFixedFreightFee fee = feeList.get(0);
                    var feeid=fee.getFeeid();
                    p.setMdg(fee.getMdg());
                    p.setSfg(fee.getSfg());
                    p.setZzg(fee.getZzg());
                    p.setFeeid(feeid);
                    p.setEnddate(fee.getEnddate());
                    p.setStartdate(fee.getStartdate());
                    p.setCusLevel(fee.getCus());
                    p.setEnddate(fee.getEnddate());
                    p.setWeight(fee.getWeight());
                    p.setVolRatio(fee.getVol());
                    p.setPackageType(fee.getPackageType());
                    p.setStandardPrice(null);
                    p.setArea(fee.getArea());
                    p.setAddman(fee.getAddman());
                    p.setGid(fee.getGid());
                    p.setJfType(fee.getJfType());
                    p.setRemark(fee.getRemark());
                    p.setRealgid(fee.getGid());
                    p.setTwocode(fee.getTwocode());
                    p.setHbh(fee.getHbh());
                    p.setEnddate(fee.getEnddate());
                    p.setFixedDiff(fee.getDiff());
                    result.add(p);
                });
        return result;

    }


    /**
     * 获取费用详情
     * @param json 包含sfg mdg zzg
     * @return 用hashmap返回一个大对象 第一个Long是费用id
     */
    @Override
    public HashMap<Long, HashMap<String, Object>> getDetail(String json) {
        HashMap<Long, HashMap<String, Object>> result = new HashMap<>();
        String basicInfo = "basicInfo";
        String twocodeArr = "twocodeArr";
        String hbhArr="hbhArr";
        String packageTypeArr = "packageTypeArr";
        String weightArr = "weightArr";
        String volArr = "volArr";
        String cusArr = "cusArr";
        String fixedPrice="fixedPrice";
        String approvalArr="approvalArr";//审批数组

        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, FreightFeePending.class);
        List<FreightFeePending> list = feePendingDao.list(query);
        if (list.stream().count() == 0) {
            return result;
        }
        List<Long> feeidList = list.stream().map(f -> f.getGuid()).collect(Collectors.toList());

        // 查询航司信息
        var aircomWrapper = new LambdaQueryWrapper<FeeAircompany>().
                in(FeeAircompany::getFeeid, feeidList);
        List<FeeAircompany> aircomList = airCompanyDao.list(aircomWrapper);

        // 查询航班号
        var flightWrapper = new LambdaQueryWrapper<FeeAirFlight>().
                in(FeeAirFlight::getFeeid, feeidList);
        List<FeeAirFlight> flightList = flightDao.list(flightWrapper);


        //查询packageType
        var packageTypeWrapper = new LambdaQueryWrapper<FeePackageType>().
                in(FeePackageType::getFeeid, feeidList);
        List<FeePackageType> packageTypeList = packageTypeDao.list(packageTypeWrapper);

        // 查询weight
        var weightWrapper = new LambdaQueryWrapper<FeeWeight>()
                .in(FeeWeight::getFeeid, feeidList);
        List<FeeWeight> weightList = weightDao.list(weightWrapper);

        // 查询volratio
        var volWrapper = new LambdaQueryWrapper<FeeVolRatio>()
                .in(FeeVolRatio::getFeeid, feeidList);
        List<FeeVolRatio> volList = volDao.list(volWrapper);

        // 查询cus
        var cusWrapper = new LambdaQueryWrapper<FeeCuslevel>()
                .in(FeeCuslevel::getFeeid, feeidList);
        List<FeeCuslevel> cusList = cuslevelDao.list(cusWrapper);

        // 查询一口价
        var fixedWrapper = new LambdaQueryWrapper<FixedFreightFee>()
                .in(FixedFreightFee::getFeeid, feeidList);
        List<FixedFreightFee> fixedList = fixedFeeDao.list(fixedWrapper);

        var approvalWrapper=new LambdaQueryWrapper<FeeApprovalRecord>().in(FeeApprovalRecord::getFeeid,feeidList);
        List<FeeApprovalRecord>approvalList=approvalDao.list(approvalWrapper);


        list.forEach(p -> {
            HashMap<String, Object> data = new HashMap<>();
            data.put(basicInfo, p);
            result.put(p.getGuid(), data);
        });
        aircomList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(twocodeArr)) {
                List<FeeAircompany> d = new ArrayList<>();
                d.add(p);
                matchData.put(twocodeArr, d);
            } else {
                List<FeeAircompany> d = (List<FeeAircompany>) matchData.get(twocodeArr);
                d.add(p);
            }
        });

        flightList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(hbhArr)) {
                List<FeeAirFlight> d = new ArrayList<>();
                d.add(p);
                matchData.put(hbhArr, d);
            } else {
                List<FeeAirFlight> d = (List<FeeAirFlight>) matchData.get(hbhArr);
                d.add(p);
            }
        });

        packageTypeList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(packageTypeArr)) {
                List<FeePackageType> d = new ArrayList<>();
                d.add(p);
                matchData.put(packageTypeArr, d);
            } else {
                List<FeePackageType> d = (List<FeePackageType>) matchData.get(packageTypeArr);
                d.add(p);
            }
        });

        weightList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(weightArr)) {
                List<FeeWeight> d = new ArrayList<>();
                d.add(p);
                matchData.put(weightArr, d);
            } else {
                List<FeeWeight> d = (List<FeeWeight>) matchData.get(weightArr);
                d.add(p);
            }
        });

        volList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(volArr)) {
                List<FeeVolRatio> d = new ArrayList<>();
                d.add(p);
                matchData.put(volArr, d);
            } else {
                List<FeeVolRatio> d = (List<FeeVolRatio>) matchData.get(volArr);
                d.add(p);
            }
        });

        cusList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(cusArr)) {
                List<FeeCuslevel> d = new ArrayList<>();
                d.add(p);
                matchData.put(cusArr, d);
            } else {
                List<FeeCuslevel> d = (List<FeeCuslevel>) matchData.get(cusArr);
                d.add(p);
            }
        });

        fixedList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(fixedPrice)) {
                List<FixedFreightFee> d = new ArrayList<>();
                d.add(p);
                matchData.put(fixedPrice, d);
            } else {
                List<FixedFreightFee> d = (List<FixedFreightFee>) matchData.get(fixedPrice);
                d.add(p);
            }
        });
        //审批记录
        approvalList.forEach(p -> {
            HashMap<String, Object> matchData = result.get(p.getFeeid());
            if (!matchData.containsKey(approvalArr)) {
                List<FeeApprovalRecord> d = new ArrayList<>();
                d.add(p);
                matchData.put(approvalArr, d);
            } else {
                List<FeeApprovalRecord> d = (List<FeeApprovalRecord>) matchData.get(approvalArr);
                d.add(p);
            }
        });
        return result;

    }

    @Override
    /**
     *
     *
     * @description: 获取最后一条直达费用如果没有则异常 前端处理error 把随直达价切为标准价格
     * @param json
     * @return: com.wecan.modelview.model.vo.fee.output.OutputFreightFeeList
     * @author: yaodui

     */
    public FreightFee getDirectFee(String json) {
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, FreightFee.class);
        List<FreightFee> list = feeDao.list(query);
        if (list.stream().count() == 0) throw new BusinessException("不存在直达价,将切换为标准价格");
        List<FreightFee> sortedList = list.stream().sorted(Comparator.comparing(d -> d.getEnddate(), Comparator.reverseOrder())).collect(Collectors.toList());

        return sortedList.get(0);
    }


    /**
     * @param fee
     * @description: 通过标注价格和diff计算真实价格
     * @return: java.math.BigDecimal
     * @author: yaodui
     */
    private BigDecimal getRealPrice(ViewFreightFee fee) {
        var zero=new BigDecimal(0);
        BigDecimal cusDiff=fee.getCusDiff()==null?zero:fee.getCusDiff();
        BigDecimal packageDiff=fee.getPackageTypeDiff()==null?zero:fee.getPackageTypeDiff();
        BigDecimal volDiff=fee.getVolRatioDiff()==null?zero:fee.getVolRatioDiff();
        BigDecimal weightDiff=fee.getWeightDiff()==null?zero:fee.getWeightDiff();
        return cusDiff.add(packageDiff.add(volDiff.add(weightDiff)));

    }

    private List<OutputFreightFeeList> distinctByRoute(List<OutputFreightFeeList> list, Function<OutputFreightFeeList, String> func) {
        List<OutputFreightFeeList> result = new ArrayList<>();
        list.stream().collect(Collectors.groupingBy(g -> func.apply(g))).forEach(
                (key, val) -> {
                    // 每个分组取时间最大的数据 首页只展示同sfg zzg mdg 最新的那条数据
                    OutputFreightFeeList topItem = val.stream().sorted(Comparator.comparing(d -> d.getEnddate(), Comparator.reverseOrder())).max(Comparator.comparing(m -> m.getEnddate())).get();
                    result.add(topItem);
                }
        );
        var s = result.stream().sorted(Comparator.comparing(d -> getOrderByKey(d))).collect(Collectors.toList());
        return s;
    }

    /**
     * 返回同路线分组的key sfg+zzg+mdg 只取最晚时间的数据
     **/
    private String getDistinctAirfreightFeeKey(OutputFreightFeeList fee) {
        return fee.getSfg() + fee.getZzg() + fee.getMdg() + fee.getTwocode();
    }

    /**
     * 客户运费分组条件
     */
    private String getDistinctCustomerFeeKey(OutputFreightFeeList fee) {
        return fee.getSfg() + fee.getZzg() + fee.getMdg() + fee.getTwocode() + fee.getGid();
    }

    /**
     * 运价维护展示页分组逻辑
     */
    private String getFeeMaintainKey(ViewFreightFee fee) {
        return fee.getFeeid().toString();
    }

    /**
     * 运价维护展示页分组逻辑
     */
    private String getFeeMaintainKey(ViewFixedFreightFee fee) {
        return fee.getFeeid().toString()+fee.getVol()+fee.getWeight()+fee.getCus()+fee.getPackageType();
    }
    /**
     * 返回同路线分组的key sfg+zzg+mdg
     **/
    private String getOrderByKey(OutputFreightFeeList fee) {
        return fee.getSfg() + fee.getZzg() + fee.getMdg();
    }

    /**
     * 判断当前sfg mdg zzg 航司有无重复有效期区间
     */
    @Transactional
    public void checkDuplicateTimespan(InputAirFreightFee data) {
        checkDuplicateTimespan(data, 0L, 0);
    }

    @Transactional
    public void checkDuplicateTimespan(InputAirFreightFee data, Long editFeeid, Integer gid) {
        LambdaQueryWrapper<FreightFeePending> feeQuery = new LambdaQueryWrapper<FreightFeePending>()
                .eq(FreightFeePending::getSfg, data.getSfg())
                .eq(FreightFeePending::getMdg, data.getMdg())
                .eq(FreightFeePending::getZzg, data.getZzg())
                .and(a ->
                        a.ge(FreightFeePending::getEnddate, data.getStartdate())

                                .le(FreightFeePending::getStartdate, data.getEnddate())
                );
        if (editFeeid != 0) {
            feeQuery.ne(FreightFeePending::getGuid, editFeeid);
        }

            feeQuery.eq(FreightFeePending::getGid, gid);

        // 所有关联费用
        List<FreightFeePending> feeList = feePendingDao.list(feeQuery);
        if (feeList.stream().count() == 0) return;
        List<Long> feeidList = feeList.stream().map(m -> m.getGuid()).collect(Collectors.toList());
        // 关联航司二字码
        List<String> twocodeList = data.getAircomArr().stream().map(m -> m.getTwocode()).collect(Collectors.toList());


        var airComQuery = new LambdaQueryWrapper<FeeAircompany>()
                .in(FeeAircompany::getFeeid, feeidList)
                .in(FeeAircompany::getTwocode, twocodeList);
        List<FeeAircompany> aircomList = airCompanyDao.list(airComQuery);
        // 匹配的航司费用id 对这些费用进行筛选查找有无重复时间
        Map<Long, Long> feeidMap = aircomList.stream().map(m -> m.getFeeid()).distinct().collect(Collectors.toMap(m -> m, m -> m));

        //按开始时间排序的关联航司的费用数据 不允许新增有重复区间的数据
        List<FreightFeePending> sortFeeList = feeList.stream().filter(f -> feeidMap.containsKey(f.getGuid()))
                .sorted(Comparator.comparing(c -> c.getStartdate()))
                .collect(Collectors.toList());

        for (FreightFeePending item : sortFeeList) {
            // 起始时间大于当前费用结束时间 符合条件
            if (data.getStartdate().isAfter(item.getEnddate())) continue;
            // 结束时间小于当前费用起始时间符合 因为排过序后续费用统统过滤
            if (data.getEnddate().isBefore(item.getStartdate())) break;
            else throw new BusinessException("输入时间期限与现存数据有重复区间");
        }

    }

    /**
     * 判断当前sfg mdg zzg gid 航司 无重复有效期区间
     *
     * @param data
     * @param gid
     */
    @Transactional
    public void checkDuplicateTimespan(InputAirFreightFee data, Integer gid) {
        checkDuplicateTimespan(data, 0L, gid);
    }

    @Override
    public List<OutputFreightRouting> getRouting(String json) {
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, ViewFreightRouting.class);
        query.orderByAsc("startDate");
        var list = routingDao.getRoutingList(query);
        if(list.stream().count()==0)return new ArrayList<>();
        List<OutputFreightRouting> result = ViewFreightRoutingObjectMapper.INSTANCES.toList(list);
        getRoutingData(result);
        return result;
    }

    protected   void getRoutingData(List<OutputFreightRouting> result) {
        //航线费用id list
        List<Long> feeidList = result.stream().map(t -> t.getFeeid()).collect(Collectors.toList());
        //卡车匹配航线的费用id list
        List<Long> truckFeeidList=result.stream().map(t -> t.getTruckFeeid()).collect(Collectors.toList());
        List<OutputCodeDiff> packageDiffList = getCodeArr(packageTypeDiff, feeidList);
        List<OutputCodeDiff> cusDiffList = getCodeArr(cusDiff, feeidList);
        List<OutputCodeDiff> weightDiffList = getCodeArr(weightDiff, feeidList);
        List<OutputCodeDiff> volDiffList = getCodeArr(volDiff, feeidList);
        List<FixedFreightFee>fixedList=getFixedFee(feeidList);
        List<FeeAirFlight>flightList=getFlight(feeidList);
        List<TruckFeeWeight> truckWeightList=getTruckWeightFee(truckFeeidList);
        result.forEach(item -> {
            List<OutputCodeDiff>matchPackageList=packageDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList());
            var packageMap= matchPackageList.stream().collect(Collectors.toMap(InputCodeDiff::getCode,InputCodeDiff::getDiff));
            item.getPackageCusDiffMap().putAll(packageMap);
            List<OutputCodeDiff> matchCusList= cusDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList());
            var cusMap= matchCusList.stream().collect(Collectors.toMap(InputCodeDiff::getCode,InputCodeDiff::getDiff));
            item.getPackageCusDiffMap().putAll(cusMap);
            item.setWeightArr(weightDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
            item.setVolArr(volDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
            item.setCusArr(cusDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
            item.setPackageTypeArr(packageDiffList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
            item.setFixedFeeList(fixedList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
            item.setTruckFeeWeightList(truckWeightList.stream().filter(f->f.getFeeid().equals(item.getTruckFeeid())).collect(Collectors.toList()));
            item.setFlightList(flightList.stream().filter(f -> f.getFeeid().equals(item.getFeeid())).collect(Collectors.toList()));
        });
    }

    //获取参数diff值
    private List<OutputCodeDiff> getCodeArr(String diffType, List<Long> feeidList) {

        switch (diffType) {
            case packageTypeDiff:
                var packageQuery = new LambdaQueryWrapper<FeePackageType>().in(FeePackageType::getFeeid, feeidList);
                var packageList = packageTypeDao.list(packageQuery);
                return OutputCodeDiffMapper.INSTANCES.toCodeDiffPackageList(packageList);

            case cusDiff:
                var cusQuery = new LambdaQueryWrapper<FeeCuslevel>().in(FeeCuslevel::getFeeid, feeidList);
                var cusList = cuslevelDao.list(cusQuery);
                return OutputCodeDiffMapper.INSTANCES.toCodeDiffCusList(cusList);

            case weightDiff:
                var weightQuery = new LambdaQueryWrapper<FeeWeight>().in(FeeWeight::getFeeid, feeidList);
                var weightList = weightDao.list(weightQuery);
                return OutputCodeDiffMapper.INSTANCES.toCodeDiffWeightList(weightList);

            case volDiff:
                var volQuery = new LambdaQueryWrapper<FeeVolRatio>().in(FeeVolRatio::getFeeid, feeidList);
                var volList = volDao.list(volQuery);
                return OutputCodeDiffMapper.INSTANCES.toCodeDiffVolList(volList);

        }
        return null;
    }


    private  List<TruckFeeWeight>getTruckWeightFee(List<Long>feeidList){
        var query = new LambdaQueryWrapper<TruckFeeWeight>().in(TruckFeeWeight::getFeeid, feeidList);
        var list = truckWeightDao.list(query);
        return list;
    }

    private List<FeeAirFlight>getFlight(List<Long>feeidList){
        var query = new LambdaQueryWrapper<FeeAirFlight>().in(FeeAirFlight::getFeeid, feeidList);
        var list = flightDao.list(query);
        return list;
    }



    private List<FixedFreightFee>getFixedFee(List<Long>feeidList){
        var query = new LambdaQueryWrapper<FixedFreightFee>().in(FixedFreightFee::getFeeid, feeidList);
        var list = fixedFeeDao.list(query);
        return list;
    }


    public String makeUpdateMscMsg(Long feeid,String area, String threeCode, String sfg, String mdg) {
        MycMscDto data=new MycMscDto();
        data.setFeeid(feeid);
        data.setArea(area);
        data.setMdg(mdg);
        data.setSfg(sfg);
        data.setThreeCode(threeCode);
        String msg=JSON.toJSONString(data);
        return msg;
    }

    @Override
    public Boolean sendMsgToUpdateMyc(String sfg, String mdg, String area, String threeCode, String twoCode) {
        var query=new  QueryWrapper<ViewFreightFee>();
        if(!StringUtils.isEmpty(mdg)){
            query.lambda() .eq(ViewFreightFee::getMdg,mdg);
        }
        if(!StringUtils.isEmpty(area)){
            query.lambda() .eq(ViewFreightFee::getArea,area);
        }
        query.lambda()
                .eq(ViewFreightFee::getSfg,sfg)
                .eq(ViewFreightFee::getTwocode,twoCode);
        query.select("*");
        var list=viewFreightFeeDao.getDefaultFreightFee(query);
        if(list.stream().count()==0)return true;
        LambdaUtil.forEach(0,list,(item,index)->{
            var feeid=item.getFeeid();
            mqSender.sendMsg( makeUpdateMscMsg(feeid,area,threeCode,sfg,mdg));
        });
        return true;
    }

    /**
     * 经理审核
     * @param data 入参
     * @return
     */
    @Override
    @Transactional
    public Boolean approve(InputApprovalRecord data) {
        //判断能否审核 100 待审核 200 已通过 500已驳回 只有approvalStatus 为100的时候可以审核
        FreightFeePending pendingFee=feePendingDao.getById(data.getFeeid());
        if(!pendingFee.getApprovalStatus().equals(ApprovalStatusEnum.PendingApproval.getCode())){
            throw new BusinessException("已审核数据不能重复审核");
        }
        if(data.getApprovalStatus()==ApprovalStatusEnum.PendingApproval.getCode()){
            throw new BusinessException("传入审核状态有误");
        }
        FeeApprovalRecord r=InputFeeApprovalStatusMapper.INSTANCES.toApprovalRecord(data);

        //改变原运价主体的状态
        pendingFee.setApprovalStatus(data.getApprovalStatus());
        syncPendingToFee(pendingFee);
        approvalDao.save(r);
        feePendingDao.updateById(pendingFee);

        return true;
    }

    // 同步pending费用到正式数据 仅在经理审核通过后
    private void syncPendingToFee(FreightFeePending pendingFee){
        if(!pendingFee.getApprovalStatus().equals(ApprovalStatusEnum.Approval.getCode())){
            return;
        }

        var feeQuery=new LambdaQueryWrapper<FreightFee>().eq(FreightFee::getFeeidPending,pendingFee.getGuid());
        var fee=feeDao.getOne(feeQuery);
        var newFeeid=SnowflakeIdWorker.generateId();
        var pendingFeeid=pendingFee.getGuid();
        if(fee!=null){
            delRelatedData(fee.getGuid());
            feeDao.removeById(fee);
        }
        fee=FreightFeePendingMapper.INSTANCES.toFreightFee(pendingFee);
        fee.setFeeidPending(pendingFee.getGuid());
        fee.setGuid(newFeeid);

        LambdaQueryWrapper<FeeAircompany> airComQuery = new LambdaQueryWrapper<FeeAircompany>()
                .eq(FeeAircompany::getFeeid, pendingFeeid);
        var airComList=airCompanyDao.list(airComQuery);
        LambdaUtil.forEach(0,airComList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        LambdaQueryWrapper<FeeCuslevel> cusQuery = new LambdaQueryWrapper<FeeCuslevel>()
                .eq(FeeCuslevel::getFeeid, pendingFeeid);
        var cusList=cuslevelDao.list(cusQuery);
        LambdaUtil.forEach(0,cusList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        LambdaQueryWrapper<FeePackageType> packageQuery = new LambdaQueryWrapper<FeePackageType>()
                .eq(FeePackageType::getFeeid, pendingFeeid);
        var packageList=packageTypeDao.list(packageQuery);
        LambdaUtil.forEach(0,packageList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        LambdaQueryWrapper<FeeVolRatio> volQuery = new LambdaQueryWrapper<FeeVolRatio>()
                .eq(FeeVolRatio::getFeeid, pendingFeeid);
        var volList=volDao.list(volQuery);
        LambdaUtil.forEach(0,volList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        LambdaQueryWrapper<FeeWeight> weightQuery = new LambdaQueryWrapper<FeeWeight>()
                .eq(FeeWeight::getFeeid, pendingFeeid);
        var weightList=weightDao.list(weightQuery);
        LambdaUtil.forEach(0,weightList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });


        LambdaQueryWrapper<FixedFreightFee> fixedQuery = new LambdaQueryWrapper<FixedFreightFee>()
                .eq(FixedFreightFee::getFeeid, pendingFeeid);
        var fixedList=fixedFeeDao.list(fixedQuery);
        LambdaUtil.forEach(0,fixedList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        LambdaQueryWrapper<FeeAirFlight> flightQuery = new LambdaQueryWrapper<FeeAirFlight>()
                .eq(FeeAirFlight::getFeeid, pendingFeeid);
        var flightList=flightDao.list(flightQuery);
        LambdaUtil.forEach(0,flightList,(item,index)->{
            item.setGuid(SnowflakeIdWorker.generateId());
            item.setFeeid(newFeeid);
        });

        feeDao.save(fee);
        airCompanyDao.saveBatch(airComList);
        cuslevelDao.saveBatch(cusList);
        packageTypeDao.saveBatch(packageList);
        volDao.saveBatch(volList);
        weightDao.saveBatch(weightList);
        fixedFeeDao.saveBatch(fixedList);
        if(flightList.stream().count()>0) {
            flightDao.saveBatch(flightList);
        }

        updateCusEmailNotify(fee,cusList);

    }

    /**
     *    插入待发送更新邮件的数据 根据 gid 客户等级插入或更新匹配的客户数据
     *    逻辑为isSend为2时不更新lastTimestamp
     */
    private void updateCusEmailNotify(FreightFee fee,List<FeeCuslevel> cusList){
        int gid=fee.getGid();
        //特定客户
        if(gid>0){
            Optional<OutputFidCache> optCus=cusCache.getCache().stream().filter(f->{return f.id.equals(gid);}).findFirst();
            if(! optCus.isPresent())return;
            var cus=optCus.get();
            if(!cus.area.equals("-1")&&cus.area.indexOf(fee.getArea())==-1)return;
            var query=new LambdaQueryWrapper<EmailNotify>()
                    .eq(EmailNotify::getFid,cus.fid)
                    .in(EmailNotify::getArea,fee.getArea());
            var notify=emailNotifyDao.getOne(query);
            if(notify==null){
                notify= newNotify(fee,cus.fid);
                emailNotifyDao.save(notify);
            }
            else {
                //仅在已发送之后更新该条数据的最后一次时间戳
                if(notify.isSend==1){
                    notify.setLastTimestamp(System.currentTimeMillis());
                    emailNotifyDao.updateById(notify);
                }
            }
            return;// gid大于0逻辑结束
        }
        // 不选客户参数 视为全选
        var matchCusList= cusCache.getCache().stream().filter(f->{return
                f.area.indexOf(fee.getArea())>-1 || f.area.equals("-1");
        }).collect(Collectors.toList());
        if(cusList.stream().count()>0){
            // 配置了客户等级加入筛选条件
            List<String> creditLevelList=   cusList.stream().collect(Collectors.groupingBy(g->g.getCode())).keySet().stream().map(f->{return f.substring(0,1);}).collect(Collectors.toList());
            matchCusList=matchCusList.stream().filter(f->{return creditLevelList.contains(f.creditlevel);}).collect(Collectors.toList());
        }
        if(matchCusList.stream().count()==0)return;
        var fidMap=matchCusList.stream().collect(Collectors.groupingBy(g->g.fid));
        var fidList=fidMap.keySet().stream().collect(Collectors.toList());

        //已发送且已存在的数据
        var existList=emailNotifyDao.list(
                new LambdaQueryWrapper<EmailNotify>()
                        .in(EmailNotify::getFid,fidList)
                        .eq(EmailNotify::getArea,fee.getArea()));
        var existFidList=existList.stream().collect(Collectors.groupingBy(g->g.fid)).keySet().stream().collect(Collectors.toList());
        var updateList=new ArrayList<EmailNotify>();
        var insertList=new ArrayList<EmailNotify>();
        fidList.stream().filter(f->{return !existFidList.contains(f);}).forEach(i->{
            var n=newNotify(fee,i);
            insertList.add(n);
        });
        existList.stream().filter(f->{return f.isSend==1;}).forEach(item->{
            item.isSend=2;
            item.lastTimestamp=System.currentTimeMillis();
            updateList.add(item);
        });
        emailNotifyDao.updateBatchById(updateList);
        emailNotifyDao.saveBatch(insertList);

    }

    private EmailNotify newNotify(FreightFee fee,int cusFid){
        var notify=new EmailNotify();
        notify.setArea(fee.getArea());
        notify.setFid(cusFid);
        notify.setIsSend(2);
        notify.setLastTimestamp(System.currentTimeMillis());
        return notify;
    }


}