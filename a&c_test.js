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

// let a = web3.utils.fromWei("12312312312312239847234", 'ether');
// let b = parseFloat(a);
// let c = parseInt(a);
//
// console.log('fromWei', a, typeof a);
// console.log('parseFloat', b, typeof b);
// console.log('parseInt',c, typeof c);
// process.exit();


web3.eth.accounts.wallet.add("0xb3de95fd292b03c783287f08f52ef9a7d5030b6261c81fa1a473b00aae1ffca3");

const candy_addr = "0xc9eA5D257abe756fe1BDB8b4F2725519dCf81237"; //rinkeby
// const candy_addr = "0x325B19293FA45B9a34aC10944e428E95d5377761"; //local
const candy_abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"crowdsaleContract","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"contractAddress","type":"address"}],"name":"setCrowdsaleContract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}];
const candy_contract = new web3.eth.Contract(candy_abi, candy_addr);

// const rank_addr = "0x73390d79c6f64aeb9a860985f71f28c220f31c36";
// const rank_abi = [
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "isGamePaused",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "buyRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_landLimit",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_priceCandy",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_priceEth",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_title",
//                 "type": "string"
//             }
//         ],
//         "name": "addRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "name": "userRanks",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             }
//         ],
//         "name": "getUserLandLimit",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             },
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getPreSaleRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "landManagement",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getRankPriceEth",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "withdrawTokens",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_value",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_token",
//                 "type": "address"
//             },
//             {
//                 "name": "_extraData",
//                 "type": "bytes"
//             }
//         ],
//         "name": "receiveApproval",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getRankPriceCandy",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_priceCandy",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_priceEth",
//                 "type": "uint256"
//             }
//         ],
//         "name": "editRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "candyToken",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             }
//         ],
//         "name": "getUserRank",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getRankTitle",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             }
//         ],
//         "name": "getNextRank",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             },
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getIndividualPrice",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "buyNextRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "name": "ranks",
//         "outputs": [
//             {
//                 "name": "landLimit",
//                 "type": "uint256"
//             },
//             {
//                 "name": "priceCandy",
//                 "type": "uint256"
//             },
//             {
//                 "name": "priceEth",
//                 "type": "uint256"
//             },
//             {
//                 "name": "title",
//                 "type": "string"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "ranksCount",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [],
//         "name": "init",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_user",
//                 "type": "address"
//             },
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getRank",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "getRankLandLimit",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "inputs": [
//             {
//                 "name": "_landManagementAddress",
//                 "type": "address"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "wallet",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "value",
//                 "type": "uint256"
//             }
//         ],
//         "name": "TokensTransferred",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "index",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "_landLimit",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "_title",
//                 "type": "string"
//             },
//             {
//                 "indexed": false,
//                 "name": "_priceCandy",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "_priceEth",
//                 "type": "uint256"
//             }
//         ],
//         "name": "NewRankAdded",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "index",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "priceCandy",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "priceEth",
//                 "type": "uint256"
//             }
//         ],
//         "name": "RankChange",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "BuyNextRank",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": true,
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "BuyRank",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "from",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "value",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "token",
//                 "type": "address"
//             }
//         ],
//         "name": "ReceiveApproval",
//         "type": "event"
//     }
// ];
// const rank_contract = new web3.eth.Contract(rank_abi, rank_addr);



const land_addr = web3.utils.toChecksumAddress("0xd894353562776dbd114e2e6a158ccb59bbb1bf2f");
// const test_abi = [
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "name": "_value",
//                 "type": "uint256"
//             },
//             {
//                 "name": "_token",
//                 "type": "address"
//             },
//             {
//                 "name": "_extraData",
//                 "type": "bytes"
//             }
//         ],
//         "name": "receiveApproval",
//         "outputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "anonymous": false,
//         "inputs": [
//             {
//                 "indexed": false,
//                 "name": "_from",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "_value",
//                 "type": "uint256"
//             },
//             {
//                 "indexed": false,
//                 "name": "_token",
//                 "type": "address"
//             },
//             {
//                 "indexed": false,
//                 "name": "_extraData",
//                 "type": "bytes"
//             }
//         ],
//         "name": "receiveApprovalEvent",
//         "type": "event"
//     },
//     {
//         "anonymous": false,
//         "inputs": [],
//         "name": "Success",
//         "type": "event"
//     },
//     {
//         "constant": false,
//         "inputs": [
//             {
//                 "name": "_owner",
//                 "type": "address"
//             },
//             {
//                 "name": "_index",
//                 "type": "uint256"
//             }
//         ],
//         "name": "testCall2",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bool"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "function"
//     },
//     {
//         "inputs": [],
//         "payable": false,
//         "stateMutability": "nonpayable",
//         "type": "constructor"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "allowedFuncs1",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bytes4"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "allowedFuncs2",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bytes4"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "lastExtraData",
//         "outputs": [
//             {
//                 "name": "",
//                 "type": "bytes"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "result1",
//         "outputs": [
//             {
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "name": "index",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     },
//     {
//         "constant": true,
//         "inputs": [],
//         "name": "result2",
//         "outputs": [
//             {
//                 "name": "owner",
//                 "type": "address"
//             },
//             {
//                 "name": "index",
//                 "type": "uint256"
//             }
//         ],
//         "payable": false,
//         "stateMutability": "view",
//         "type": "function"
//     }
// ];
const land_abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_beneficiary",
                "type": "address"
            },
            {
                "name": "_count",
                "type": "uint256"
            },
            {
                "name": "_gardenerId",
                "type": "uint256"
            }
        ],
        "name": "_receiveMakePlant",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_period",
                "type": "uint256"
            },
            {
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "addGardener",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_gardenerId",
                "type": "uint256"
            },
            {
                "name": "_period",
                "type": "uint256"
            },
            {
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "editGardener",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_gardenId",
                "type": "uint256"
            }
        ],
        "name": "getCrop",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseApproval",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
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
                "name": "_count",
                "type": "uint256"
            },
            {
                "name": "_gardenerId",
                "type": "uint256"
            }
        ],
        "name": "makePlant",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "gardenerId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_period",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "NewGardenerAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "newLimit",
                "type": "uint256"
            }
        ],
        "name": "NewLandLimit",
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
                "indexed": false,
                "name": "gardenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "megaCandyCount",
                "type": "uint256"
            }
        ],
        "name": "GetCrop",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "gardenerId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_period",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "GardenerChange",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "token",
                "type": "address"
            }
        ],
        "name": "ReceiveApproval",
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
                "indexed": false,
                "name": "gardenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "count",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "gardenerId",
                "type": "uint256"
            }
        ],
        "name": "MakePlant",
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
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Mint",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "receiveApproval",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "setLandLimit",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFromSystem",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_landManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
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
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
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
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
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
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "freeLandsOf",
        "outputs": [
            {
                "name": "balance",
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
        "name": "gardeners",
        "outputs": [
            {
                "name": "period",
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
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "gardens",
        "outputs": [
            {
                "name": "count",
                "type": "uint256"
            },
            {
                "name": "startTime",
                "type": "uint256"
            },
            {
                "name": "owner",
                "type": "address"
            },
            {
                "name": "gardenerId",
                "type": "uint256"
            },
            {
                "name": "lastCropTime",
                "type": "uint256"
            },
            {
                "name": "plantationIndex",
                "type": "uint256"
            },
            {
                "name": "ownerPlantationIndex",
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
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserLandLimit",
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
        "inputs": [],
        "name": "landManagement",
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
        "name": "MAX_SUPPLY",
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
        "name": "megaCandy",
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
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "type": "address"
            },
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ownerPlantation",
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
                "type": "address"
            }
        ],
        "name": "ownerPlantationSize",
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
        "name": "plantation",
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
        "name": "plantationSize",
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
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "plantedOf",
        "outputs": [
            {
                "name": "balance",
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
        "name": "plantedRate",
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
        "name": "plantedTime",
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
        "name": "priceRate",
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
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
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
        "name": "userRank",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
const land_contract = new web3.eth.Contract(land_abi, land_addr);

const landsale_addr = web3.utils.toChecksumAddress("0xd2e0bbfb786cab1cdd732a6ffa3f418fd1b2c19a");
const landsale_abi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "token",
                "type": "address"
            }
        ],
        "name": "ReceiveApproval",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "_receiveBuyLandForCandy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "buyLandForCandy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "buyLandForEth",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_count",
                "type": "uint256"
            },
            {
                "name": "_rankIndex",
                "type": "uint256"
            }
        ],
        "name": "createPresale",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
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
                "indexed": false,
                "name": "count",
                "type": "uint256"
            }
        ],
        "name": "BuyLand",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "wallet",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TokensTransferred",
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
        "inputs": [
            {
                "name": "_landManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "candyLand",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "getBuyLandInfo",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
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
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "getNeededRank",
        "outputs": [
            {
                "name": "neededRank",
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
        "inputs": [],
        "name": "landManagement",
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
        "name": "userRank",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
const landsale_contract = new web3.eth.Contract(landsale_abi, landsale_addr);

const userrank_addr = web3.utils.toChecksumAddress("0xc2bd093b1a87b55c77d77276137320bfcacb3552");
const userrank_abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_beneficiary",
                "type": "address"
            }
        ],
        "name": "_receiveBuyNextRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_beneficiary",
                "type": "address"
            },
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "_receiveBuyRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_landLimit",
                "type": "uint256"
            },
            {
                "name": "_priceCandy",
                "type": "uint256"
            },
            {
                "name": "_priceEth",
                "type": "uint256"
            },
            {
                "name": "_title",
                "type": "string"
            }
        ],
        "name": "addRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "buyNextRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "buyRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_index",
                "type": "uint256"
            },
            {
                "name": "_priceCandy",
                "type": "uint256"
            },
            {
                "name": "_priceEth",
                "type": "uint256"
            }
        ],
        "name": "editRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_user",
                "type": "address"
            },
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getPreSaleRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_user",
                "type": "address"
            },
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRank",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            },
            {
                "name": "_token",
                "type": "address"
            },
            {
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "receiveApproval",
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
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "BuyRank",
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
                "indexed": false,
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "BuyNextRank",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "token",
                "type": "address"
            }
        ],
        "name": "ReceiveApproval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "priceCandy",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "priceEth",
                "type": "uint256"
            }
        ],
        "name": "RankChange",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_landLimit",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_title",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_priceCandy",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_priceEth",
                "type": "uint256"
            }
        ],
        "name": "NewRankAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "wallet",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TokensTransferred",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getNextRank",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_landManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
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
        "inputs": [
            {
                "name": "_user",
                "type": "address"
            },
            {
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getIndividualPrice",
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
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRankLandLimit",
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
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRankPriceCandy",
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
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRankPriceEth",
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
                "name": "_index",
                "type": "uint256"
            }
        ],
        "name": "getRankTitle",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserLandLimit",
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
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getUserRank",
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
        "inputs": [],
        "name": "landManagement",
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
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ranks",
        "outputs": [
            {
                "name": "landLimit",
                "type": "uint256"
            },
            {
                "name": "priceCandy",
                "type": "uint256"
            },
            {
                "name": "priceEth",
                "type": "uint256"
            },
            {
                "name": "title",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "ranksCount",
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
                "type": "address"
            }
        ],
        "name": "userRanks",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
const userrank_contract = new web3.eth.Contract(userrank_abi, userrank_addr);

const my_addr = web3.eth.accounts.wallet[0].address;

let extradata = web3.eth.abi.encodeFunctionCall({
    name: '_receiveMakePlant',
    type: 'function',
    inputs: [{
        type: 'address',
        name: '_owner'
    },{
        type: 'uint256',
        name: '_count'
    },{
        type: 'uint256',
        name: '_gardenerId'
    }]
}, [my_addr, 120, 3]);
// let extradata = web3.eth.abi.encodeFunctionCall({
//     name: '_receiveBuyLandForCandy',
//     type: 'function',
//     inputs: [{
//         type: 'address',
//         name: '_owner'
//     },{x§
//         type: 'uint256',
//         name: '_count'
//     }]
// }, [my_addr, 100]);


// let extradata = web3.eth.abi.encodeFunctionCall({
//     name: '_receiveBuyRank',
//     type: 'function',
//     inputs: [{
//         type: 'address',
//         name: '_owner'
//     },{
//         type: 'uint256',
//         name: '_count'
//     }]
// }, [my_addr, 10]);
// console.log(my_addr);
console.log(extradata);



// function approveAndCall(address _spender, uint256 _value, bytes _extraData)
// candy_contract.methods.approveAndCall(rank_addr, web3.utils.toWei('1', 'ether'), a1).send({ from: 0})
//     .on('receipt', receipt=>{
//         console.log(receipt)
//     })
//     .catch(console.error)

// userrank_contract.events.allEvents()
//     .on('data', function(event){
//         console.log(event); // same results as the optional callback above
//     })
//     .on('error', console.error);

// let data = candy_contract.methods.approveAndCall(land_addr, web3.utils.toWei('90000', 'ether'), extradata).encodeABI();
// console.log(data);
// //
// web3.eth.sendTransaction(
//     {
//         from: 0, //account index in wallet
//         to: candy_addr,
//         // value: 0,
//         gas: 500000,
//         // gasPrice: 2000000000, //2 gwei
//         data,
//         // nonce: nonce
//     })
//     .on('receipt', receipt=>{
//         console.log(receipt)
//     })
//     .catch(console.error)

// let data = candy_contract.methods.getPreSaleRank(web3.eth.accounts.wallet[0].address, 4).encodeABI();


