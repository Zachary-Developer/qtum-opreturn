<template>
  <v-container fluid fill-height justify-center>
    <v-layout column wrap>
      <v-flex xs10 offset-xs1>
        <input type="file" id="selectFile" name="files[]" @change="fileSelect">
        <button id="findUTXO" @click="findUTXO">Find UTXO</button>
        <button id="sendData" @click="sendData">Send Data</button>
        <button id="showData" @click="showData">Show Data</button>
        <label id="showArray" style="height: 1000px; width:100px"></label>
        <div id="div_UTXO" style="display: block">
          <ul>
            <li
              v-for="item in items"
              :key="item">
              <span @click="chooseUTXO">{{item.txid}} - {{item.amount}} Qtum</span>
            </li>
          </ul>
        </div>
      </v-flex>
      <information v-bind:utxo="selectedItem" v-bind:output="output_qtum" v-bind:tx="tx_qtum" v-bind:transaction="transaction_qtum"></information>
    </v-layout>
  </v-container>
  <!--<div id='info'>-->
  <!--<label>{{selectedItem}}</label>-->
  <!--</div>-->
</template>

<script>
import {QtumRPC} from 'qtumjs'
import UTXO from '@/components/UTXO'
import Information from '@/components/Information'

const rpc = new QtumRPC('http://user:qtum@localhost:13889')
export default {
  name: 'Controller',
  components: {Information, UTXO},
  data () {
    return {
      items: [],
      fileArray: null,
      selectedItem: null,
      output_qtum: null,
      tx_qtum: null,
      transaction_qtum: []
    }
  },
  methods: {
    fileSelect (event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      const con = this
      reader.onload = function () {
        let fileString = this.result
        if (fileString.length > 80) {
          alert('Data are Too Big To Be Sent')
          return
        }
        let array = []
        for (let i = 0; i < fileString.length - 1; i++) {
          let c = fileString.charCodeAt(i)
          array = array + c.toString(16)
        }
        let t = document.getElementById('showArray')
        t.innerText = array.toString()
        con.fileArray = array
      }
      reader.readAsText(file)
    },
    async findUTXO () {
      let list = await rpc.rawCall('listunspent')
      let availableList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].amount <= 0.05 && list[i].amount >= 0.001) {
          availableList.push(list[i])
        }
      }
      this.items = list
      // this.$forceUpdate()
    },
    chooseUTXO (event) {
      let utxo = event.target
      let labels = document.getElementsByTagName('span')
      for (let i = 0; i < labels.length; i++) {
        labels[i].style.backgroundColor = 'white'
      }
      utxo.style.backgroundColor = 'green'
      let txids = utxo.innerHTML.split(' ')
      let txid = txids[0]
      let amount = txids[(txids.length - 2)]
      console.log(amount)
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i]
        if (item.txid === txid && item.amount.toString() === amount) {
          this.selectedItem = item
        }
      }
    },
    async sendData () {
      if (this.fileArray == null || this.selectedItem == null) {
        return
      }
      let jsonArg1 = [{'txid': this.selectedItem.txid, 'vout': this.selectedItem.vout}]
      // let jsonArg2 = {'data': this.fileArray, 'address': this.selectedItem.address, 'amount': (this.selectedItem.amount - 0.001)}
      let jsonArg2 = {'data': this.fileArray}
      var pluginArrayArg = []
      pluginArrayArg.push(jsonArg1)
      pluginArrayArg.push(jsonArg2)
      let output = await rpc.rawCall('createrawtransaction', pluginArrayArg)
      this.output_qtum = output

      output = [output]
      output = await rpc.rawCall('signrawtransaction', output)
      this.output_qtum = output
      output = [output.hex]
      console.log(output)
      output = await rpc.rawCall('sendrawtransaction', output)
      console.log(output)
      this.tx_qtum = output
      output = await rpc.rawCall('getrawtransaction', [output, 1])
    },
    async showData () {
      let n = 100
      let blockInfo = await rpc.rawCall('getblockchaininfo')
      console.log(blockInfo)
      let height = blockInfo.blocks
      console.log(height)
      let blockhash = await rpc.rawCall('getblockhash', [height])
      console.log(blockhash)
      let block = await rpc.rawCall('getblock', [blockhash.toString()])
      for (let k = 0; k < n; k++) {
        let txs = block.tx

        this.transaction_qtum = []
        for (let i = 0; i < txs.length; i++) {
          console.log(i)
          let transaction = await rpc.rawCall('getrawtransaction', [txs[i].toString(), 1])
          let outs = transaction.vout
          for (let j = 0; j < outs.length; j++) {
            console.log(j)
            if (outs[j].scriptPubKey.type === 'nulldata') {
              this.transaction_qtum.push(outs[j].scriptPubKey)
            }
          }
        }
        blockhash = block.previousblockhash
        block = await rpc.rawCall('getblock', [blockhash.toString()])
      }
      console.log(this.transaction_qtum)
    }
  }

}
</script>

<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }
</style>
