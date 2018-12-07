<template>
  <div>
        <input type="file" id="selectFile" name="files[]" @change="fileSelect">
        <button id="findUTXO" v-if="items == null" @click="findUTXO" v-tooltip.top-center="">Find UTXO</button>
        <button id="hideUTXO" v-if="items != null" @click="hideUTXO">Hide UTXO</button>
        <button id="sendData" @click="sendData">Send Data</button>
        <button id="showData" v-if="!isClick" @click="showData">Show Data</button>
        <button id="clearData" v-if="isClick" @click="clearData">Clear Data</button>
        <label id="showArray" v-if="fileArray != null" style="height: 1000px; width:100px"></label>
        <div id="div_UTXO" v-if="items != null">
          <ul>
            <li
              v-for="(obj,item) in items"
              :key="item">
              <span @click="chooseUTXO">{{obj.txid}} - {{obj.amount}} Qtum</span>
            </li>
          </ul>
        </div>
      <information v-bind:utxo="selectedItem" v-bind:output="outputInfo" v-bind:tx="txInfo" v-bind:transaction="transactionInfo"></information>
  </div>
</template>

<script>
import {QtumRPC} from 'qtumjs'
import UTXO from '@/components/UTXO'
import Information from '@/components/Information'

const rpc = new QtumRPC('http://user:qtum@localhost:8080')
export default {
  name: 'Controller',
  components: {Information, UTXO},
  data () {
    return {
      items: null,
      fileArray: null,
      selectedItem: null,
      outputInfo: null,
      txInfo: null,
      transactionInfo: [],
      isClick: false,
      msg: '123'
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
    },
    hideUTXO () {
      this.items = null
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
      let jsonArg2 = {'data': this.fileArray}
      var pluginArrayArg = []
      pluginArrayArg.push(jsonArg1)
      pluginArrayArg.push(jsonArg2)
      let output = await rpc.rawCall('createrawtransaction', pluginArrayArg)
      this.outputInfo = output

      output = [output]
      output = await rpc.rawCall('signrawtransaction', output)
      this.outputInfo = output
      output = [output.hex]
      console.log(output)
      output = await rpc.rawCall('sendrawtransaction', output)
      console.log(output)
      this.txInfo = output
      output = await rpc.rawCall('getrawtransaction', [output, 1])
    },
    async showData () {
      this.isClick = true
      let n = 50
      let blockInfo = await rpc.rawCall('getblockchaininfo')
      let height = blockInfo.blocks
      let blockhash = await rpc.rawCall('getblockhash', [height])
      let block = await rpc.rawCall('getblock', [blockhash.toString()])
      this.transactionInfo = []
      for (let k = 0; k < n; k++) {
        let txs = block.tx
        for (let i = 0; i < txs.length; i++) {
          let transaction = null
          try {
            transaction = await rpc.rawCall('getrawtransaction', [txs[i], 1])
          } catch (e) {
            transaction = null
          }
          if (transaction == null) {
            try {
              transaction = await rpc.rawCall('gettransaction', [txs[i]])
              transaction = await rpc.rawCall('decoderawtransaction', [transaction.hex])
            } catch (e) {
              transaction = null
            }
          }
          if (transaction == null) {
            continue
          }
          let outs = transaction.vout
          for (let j = 0; j < outs.length; j++) {
            if (outs[j].scriptPubKey.type === 'nulldata') {
              let txid = transaction.txid
              let data = outs[j].scriptPubKey.asm.substring(10)
              this.transactionInfo.push({'blockheight': block.height, 'txid': txid, 'data': data})
            }
          }
        }
        blockhash = block.previousblockhash
        block = await rpc.rawCall('getblock', [blockhash.toString()])
      }
    },
    clearData () {
      this.transactionInfo = []
      this.isClick = false
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
