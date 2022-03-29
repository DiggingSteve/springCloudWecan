<template>
  <div>
		   <h2>表格44</h2>
     <input type='text'>
  </div>
</template>

<script>




 export default {
   name: 'orderTran',

    data() {
      return {
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 4,
		val:{}
      }
    },
	props:['mes'],

    methods: {
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }

          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      },
	  addmenu(obj){
	  this.editableTabs.push(obj)
	  },
	  jiantin(){
	  alert(1)
	  },
	  send(){
	    this.Gloas.subEvent.$emit('amsg',"2");
	  }

    },created:function(){
	 //this.editableTabs.push(this.val)
	  // //console.log(this.mes)
	   this.addmenu(this.mes);
	   //myFunc(8)
		//this.Gloas.fff(33)

	},watch:{
	  mes:function(){
	    this.addmenu(this.mes);
	  }
	}

  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
