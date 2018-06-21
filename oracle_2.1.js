'use strict';
// let log = console.log.bind( console, '[' + new Date().toUTCString() + ']' );
let log = (...args) => {
  console.log('[' + new Date().toUTCString() + ']', ...args)
};

log('UnicornGO Oracle 2.1 by KRogLA');

require('dotenv').config()
const fs = require('fs')
const ethers = require('ethers')
// const lockFile = require('lockfile')
// const backend_sem = require('semaphore')(1)
const events_sem = require('semaphore')(1)
const request = require('request')
const redis_pub = require('redis').createClient()

if (fs.existsSync(process.env.LOCKFILE)) {
  console.log('locked')
  process.exit(1)
}
fs.writeFileSync(process.env.LOCKFILE, '')
// log(typeof process.env.TESTNET)
let network = process.env.TESTNET === '1' ? ethers.providers.networks.rinkeby : ethers.providers.networks.homestead


// Connect to INFUA
let infuraProvider = new ethers.providers.InfuraProvider(network, process.env.INFURA_TOKEN)
// Connect to Etherscan
let etherscanProvider = new ethers.providers.EtherscanProvider(network, process.env.ETHERSCAN_TOKEN)

let provider = new ethers.providers.FallbackProvider([
  infuraProvider,
  etherscanProvider
])
let wallet = new ethers.Wallet(process.env.ORACLE_KEY, provider);
log('work on', provider.name, wallet.address)


let bb_contract = null
let ut_contract = null
let br_contract = null
let gasPrice = ethers.utils.bigNumberify(process.env.GASPRICE)
let blockfile = provider.name + '.block'
let nonce = 0
let completedBlock = 0
let args = process.argv.slice(2);

let fromBlock = parseInt(args[0] ? args[0] : '0')
let toBlock = parseInt(args[1] ? args[1] : '0')
let autoMode = fromBlock === 0

if (fs.existsSync(blockfile)) {
  let state = JSON.parse(fs.readFileSync(blockfile, 'utf8'))
  completedBlock = state.completedBlock
  nonce = state.nonce
  if (autoMode) {
    fromBlock = completedBlock + 1
    toBlock = fromBlock
  }
} else {
  fs.writeFileSync(blockfile, JSON.stringify({completedBlock}), 'utf8')
}


Promise.all([provider.getBlockNumber(), provider.getGasPrice(), provider.getTransactionCount(wallet.address)])
  .then(blockchainStatus => {
    if (autoMode) {
      let blocks = parseInt(process.env.BLOCKS)
      //skip latest block
      if (fromBlock > blockchainStatus[0] - 1) fromBlock = blockchainStatus[0] - 1
      toBlock = blockchainStatus[0] > fromBlock + blocks + 1 ? fromBlock + blocks : blockchainStatus[0] - 1
    } else {
      if (toBlock === 0) toBlock = blockchainStatus[0]
    }
    // let toBlock = results[0]
    if (gasPrice.gt(blockchainStatus[1])) gasPrice = blockchainStatus[1] //get min gasPrice
    if (nonce != blockchainStatus[2]) {
      nonce = blockchainStatus[2]
    }
    log("gasPrice", ethers.utils.formatUnits(gasPrice, 'gwei'), 'gwei, nonce', nonce, 'from', fromBlock,"to", toBlock)
    //breeding
    br_contract = new ethers.Contract(process.env.BREEDING_ADDRESS, process.env.BREEDING_ABI, wallet)
    ut_contract = new ethers.Contract(process.env.UNICORNTOKEN_ADDRESS, process.env.UNICORNTOKEN_ABI, wallet)
    bb_contract = new ethers.Contract(process.env.BLACKBOX_ADDRESS, process.env.BLACKBOX_ABI, wallet)

    let blockchainEvents = {
      CreateUnicorn: br_contract.interface.events.CreateUnicorn,
      OfferAdd: br_contract.interface.events.OfferAdd,
      UnicornSold: br_contract.interface.events.UnicornSold,
      OfferDelete: br_contract.interface.events.OfferDelete,
      HybridizationAdd: br_contract.interface.events.HybridizationAdd,
      HybridizationAccept: br_contract.interface.events.HybridizationAccept,
      HybridizationDelete: br_contract.interface.events.HybridizationDelete,
      Transfer: ut_contract.interface.events.Transfer,
    }

    let logs = [
      provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: process.env.BREEDING_ADDRESS,
        topics: [ //all topics
          // br_contract.interface.events.CreateUnicorn.topics[0],
          // br_contract.interface.events.HybridizationAdd.topics[0],
          // br_contract.interface.events.HybridizationAccept.topics[0],
          // br_contract.interface.events.HybridizationDelete.topics[0],
          // br_contract.interface.events.OfferAdd.topics[0],
          // br_contract.interface.events.UnicornSold.topics[0],
          // br_contract.interface.events.OfferDelete.topics[0],
        ]
      }),
      provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: process.env.UNICORNTOKEN_ADDRESS,
        topics: [
          blockchainEvents.Transfer.topics[0],
        ]
      })
    ]

    if (process.env.BREEDING_ADDRESS_OLD1) {
      logs.push(provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: process.env.BREEDING_ADDRESS_OLD1,
        topics: []
      }))
    }

    if (process.env.BREEDING_ADDRESS_OLD2) {
      logs.push(provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: process.env.BREEDING_ADDRESS_OLD2,
        topics: []
      }))
    }

    Promise.all(logs)
      .then(blockEvents => {
        let events = [].concat(
          blockEvents[0].filter(e => !e.removed),
          blockEvents[1].filter(e => !e.removed)
        ).sort((a, b) => {
          let deltaBlock = a.blockNumber - b.blockNumber
          return deltaBlock !== 0 ? deltaBlock : a.logIndex - b.logIndex;
        })

        if (!events.length) finish()

        // let txEvents = {}

        for (let i = 0; i < events.length; i++) {
          let e = events[i]
          if (!txEvents.hasOwnProperty(e.transactionHash)) {
            txEvents[e.transactionHash] = {}
          }
          txEvents[e.transactionHash][e.topics[0]] = e
        }

        for (let tx of txEvents) {
          //1. если Create - владельца получаем из события, трансфер и остальные не обрабатываем
          if (blockchainEvents.CreateUnicorn.topics[0] in tx) {
            let eCreate = tx[blockchainEvents.CreateUnicorn.topics[0]]
            log('parse create',e)
            let workers = []
            let dataCreate = blockchainEvents.CreateUnicorn.parse(e.topics, e.data)
              //{unicornId, parent1, parent2, owner}
            if (blockchainEvents.HybridizationAccept.topics[0] in tx) {

            } else {
              workers.push(eventCreateUnicorn(dataCreate))
            }

            Promise.all(workers).then(results => {

            })

          } else if (blockchainEvents.UnicornSold.topics[0] in tx) {
            log('parse sold')

          } else {

          }
          //2. если UnicornSold - то из события трансфер берем старого и нового владельца и им отправляем, остальные евенты обарабтываем как обычно
        }
        console.log(txEvents)

        for (let i = 0; i < events.length; i++) {
          let e = events[i]
          events_sem.take(() => {
            eventsParser(e).then(r => {
              log(i, e.blockNumber, e.logIndex, r)
              events_sem.leave()
              if (i === events.length - 1) {
                finish()
              }
            })
          })
        }

      })
  })


function eventsParser(e) {
  log('event parse address/block/index', e.address, e.blockNumber, e.logIndex)
  switch (e.topics[0]) {
    //CreateUnicorn (index_topic_1 address owner, index_topic_2 uint256 unicornId, uint256 parent1, uint256 parent2)
    case br_contract.interface.events.CreateUnicorn.topics[0]:
      return eventCreateUnicorn(br_contract.interface.events.CreateUnicorn.parse(e.topics, e.data))
      break
    case br_contract.interface.events.OfferAdd.topics[0]:
      return eventOfferAdd(br_contract.interface.events.OfferAdd.parse(e.topics, e.data))
      break
    case br_contract.interface.events.UnicornSold.topics[0]:
      return eventUnicornSold(br_contract.interface.events.UnicornSold.parse(e.topics, e.data))
      break
    case br_contract.interface.events.OfferDelete.topics[0]:
      return eventOfferDelete(br_contract.interface.events.OfferDelete.parse(e.topics, e.data))
      break
    case br_contract.interface.events.HybridizationAdd.topics[0]:
      return eventHybridizationAdd(br_contract.interface.events.HybridizationAdd.parse(e.topics, e.data))
      break
    case br_contract.interface.events.HybridizationAccept.topics[0]:
      return eventHybridizationAccept(br_contract.interface.events.HybridizationAccept.parse(e.topics, e.data))
      break
    case br_contract.interface.events.HybridizationDelete.topics[0]:
      return eventHybridizationDelete(br_contract.interface.events.HybridizationDelete.parse(e.topics, e.data))
      break
    case ut_contract.interface.events.Transfer.topics[0]:
      return eventTransfer(ut_contract.interface.events.Transfer.parse(e.topics, e.data))
      break
    default:
      return new Promise(resolve => resolve(false))
  }
}

function finish() {
  // lockFile.unlock(process.env.LOCKFILE, er => {
  // er means that an error happened, and is probably bad.
  // })
  // if (autoMode) {
    fs.writeFileSync(blockfile, JSON.stringify({completedBlock: autoMode ? toBlock : completedBlock, nonce}), 'utf8')
  // }
  fs.unlinkSync(process.env.LOCKFILE)
  process.exit(0)
}

function eventTransfer({unicornId, from, to}) {
  return new Promise(resolve => {
    let recipients = [];
    // log(ethers.utils.bigNumberify(from))
    if (!ethers.utils.bigNumberify(from).isZero() && !ethers.utils.bigNumberify(to).isZero()) {
      recipients.push(from);
      recipients.push(to);
      Promise.all([
      publishUnicornEvent('transfer_remove', [from], {unicornId: unicornId.toNumber(), from, to}),
      publishUnicornEvent('transfer_add', [to], {unicornId: unicornId.toNumber(), from, to}),
      updateUnicornOwner(unicornId.toNumber(), {owner_blockchain_id: to})
        ]).then(results=>{
          resolve(true)
      })
    } else {
      resolve(true)
    }
  })
}

function eventHybridizationAdd({unicornId, price}) {
  return new Promise(resolve => {
    let _price = ethers.utils.formatEther(price)
    Promise.all([ut_contract.functions.ownerOf(unicornId)]).then(recipients => {
      updateUnicornStatus(unicornId.toNumber(),
        {blockchain_id: unicornId.toNumber(), candy_breed_cost: _price, operation_id: 6, operation_status_id: 2},
        'pair-posted', recipients,
        {unicornId: unicornId.toNumber(), price: _price})
        .then(resolve)
    })
  })
}

function eventHybridizationDelete({unicornId}) {
  return new Promise(resolve => {
    Promise.all([ut_contract.functions.ownerOf(unicornId)]).then(recipients => {
      updateUnicornStatus(unicornId.toNumber(),
        {blockchain_id: unicornId.toNumber(), candy_breed_cost: '', operation_id: 8, operation_status_id: 2},
        'pair-revoke', recipients,
        {unicornId: unicornId.toNumber()})
        .then(resolve)
    })
  })
}

function eventHybridizationAccept({newUnicornId, firstUnicornId, secondUnicornId}) {
  return new Promise(resolve => {
    Promise.all([
      ut_contract.functions.ownerOf(firstUnicornId),
      ut_contract.functions.ownerOf(secondUnicornId)
    ]).then(recipients => {
      updateUnicornStatus(firstUnicornId.toNumber(),
        {blockchain_id: firstUnicornId.toNumber(), candy_breed_cost: '', operation_id: 7, operation_status_id: 2},
        'pair-accept', recipients,
        {unicornId: newUnicornId.toNumber(), firstUnicornId: firstUnicornId.toNumber(), secondUnicornId: secondUnicornId.toNumber()})
        .then(resolve)
    })
  })
}

function eventOfferAdd({unicornId, priceEth, priceCandy}) {
  return new Promise(resolve => {
    let _priceEth = ethers.utils.formatEther(priceEth)
    let _priceCandy = ethers.utils.formatEther(priceCandy)
    if (priceEth.isZero() && !priceCandy.isZero()) {
      _priceEth = ''
    } else if (priceCandy.isZero() && !priceEth.isZero()) {
      _priceCandy = ''
    }
    Promise.all([ut_contract.functions.ownerOf(unicornId)]).then(recipients => {
      updateUnicornStatus(unicornId.toNumber(),
        {blockchain_id: unicornId.toNumber(), cost: _priceEth, candy_cost: _priceCandy, operation_id: 2, operation_status_id: 2},
        'offer-posted', recipients,
        {unicornId: unicornId.toNumber(), priceEth: _priceEth, priceCandy: _priceCandy})
        .then(resolve)
    })
  })
}

function eventOfferDelete({unicornId}) {
  return new Promise(resolve => {
    Promise.all([ut_contract.functions.ownerOf(unicornId)]).then(recipients => {
      updateUnicornStatus(unicornId.toNumber(),
        {blockchain_id: unicornId.toNumber(), cost: '', candy_cost: '', operation_id: 5, operation_status_id: 2},
        'offer-deleted', recipients,
        {unicornId: unicornId.toNumber()})
        .then(resolve)
    })
  })
}

function eventUnicornSold({unicornId}) {
  return new Promise(resolve => {
    Promise.all([ut_contract.functions.ownerOf(unicornId)]).then(recipients => {
      updateUnicornStatus(unicornId.toNumber(),
        {blockchain_id: unicornId.toNumber(), cost: '', candy_cost: '', operation_id: 4, operation_status_id: 2},
        'purchase-done', recipients,
        {unicornId: unicornId.toNumber()})
        .then(resolve)
    })
  })
}

function eventCreateUnicorn({unicornId, parent1, parent2, owner}) {
  return new Promise(resolve => {
    let parent1Id = parent1.toNumber();
    let parent2Id = parent2.toNumber();
    // let owner = r.owner;
    // log('Request new gene for', unicornId, parent1Id, parent2Id);
    Promise.all([
      requestUnicornGene(unicornId.toNumber(), owner, parent1Id, parent2Id),
      ut_contract.functions.getGen(unicornId)
    ]).then(results => {
      let chain = results[0]
      let gene = !!ethers.utils.toUtf8String(results[1])
      // resolve(true)
      // return
      let actions = [
        updateUnicornStatus(unicornId.toNumber(),
          {blockchain_id: unicornId.toNumber(), operation_id: 1, operation_status_id: 2},
          'creation', [owner],
          {unicornId: unicornId.toNumber(), parent1Id, parent2Id, owner, chain}),
        requestRender(unicornId.toNumber(), chain)
      ]
      if (!gene) actions.push(bb_contract.functions.oracleCallbackWithdraw(unicornId, chain, {
        gasLimit: ethers.utils.bigNumberify(process.env.GASLIMIT),
        gasPrice: gasPrice,
        nonce: nonce++
      }))
      Promise.all(actions).then(results => {
        let status = results[0]
        let render = results[1]

        if (!gene) {
          let tx = results[2]
          log('create unicorn', unicornId.toNumber(), status, render, tx);
          publishUnicornEvent('geneconfirm', [owner], {id: unicornId.toNumber(), chain}).then(resolve)
          // provider.waitForTransaction(tx.hash).then(tx => {
          //   // console.log('Transaction Mined: ' + transaction.hash);
          //   console.log('gene write completed', tx)
          // })
        } else resolve(true)
      })
    }).catch(r => resolve(false))
  })
}

function requestUnicornGene(unicornId, owner, parent1Id, parent2Id) {
  return new Promise((resolve, reject) => {
    let request_data;
    let url;
    if (parent1Id || parent2Id) {
      url = process.env.URL_HYBR + process.env.URL_PARAMS;
      request_data = {
        parents: [
          {unicorn_blockchain_id: parent1Id},
          {unicorn_blockchain_id: parent2Id}
        ],
        unicorn_blockchain_id: unicornId,
        owner_blockchain_id: owner
      };
      log('Request pair for', unicornId, parent1Id, parent2Id);
    } else {
      url = process.env.URL_GEN0 + process.env.URL_PARAMS;
      request_data = {
        unicorn_blockchain_id: unicornId,
        owner_blockchain_id: owner
      };
      log('Request gen0 for', unicornId);
    }
    // backend_sem.take(() => {
    request({method: 'POST', uri: url, json: request_data}, function (error, response, body) {
      // backend_sem.leave();
      if (error) {
        log(error)
        reject()
      }
      if (response.statusCode == 200) {
        // log('Set '+unicornId+' gene:', body.chain);
        resolve(body.chain)
      } else {
        log('gene request ' + unicornId + ' error: ', response.statusCode, response.request.path, response.request.body);
        reject()
      }
    })
    // })
  })
}


function requestRender(unicornId, chain) {
  return new Promise((resolve, reject) => {
    let form = {chain}
    let uri = process.env.URL_RENDER + unicornId
    log('Request render for', unicornId);
    if (process.env.RENDER !== '1') {
      resolve(false)
    } else {
      request({method: 'POST', uri, form}, function (error, response, body) {
        if (error) {
          log(error)
          reject()
        }
        if (response.statusCode == 200) {
          resolve(true)
        } else {
          log('render request ' + unicornId + ' error: ', response.statusCode, response.request.path, response.request.body);
          resolve(false)
        }
      })
    }
  })
}

function updateUnicornStatus(id, status_data, event = null, recipients = null, event_data = null) {
  return updateUnicorn(process.env.URL_STATUS, id, status_data, event, recipients, event_data)
}

function updateUnicornOwner(id, owner_data, event = null, recipients = null, event_data = null) {
  return updateUnicorn(process.env.URL_OWNER + id, id, owner_data, event, recipients, event_data)
}

function updateUnicorn(url, id, update_data, event = null, recipients = null, event_data = null) {
  return new Promise(resolve => {
    // backend_sem.take(() => {
    request({
      method: 'PUT',
      uri: url + process.env.URL_PARAMS,
      json: update_data
    }, function (error, response, body) {
      // backend_sem.leave();
      if (error) {
        log(error)
        resolve(false)
      }
      if (response.statusCode == 200) {
        log('update status Ok:', id, event, update_data);
        if (event !== null) {
          publishUnicornEvent(event, recipients, event_data).then(resolve)
        } else resolve(true)
      } else {
        log('update status error:', id, response.statusCode, response.request.path, response.request.body);
        resolve(false)
      }
    })
  })
  // })
}

function publishUnicornEvent(event, recipients, data) {
  return new Promise(resolve => {
    log('EVENT:', event, recipients, data);
    redis_pub.publish(process.env.CHANNEL_USER_EVENTS,
      JSON.stringify({
        event,
        data: {
          recipients: recipients,
          data: data
        }
      }))
    resolve(true)
  })
}