<template>
  <div class="reconMngSecOut">
    <reconMngSec :wageinout="'2'"></reconMngSec>
  </div>
</template>

<script>
import reconMngSec from './reconMngSec'
export default {
  name: 'reconMngSecOut',
  components: {
    reconMngSec
  }
}
</script>

<style>
.reconMngSecOut > div {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px )
}
</style>
