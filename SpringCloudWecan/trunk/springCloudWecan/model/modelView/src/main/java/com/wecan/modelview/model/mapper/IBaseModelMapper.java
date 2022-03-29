package com.wecan.modelview.model.mapper;

public interface IBaseModelMapper<T extends Object> {
    /**
     * @description: 返回该model 默认的赋值属性 理论上所有mapper都要继承这个接口
     * @return:
     * @author: yaodui
     */

    //不能实例化类型变量
    //如T obj = new T ();  // 报错， 提示： Type parameter 'T' cannot be instantiated directl 只能通过这样反射创建
    //默认返回一个控的obj 如果要设置初始值 请在子接口继承重写
    default T defaultObj(Class<T> c) throws IllegalAccessException, InstantiationException {
        try {
            return c.newInstance(); // 利用反射创建实例
        } catch (Exception e) {
            throw e;
        }
    }

}
