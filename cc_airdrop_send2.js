'use strict';
console.log('AirDropper/Sender by KRogLA');
console.log('connecting...');

require('dotenv').config()
// Add the web3 node module
const Web3 = require('web3');

// Show web3 where it needs to look for the Ethereum node.
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// Show the Hash in the console.

web3.eth.accounts.wallet.add(process.env.OWNER_KEY);

const candy_addr = "0xc9eA5D257abe756fe1BDB8b4F2725519dCf81237";
const candy_abi =
    [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"setCrowdsaleContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]
;
const candy_contract = new web3.eth.Contract(candy_abi, candy_addr);


const MongoClient    = require('mongodb').MongoClient;

// async function recursiveCursor(holders, cursor, nonce) {
//     let result = (await cursorReslover(holders, cursor, nonce))
//         // .then((result) => {
//             if (result) {
//                 recursiveCursor(holders, cursor, nonce+1);
//             }
//         // })
//         // .catch(console.error);
// }
//
// function syncTrans(nonce, data) {
//     return new Promise((resolve, reject) => {
//         web3.eth.sendTransaction(
//             {
//                 from: 0, //account index in wallet
//                 to: candy_addr,
//                 value: 0,
//                 gas: 500000,
//                 gasPrice: 2000000000, //2 gwei
//                 data,
//                 nonce
//             })
//             .on('receipt', function (receipt) {
//                 // console.log("send 1Candy to :"+doc.address)
//                 resolve(receipt)
//             })
//             .on('error', (err) => {
//                 reject(err)
//             });
//     })
// }
//
// function cursorReslover(holders, cursor, nonce) {
//     return new Promise((resolve, reject) => {
//         (async () => {
//             if (await cursor.hasNext()) {
//
//                 //...
//                 resolve(true);
//             }
//             resolve(false);
//         })();
//     })
// }
let count = 0, send = 0, notsend = 0, updated = 0;
// let nonce = 0, prevnonce = 0;
// let holders
// Connect to the db
let batch = new web3.BatchRequest();

MongoClient.connect("mongodb://localhost:27017", function(err, client) {
    if (err) { return console.dir(err); }
    // console.log("We are connected");
    const db = client.db('ccairdrop');
    let holders = db.collection('holders');

    let cursor =  holders.find({ count: { $gt: 1 }, contract: false, candy: 1}).sort({count: -1}).limit(50);
    web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending')
        .then((nonce) => {
            // nonce = _nonce
            // recursiveCursor(holders, cursor, _nonce)
            (async () => {
                // let next =
                while(await cursor.hasNext()) {
                    let holder = await cursor.next();
                    count++
                    holders.updateOne({_id: holder._id}, {$set : {candy:0}}, (error, result) => {
                        if (!error) {
                            updated++
                            process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");
                        }
                    });

                    // console.log(r.modifiedCount);
                    process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");

                    const data = candy_contract.methods.transfer(holder.address, web3.utils.toWei('1', 'ether')).encodeABI();
                    // console.log(holder.address);
                    // let nonce = (await web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending'));
                    // if (nonce )
                    // console.log(nonce);
                    // process.stdout.write("Send " + count + "confirmed: " +send+ "\r");
                    // r = await syncTrans(nonce, data)
                    // console.log(r);
                    nonce++
                    batch.add(
                        web3.eth.sendTransaction(
                            {
                                from: 0, //account index in wallet
                                to: candy_addr,
                                value: 0,
                                gas: 250000,
                                gasPrice: 2000000000, //2 gwei
                                data,
                                // nonce
                            }, (error, hash) => {
                                if (error) {
                                    notsend++
                                    console.log("send tr err:", error)
                                } else {
                                    send++
                                }
                                process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");
                            }
                            )
                            // .on('receipt', function(receipt){
                            //     send++
                            //     // console.log( //receipt.logs[0], receipt.logs[0].topics, receipt.logs[0].topics[2],
                            //         // web3.utils.toChecksumAddress(receipt.logs[0].topics[2]))
                            //     process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");
                            //     // holders.updateOne({"address": web3.utils.toChecksumAddress(receipt.to)}, {$set : {candy:0}}, (error, result) => {
                            //     //     if (!error) {
                            //     //         updated++
                            //     //         process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");
                            //     //     }
                            //     // });
                            //
                            //
                            // })
                            // .on('error', error => {
                            //     notsend++
                            //     console.log("send tr err:", error)
                            //     process.stdout.write("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r");
                            // })
                    );

                }
            })();


            // console.log(batch)
            batch.execute()
        })


            // //limit(1).
/*
    holders.find({ count: { $gt: 1 }, contract: false, candy: 1}).sort({count: -1}).limit(2).each(function(err, doc) {
            if (err) { return console.dir(err) }
            if(!doc) { return false }
            (async () => {
                try {
                    process.stdout.write("Send " + count + "confirmed: " +send+ "\r");

                    // console.log(doc);
                    let r = (await holders.updateOne({"_id": doc._id}, {$set : {candy:1}}));
                    // console.log(r.modifiedCount);
                    count++;
                    //sending 1 coin
                    const data = candy_contract.methods.transfer(doc.address, web3.utils.toWei('1', 'ether')).encodeABI();
                    console.log(doc.address);
                    if (nonce == 0) {
                        nonce = (await web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending'));
                    } else {
                        nonce++
                    }
                    // if (nonce )
                    // console.log(nonce);
                    process.stdout.write("Send " + count + "confirmed: " +send+ "\r");
                    r = (await ((nonce, data)=>{
                        return new Promise((resolve, reject) => {
                            web3.eth.sendTransaction(
                                {
                                    from: 0, //account index in wallet
                                    to: candy_addr,
                                    value: 0,
                                    gas: 500000,
                                    gasPrice: 3000000000, //20 gwei
                                    data,
                                    nonce
                                })
                                .on('receipt', function (receipt) {
                                    // console.log("send 1Candy to :"+doc.address)
                                    resolve(receipt)
                                })
                                .on('error', (err) => {
                                    reject(err)
                                });
                        })
                    })());
                    console.log(r);
                    send++;
                    process.stdout.write("Send " + count + "confirmed: " +send+ "\r");


                }  catch (e) {
                    console.error(e);
                }
            })();

        });
*/
    process.stdout.write("\n");
})
