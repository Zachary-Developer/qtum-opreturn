const {QtumRPC} = require("qtumjs");

const rpc = new QtumRPC("http://zhen:qtum@127.0.0.1:13889");

async function sendData(data) {
    if (data.length > 80)  {
        console.log("Data Length Is Too Long To Send. Please Try Some Shorter One.")
    }
    let list = await rpc.rawCall("listunspent");
    let availableList = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].amount <=0.05 && list[i].amount >=0.001 ) {
            availableList.push(list[i]);
        }
    }
    let jsonArg1 = [{'txid':availableList[0].txid,'vout':availableList[0].vout}];
    let jsonArg2 = {'data':data};
    var pluginArrayArg = [];
    pluginArrayArg.push(jsonArg1);
    pluginArrayArg.push(jsonArg2);
    let output = await rpc.rawCall("createrawtransaction",pluginArrayArg);
    console.log(output);
    output = [output];
    output = await rpc.rawCall("signrawtransaction",output);
    output = [output.hex];
    console.log(output);
    output = await rpc.rawCall("sendrawtransaction",output);
    console.log(output);
}
sendData().then();




