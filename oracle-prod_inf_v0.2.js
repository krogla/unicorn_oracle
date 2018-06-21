'use strict';
// let log = console.log.bind( console, '[' + new Date().toUTCString() + ']' );
let log = (...args) => { console.log('[' + new Date().toUTCString() + ']', ...args ) };

log('UnicornGO Oracle by KRogLA');

log('connecting...');

require('dotenv').config();
const transaction_sem = require('semaphore')(1);
// const past_events_semaphore = require('semaphore')(1);
// const ressurector_semaphore = require('semaphore')(1);
const backend_sem = require('semaphore')(1);
const Web3 = require('web3');
const request = require('request');
// const cache = require('redis').createClient();
const redis_pub = require('redis').createClient();

//connect to redis
// let io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6001 });
let ws_url = process.env.INFURA_ADDRESS_WS
let http_url = process.env.INFURA_ADDRESS

// const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NODE_ADDRESS));
const web3 = new Web3(new Web3.providers.WebsocketProvider(ws_url));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ADDRESS));
log('listening on', ws_url);
log('work on', http_url);
// web3.eth.accounts.wallet.add(process.env.ORACLE_KEY);
let web3_signer
let fromAddress = initWeb3Signer();
log('oracle address:', fromAddress);
const br_addr = process.env.BREEDING_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;
const ut_addr = process.env.UNICORNTOKEN_ADDRESS;

const br_abi = JSON.parse(process.env.BREEDING_ABI)
const bb_abi = JSON.parse(process.env.BLACKBOX_ABI)
const ut_abi = JSON.parse(process.env.UNICORNTOKEN_ABI)

// Define the br_contract ABI and Address
let br_contract = new web3.eth.Contract(br_abi, br_addr);
let bb_contract = new web3.eth.Contract(bb_abi, bb_addr);
let ut_contract = new web3.eth.Contract(ut_abi, ut_addr);
let nonce = 0;

log('waiting for events...');
let args = process.argv.slice(2);


function initWeb3Signer() {
    web3_signer = new Web3(new Web3.providers.HttpProvider(http_url));
    web3_signer.eth.accounts.wallet.add(process.env.ORACLE_KEY);
    transaction_sem.take(() => {
        web3_signer.eth.getTransactionCount(web3_signer.eth.accounts.wallet[0].address, 'pending')
            .then((_nonce) => {
                let _nonce2 = parseInt(args[0] ? args[0] : '0');
                nonce = _nonce > _nonce2 ?  _nonce : _nonce2;
                log("nonce:", nonce);
                transaction_sem.leave();
            })
    });
    return web3_signer.eth.accounts.wallet[0].address
}


// br_contract.getPastEvents('CreateUnicorn', {
// // bb_contract.getPastEvents('GeneHybritizationRequest', {
// // bb_contract_old1.getPastEvents('Gene0Request', {
// // bb_contract.getPastEvents('Gene0Request', {
//     // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 0,
//     toBlock: 'latest'
// })
//     .then(function (events) {
//         log('found total past events:',events.length)
//         for (let i = 3990; i < events.length; i++) {
//             past_events_semaphore.take(()=> {
//                 let event = events[i];
//                 // count++;
//                 // printInfo();
//
//                 let unicornId = parseInt(event.returnValues.unicornId);
//                 let parent1Id = parseInt(event.returnValues.parent1);
//                 let parent2Id = parseInt(event.returnValues.parent2);
//                 // let owner = event.returnValues.owner;
//                 // let parent1Id = parseInt(event.returnValues.firstAncestorUnicornId);
//                 // let parent2Id = parseInt(event.returnValues.secondAncestorUnicornId);
//
//                 ut_contract.methods.unicorns(unicornId).call({from: fromAddress})
//                     .then(unicorn => {
//                         // log(unicornId,unicorn);
//
//                         if (!unicorn.gene) {
//                             log('Request past gene for', unicornId, parent1Id, parent2Id);
//                             (async () => {
//                                 return await ut_contract.methods.ownerOf(unicornId).call({from: fromAddress});
//                             })().then(owner => {
//                                 requestUnicornGene(unicornId, owner, parent1Id, parent2Id);
//                             }).catch(e => {
//                                 log('get past owner of ' + unicornId + ' error:', e)
//                             })
//                         }
//                         past_events_semaphore.leave();
//                     }).catch(e => {
//                         log('get past unicorn ' + unicornId + ' error:', e)
//                     })
//             })
//         }
//     });
// let resurrectorInterval = 600000;
// let resurrectorCount = 500;
// let ressurectorLastId = parseInt(args[0] ? args[0] : '0');;
// function ressurector() {
//TODO start/stop commands
/*
let ressurector = setInterval(()=>{
    ressurector_semaphore.take(() => {
        ut_contract.methods.totalSupply().call({from: fromAddress}).then(function (total) {
            let lastId = total - 1
            if (total > resurrectorCount && ressurectorLastId > lastId - resurrectorCount) {
                // ressurector_semaphore.leave();
                // return
                ressurectorLastId = lastId - resurrectorCount
            }
            let fromId = ressurectorLastId;
            //id starts from 0, so lastId = total - 1
            let toId = ressurectorLastId + resurrectorCount < lastId ? ressurectorLastId + resurrectorCount : lastId;
            let resurrectedCnt = 0
            const ressurector_cycle_semaphore = require('semaphore')(1);
            // console.log('unicorns',toId-fromId,'from', fromId, 'to', toId-1);
            // console.log();
            log('[resurrector] cycle start: from', fromId, 'to', toId - 1)
            // for (let unicornId = 0; unicornId < total; unicornId++) {
            ressurector_cycle_semaphore.take(()=> {
                for (let unicornId = ressurectorLastId; unicornId < toId; unicornId++) {
                    past_events_semaphore.take(() => {
                        ut_contract.methods.unicorns(unicornId).call({from: fromAddress}).then(unicorn => {
                            // log('[resurrector] check', unicornId)
                            if (!unicorn.gene) {
                                log('[resurrector] gene need:', unicornId)
                                resurrectedCnt++;
                                // printInfo();
                                ut_contract.methods.ownerOf(unicornId).call({from: fromAddress}).then(currentOwner => {
                                    br_contract.getPastEvents('CreateUnicorn', {
                                        filter: {unicornId: unicornId}, // Using an array means OR: e.g. 20 or 23
                                        fromBlock: 0,
                                        toBlock: 'latest'
                                    }).then(function (events) {
                                        if (events.length == 1) {
                                            let event = events[0]
                                            let unicornId = parseInt(event.returnValues.unicornId);
                                            let parent1Id = parseInt(event.returnValues.parent1);
                                            let parent2Id = parseInt(event.returnValues.parent2);
                                            log('[resurrector] gene update:', unicornId, parent1Id, parent2Id)
                                            requestUnicornGene(unicornId, currentOwner, parent1Id, parent2Id)
                                        } else {
                                            log('[resurrector] wrong events count', unicornId, events.length)
                                        }
                                        // unicorn_sem.leave();
                                    }).catch(log)
                                }).catch(log)
                            } else {
                                //skip existing gene
                                // updOffer(unicornId, updHybr);
                            }
                        }).catch(e=>{
                            log(e)
                            return true
                        }).then(()=>{
                            past_events_semaphore.leave();
                            if (unicornId === toId - 1) {
                                log('[resurrector] cycle finish: from', fromId, 'to', toId - 1)
                                ressurector_cycle_semaphore.leave();
                            }
                        })
                    })
                }
            })
            ressurector_cycle_semaphore.take(()=> {
                ressurectorLastId = toId
                ressurector_cycle_semaphore.leave();
                ressurector_semaphore.leave();
            })
        });
    })
}, resurrectorInterval)
*/

function listenToEvent() {
// bb_contract.events.GeneHybritizationRequest()
  br_contract.events.CreateUnicorn()
    .on('data', function (event) {
      // log(event);
      // let childId = web3.utils.toBN(event.returnValues.unicornId);
      // let parent1Id = web3.utils.toBN(event.returnValues.parent1);
      // let parent2Id = web3.utils.toBN(event.returnValues.parent2);

      let unicornId = parseInt(event.returnValues.unicornId);
      let parent1Id = parseInt(event.returnValues.parent1);
      let parent2Id = parseInt(event.returnValues.parent2);
      let owner = event.returnValues.owner;
      // log('Request new gene for', unicornId, parent1Id, parent2Id);

      requestUnicornGene(unicornId, owner, parent1Id, parent2Id);

    })
    // .on('changed', function (event) {
    //     // remove event from local database
    //     console.warn('REMOVED', event);
    // })
    .on('error', log);


  br_contract.events.HybridizationAccept()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.newUnicornId);
      let firstId = parseInt(event.returnValues.firstUnicornId);
      let secondId = parseInt(event.returnValues.secondUnicornId);
      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(firstId).call({from: fromAddress}),
          ut_contract.methods.ownerOf(secondId).call({from: fromAddress})
        ]);
      })().then(recipients => {
        updateUnicornStatus(
          firstId,
          {
            blockchain_id: firstId,
            candy_breed_cost: '',
            operation_id: 7,
            operation_status_id: 2,
          },
          'pair-accept',
          recipients,
          {
            unicornId: id,
            firstUnicornId: firstId,
            secondUnicornId: secondId,
          });
      })
    })
    // .on('changed', function (event) {
    //     // remove event from local database
    //     console.warn('REMOVED', event);
    // })
    .on('error', log);

  br_contract.events.HybridizationAdd()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.unicornId);
      let price = web3.utils.fromWei(event.returnValues.price, 'ether');

      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(id).call({from: fromAddress})
        ])
      })().then(recipients => {
        updateUnicornStatus(
          id,
          {
            blockchain_id: id,
            candy_breed_cost: price,
            operation_id: 6,
            operation_status_id: 2
          },
          'pair-posted',
          recipients,
          {
            unicornId: id,
            price: price, //TODO check
          });
      })
    })
    .on('error', log);


  br_contract.events.HybridizationDelete()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.unicornId);
      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(id).call({from: fromAddress})
        ]);
      })().then(recipients => {
        updateUnicornStatus(
          id,
          {
            blockchain_id: id,
            candy_breed_cost: '',
            operation_id: 8,
            operation_status_id: 2,
          },
          'pair-revoke',
          recipients,
          {
            unicornId: id,
          });
      })
    })
    .on('error', log);


  br_contract.events.OfferAdd()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.unicornId);
      let _priceEth = web3.utils.toBN(event.returnValues.priceEth);
      let _priceCandy = web3.utils.toBN(event.returnValues.priceCandy);
      // let priceEth = web3.utils.fromWei(event.returnValues.priceEth, 'ether');
      // let priceCandy = web3.utils.fromWei(event.returnValues.priceCandy, 'ether');
      let priceEth = web3.utils.fromWei(_priceEth, 'ether')
      let priceCandy = web3.utils.fromWei(_priceCandy, 'ether')
      if (_priceEth.isZero() && !_priceCandy.isZero()) {
        priceEth = ''
      } else if (_priceCandy.isZero() && !_priceEth.isZero()) {
        priceCandy = ''
      }

      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(id).call({from: fromAddress})
        ]);
      })().then(recipients => {
        updateUnicornStatus(
          id,
          {
            blockchain_id: id,
            cost: priceEth,
            candy_cost: priceCandy,
            operation_id: 2,
            operation_status_id: 2
          },
          'offer-posted',
          recipients,
          {
            unicornId: id,
            priceEth: priceEth,
            priceCandy: priceCandy
          });
      })
    })
    .on('error', log);


  br_contract.events.OfferDelete()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.unicornId);
      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(id).call({from: fromAddress})
        ]);
      })().then(recipients => {
        updateUnicornStatus(
          id,
          {
            blockchain_id: id,
            cost: '',
            candy_cost: '',
            operation_id: 5,
            operation_status_id: 2
          },
          'offer-deleted',
          recipients,
          {
            unicornId: id,
          });
      })
    })
    .on('error', log);


  br_contract.events.UnicornSold()
    .on('data', function (event) {
      let id = parseInt(event.returnValues.unicornId);
      (async () => {
        return await Promise.all([
          ut_contract.methods.ownerOf(id).call({from: fromAddress})
        ]);
      })().then(recipients => {
        updateUnicornStatus(
          id,
          {
            blockchain_id: id,
            cost: '',
            candy_cost: '',
            operation_id: 4,
            operation_status_id: 2
          },
          'purchase-done',
          recipients,
          {
            unicornId: id,
          });
      })
    })
    .on('error', log);


  ut_contract.events.Transfer()
    .on('data', function (event) {
      let unicornId = parseInt(event.returnValues.unicornId);
      // log('Transfer ' + unicornId.toString() + ' from: ' + event.returnValues.from + ' to ' + event.returnValues.to);

      let recipients = [];
      if (!web3.utils.toBN(event.returnValues.from).isZero()) {
        recipients.push(event.returnValues.from);
        publishUnicornEvent('transfer_remove', [event.returnValues.from], {
          unicornId,
          from: event.returnValues.from,
          to: event.returnValues.to
        })
      }
      if (!web3.utils.toBN(event.returnValues.to).isZero()) {
        recipients.push(event.returnValues.to);
        publishUnicornEvent('transfer_add', [event.returnValues.to], {
          unicornId,
          from: event.returnValues.from,
          to: event.returnValues.to
        })
      }
      if (recipients.length > 1) {
        updateUnicornOwner(unicornId, {
            owner_blockchain_id: event.returnValues.to
          }
          // , 'transfer', recipients, {
          //     unicornId,
          //     from: event.returnValues.from,
          //     to: event.returnValues.to
          // }
        )
        // } else {
        //     publishUnicornEvent('transfer', recipients, {
        //         unicornId,
        //         from: event.returnValues.from,
        //         to: event.returnValues.to
        //     })
      }

    })
    // .on('changed', function (event) {
    //     // remove event from local database
    //     console.warn('REMOVED', event);
    // })
    .on('error', log);
}

function publishUnicornEvent(event, recipients, data) {
    log('EVENT:', event, recipients, data);
    redis_pub.publish(process.env.CHANNEL_USER_EVENTS,
        JSON.stringify({
            event,
            data: {
                recipients: recipients,
                data: data
            }
        }));
    // io.emit(event, data);
}

// function updateUnicornStatus(id, status_data, event = null, recipients = null, data = null) {
//
//     // let url = ;
//     // log(url);
//     log(status_data);
//     request({
//         method: 'PUT',
//         uri:  process.env.URL_STATUS + process.env.URL_PARAMS,
//         json: status_data
//     }, function (error, response, body) {
//         if (error) {
//             return console.error(error);
//         }
//         if (response.statusCode == 200) {
//             if (event !== null) {
//                 publishUnicornEvent(event, recipients, data);
//             }
//         } else {
//             log('upd status error:', response.statusCode, response);
//         }
//     })
// }



function updateUnicorn(url, id, update_data, event = null, recipients = null, event_data = null) {
    backend_sem.take(()=> {
        request({
            method: 'PUT',
            uri: url + process.env.URL_PARAMS,
            json: update_data
        }, function (error, response, body) {
            backend_sem.leave();
            if (error) {
                return console.error(error);
            }
            if (response.statusCode == 200) {
                log('update status Ok:', id,event,update_data);
                if (event !== null) {
                    publishUnicornEvent(event, recipients, event_data);
                }
            } else {
                log('update status error:', id, response.statusCode, response.request.path, response.request.body);
            }
        })
    })
}



function updateUnicornStatus(id, status_data, event = null, recipients = null, event_data = null) {
    updateUnicorn(process.env.URL_STATUS, id, status_data, event, recipients, event_data)
}
function updateUnicornOwner(id, owner_data, event = null, recipients = null, event_data = null) {
    updateUnicorn(process.env.URL_OWNER + id, id, owner_data, event, recipients, event_data)
}


function requestUnicornGene(unicornId, owner, parent1Id, parent2Id) {
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
    backend_sem.take(()=> {
        request({
            method: 'POST',
            uri: url,
            json: request_data
        }, function (error, response, body) {
            backend_sem.leave();
            if (response.statusCode == 200) {
                // log('Set '+unicornId+' gene:', body.chain);
                updateUnicornStatus(
                    unicornId,
                    {
                        blockchain_id: unicornId,
                        operation_id: 1,
                        operation_status_id: 2,
                    },
                    'creation',
                    [owner],
                    {
                        unicornId: unicornId,
                        parent1Id,
                        parent2Id,
                        owner: owner,
                        chain: body.chain
                    });
                const data = bb_contract.methods.oracleCallback(unicornId, body.chain).encodeABI();
                transaction_sem.take(() => {
                    log('trying set gene for',unicornId,'nonce:', nonce);
                    web3_signer.eth.sendTransaction(
                        {
                            from: 0, //account index in wallet
                            to: bb_addr,
                            value: 0,
                            gas: process.env.GASLIMIT,
                            gasPrice: process.env.GASPRICE, //1 gwei
                            data,
                            nonce
                        })
                        .on('transactionHash', function (hash) {

                            nonce++;
                            transaction_sem.leave();
                            log('gene ' + unicornId + ' confirm, tx hash:', nonce, hash);
                            publishUnicornEvent('geneconfirm', [
                                owner,
                            ], {
                                // time: +new Date(),
                                id: unicornId,
                                // chain: body.chain
                            })
                        })
                        // .on('receipt', function (receipt) {
                        //     // log(receipt);
                        //
                        // })
                        .catch(e=>{
                            log('crash & respawn', e)
                            initWeb3Signer()
                        });
                })
            } else {
                log('gene request ' + unicornId + ' error: ', response.statusCode, response.request.path, response.request.body);
                // log(body);
            }
        })
    })

}