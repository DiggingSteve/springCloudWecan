/**
 * @description:
 * @author: yaodui
 * @time: 2021/7/2 14:51
 */
package com.wecan.fee.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.netflix.discovery.converters.Auto;
import com.wecan.commonutils.commonClass.exception.BusinessException;
import com.wecan.commonutils.commonClass.mybatis.GetQueryWrapper;
import com.wecan.commonutils.commonClass.util.LambdaUtil;
import com.wecan.daofee.mapper.ViewTruckFeeMapper;
import com.wecan.daofee.service.impl.TruckFeeAircompanyImpl;
import com.wecan.daofee.service.impl.TruckFeeServiceImpl;
import com.wecan.daofee.service.impl.TruckFeeWeightServiceImpl;
import com.wecan.fee.service.ITruckFee;
import com.wecan.modeldbo.airfreight.fee.*;
import com.wecan.modelview.model.mapper.fee.InputAirFreightFeeMapper;
import com.wecan.modelview.model.mapper.fee.InputCodeDiffMapper;
import com.wecan.modelview.model.mapper.fee.InputTruckFeeMapper;
import com.wecan.modelview.model.mapper.fee.InputTruckWeightDiffMapper;
import com.wecan.modelview.model.vo.fee.input.InputTruckFee;
import com.wecan.modelview.model.vo.fee.input.InputTruckWeightDiff;
import com.wecan.modelview.model.vo.fee.output.OutputTruckDetail;
import com.wecan.modelview.model.vo.fee.output.OutputTruckFee;
import com.wecan.modelview.model.vo.fee.output.OutputTruckWeightDiff;
import com.wecan.modelview.model.vo.fee.view.ViewTruckFee;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class TruckFeeService implements ITruckFee {


    @Autowired
    TruckFeeServiceImpl truckDao;

    @Autowired
    TruckFeeWeightServiceImpl weightCodeDao;

    @Autowired
    TruckFeeAircompanyImpl airComDao;

    @Autowired
    ViewTruckFeeMapper viewTruckMapper;

    @Override
    @Transactional
    public List<TruckFee> saveFee(List<InputTruckFee> data,Boolean isSync) {

        List<Long> feeidList = checkDuplicateGroup(data);
        if (feeidList.stream().count() > 0) {
            throw new BusinessException("存在重复基港 到达港 二字码组合的数据");
        }
        List<TruckFeeWeight> codeList = new ArrayList<>();
        List<TruckFeeAircompany> comList = new ArrayList<>();
        String twocdeoStr = data.get(0).getTwocodeStr(); // 二字码拼接的字符串
        var twocodeArr = Arrays.stream(twocdeoStr.split(",")).collect(Collectors.toList());

        List<TruckFee> feeList = InputTruckFeeMapper.INSTANCES.toList(data);
        LambdaUtil.forEach(0, feeList, (item, index) -> {
            var list = InputTruckWeightDiffMapper.INSTANCES.toCodeArr(data.get(index).getCodeArr(), item.getGuid());
            codeList.addAll(list);
            LambdaUtil.forEach(0, twocodeArr, (twocode, j) -> {
                var newTwocode = new TruckFeeAircompany();
                newTwocode.setTwocode(twocode);
                newTwocode.setFeeid(item.getGuid());
                comList.add(newTwocode);
            });
        });
        //航司参数


        truckDao.saveBatch(feeList);
        weightCodeDao.saveBatch(codeList);
        airComDao.saveBatch(comList);
        return feeList;
    }

    @Override
    @Transactional
    public void syncToWagein(List<InputTruckFee> data) {
        List<InputTruckFee> editList = new ArrayList<>();
        List<InputTruckFee> insertList = new ArrayList<>();
        LambdaUtil.forEach(0, data, (item, index) -> {
            List<InputTruckFee> checkList = new ArrayList<>();
            checkList.add(item);
            List<Long> needEditFeeid = checkDuplicateGroup(checkList);
            if (needEditFeeid.stream().count() > 0) {
                item.setFeeid(needEditFeeid.get(0));
                editList.add(item);
            } else {
                insertList.add(item);
            }
        });
        if(insertList.stream().count()>0) {
            saveFee(insertList,true);
        }
        if(editList.stream().count()>0) {
            editFee(editList,true);
        }

    }

    /**
     * @param
     * @description:检查重复组 ddg mdg twocdeoStr 为唯一组别
     * @return: long list 已存在的fee id
     * @author: yaodui
     */
    @Transactional
    public List<Long> checkDuplicateGroup(List<InputTruckFee> list) {
        LambdaQueryWrapper<ViewTruckFee> query = new LambdaQueryWrapper<>();
        LambdaUtil.forEach(0, list, (item, index) -> {

            String[] arr = item.getTwocodeStr().split(",");
            query.or(t ->
                    t
                            .eq(ViewTruckFee::getMdg, item.getMdg())
                            .eq(ViewTruckFee::getDdg, item.getDdg())
                            .eq(ViewTruckFee::getWageinout, item.getWageinout())
                            .in(ViewTruckFee::getTwocode, arr)
            );
        });
        query.select(ViewTruckFee::getFeeid);
        var currentList= list.stream().filter(f-> f.getFeeid()!=null ).collect(Collectors.toList());
        if(currentList.stream().count()>0){
        query.and(a -> a.not(n -> n.in(ViewTruckFee::getFeeid, currentList.stream().map(InputTruckFee::getFeeid).collect(Collectors.toList()))));
        }
        var result = viewTruckMapper.getList(query);
        return result.stream().map(ViewTruckFee::getFeeid).collect(Collectors.toList());
    }

    /**
     *
     *
     * @description:
     * @param isSync 是否同步应收费用时调用
     * @return:
     * @author: yaodui

     */
    @Override
    @Transactional
    public List<TruckFee> editFee(List<InputTruckFee> data ,Boolean isSync) {

        List<Long> feeidList = checkDuplicateGroup(data);
        if (feeidList.stream().count() > 0) {
            throw new BusinessException("存在重复基港 到达港 二字码组合的数据");
        }
        List<TruckFeeWeight> codeList = new ArrayList<>();
        List<TruckFeeAircompany> comList = new ArrayList<>();
        String twocdeoStr = data.get(0).getTwocodeStr(); // 二字码拼接的字符串
        var twocodeArr = Arrays.stream(twocdeoStr.split(",")).collect(Collectors.toList());
        List<TruckFee> feeList = InputTruckFeeMapper.INSTANCES.toList(data);
        LambdaUtil.forEach(0, feeList, (item, index) -> {
            LambdaQueryWrapper<TruckFeeAircompany> delAircomQuery = new LambdaQueryWrapper<TruckFeeAircompany>()
                    .eq(TruckFeeAircompany::getFeeid, item.getGuid());
            airComDao.remove(delAircomQuery);
            LambdaQueryWrapper<TruckFeeWeight> weightQuery=new LambdaQueryWrapper<>();
            weightQuery.eq(TruckFeeWeight::getFeeid,item.getGuid());
            List<TruckFeeWeight> existedCodeList=weightCodeDao.list(weightQuery);
            var list = InputTruckWeightDiffMapper.INSTANCES.toCodeArr(data.get(index).getCodeArr(), item.getGuid());
            LambdaUtil.forEach(0,existedCodeList,(code,k)->{
                var inputCode=list.get(k);//前端传入的code对应索引顺序是一样的
                code.setDiff(inputCode.getDiff());
                code.setWageinDiff(inputCode.getWageinDiff());
                code.setFixedDiff(inputCode.getFixedDiff());
            });
            codeList.addAll(existedCodeList);
            LambdaUtil.forEach(0, twocodeArr, (twocode, j) -> {
                var newTwocode = new TruckFeeAircompany();
                newTwocode.setTwocode(twocode);
                newTwocode.setFeeid(item.getGuid());
                comList.add(newTwocode);
            });
        });
        //航司参数


        truckDao.updateBatchById(feeList);
        weightCodeDao.updateBatchById(codeList);
        airComDao.saveBatch(comList);
        return feeList;
    }

    @Override
    @Transactional
    public void delFee(List<InputTruckFee> data) {
        List<TruckFeeWeight> codeList = new ArrayList<>();
        List<TruckFee> feeList = InputTruckFeeMapper.INSTANCES.toList(data);
        LambdaUtil.forEach(0, feeList, (item, index) -> {
            var list = InputTruckWeightDiffMapper.INSTANCES.toCodeArr(data.get(index).getCodeArr(), item.getGuid());
            codeList.addAll(list);
        });
        //航司参数

        truckDao.removeByIds(feeList.stream().map(m -> m.getGuid()).collect(Collectors.toList()));
        weightCodeDao.removeByIds(codeList.stream().map(m -> m.getGuid()).collect(Collectors.toList()));
    }

    @Override
    public List<OutputTruckFee> getList(String json) {
        List<OutputTruckFee> result = new ArrayList<>();
        var query = GetQueryWrapper.getQueryWrapperByJsonStr(json, TruckFee.class);
        List<TruckFee> list = truckDao.list(query);
        if (list.stream().count() == 0) return result;
        List<Long> feeidList = new ArrayList<>();
        for (TruckFee item : list) {
            OutputTruckFee p = new OutputTruckFee();
            p.setFeeid(item.getGuid());
            p.setDdg(item.getDdg());
            p.setFlat(item.getFixedFlat().compareTo(BigDecimal.ZERO)>0 ?item.getFixedFlat(): item.getFlat().add(item.getFlatDiff()));
            p.setMdg(item.getMdg());
            p.setMin(item.getFixedMin().compareTo(BigDecimal.ZERO)>0 ?item.getFixedMin(): item.getMin().add(item.getMinDiff()));
            p.setTwocodeStr(item.getTwocodeStr());
            p.setAddman(item.getAddman());
            p.setAddtime(item.getAddtime());
            p.setWageinout(item.getWageinout());
            p.setArea(item.getArea());
            p.setFixedFlat(item.getFixedFlat());
            p.setFixedMin(item.getFixedMin());
            p.setMinDiff(item.getMinDiff());
            p.setFlatDiff(item.getFlatDiff());
            p.setWageoutId(item.getWageoutId());
            feeidList.add(item.getGuid());
            result.add(p);
        }
        var codeQuery = new LambdaQueryWrapper<TruckFeeWeight>().
                in(TruckFeeWeight::getFeeid, feeidList);
        var codeList = weightCodeDao.list(codeQuery);
        var codeMap = codeList.stream().collect(Collectors.groupingBy(g -> g.getFeeid()));
        result.forEach(p -> {
            var matchCodeList = codeMap.get(p.getFeeid());
            var mapList = matchCodeList.stream().map(m -> {
                OutputTruckWeightDiff item = new OutputTruckWeightDiff();
                item.setCode(m.getCode());
                item.setDiff(m.getFixedDiff().compareTo(BigDecimal.ZERO)>0 ?m.getFixedDiff(): m.getDiff().add(m.getWageinDiff()));
                item.setGuid(m.getGuid());
                return item;
            }).collect(Collectors.toList());
            p.setCodeArr(mapList);
        });
        return result;
    }
    @Override
    public OutputTruckDetail getFeeDetail(String json){
        var truckQuery=GetQueryWrapper.getQueryWrapperByJsonStr(json,TruckFee.class);
        List<TruckFee> truckList=truckDao.list(truckQuery);
        if(truckList.stream().count()==0)return null;
        var truck=truckList.get(0);
        // 重量参数
        LambdaQueryWrapper<TruckFeeWeight>weightQuery=new LambdaQueryWrapper<>();
        weightQuery.eq(TruckFeeWeight::getFeeid,truck.getGuid());
        List<TruckFeeWeight> codeList=weightCodeDao.list(weightQuery);
        OutputTruckDetail result=new OutputTruckDetail();
        result.setFee(truck);
        result.setCodeArr(codeList);
        return result;
    }
}
