const {QtumRPC} = require('qtumjs')

const rpc = new QtumRPC('http://zhen:qtum@127.0.0.1:13889')
async function getUTXO (data) {
  if (data.length > 80) {
    console.log('Data Length Is Too Long To Send. Please Try Some Shorter One.')
  }
  let list = await rpc.rawCall('listunspent')
  return list
}
