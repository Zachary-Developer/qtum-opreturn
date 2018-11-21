<template>
  <div class="Main">
    <h1>Welcome to Qtum Data Service</h1>
    <h2>Run at First</h2>
    <h3>( ./qtumd -rpcuser=user -rpcpassword=qtum --testnet )</h3>
    <template>
      <div>
        <controller></controller>
      </div>
    </template>
  </div>

</template>

<script>
import Controller from '@/components/Controller'
import Information from '@/components/Information'

export default {

  name: 'Main',
  components: {Information, Controller},
  data () {
    return {
      utxo: null

    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  h1, h2 {
    font-weight: normal;
  }

  a {
    color: #35495E;
  }
</style>
