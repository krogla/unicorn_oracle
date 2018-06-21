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
// const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_ADDRESS_WS));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NODE_ADDRESS_HTTP));
// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ADDRESS));
log('listening on '+process.env.INFURA_ADDRESS_WS);
log('work on '+process.env.INFURA_ADDRESS);
// web3.eth.accounts.wallet.add(process.env.RESURRECTOR_KEY);
web3.eth.accounts.wallet.add(process.env.ORACLE_KEY);
log('resurrector address:', web3.eth.accounts.wallet[0].address);

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
let nonce;

transaction_semaphore.take(() => {
  web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending')
    .then((_nonce) => {
      nonce = _nonce;
      log(_nonce)
      transaction_semaphore.leave();
    })
});