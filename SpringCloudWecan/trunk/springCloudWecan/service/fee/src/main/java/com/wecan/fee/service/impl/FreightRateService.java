package com.wecan.fee.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wecan.daofee.mapper.ViewFeeFlyPriceMapper;
import com.wecan.daofee.service.impl.FeeAirFlightServiceImpl;
import com.wecan.fee.model.dto.FpHeader;
import com.wecan.fee.model.dto.FreightFlyPriceDto;
import com.wecan.fee.model.dto.FreightPublishPriceDto;
import com.wecan.fee.service.IFreightRate;
import com.wecan.modeldbo.airfreight.fee.FeeAirFlight;
import com.wecan.modeldbo.airfreight.fee.ViewFeeFlyPrice;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class FreightRateService implements IFreightRate {

    @Autowired
    private ViewFeeFlyPriceMapper vfm;

    @Autowired
    private AirFreightFeeService airFee;

    @Autowired
    FeeAirFlightServiceImpl flightDao;

    final  String minprice="minprice";
    final  String noRegister="官网公布";//散客官网公布
    final  String defaultAll="-1";

    /**
     * @param sfg
     * @param mdg
     * @param dt 时间格式:yyyy-MM-dd HH:mm:ss
     * @param type 时间类型:-1.减 0.减1加1,1.加
     * @param gid
     * @param level 客户等级:A类,B类,C类,官网公布
     * @description: 运价查询
     * @return:
     * @author:  hzh
     */
    @Override
    public  FreightFlyPriceDto getFlyPrice(String sfg,String mdg,LocalDateTime dt, Integer type,
                                           Integer gid,String level) {
        LocalDateTime lowDt=  LocalDateTime.from(dt);
        if (type==-1 ||type==0)
            lowDt= dt.plusMonths(-1);
        if(type>=0)
            dt=dt.plusMonths(2);
        if (level.toUpperCase()=="C类")
        {
            level=noRegister;
        }
        QueryWrapper<ViewFeeFlyPrice> query=new QueryWrapper<>();
        var sfgList=sfg.split(",");
        query.in("sfg",sfgList);
        query.eq("ddg",mdg);

        //散客 gid-1
        GetQuerWrapper(gid, level, query);
        //gt >  lt<   ge >=   le <= //查询 2021-11-12  2021-12-13ot
        var tempdt=LocalDateTime.from(dt);
        var templowDt=LocalDateTime.from(lowDt);
        query.and(c-> c.lt("startdate",tempdt).ge("enddate",templowDt))
                .or().le("startdate",templowDt).ge("enddate",tempdt);
        var result=new FreightFlyPriceDto();
        result.bodyList=new ArrayList<>();
        result.headerList=new ArrayList<>();

        var list= vfm.selectList(query).stream()
                .sorted(Comparator.comparing(c -> c.getStartdate()))
                .collect(Collectors.toList());

        Function<ViewFeeFlyPrice, List<Object>> groupByKey = c ->
                Arrays.asList(c.getPackageType(),c.getFeeid(),c.getSfg(),c.getMdg(),c.getZzg(),c.getTwocode(),
                        c.getStartdate(),c.getEnddate(),c.getWffareaid(),
                        c.getAddman(),c.getAddtime(),c.getGid(),c.getHbh(),c.getDdg());

        while (dt.isAfter(lowDt)){
            var hp=new FpHeader();
            hp.date=lowDt;
            // 开始日期 当前日期 结束日期
            var temp=LocalDateTime.from(lowDt);
            var currList= list.stream().filter(c-> c.getStartdate().compareTo(temp)<=0
                    && c.getEnddate().compareTo(temp)>=0).sorted(Comparator.comparing(c->c.getCusLevel())).collect(Collectors.toList());
            var count=currList.size();
            hp.minprice = BigDecimal.ZERO;
            if (count==0) {
               // hp.minprice= BigDecimal.ZERO;
            }
            else {
                //var minFee = currList.stream().min(Comparator.comparing(c -> c.getNewStandardPrice())).get();
               //getMinprice(minFee);
                //查询详情
                Map<Object, List<ViewFeeFlyPrice>> gp = currList.stream().collect(Collectors.groupingBy(groupByKey));
                var outList = getOutputFreightRouting(gp, result.bodyList);
                if (outList.size() > 0) {
                    airFee.getRoutingData(outList);
                    result.bodyList.addAll(outList);
                }
            }
            result.headerList.add(hp);
            lowDt=lowDt.plusDays(1);
        }
        return  result;
    }



    private void GetQuerWrapper(Integer gid, String level, QueryWrapper<ViewFeeFlyPrice> query) {
        //没登录的散客
        if (gid==-1) {
            query.eq("gid", gid);
            query.and(c -> c.eq("cusLevel", level.trim()).or().eq("cusLevel", defaultAll));
        }
        else {
            query.and(c -> c.eq("cusLevel", level.trim()).or().eq("cusLevel", defaultAll)
                    .or().eq("cusLevel", noRegister));
            var tempgid = gid;
            query.and(c -> c.eq("gid", -1).or().eq("gid",tempgid));
        }
    }

    /*//判断是否为未登录的散客
    private boolean isNoRegister(Integer gid) {
        return  gid==-1;
    }*/

    private  List<OutputFreightRouting>  getOutputFreightRouting(Map<Object,List<ViewFeeFlyPrice>> origlist,
                                                                 List<OutputFreightRouting> bodyList){
        List<OutputFreightRouting> list = new ArrayList<>( );
        for(Map.Entry<Object, List<ViewFeeFlyPrice>> c  :origlist.entrySet())
        {
            var glist =c.getValue();
            if (glist.size()==0)
                continue;
            //var item=glist.get(0);
            //价格便宜的那个
            var item=glist.stream().min(Comparator.comparing(f->f.getNewStandardPrice())).get();
            var dataCount= bodyList.stream().filter(f->f.getFeeid()==item.getFeeid()
                && f.getPackageType()==item.getPackageType()).count();
            if ( dataCount>0)
                continue;
            OutputFreightRouting outputFreightRouting = getOutputFreightRouting(item);
            list.add(outputFreightRouting);

        }
        return list;
    }

    private OutputFreightRouting getOutputFreightRouting(ViewFeeFlyPrice item) {
        var outputFreightRouting=new OutputFreightRouting();
        outputFreightRouting.setFeeid( item.getFeeid() );
        outputFreightRouting.setAddman( item.getAddman() );
        outputFreightRouting.setSfg( item.getSfg() );
        outputFreightRouting.setZzg( item.getZzg() );
        outputFreightRouting.setMdg( item.getMdg() );
        outputFreightRouting.setDdg( item.getDdg() );
        outputFreightRouting.setArea( item.getArea() );
        outputFreightRouting.setTruckTwocode( item.getTruckTwocode() );
        outputFreightRouting.setStartDate( item.getStartdate() );
        outputFreightRouting.setEndDate( item.getEnddate() );
        outputFreightRouting.setRemark( item.getRemark() );
        outputFreightRouting.setGid( item.getGid() );
        outputFreightRouting.setTruckMin( item.getTruckMin() );
        outputFreightRouting.setTruckMinDiff( item.getTruckminDiff() );
        outputFreightRouting.setTruckFixedMin(item.getTruckFixedMin());
        outputFreightRouting.setWffAreaid( item.getWffareaid() );
        outputFreightRouting.setHbh( item.getHbh() );
        outputFreightRouting.setJfType( item.getJftype() );
        outputFreightRouting.setTruckFeeid( item.getTruckFeeid() );
        outputFreightRouting.setPackageType(item.getPackageType());
        outputFreightRouting.setTwocode( item.getTwocode() );
        return outputFreightRouting;
    }

    //获取最小价格
    private BigDecimal getMinprice(ViewFeeFlyPrice minFee) {
        return minFee.getNewStandardPrice().compareTo(BigDecimal.ZERO) <= 0 ? minFee.getStandardPrice():
        minFee.getNewStandardPrice();
        //  minFee.getStandardPrice().compareTo( minFee.getNewStandardPrice())<=0?
        //                        minFee.getStandardPrice(): minFee.getNewStandardPrice()
    }

    /*
    * 发布运价 价格对比
    * */
    @Override
    public Object getUpdatePrice(Integer gid, String level, BigInteger timestamp) {
        QueryWrapper<ViewFeeFlyPrice> query = new QueryWrapper<>();
        GetQuerWrapper(gid, level, query);
        //query.eq("sfg","PVG");
        //query.eq("mdg","NRT");
        var list = vfm.selectList(query).stream()
                .collect(Collectors.toList());

        List<FreightPublishPriceDto> priceResult =new ArrayList();

        var gpFee = list.stream().collect(Collectors.groupingBy(GetUpdatePriceGroup()));
        for (Map.Entry<Object, List<ViewFeeFlyPrice>> item : gpFee.entrySet()) {
            var clist=item.getValue().stream()
                    .collect(Collectors.toList());
            //根据时间戳取数据
            //新数据>时间戳 倒序第一条,对比的数据 <时间戳 倒序第一条
            var newFeePrice=GetFee(clist,
                    (a->a.getTimestamp().compareTo(timestamp)>=0));
            var oldFeePrice= GetFee(clist,
                    (a->a.getTimestamp().compareTo(timestamp)<0));

            List<Map.Entry<LocalDateTime,List<ViewFeeFlyPrice>>> twoDateList=new ArrayList<>();
            twoDateList.addAll(newFeePrice);
            twoDateList.addAll(oldFeePrice);
            //价格最少的
            List<ViewFeeFlyPrice> currPriceList=new ArrayList<>();
            List<ViewFeeFlyPrice> prevPriceList=new ArrayList<>();
            if (twoDateList.size()==0) {
                return  priceResult;
            }
            //新发布的之前没有数据 之前的就是它本身
            currPriceList = twoDateList.get(0).getValue();
            if (twoDateList.size()==1)
                prevPriceList = currPriceList;
            else
                prevPriceList=twoDateList.get(1).getValue();

            var currp = GetMinPrice(currPriceList);
            var prevp = GetMinPrice(prevPriceList);
            FreightPublishPriceDto fpp = getFreightPublishPriceDto(currp, prevp);
            priceResult.add(fpp);
        }
        if (priceResult.size()>0)
            priceResult= priceResult.stream().sorted(Comparator.comparing(a->a.sfg))
                            .collect(Collectors.toList());
        return priceResult;
    }

    private  Function<ViewFeeFlyPrice,Object> GetUpdatePriceGroup()
    {
        /*Function<ViewFeeFlyPrice,Object> gk = c ->
                c.getSfg()+","+c.getMdg()+","+c.getZzg()+","+c.getTwocode()+","
                        +c.getDdg()+","+c.getArea()+","+c.getHbh();*/
        Function<ViewFeeFlyPrice,Object> gk = c ->
                c.getSfg()+","+c.getMdg()+","+c.getZzg()+","+c.getTwocode()+","
                        +c.getPackageType()+","+c.getArea();
        return gk;
    }

    private  ViewFeeFlyPrice GetMinPrice(List<ViewFeeFlyPrice> list) {
        var result = list.stream().min(Comparator.comparing(c -> c.getNewStandardPrice())).get();
        return result;
    }

    private FreightPublishPriceDto getFreightPublishPriceDto(ViewFeeFlyPrice currp, ViewFeeFlyPrice prevp) {
        var fpp = new FreightPublishPriceDto();
        fpp.price = getMinprice(currp);// currp.getNewStandardPrice();
        fpp.change =getMinprice(currp).subtract(getMinprice(prevp));
        fpp.sfg = currp.getSfg();
        fpp.mdg = currp.getMdg();
        fpp.twocode = currp.getTwocode();
        fpp.zzg = currp.getZzg();
        fpp.ddg = currp.getDdg();
        fpp.publishMan = currp.getAddman();
        fpp.publishDate = currp.getAddtime();
        fpp.remark = currp.getRemark();
        fpp.packageType = currp.getPackageType();
        fpp.addman=currp.getAddman();
        fpp.area=currp.getArea();
        fpp.hbh=currp.getHbh();
        fpp.flightList= getFlightByFeeid(currp.getFeeid());
        return fpp;
    }
    private  List<Map.Entry<LocalDateTime,List<ViewFeeFlyPrice>>>  GetFee(List<ViewFeeFlyPrice> clist,
                          Predicate<ViewFeeFlyPrice> predicate) {
        //同一个时间可能有多条 所以根据时间倒序分组取第一条
        var feePrice=clist.stream().filter(predicate)
                .collect(Collectors.groupingBy(ViewFeeFlyPrice::getStartdate))
                .entrySet().stream()
                .sorted((a,b)->b.getKey().compareTo(a.getKey()))
                .limit(1).collect(Collectors.toList());
        return feePrice;
    }

    protected List<FeeAirFlight>getFlightByFeeid(long feeid){
        var query = new LambdaQueryWrapper<FeeAirFlight>().eq(FeeAirFlight::getFeeid, feeid);
        var list = flightDao.list(query);
        return list;
    }
}
