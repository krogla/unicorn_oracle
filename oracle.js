'use strict';
require('dotenv').config()
// Add the web3 node module
const Web3 = require('web3');
const request = require('request');

// Show web3 where it needs to look for the Ethereum node.
// web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/YOUR-API-TOKEN-HERE'));
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545"));

// The address we want to search by.
const br_addr = process.env.BREEDING_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;

const owner = process.env.OWNER;
web3.eth.defaultAccount = owner;

// Show the Hash in the console.
console.log('Events by Address: ' + br_addr);

// Define the br_contract ABI
const br_abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "isGamePaused",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "hybridizations",
        "outputs": [
            {
                "name": "listIndex",
                "type": "uint256"
            },
            {
                "name": "price",
                "type": "uint256"
            },
            {
                "name": "exists",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "getHybridizationPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            },
            {
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "makeHybridization",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "market",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "minusFreezingTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "cancelHybridization",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCreateUnicornPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "getOfferPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_count",
                "type": "uint256"
            },
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "createPresaleUnicorns",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "minusTourFreezingTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_step",
                "type": "uint256"
            }
        ],
        "name": "setGen0Step",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "createUnicornForCandy",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unicornToken",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            },
            {
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "sellUnicorn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "hybridizationList",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "deleteOffer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0PresaleLimit",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0PresaleCount",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "offers",
        "outputs": [
            {
                "name": "marketIndex",
                "type": "uint256"
            },
            {
                "name": "price",
                "type": "uint256"
            },
            {
                "name": "exists",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "createUnicorn",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdrawTokens",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unicornManagement",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "candyToken",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "candyPowerToken",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "revokeUnicorn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "buyUnicorn",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0Count",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "blackBox",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "deleteHybridization",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "plusTourFreezingTime",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0Step",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_firstUnicornId",
                "type": "uint256"
            },
            {
                "name": "_secondUnicornId",
                "type": "uint256"
            }
        ],
        "name": "acceptHybridization",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getEtherFeeForPriceInCandy",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "init",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "gen0Limit",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "hybridizationListSize",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "marketSize",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "setGen0Limit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCreateUnicornPriceInCandy",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferEthersToDividendManager",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_unicornManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "HybridizationAdd",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "firstUnicornId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "secondUnicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "newUnicornId",
                "type": "uint256"
            }
        ],
        "name": "HybridizationAccept",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "HybridizationDelete",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "dividendManager",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "FundsTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "parent1",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "parent2",
                "type": "uint256"
            }
        ],
        "name": "CreateUnicorn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "limit",
                "type": "uint256"
            }
        ],
        "name": "NewGen0Limit",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "step",
                "type": "uint256"
            }
        ],
        "name": "NewGen0Step",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "price",
                "type": "uint256"
            }
        ],
        "name": "OfferAdd",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "OfferDelete",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "UnicornSold",
        "type": "event"
    }
];
const bb_abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "unicornToken",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unicornManagement",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isGamePaused",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "queue",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "queueSize",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "geneCoreRetry",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "createGen0Retry",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "dividendManager",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "FundsTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "name": "_unicornManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newPrice",
                "type": "uint256"
            }
        ],
        "name": "setGasPrice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "createGen0",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_gene0Url",
                "type": "string"
            }
        ],
        "name": "setGene0Url",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "hash",
                "type": "bytes32"
            },
            {
                "name": "result",
                "type": "string"
            }
        ],
        "name": "__callback",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "unicornId",
                "type": "uint256"
            },
            {
                "name": "gene",
                "type": "string"
            }
        ],
        "name": "setGeneManual",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferEthersToDividendManager",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "Gene0Request",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "Gene0RequestRetry",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "firstAncestorUnicornId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "secondAncestorUnicornId",
                "type": "uint256"
            }
        ],
        "name": "GeneHybritizationRequest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "GeneHybritizationRequestRetry",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_childUnicornId",
                "type": "uint256"
            },
            {
                "name": "_parent1UnicornId",
                "type": "uint256"
            },
            {
                "name": "_parent2UnicornId",
                "type": "uint256"
            }
        ],
        "name": "geneCore",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "init",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_geneCoreUrl",
                "type": "string"
            }
        ],
        "name": "setGeneCoreUrl",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_newGasLimit",
                "type": "uint256"
            }
        ],
        "name": "setGasLimit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    }
];

// Define the br_contract ABI and Address
const br_contract = new web3.eth.Contract(br_abi, br_addr);
const bb_contract = new web3.eth.Contract(bb_abi, bb_addr);


// var lastId = 2;
// Search the br_contract events for the hash in the event logs and show matching events.
// br_contract.getPastEvents('NewGeneRequest', {
//     filter: {_from: br_addr},
//     fromBlock: 0,
//     toBlock: 'latest'
// }, function (error, events) {
//     //console.log(events);
//     for (i = 0; i < events.length; i++) {
//         var eventObj = events[i];
//         console.log('id: ' + eventObj.returnValues.id);
//         console.log('name: ' + eventObj.returnValues.name);
//         // console.log('Greeting: ' + web3.utils.hexToAscii(eventObj.returnValues.name));
//     }
// });

//past
// br_contract.getPastEvents('CreateUnicorn', {
//     // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 0,
//     toBlock: 'latest'
// }
// // , function (error, events) {
// //     console.log(events);
// // }
// )
//     .then(function (events) {
//         for (i = 0; i < events.length; i++) {
//             var eventObj = events[i];
//             console.log('id: ' + eventObj.returnValues.unicornId);
//             console.log('owner: ' + eventObj.returnValues.owner);
//             // console.log('Greeting: ' + web3.utils.hexToAscii(eventObj.returnValues.name));
//         }
//     });

// br_contract.events.allEvents({
//     // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 0,
//     toBlock: 'latest'
// }).get((error, eventResult) => {
//     if (error)
//     console.log('Error in myEvent event handler: ' + error);
// else
// console.log('myEvent: ' + JSON.stringify(eventResult.args));
// });

// web3.eth.accounts.wallet.add('0xb3de95fd292b03c783287f08f52ef9a7d5030b6261c81fa1a473b00aae1ffca3');
const account = web3.eth.accounts.privateKeyToAccount(process.env.OWNER_KEY);
// const testFn = TestContract.methods.test(testAddress)
// const gas = await testFn.estimateGas()
// const data = testFn.encodeABI()
// const nonce = await web3.eth.getTransactionCount(SENDER_ADDRESS, 'pending')
// const payload = {
//     nonce,
//     data,
//     gas,
//     from: SENDER_ADDRESS,
//     to: testContractAddress
// }
// const signedTx = await account.signTransaction(payload, account.privateKey)
// const { rawTransaction } = signedTx
// const response = await web3.eth.sendSignedTransaction(rawTransaction)
// console.log(account.address);
// return;
//cur
br_contract.events.CreateUnicorn({
        // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest'
    }
// , function(error, event){ console.log(event); }
)
    .on('data', function (event) {
        // console.log(event);
        // var childId = web3.utils.toBN(event.returnValues.unicornId);
        // var parent1Id = web3.utils.toBN(event.returnValues.parent1);
        // var parent2Id = web3.utils.toBN(event.returnValues.parent2);

        let childId = parseInt(event.returnValues.unicornId);
        let parent1Id = parseInt(event.returnValues.parent1);
        let parent2Id = parseInt(event.returnValues.parent2);

        console.log('Request gen for: ' + childId.toString());
        let request_data;
        let url;
        if (parent1Id || parent2Id) {
            url = process.env.URL_HYBR;
            request_data = {
                parents: [
                    {unicorn_blockchain_id: parent1Id},
                    {unicorn_blockchain_id: parent2Id}
                ],
                parent_idx: 1,
                unicorn_blockchain_id: childId,
                owner_blockchain_id: event.returnValues.owner
            };
        } else {
            url = process.env.URL_GEN0;
            request_data = {
                unicorn_blockchain_id: childId,
                owner_blockchain_id: event.returnValues.owner
            };
        }
        request({
            method: 'POST',
            uri: url,
            json: request_data
        }, function (error, response, body) {
            if (response.statusCode == 200) {
                console.log('Set unicorn gen: ' + body.chain);

                // var fnSetGen = bb_contract.methods.setGeneManual(childId, body.chain);
                web3.eth.getTransactionCount(account.address, 'pending', (error, nonce) => {
                    if (error) {
                        console.error(error)
                        return
                    }
                    const data = bb_contract.methods.setGeneManual(childId, body.chain).encodeABI();
                    const payload = {
                        nonce,
                        data,
                        gas: 400000,
                        from: account.address,
                        to: bb_addr
                    };
                    console.log(payload);
                    return;
                    account.signTransaction(payload, account.privateKey, (error, signedTx) => {
                        if (error) {
                            console.error(error)
                            return
                        }
                        // const { raw } = signedTx;
                        console.log(signedTx)
                        // return;
                        // web3.eth.sendSignedTransaction(rawTransaction)
                        //
                        // // web3.eth.sendTransaction(
                        // //     // .send(
                        // //     {
                        // //     from: owner,
                        // //     to: bb_addr,
                        // //     value: 0,
                        // //     gas: 500000,
                        // //     // gasPrice: 5000000000, //5 gwei
                        // //     data: data
                        // // })
                        // // using the event emitter
                        //     .on('transactionHash', function (hash) {
                        //         //...
                        //     })
                        //     .on('receipt', function (receipt) {
                        //         console.log(receipt)
                        //     })
                        //     .on('confirmation', function (confirmationNumber, receipt) {
                        //         //...
                        //     })
                        //     .on('error', console.error)
                    });
                });

            } else {
                console.log('error: ' + response.statusCode);
                console.log(body);
            }
        })
    })
    .on('changed', function (event) {
        // remove event from local database
        console.warn('REMOVED', event)
    })
    .on('error', console.error);

