<template>
  <reconciliationMng :system="'报关'" ref="recon"></reconciliationMng>
</template>

<script>
import reconciliationMng from './../reconciliationMng'
export default {
  name: 'BgReconciliationMng',
  components: {
    reconciliationMng
  },
  methods: {
    search () {
      this.$refs.recon.search()
    }
  }
}
</script>
