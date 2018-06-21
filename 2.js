const WebSocket = require('ws')
const ethers =require('ethers')

let log = (...args) => { console.log('[' + new Date().toUTCString() + ']', ...args ) };
// let test_evt = {"event": "txlist", "address": "0x8d12A197cB00D4747a1fe03395095ce2A5CC6819"}
let br_evt = {"event": "txlist", "address": "0x93b7fa538913201066a262c03179c342262a7c76"}
let ut_evt = {"event": "txlist", "address": "0xcf0010af06edff540af798d06e866d95cbdc8488"}
// {"event": "txlist", "address": "0x5fde9da6056f8a651ae148c9c3a5364885f35548"}
// {"event": "txlist", "address": "0x5a8aAD505a44165813ECDFa213d0615293e33671"}

let provider = ethers.providers.getDefaultProvider()

let socketurl = "wss://socket.etherscan.io/wshandler";

function pinger(ws) {
  let timer = setInterval(()=>{
    if (ws.readyState == 1) {
      ws.send(JSON.stringify({ event: "ping" }));
      log('ping');
    }
  }, 20000);
  return { stop () { clearInterval(timer); } };
}

function wsInit() {
  ws = new WebSocket(socketurl);
  ws.on('open', function open() {
    log('connected')
    var ping = pinger(ws);
    //subscribe
    ws.send(JSON.stringify(br_evt));
  });
// {"event":"txlist","address":"0x8d12A197cB00D4747a1fe03395095ce2A5CC6819",
// "result":[{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x4a2762b05e3008de2fa43f0061552a36ffec50e9eda1ffa01fb5f6e95ceec7f4","nonce":"1087","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"2","from":"0x409c29fdd92b9cfe89018847654d9e54cc09638f","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"250000","gasPrice":"50000000000","input":"0x2e1a7d4d000000000000000000000000000000000000000000000002707f997c5f1cc800","contractAddress":"","cumulativeGasUsed":"292000","gasUsed":"250000","confirmations":"3"},{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x4805819455ecbd708f542cedf59db8f68a086cbe27c5b40e10a0d50046cafac5","nonce":"205","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"29","from":"0xb7e17d6397a1279366908f32c0e963c9eac191f1","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"250000","gasPrice":"20000000000","input":"0x9e281a98000000000000000000000000af4dce16da2877f8c9e00544c93b62ac40631f1600000000000000000000000000000000000000000000000000000000039cbf8c","contractAddress":"","cumulativeGasUsed":"1211453","gasUsed":"63122","confirmations":"3"},{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x193cff29e4439e591f80a0a68dfdc06bbf99098fa92a87490dab32c84fccb3d3","nonce":"56","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"41","from":"0x0c2830e1b10b7ec011bdc3270cc9b9aa1d56bb40","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"52000","gasPrice":"6000000000","input":"0x0a19b14a000000000000000000000000ebbdf302c940c6bfd49c6b165f457fdb324649bc0000000000000000000000000000000000000000000029ed99fc670a2fc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c510972eda0000000000000000000000000000000000000000000000000000000000000054291500000000000000000000000000000000000000000000000000000000d8dbd2a7000000000000000000000000289638bfe1b0e2e7353513e85657a2c20423f7d1000000000000000000000000000000000000000000000000000000000000001b3816552b87b935509dd3bc41d86ba9abe7bcfc4cd29fe810d107eae6c3f3214749b6ddcee76d28a6b4f7e1b6eb0194230e74edb02df8e4d48626794b93a428650000000000000000000000000000000000000000000029ed99fc670a2fc00000","contractAddress":"","cumulativeGasUsed":"1583334","gasUsed":"52000","confirmations":"3"},{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x905a0c59af8aa00643c50cc450c755c6be39475c1848230f47b4fce580049484","nonce":"3","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"106","from":"0x7debe43afb6f7a2515fec5d53a2bb07fb041ea99","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"250000","gasPrice":"4000000000","input":"0x338b5dea0000000000000000000000006f6deb5db0c4994a8283a01d6cfeeb27fc3bbe9c0000000000000000000000000000000000000000000000000000000000000d2c","contractAddress":"","cumulativeGasUsed":"4260432","gasUsed":"39043","confirmations":"3"},{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x97d69454665e389c32c679ccbe05326fd7d39703fc2332fd68fe81829f221d96","nonce":"56","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"110","from":"0x07eef3c734d7316b693d609f4d5de5686b865b6a","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"250000","gasPrice":"4000000000","input":"0x2e1a7d4d00000000000000000000000000000000000000000000000055a7594ca1b60000","contractAddress":"","cumulativeGasUsed":"4597172","gasUsed":"37900","confirmations":"3"},{"blockNumber":"5505664","timeStamp":"1524695544","hash":"0x1bec070327a644e9633ddb2a1683330903a52ec2b2f90bfc761f8620663250a2","nonce":"4","blockHash":"0x0b1dd5d2c53bc6fd66eb065bb7ba9d558fe8c4116c74fcd7d93374b41e5cbf6f","transactionIndex":"113","from":"0x04806bac84ccde79da6b376398dfeb42888def50","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"4000000000000000000","gas":"250000","gasPrice":"4000000000","input":"0xd0e30db0","contractAddress":"","cumulativeGasUsed":"4745981","gasUsed":"29493","confirmations":"3"},{"blockNumber":"5505665","timeStamp":"1524695592","hash":"0x99026eb715b3a3330ce8993bbe2fd9d8c38e4ea03d0d9a9af09c67e58cdf2b8a","nonce":"30","blockHash":"0xf66200a3c8647c3437590af0c4446059360e677e947f9955e17edce3feef8381","transactionIndex":"48","from":"0xa4094d72cd45e04498ec9b174392b95c9cd99b1c","to":"0x8d12a197cb00d4747a1fe03395095ce2a5cc6819","value":"0","gas":"250000","gasPrice":"18000000000","input":"0x278b8c0e000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000046f797e24647c80000000000000000000000000012b19d3e2ccc14da04fae33e63652ce469b3f2fd000000000000000000000000000000000000000000000000001084182d3686000000000000000000000000000000000000000000000000000000000000542236000000000000000000000000000000000000000000000000000000005b9bb98f000000000000000000000000000000000000000000000000000000000000001b0c5fbc7cd8a0a6b2f83dc5c17992d408d816cb85c1be9ed2399d6bf8429955ed7dfe197febb17766616f07c290c775c1ba9c20f24ba0880aac7d00fc866ef496","contractAddress":"","cumulativeGasUsed":"1988145","gasUsed":"59226","confirmations":"2"}]}
  ws.on('message', function incoming(evt) {
    //we can parse the result into a json
    var obj = JSON.parse(evt);
    // log(obj);

    if (obj.event == 'txlist') {
      // console.log("received: " + evt.data);
      switch (obj.address) {
        case br_evt.address: //breeding
          parseEventResult(obj.result)
            .then(log)
          break;
        case ut_evt.address: //token
          break;
        default:

      }
    } else {
      log(obj.event);
    }
  });

  ws.on('close', function close() {
    log('disconnected');
    wsInit()
  });
}


function parseEventResult(result) {
  return new Promise(resolve=> {
    let txs = []
    for (let i = 0; i < result.length; i ++) {
      let tx = result[i]
      txs.push(provider.getTransactionReceipt(tx.hash));
    }
    Promise.all(txs).then(function(receipts) {
      // console.log(receipts);
      let logs = []
      for( let i =0; i<receipts.length; i++) {
        for (let j=0; j<receipts[i].logs.length; j++) {
          // log(receipts[i].logs[j])
          logs.push(receipts[i].logs[j])
        }
      }
      resolve(logs)
    });
  })
}