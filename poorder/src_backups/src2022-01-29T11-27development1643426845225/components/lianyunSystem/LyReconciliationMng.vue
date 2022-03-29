<template>
  <reconciliationMng :system="'联运'" ref="recon"></reconciliationMng>
</template>

<script>
import reconciliationMng from '../reconciliationMng'

export default {
  name: 'LyReconciliationMng',
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
