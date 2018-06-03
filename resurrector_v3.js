// 'use strict';
let log = (...args) => { console.log('[' + new Date().toUTCString() + ']', ...args ) };

log('UnicornGO Resurrector by KRogLA');

log('connecting...');

require('dotenv').config();
const backend_sem = require('semaphore')(1);
const unicorn_sem = require('semaphore')(1);
const transaction_semaphore = require('semaphore')(1);
const Web3 = require('web3');
const request = require('request');


const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.NODE_ADDRESS_WS));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NODE_ADDRESS));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ADDRESS));
log('listening on '+process.env.NODE_ADDRESS_WS);
// log('work on '+process.env.INFURA_ADDRESS);

web3.eth.accounts.wallet.add(process.env.RESURRECTOR_KEY);
log('resurrector address:', web3.eth.accounts.wallet[0].address);
// let fromAddress = "0x5a8aAD505a44165813ECDFa213d0615293e33671" //web3.eth.accounts.wallet[0].address
let fromAddress =  web3.eth.accounts.wallet[0].address;
// log('resurrector address:', fromAddress);

const br_addr = process.env.BREEDING_ADDRESS;
const br_old1_addr = process.env.BREEDING_ADDRESS_OLD1;
const brdb_addr = process.env.BREEDINGDB_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;
const ut_addr = process.env.UNICORNTOKEN_ADDRESS;

const br_abi = JSON.parse(process.env.BREEDING_ABI)
const br_old1_abi = JSON.parse(process.env.BREEDING_ABI_OLD1)
const brdb_abi = JSON.parse(process.env.BREEDINGDB_ABI)
const bb_abi = JSON.parse(process.env.BLACKBOX_ABI)
const ut_abi = JSON.parse(process.env.UNICORNTOKEN_ABI)

// Define the br_contract ABI and Address
let br_contract = new web3.eth.Contract(br_abi, br_addr);
let br_old1_contract = new web3.eth.Contract(br_old1_abi, br_old1_addr);
let brdb_contract = new web3.eth.Contract(brdb_abi, brdb_addr);
let bb_contract = new web3.eth.Contract(bb_abi, bb_addr);
let ut_contract = new web3.eth.Contract(ut_abi, ut_addr);
let nonce = 0;

transaction_semaphore.take(() => {
    web3.eth.getTransactionCount(fromAddress, 'pending')
        .then((_nonce) => {
            nonce = _nonce;
            transaction_semaphore.leave();
        })
});

log('reading past events...');
let args = process.argv.slice(2);


function printInfo() {
    // process.stdout.write("\033[F\033[F"+"Add: " + count + " Gene need: " +gene_need+ " Gene upd: " +gene_upd+"\r\n\n");
    // process.stdout.write("\033[F\033[F"+"Add: " + count + " Gene: " +gene_need+ " Market: " +market+ " Breed: " +breed+ " Nomarket: " +nomarket+" Nobreed: " +nobreed+"\r\n\n");
    // process.stdout.write("Add: " + count + " Gene: " +gene+ " Market: " +market+ " Breed: " +breed+ " Nomarket: " +nomarket+" Nobreed: " +nobreed+"\r");
    console.log("Add: " + count + " Gene: " + gene_need + " Market: " + market + " Breed: " + breed + " Nomarket: " + nomarket + " Nobreed: " + nobreed);
}


let count = 0, gene_need = 0, gene_upd = 0, breed = 0, nomarket = 0, nobreed = 0, market = 0;
ut_contract.methods.totalSupply().call({from: fromAddress}).then(function (total) {
    let fromId = parseInt(args[0] ? args[0] : '0');
    let toId = parseInt(args[1]) ? parseInt(args[1] ? args[1] : '0') : total;

    console.log('unicorns',toId-fromId,'from', fromId, 'to', toId-1);
    console.log("\r\n\n");
    // for (let unicornId = 0; unicornId < total; unicornId++) {
    for (let unicornId = fromId; unicornId < toId; unicornId++) { //total
        unicorn_sem.take(() => {
            count = unicornId;
            printInfo();
            // if (count % 50 == 0) {
            //     console.log('processing', count, total)
            // }

            ut_contract.methods.unicorns(unicornId).call({from: fromAddress}).then(unicorn => {
                // log('get gene for:', unicornId, unicorn.gene);
                if (!unicorn.gene) {
                    gene_need++;
                    printInfo();
                    ut_contract.methods.ownerOf(unicornId).call({from: fromAddress}).then(currentOwner => {
                        log('get owner for:', unicornId);
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
                                console.log('upd gene', unicornId, parent1Id, parent2Id, "\n")
                                requestUnicornGene(unicornId, currentOwner, parent1Id, parent2Id)
                            } else if (events.length == 0) {
                                //search for old breeding
                                log('no events for, need OLD breeding', unicornId)
                              br_old1_contract.getPastEvents('CreateUnicorn', {
                                    filter: {unicornId: unicornId}, // Using an array means OR: e.g. 20 or 23
                                    fromBlock: 0,
                                    toBlock: 'latest'
                                }).then(function (events) {
                                    if (events.length == 1) {
                                        let event = events[0]
                                        let unicornId = parseInt(event.returnValues.unicornId);
                                        let parent1Id = parseInt(event.returnValues.parent1);
                                        let parent2Id = parseInt(event.returnValues.parent2);
                                        console.log('upd gene from old breeding ', unicornId, parent1Id, parent2Id, "\n")
                                        requestUnicornGene(unicornId, currentOwner, parent1Id, parent2Id)
                                    }else if (events.length == 0) {

                                    } else {
                                        console.error('wrong events count', unicornId, events.length)
                                    }
                                    // unicorn_sem.leave();
                                }).catch(console.error)
                            } else {
                                log('wrong events count', unicornId, events.length)
                            }
                            // unicorn_sem.leave();
                        }).catch(console.error)
                    }).catch(console.error)
                } else {
                    getUnicornStatus(unicornId);
                }
                unicorn_sem.leave();
            }).catch(console.error)
        })
    }
});

async function getUnicornStatus(unicornId) {
    log('upd status for:', unicornId);
    try {
        let offer = await brdb_contract.methods.offers(unicornId).call({from: fromAddress})
        if (!offer.exists) {
            updateStatus(unicornId, {
                blockchain_id: unicornId,
                cost: '',
                candy_cost: '',
                operation_id: 5,
                operation_status_id: 2
            }, ()=>{
                nomarket++;
                printInfo();
            });
        } else {
            let _priceEth = web3.utils.toBN(offer.priceEth);
            let _priceCandy = web3.utils.toBN(offer.priceCandy);
            let priceEth = web3.utils.fromWei(_priceEth, 'ether')
            let priceCandy = web3.utils.fromWei(_priceCandy, 'ether')
            if (_priceEth.isZero() && !_priceCandy.isZero()) {
                priceEth = ''
            } else if (_priceCandy.isZero() && !_priceEth.isZero()) {
                priceCandy = ''
            }
            updateStatus(unicornId, {
                blockchain_id: unicornId,
                cost: priceEth,
                candy_cost: priceCandy,
                operation_id: 2,
                operation_status_id: 2
            }, ()=>{
                market++;
                printInfo();
            });
        }
        let hybr = await brdb_contract.methods.hybridizations(unicornId).call({from: fromAddress})
        if (!hybr.exists) {
            updateStatus(unicornId, {
                blockchain_id: unicornId,
                candy_breed_cost: '',
                operation_id: 8,
                operation_status_id: 2,
            }, ()=>{
                nobreed++;
                printInfo();
            });
        } else {

            let price = web3.utils.fromWei(hybr.price, 'ether')
            updateStatus(unicornId, {
                blockchain_id: unicornId,
                candy_breed_cost: price,
                operation_id: 6,
                operation_status_id: 2
            }, ()=>{
                breed++;
                printInfo();
            });
        }
    } catch (e) {
        console.error(e)
    }
}


function updateStatus(id, status_data, callback = null) {
    backend_sem.take(() => {
        // log('try set status:',status_data);
        request({
            method: 'PUT',
            uri: process.env.URL_STATUS + process.env.URL_PARAMS,
            json: status_data
        }, function (error, response, body) {
            backend_sem.leave();
            if (error) {
                return console.error('backend error', error);
            }
            if (response.statusCode == 200) {
                log('upd status ok', id);
                if (callback) {
                    callback(id)
                }
            } else {
                log('upd status error:', id, response.statusCode, response.request.path, response.request.body, response.body);
                // log('upd status error', id, response);
            }
        })
    })
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
    backend_sem.take(() => {
        request({
            method: 'POST',
            uri: url,
            json: request_data
        }, function (error, response, body) {
            gene_upd++;
            printInfo();
            backend_sem.leave();
            if (response.statusCode == 200) {
                log('Set '+unicornId+' gene:', body.chain);
                updateStatus(unicornId, {
                    blockchain_id: unicornId,
                    operation_id: 1,
                    operation_status_id: 2,
                });
                const data = bb_contract.methods.resurrectorCallbackWithdraw(unicornId, body.chain).encodeABI();
                transaction_semaphore.take(() => {
                    web3.eth.sendTransaction(
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
                            // log('Nonce for '+unicornId+':', nonce);
                            nonce++;
                            transaction_semaphore.leave();
                            log('set gene', unicornId, 'tx hash:', hash);
                        })
                        .on('receipt', function (receipt) {
                            log('gene', unicornId, 'confirm, block', receipt.blockNumber);
                        })
                        .catch(log);
                })
            } else {
                log('gene request ' + unicornId + ' error: ', response.statusCode, response.request.path, response.request.body);
                // log(body);
            }
        })
    })

}