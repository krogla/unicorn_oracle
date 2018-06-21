'use strict';
require('dotenv').config()
// Add the web3 node module
let Web3 = require('web3');
// const fs = require('fs');
// Show the Hash in the console.
console.log('ApprooveAndCall Test by KRogLA');

// Show web3 where it needs to look for the Ethereum node.
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:7546"));
// The address we want to search by.
let pk = "0xb3de95fd292b03c783287f08f52ef9a7d5030b6261c81fa1a473b00aae1ffca3"

let msg = "my super-duper message!";

web3.eth.accounts.wallet.add(pk);
const my_addr = web3.eth.accounts.wallet[0].address;
console.log(my_addr);


console.log(data);
//

// let data = candy_contract.methods.getPreSaleRank(web3.eth.accounts.wallet[0].address, 4).encodeABI();


