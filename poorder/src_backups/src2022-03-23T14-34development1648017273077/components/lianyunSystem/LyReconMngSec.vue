<template>
  <reconMngSec :system="'联运'" ref="recon"></reconMngSec>
</template>

<script>
import reconMngSec from "../reconMngSec"

export default {
  name: 'LyReconMngSec',
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
