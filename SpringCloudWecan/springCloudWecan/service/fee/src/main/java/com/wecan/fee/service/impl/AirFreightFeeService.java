/**
 * @description:
 * @author: yaodui
 * @time: 2021/5/18 13:51
 */
package com.wecan.fee.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.wecan.commonutils.commonClass.exception.BusinessException;
import com.wecan.commonutils.commonClass.mybatis.GetQueryWrapper;
import com.wecan.commonutils.commonClass.util.ThrowingConsumer;
import com.wecan.daofee.mapper.ViewFixedFreightFeeMapper;
import com.wecan.daofee.mapper.ViewFreightFeeMapper;
import com.wecan.daofee.mapper.ViewFreightRoutingMapper;
import com.wecan.daofee.service.impl.*;
import com.wecan.fee.enums.PageTypeEnum;
import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.modeldbo.airfreight.fee.enums.FeeModeEnum;
import com.wecan.modeldbo.price.Price;
import com.wecan.modelview.model.mapper.fee.*;

import com.wecan.modelview.model.vo.fee.input.InputAirFreightFee;
import com.wecan.fee.service.IAirFreightFee;

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

import java.math.BigDecimal;
import java.math.BigInteger;
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


    @Override
    @Transactional
    public void saveFee(InputAirFreightFee data) {
        checkDuplicateTimespan(data, 0L, data.getGid() > 0 ? data.getGid() : 0);
        // 费用主表
        FreightFee fee = InputAirFreightFeeMapper.INSTANCES.toFreightFee(data);
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

        feeDao.save(fee);
        airCompanyDao.saveBatch(feeAircompanyList);
        cuslevelDao.saveBatch(feeCuslevelList);
        packageTypeDao.saveBatch(feePackageTypeList);
        volDao.saveBatch(feeVolList);
        weightDao.saveBatch(feeWeightList);
        fixedFeeDao.saveBatch(fixedFeeList);
        flightDao.saveBatch(flightList);

    }

    @Override
    @Transactional
    public void editFee(InputAirFreightFee data) {
        checkDuplicateTimespan(data, data.getFeeid(), data.getGid() > 0 ? data.getGid() : 0);
        // 费用主表
        FreightFee fee = InputAirFreightFeeMapper.INSTANCES.toFreightFee(data);
        fee.setGuid(data.getFeeid());

        LambdaQueryWrapper<FeeAircompany> delAircomQuery = new LambdaQueryWrapper<FeeAircompany>()
                .eq(FeeAircompany::getFeeid, data.getFeeid());
        airCompanyDao.remove(delAircomQuery);

        LambdaQueryWrapper<FeeCuslevel> delCusQuery = new LambdaQueryWrapper<FeeCuslevel>()
                .eq(FeeCuslevel::getFeeid, data.getFeeid());
        cuslevelDao.remove(delCusQuery);

        LambdaQueryWrapper<FeePackageType> delPackageQuery = new LambdaQueryWrapper<FeePackageType>()
                .eq(FeePackageType::getFeeid, data.getFeeid());
        packageTypeDao.remove(delPackageQuery);

        LambdaQueryWrapper<FeeVolRatio> delVolQuery = new LambdaQueryWrapper<FeeVolRatio>()
                .eq(FeeVolRatio::getFeeid, data.getFeeid());
        volDao.remove(delVolQuery);

        LambdaQueryWrapper<FeeWeight> delWeightQuery = new LambdaQueryWrapper<FeeWeight>()
                .eq(FeeWeight::getFeeid, data.getFeeid());
        weightDao.remove(delWeightQuery);

        LambdaQueryWrapper<FixedFreightFee> delFiexedFeeQuery = new LambdaQueryWrapper<FixedFreightFee>()
                .eq(FixedFreightFee::getFeeid, data.getFeeid());
        fixedFeeDao.remove(delFiexedFeeQuery);

        LambdaQueryWrapper<FeeAirFlight> delFlightQuery = new LambdaQueryWrapper<FeeAirFlight>()
                .eq(FeeAirFlight::getFeeid, data.getFeeid());
        flightDao.remove(delFlightQuery);
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
        feeDao.updateById(fee);
        airCompanyDao.saveBatch(feeAircompanyList);
        cuslevelDao.saveBatch(feeCuslevelList);
        packageTypeDao.saveBatch(feePackageTypeList);
        volDao.saveBatch(feeVolList);
        weightDao.saveBatch(feeWeightList);
        fixedFeeDao.saveBatch(fixedFeeList);
        flightDao.saveBatch(flightList);


    }

    /**
     * @param
     * @description: 同步直达价格到随直达价的费用
     * @return:
     * @author: yaodui
     */
    @Transactional
    public void syncDirectFeemode(String sfg, String mdg, BigDecimal standardPrice) {
        var query = new LambdaUpdateWrapper<FreightFee>()
                .eq(FreightFee::getFeeMode, FeeModeEnum.EqualDirect.getCode())
                .eq(FreightFee::getSfg, sfg)
                .eq(FreightFee::getMdg, mdg)
                .ne(FreightFee::getZzg, "直达");
        query.set(FreightFee::getStandardPrice, standardPrice);

        feeDao.update(query);
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
//        if (PageTypeEnum.customer.getCode().equals(pageType)) {
//
//            return distinctByRoute(list, this::getDistinctCustomerFeeKey);
//        } else return distinctByRoute(
//                list, this::getDistinctAirfreightFeeKey);
    }

    private List<OutputFreightFeeList> getListByjson(String json) {
        List<OutputFreightFeeList> result = new ArrayList<>();
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, ViewFreightFee.class);
        var order = new QueryWrapper<ViewFreightFee>().orderByAsc("feeid");
        List<ViewFreightFee> list = viewFreightFeeDao.getDefaultFreightFee(query);
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
                    p.setFeeMode(fee.getFeeMode());
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
                    p.setMinPrice(fee.getMinPrice());
                    p.setRemark(fee.getRemark());
                    p.setRealgid(fee.getGid());
                    p.setTwocode(fee.getTwocode());
                    p.setHbh(fee.getHbh());
                    p.setEnddate(fee.getEnddate());
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
                    p.setFeeMode(fee.getFeeMode());
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
                    p.setMinPrice(fee.getMinPrice());
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

        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, FreightFee.class);
        List<FreightFee> list = feeDao.list(query);
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
        BigDecimal standardPrice=fee.getStandardPrice()==null?zero:fee.getStandardPrice();
        BigDecimal cusDiff=fee.getCusDiff()==null?zero:fee.getCusDiff();
        BigDecimal packageDiff=fee.getPackageTypeDiff()==null?zero:fee.getPackageTypeDiff();
        BigDecimal volDiff=fee.getVolRatioDiff()==null?zero:fee.getVolRatioDiff();
        BigDecimal weightDiff=fee.getWeightDiff()==null?zero:fee.getWeightDiff();
      return standardPrice.add(cusDiff.add(packageDiff.add(volDiff.add(weightDiff))));

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
        return fee.getFeeid().toString()+fee.getVolRatio()+fee.getWeight()+fee.getCusLevel()+fee.getPackageType();
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
        LambdaQueryWrapper<FreightFee> feeQuery = new LambdaQueryWrapper<FreightFee>()
                .eq(FreightFee::getSfg, data.getSfg())
                .eq(FreightFee::getMdg, data.getMdg())
                .eq(FreightFee::getZzg, data.getZzg())
                .and(a ->
                        a.ge(FreightFee::getEnddate, data.getStartdate())

                                .le(FreightFee::getStartdate, data.getEnddate())
                );
        if (editFeeid != 0) {
            feeQuery.ne(FreightFee::getGuid, editFeeid);
        }
        if (gid > 0) {
            feeQuery.eq(FreightFee::getGid, gid);
        }
        // 所有关联费用
        List<FreightFee> feeList = feeDao.list(feeQuery);
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
        List<FreightFee> sortFeeList = feeList.stream().filter(f -> feeidMap.containsKey(f.getGuid()))
                .sorted(Comparator.comparing(c -> c.getStartdate()))
                .collect(Collectors.toList());

        for (FreightFee item : sortFeeList) {
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
        List<Long> feeidList = result.stream().map(t -> t.getFeeid()).collect(Collectors.toList());
        List<OutputCodeDiff> packageDiffList = getCodeArr(packageTypeDiff, feeidList);
        List<OutputCodeDiff> cusDiffList = getCodeArr(cusDiff, feeidList);
        List<OutputCodeDiff> weightDiffList = getCodeArr(weightDiff, feeidList);
        List<OutputCodeDiff> volDiffList = getCodeArr(volDiff, feeidList);
        List<FixedFreightFee>fixedList=getFixedFee(feeidList);
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

        });
        return result;
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

    private List<FixedFreightFee>getFixedFee(List<Long>feeidList){
        var query = new LambdaQueryWrapper<FixedFreightFee>().in(FixedFreightFee::getFeeid, feeidList);
        var list = fixedFeeDao.list(query);
        return list;
    }
}
