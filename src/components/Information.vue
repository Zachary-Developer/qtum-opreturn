<template>
  <div>
    <u-t-x-o v-bind:info="utxo">
    </u-t-x-o>
    <li v-if="output != null">Output: {{output}}</li>
    <li v-if="tx != null">tx : {{tx}}</li>
    <div>
      <ul>
        <li
          v-for="(object,t) in transaction"
          :key="t">
          <span>Block Height   : {{object.blockheight}}</span>
          <div></div>
          <span>TXID   : {{object.txid}}</span>
          <div></div>
          <span @mouseover="showConext" v-tooltip.right="msg">OUTPUT : {{object.data}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import UTXO from '@/components/UTXO'
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)
export default {
  name: 'Information',
  props: ['output', 'utxo', 'tx', 'transaction'],
  data () {
    return {
      msg: {},
      isShow: {}
    }
  },
  components: {UTXO, VTooltip},
  methods: {
    showConext (event) {
      this.isShow = true
      let context = event.target.innerHTML
      context = context.substring(9)
      let s = context.substring(6)
      context = ''
      for (let i = 0; i < s.length; i += 2) {
        let c = s.substring(i, i + 2)
        c = parseInt(c, 16)
        c = String.fromCharCode(c)
        context = context + c
      }
      console.log(context)
      this.msg = context
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
