<template>
  <div>
      <li v-if="info != null">TXID    : {{info.txid}}</li>
      <li v-if="info != null">VOUT    : {{info.vout}}</li>
      <li v-if="info != null">AMOUNT  : {{info.amount}}</li>
      <li v-if="info != null">ADDRESS : {{info.address}}</li>
  </div>
</template>

<script>
export default {
  name: 'UTXO',
  props: ['info'],
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  li {
    text-align: left;
    margin: 0 10px;
  }
</style>
