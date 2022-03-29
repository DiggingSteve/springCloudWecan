
import Vue from 'vue'
var subEvent=new Vue()


export default {
	dataval:["1","2","3"],
	subEvent:subEvent,
   setStorage(name,val){
      localStorage.setItem(name,val)
   },
   getStorage(name){
	  return localStorage.getItem(name)
   },
   clearStorage(name){
	localStorage.removeItem(name)
   }
}










