<template>

  <bm-overlay
    ref="customOverlay"
    class="sample"
    pane="labelPane"
    @draw="draw">
    <p v-html="text">
     
    </p>
  </bm-overlay>



</template>

<script>
import BmOverlay from 'vue-baidu-map/components/overlays/Overlay.vue'
export default {
  props: ['text', 'position'],
  components: {
     BmOverlay
  },
  watch: {
    position: {
      handler (val) {
        //console.log(val)
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
   
    draw ({el, BMap, map}) {
      //alert('1')
      const {lng, lat} = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 120 + 'px'
      el.style.top = pixel.y - 80 + 'px'
    }
  },
  created(){
    //console.log(this.position)
  }

}
</script>

<style>
.sample{
  position:absolute;
  background:rgba(17,108,243,.8);
  font-size:13px;
  border-radius: 3px;
  color: rgb(255, 255, 255);
  height: 50px;
  padding: 8px;
  width:max-content;
  white-space: nowrap;
  text-align: center;
  letter-spacing: 0.1em;
}
</style>