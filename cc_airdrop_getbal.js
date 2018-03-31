// 'use strict';
console.log('AirDropper/Sender by KRogLA');
console.log('connecting...');

require('dotenv').config()
const sem = require('semaphore')(1)
// Add the web3 node module
const Web3 = require('web3');

// Show web3 where it needs to look for the Ethereum node.
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Show the Hash in the console.

// web3.eth.accounts.wallet.add(process.env.OWNER_KEY);

// const candy_addr = "0xc9eA5D257abe756fe1BDB8b4F2725519dCf81237";
// const candy_abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"setCrowdsaleContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}];
// const candy_contract = new web3.eth.Contract(candy_abi, candy_addr);

const MongoClient    = require('mongodb').MongoClient;

function printInfo() {
    process.stdout.write("\033[F"+"Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated+ "\r\n");
    // console.log("Add: " + count + " Send: " +send+ " Not send: " +notsend+ " Updated: " +updated);
}

let count = 0, send = 0, notsend = 0, updated = 0;

function updBal(holders, holder) {
    web3.eth.getBalance(holder.address)
        .then(balance => {
            // console.log(holder.address, balance)
            holders.updateOne({_id: holder._id}, {$set: {balance: balance}}, (error, result) => {
                // console.log(error, result)
                if (!error) {
                    updated++
                    printInfo()
                } else {
                    console.error(error);
                }
            });
        })
        .catch(console.error)
}

MongoClient.connect("mongodb://localhost:27017", function(err, client) {
    if (err) { return console.dir(err); }
    // console.log("We are connected");
    const db = client.db('ccairdrop');
    let holders = db.collection('holders');

    holders.find({}) //.limit(10)
        .each((err, holder) => {
            if(holder) {
                // console.log(holder)
                // return
                count++
                printInfo()
                sem.take(() => {
                    web3.eth.getBalance(holder.address, (error, balance) => {
                        if (!error) {
                            send++
                            // console.log(holder.address, parseFloat(web3.utils.fromWei(balance)))
                            holders.updateOne({_id: holder._id}, {$set: {balance: parseFloat(web3.utils.fromWei(balance))}}, (error, result) => {
                                // console.log(error, result)
                                if (!error) {
                                    updated++
                                    printInfo()
                                } else {
                                    console.error(error);
                                }
                            });
                        } else {
                            notsend++
                            console.error(error);
                        }
                        printInfo()
                        sem.leave();
                    })
                })
            }
        });

    process.stdout.write("\n");
})
