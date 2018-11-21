<template>
  <div>
      <li>TXID    : {{info.txid}}</li>
      <li>VOUT    : {{info.vout}}</li>
      <li>AMOUNT  : {{info.amount}}</li>
      <li>ADDRESS : {{info.address}}</li>
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
