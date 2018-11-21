<template>
  <div>
    <u-t-x-o v-bind:info="utxo">
    </u-t-x-o>
    <li>Output: {{output}}</li>
    <li>tx : {{tx}}</li>
    <div>
      <ul>
        <li
          v-for="t in transaction"
          :key="t">
          <span>{{t.asm}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import UTXO from '@/components/UTXO'

export default {
  name: 'Information',
  props: ['output', 'utxo', 'tx', 'transaction'],
  components: {UTXO}
}
</script>

<style scoped>
  li {
    text-align: left;
    margin: 0 10px;
  }

</style>
