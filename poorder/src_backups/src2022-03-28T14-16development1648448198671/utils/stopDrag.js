/*
 * @Description: 
 * @Version: 
 * @Autor: ZX
 * @Date: 2021-09-18 13:49:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-18 13:49:44
 */
import Vue from 'vue';
//使用Vue.directive()定义一个全局指令
//1.参数一：指令的名称，定义时指令前面不需要写v-
//2.参数二：是一个对象，该对象中有相关的操作函数
//3.在调用的时候必须写v-
const stopDrag = Vue.directive('stopDrag', {

    inserted: function (el) {
        el.onmousedown = function (e) {
           e.stopPropagation()
        }
    },
    //当VNode更新的时候会执行updated，可以触发多次
    updated: function (el) { }
})
export default stopDrag;
