<template>
  <reconMngSec :system="'报关'" ref="recon"></reconMngSec>
</template>

<script>
import reconMngSec from './../reconMngSec'
export default {
  name: 'BgReconMngSec',
  components: {
    reconMngSec
  },
  methods: {
    search () {
      this.$refs.recon.search()
    }
  }
}
</script>
