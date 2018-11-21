const {QtumRPC} = require("qtumjs");

const rpc = new QtumRPC("http://zhen:qtum@127.0.0.1:13889");

async function showData(n) {

    let blockInfo = await rpc.rawCall("getblockchaininfo");
    // console.log(blockInfo);
    let height = blockInfo.blocks;
    // console.log(height);
    let blockhash = await rpc.rawCall("getblockhash", [height]);
    // console.log(blockhash);
    let block = await rpc.rawCall("getblock", [blockhash.toString()]);
    for (let k = 0; k < n; k++) {

        console.log(k);
        let txs = block.tx;
        for (let i = 0; i < txs.length; i++) {
            let transaction = await rpc.rawCall("getrawtransaction", [txs[i].toString(), 1]);
            let outs = transaction.vout;
            for (let j = 0; j < outs.length; j++) {
                if (outs[j].scriptPubKey.type == "nulldata") {
                    console.log(outs[j].scriptPubKey);
                }
            }

        }
        blockhash = block.previousblockhash;
        block = await rpc.rawCall("getblock", [blockhash.toString()]);
    }
}

showData(100).then();




