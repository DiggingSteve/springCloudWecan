package com.wecan.fee.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.wecan.daofee.mapper.ViewFeeFlyPriceMapper;
import com.wecan.fee.model.dto.FpHeader;
import com.wecan.fee.model.dto.FreightFlyPriceDto;
import com.wecan.fee.model.dto.FreightPublishPriceDto;
import com.wecan.fee.service.IFreightRate;
import com.wecan.modeldbo.airfreight.fee.ViewFeeFlyPrice;
import com.wecan.modelview.model.vo.fee.output.OutputFreightRouting;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FreightRateService implements IFreightRate {

    @Autowired
    private ViewFeeFlyPriceMapper vfm;

    @Autowired
    private AirFreightFeeService airFee;

    final  String minprice="minprice";
    final  String noRegister="散客";
    final  String defaultAll="-1";

    /**
     * @param sfg
     * @param mdg
     * @param dt 时间格式:yyyy-MM-dd HH:mm:ss
     * @param type 时间类型:-1.减 0.减1加1,1.加
     * @param gid
     * @param level 客户等级:A类,B类,C类,散客
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
        QueryWrapper<ViewFeeFlyPrice> query=new QueryWrapper<>();
        query.eq("sfg",sfg);
        query.eq("mdg",mdg);
        //散客 gid-1
        GetQuerWrapper(gid, level, query);
        //gt >  lt<   ge >=   le <= //查询 2021-11-12  2021-12-13
        var tempdt=LocalDateTime.from(dt);
        var templowDt=LocalDateTime.from(lowDt);
        query.and(c-> c.lt("startdate",tempdt).ge("enddate",templowDt))
                .or().le("startdate",templowDt).gt("enddate",tempdt);
        var result=new FreightFlyPriceDto();
        result.bodyList=new ArrayList<>();
        result.headerList=new ArrayList<>();

        var list= vfm.selectList(query).stream()
                .sorted(Comparator.comparing(c -> c.getStartdate()))
                .collect(Collectors.toList());
        List<OutputFreightRouting> ls=new ArrayList<>();

        Function<ViewFeeFlyPrice, List<Object>> groupByKey = c ->
                Arrays.asList(c.getFeeid(),c.getSfg(),c.getMdg(),c.getZzg(),c.getTwocode(),
                        c.getStartdate(),c.getEnddate(),c.getWffareaid(),
                        c.getAddman(),c.getAddtime(),c.getGid(),c.getHbh(),c.getDdg());
        var fly=new ArrayList<>();
        while (dt.isAfter(lowDt)){
            var hp=new FpHeader();
            hp.date=lowDt;
            // 开始日期 当前日期 结束日期
            var temp=LocalDateTime.from(lowDt);
            var currList= list.stream().filter(c-> c.getStartdate().compareTo(temp)<=0
                    && c.getEnddate().compareTo(temp)>=0).sorted(Comparator.comparing(c->c.getCusLevel())).collect(Collectors.toList());
            var count=currList.size();
            if (count==0) {
                hp.minprice= BigDecimal.ZERO;
            }
            else {
               var minPrice= currList.stream().min(Comparator.comparing(c->c.getNewStandardPrice())).get().getNewStandardPrice();
                if(minPrice.compareTo(BigDecimal.ZERO)<=0)
                    minPrice= currList.stream().min(Comparator.comparing(c->c.getStandardPrice())).get().getStandardPrice();
               hp.minprice=minPrice;
               //查询详情
               Map<Object,List<ViewFeeFlyPrice>> gp=currList.stream().collect(Collectors.groupingBy(groupByKey));
               var outList= getOutputFreightRouting(gp,result.bodyList);
               if (outList.size()>0) {
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
        if (isNoRegister(level)) {
            gid =-1;
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

    private boolean isNoRegister(String level) {
        return !level.isEmpty() && level.trim().compareTo(noRegister)==0;
    }

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
            var dataCount= bodyList.stream().filter(f->f.getFeeid()==item.getFeeid()).count();
            if ( dataCount>0)
                continue;
            var outputFreightRouting=new OutputFreightRouting();
            outputFreightRouting.setFeeid( item.getFeeid() );
            outputFreightRouting.setAddman( item.getAddman() );
            outputFreightRouting.setSfg( item.getSfg() );
            outputFreightRouting.setZzg( item.getZzg() );
            outputFreightRouting.setMdg( item.getMdg() );
            outputFreightRouting.setDdg( item.getDdg() );
            outputFreightRouting.setArea( item.getArea() );
            outputFreightRouting.setTwocode( item.getTwocode() );
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
            list.add(outputFreightRouting);
        }
        origlist.entrySet().forEach(c->{
           var kk= c.getKey();
           var glist =c.getValue();
           if(glist.size()>0) {

           }
        });
        return list;
    }

    /*
    * 发布运价 价格对比
    * */
    @Override
    public Object getUpdatePrice(Integer gid, String level) {
        QueryWrapper<ViewFeeFlyPrice> query = new QueryWrapper<>();
        GetQuerWrapper(gid, level, query);
        var list = vfm.selectList(query).stream()
                .sorted(Comparator.comparing(ViewFeeFlyPrice::getSfg).reversed())
                .collect(Collectors.toList());

        List<FreightPublishPriceDto> priceResult =new ArrayList();

        var gpFee = list.stream().collect(Collectors.groupingBy(GetPriceGroup()));
        for (Map.Entry<Object, List<ViewFeeFlyPrice>> item : gpFee.entrySet()) {
            var clist=item.getValue().stream()
                    .collect(Collectors.toList());
            //取最近的2个时间
            var twoDateList = clist.stream()
                    .collect(Collectors.groupingBy(ViewFeeFlyPrice::getStartdate))
                    .entrySet().stream()
                    .sorted((a,b)->b.getKey().compareTo(a.getKey()))
                    .limit(2).collect(Collectors.toList());;
            //价格最少的
            List<ViewFeeFlyPrice> currPriceList=new ArrayList<>();
            List<ViewFeeFlyPrice> prevPriceList=new ArrayList<>();

            if (twoDateList.size()==0) {
                return  priceResult;
            }
//            else if (twoDateList.size()==1){
//                currPriceList = twoDateList.get(0).getValue();
//                prevPriceList = twoDateList.get(0).getValue();
//            }
//           else {
//                currPriceList = twoDateList.get(0).getValue();
//                prevPriceList = twoDateList.get(1).getValue();
//            }
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
        return priceResult;
    }

    private  Function<ViewFeeFlyPrice,Object>  GetPriceGroup()
    {
        Function<ViewFeeFlyPrice,Object> gk = c ->
                c.getSfg()+","+c.getMdg()+","+c.getZzg()+","+c.getTwocode()+","
                        +c.getDdg()+","+c.getArea()+","+c.getHbh();
        return gk;
    }

    private  ViewFeeFlyPrice GetMinPrice(List<ViewFeeFlyPrice> list) {
        var result = list.stream().min(Comparator.comparing(c -> c.getNewStandardPrice())).get();
        return result;
    }

    private FreightPublishPriceDto getFreightPublishPriceDto(ViewFeeFlyPrice currp, ViewFeeFlyPrice prevp) {
        var fpp = new FreightPublishPriceDto();
        fpp.price = currp.getNewStandardPrice();
        fpp.change = currp.getNewStandardPrice().subtract(prevp.getNewStandardPrice());
        fpp.sfg = currp.getSfg();
        fpp.mdg = currp.getMdg();
        fpp.twocode = currp.getTwocode();
        fpp.zzg = currp.getZzg();
        fpp.ddg = currp.getDdg();
        fpp.publishMan = currp.getAddman();
        fpp.publishDate = currp.getAddtime();
        fpp.remark = currp.getRemark();
        fpp.packageType = currp.getPackageType();
//                fpp.area=currp.getArea();
//                fpp.gid=currp.getGid();
        return fpp;
    }

}
