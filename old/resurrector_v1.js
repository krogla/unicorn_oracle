// 'use strict';
let log = console.log.bind( console, "[" + new Date().toUTCString() + ']' );

log('UnicornGO Resurrector by KRogLA/Eugene');

log('connecting...');

require('dotenv').config();
const sem = require('semaphore')(1);
const sem1 = require('semaphore')(1);
const Web3 = require('web3');
const request = require('request');


const URL = "ws://"+process.env.NODE_ADDRESS;
const web3 = new Web3(new Web3.providers.WebsocketProvider(URL));
log('working on '+URL);
web3.eth.accounts.wallet.add(process.env.OWNER_KEY);
log('resurrector address:', web3.eth.accounts.wallet[0].address);
const br_addr = process.env.BREEDING_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;
const ut_addr = process.env.UNICORNTOKEN_ADDRESS;
const bb_addr_old1 = process.env.BLACKBOX_ADDRESS_OLD1;
//const bb_addr_old2 = process.env.BLACKBOX_ADDRESS_OLD2;

// Define the br_contract ABI
const br_abi = [{"constant":true,"inputs":[],"name":"isGamePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hybridizations","outputs":[{"name":"listIndex","type":"uint256"},{"name":"price","type":"uint256"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"getHybridizationPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_price","type":"uint256"}],"name":"makeHybridization","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"getOfferPriceCandy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"market","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"minusFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_priceEth","type":"uint256"},{"name":"_priceCandy","type":"uint256"}],"name":"sellUnicorn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"cancelHybridization","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCreateUnicornPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"buyUnicornWithEth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_count","type":"uint256"},{"name":"_owner","type":"address"}],"name":"createPresaleUnicorns","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"minusTourFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_step","type":"uint256"}],"name":"setGen0Step","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"createUnicornForCandy","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"unicornToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hybridizationList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"getOfferPriceEth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"deleteOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gen0PresaleLimit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gen0PresaleCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"offers","outputs":[{"name":"marketIndex","type":"uint256"},{"name":"priceEth","type":"uint256"},{"name":"priceCandy","type":"uint256"},{"name":"exists","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"createUnicorn","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unicornManagement","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"candyToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"candyPowerToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"revokeUnicorn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gen0Count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"blackBox","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"deleteHybridization","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"buyUnicornWithCandy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"plusTourFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gen0Step","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_firstUnicornId","type":"uint256"},{"name":"_secondUnicornId","type":"uint256"}],"name":"acceptHybridization","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getEtherFeeForPriceInCandy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gen0Limit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hybridizationListSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"marketSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setGen0Limit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCreateUnicornPriceInCandy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"transferEthersToDividendManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_unicornManagementAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"HybridizationAdd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"firstUnicornId","type":"uint256"},{"indexed":true,"name":"secondUnicornId","type":"uint256"},{"indexed":false,"name":"newUnicornId","type":"uint256"}],"name":"HybridizationAccept","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"HybridizationDelete","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dividendManager","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"FundsTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"parent1","type":"uint256"},{"indexed":false,"name":"parent2","type":"uint256"}],"name":"CreateUnicorn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"limit","type":"uint256"}],"name":"NewGen0Limit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"step","type":"uint256"}],"name":"NewGen0Step","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"priceEth","type":"uint256"},{"indexed":false,"name":"priceCandy","type":"uint256"}],"name":"OfferAdd","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"OfferDelete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"UnicornSold","type":"event"}];
const bb_abi = [{"anonymous":false,"inputs":[{"indexed":false,"name":"dividendManager","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"FundsTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"createGen0","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_childUnicornId","type":"uint256"},{"name":"_parent1UnicornId","type":"uint256"},{"name":"_parent2UnicornId","type":"uint256"}],"name":"geneCore","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"unicornId","type":"uint256"},{"name":"gene","type":"string"}],"name":"oracleCallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"unicornId","type":"uint256"},{"name":"gene","type":"string"}],"name":"setGeneManual","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"Gene0Request","type":"event"},{"constant":false,"inputs":[{"name":"_ownOracle","type":"address"}],"name":"setOwnOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"firstAncestorUnicornId","type":"uint256"},{"indexed":false,"name":"secondAncestorUnicornId","type":"uint256"}],"name":"GeneHybritizationRequest","type":"event"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"transferEthersToDividendManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"inputs":[{"name":"_unicornManagementAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"isGamePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unicornManagement","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unicornToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
const ut_abi = [{"constant":true,"inputs":[],"name":"isGamePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"approvedFor","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"getGen","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_gene","type":"bytes"}],"name":"setGene","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"plusFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_time","type":"uint64"}],"name":"minusFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_gene","type":"bytes"}],"name":"updateGene","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_byteNo","type":"uint256"}],"name":"getUnicornGenByte","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"unicorns","outputs":[{"name":"gene","type":"bytes"},{"name":"birthTime","type":"uint64"},{"name":"freezingEndTime","type":"uint64"},{"name":"freezingTourEndTime","type":"uint64"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_claimant","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"owns","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"approveForGeneLab","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unicornManagement","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"unicornsOf","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_time","type":"uint64"}],"name":"minusTourFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"takeOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"clearApprovalForGeneLab","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"marketTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unicornBreeding","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"isTourUnfreezed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"isUnfreezed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"createUnicorn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"plusTourFreezingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_unicornId","type":"uint256"}],"name":"allowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"},{"name":"_name","type":"string"}],"name":"setName","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_unicornManagementAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"unicornId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":false,"name":"unicornId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"UnicornGeneSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"UnicornGeneUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"UnicornFreezingTimeSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"UnicornTourFreezingTimeSet","type":"event"}];
const bb_abi_old1 = [{"constant":false,"inputs":[{"name":"_gene0Url","type":"string"}],"name":"setGene0Url","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isGamePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"createGen0","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_childUnicornId","type":"uint256"},{"name":"_parent1UnicornId","type":"uint256"},{"name":"_parent2UnicornId","type":"uint256"}],"name":"geneCore","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"unicornId","type":"uint256"},{"name":"gene","type":"string"}],"name":"setGeneManual","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unicornToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"geneCoreRetry","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"ownOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_geneCoreUrl","type":"string"}],"name":"setGeneCoreUrl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unicornManagement","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"queueSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_unicornId","type":"uint256"}],"name":"createGen0Retry","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newPrice","type":"uint256"}],"name":"setGasPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_ownOracle","type":"address"}],"name":"setOwnOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"queue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"init","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newGasLimit","type":"uint256"}],"name":"setGasLimit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_useOwnOracle","type":"bool"}],"name":"setUseOwnOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"useOwnOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"transferEthersToDividendManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_unicornManagementAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"Gene0Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"},{"indexed":false,"name":"firstAncestorUnicornId","type":"uint256"},{"indexed":false,"name":"secondAncestorUnicornId","type":"uint256"}],"name":"GeneHybritizationRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"Gene0RequestRetry","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"unicornId","type":"uint256"}],"name":"GeneHybritizationRequestRetry","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dividendManager","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"FundsTransferred","type":"event"}];
// Define the br_contract ABI and Address
let br_contract = new web3.eth.Contract(br_abi, br_addr);
let bb_contract = new web3.eth.Contract(bb_abi, bb_addr);
let ut_contract = new web3.eth.Contract(ut_abi, ut_addr);
let bb_contract_old1 = new web3.eth.Contract(bb_abi_old1, bb_addr_old1);
let nonce = 0;

sem.take(()=> {
    web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending')
        .then((_nonce) => {
            nonce = _nonce;
            sem.leave();
        })
});

log('reading past events...');

function printInfo() {
    // process.stdout.write("\033[F"+"Add: " + count + " Gene: " +gene+ " Market: " +market+ " Breed: " +breed+ " Nomarket: " +nomarket+" Nobreed: " +nobreed+"\r\n");
    process.stdout.write("Add: " + count + " Gene: " +gene+ " Market: " +market+ " Breed: " +breed+ " Nomarket: " +nomarket+" Nobreed: " +nobreed+"\r");
}

let count = 0, gene = 0, market = 0, breed = 0, nomarket = 0, nobreed = 0;

// bb_contract_old1.getPastEvents('GeneHybritizationRequest', {
// bb_contract.getPastEvents('GeneHybritizationRequest', {
// bb_contract_old1.getPastEvents('Gene0Request', {
// bb_contract.getPastEvents('Gene0Request', {
br_contract.getPastEvents('CreateUnicorn', {
        filter: {unicornId: [805,806]}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    })
    .then(function (events) {
        console.log('Total events:',events.length)
        for (let i = 0; i < events.length; i++) {
            sem1.take(()=> {
                let event = events[i];
                console.log(event)
                count++;
                printInfo();

                let unicornId = parseInt(event.returnValues.unicornId);
                // let parent1Id = parseInt(event.returnValues.parent1);
                let parent1Id = parseInt(event.returnValues.firstAncestorUnicornId);
                // let parent2Id = parseInt(event.returnValues.parent2);
                let parent2Id = parseInt(event.returnValues.secondAncestorUnicornId);
                // let owner = event.returnValues.owner;


                ut_contract.methods.unicorns(unicornId).call({from: web3.eth.accounts.wallet[0].address})
                    .then(unicorn => {
                        // log(unicornId,unicorn);

                        if (!unicorn.gene) {
                            // log('Request gen for', unicornId);
                            (async () => {
                                return await ut_contract.methods.ownerOf(unicornId).call({from: web3.eth.accounts.wallet[0].address});
                            })().then(owner => {
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
                                } else {
                                    url = process.env.URL_GEN0 + process.env.URL_PARAMS;
                                    request_data = {
                                        unicorn_blockchain_id: unicornId,
                                        owner_blockchain_id: owner
                                    };
                                }
                                log('Request gen for', unicornId, url, request_data);
                                // request({
                                //     method: 'POST',
                                //     uri: url,
                                //     json: request_data
                                // }, function (error, response, body) {
                                //     if (response.statusCode == 200) {
                                //         gene++;
                                //         printInfo();
                                //         log('Set ' + unicornId + ' gene:', body.chain);
                                //         updateStatus(unicornId, {
                                //             blockchain_id: unicornId,
                                //             operation_id: 1,
                                //             operation_status_id: 2,
                                //         });
                                //
                                //         const data = bb_contract.methods.oracleCallback(unicornId, body.chain).encodeABI();
                                //         sem.take(()=> {
                                //             web3.eth.sendTransaction(
                                //                 {
                                //                     from: 0, //account index in wallet
                                //                     to: bb_addr,
                                //                     value: 0,
                                //                     gas: 500000,
                                //                     gasPrice: process.env.GASLIMIT, //2.5 gwei
                                //                     data,
                                //                     nonce
                                //                 })
                                //                 .on('transactionHash', function (hash) {
                                //                     log('Nonce for '+unicornId+':', nonce);
                                //                     nonce++;
                                //                     sem.leave();
                                //                     log('Gene '+unicornId+' confirm, tx hash:', hash);
                                //                 })
                                //                 .catch(e=>{log('write gene of '+unicornId+':', e)})
                                //         })
                                //     } else {
                                //         log('gene request ' + unicornId + ' error: ', response.statusCode, response.request.path, response.request.body);
                                //     }
                                // })
                            }).catch(e => {
                                log('get owner of ' + unicornId + ' error:', e.message)
                            })
                        }
                        sem1.leave();
                    }).catch(e => {
                        log('get unicorn ' + unicornId + ' error:', e.message)
                    })
            })
        }
    });

function updateStatus(id, status_data) {
    log(status_data);
    request({
        method: 'PUT',
        uri:  process.env.URL_STATUS + process.env.URL_PARAMS,
        json: status_data
    }, function (error, response, body) {
        if (error) {
            return console.error(error);
        }
        if (response.statusCode != 200) {
        //     log('upd status '+id+' ok:');
        // } else {
            log('upd status '+id+' error:', response.statusCode, response.request.path, response.request.body);
        }
    })
}