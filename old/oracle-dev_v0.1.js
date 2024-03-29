'use strict';
require('dotenv').config()
// Add the web3 node module
var Web3 = require('web3');
var request = require('request');
const redis = require('redis').createClient(6001)
const redis_pub = redis;

//connect to redis
var io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6001 });


// Show web3 where it needs to look for the Ethereum node.
// web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/YOUR-API-TOKEN-HERE'));
var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://"+process.env.NODE_ADDRESS));

// The address we want to search by.
const br_addr = process.env.BREEDING_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;
const ut_addr = process.env.UNICORNTOKEN_ADDRESS;
//urls to backend (or dummyserver)

// Show the Hash in the console.
console.log('UnicornGO Oracle');

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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "getOfferPriceCandy",
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
            },
            {
                "name": "_priceEth",
                "type": "uint256"
            },
            {
                "name": "_priceCandy",
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
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "buyUnicornWithEth",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
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
        "constant": true,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "getOfferPriceEth",
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
                "name": "priceEth",
                "type": "uint256"
            },
            {
                "name": "priceCandy",
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
        "name": "buyUnicornWithCandy",
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
                "name": "priceEth",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "priceCandy",
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
        "name": "useOwnOracle",
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
        "name": "ownOracle",
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
                "name": "_useOwnOracle",
                "type": "bool"
            }
        ],
        "name": "setUseOwnOracle",
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
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
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
        "constant": false,
        "inputs": [
            {
                "name": "_ownOracle",
                "type": "address"
            }
        ],
        "name": "setOwnOracle",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
const ut_abi = [
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
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
        "name": "approvedFor",
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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "getGen",
        "outputs": [
            {
                "name": "",
                "type": "bytes"
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
                "name": "_gene",
                "type": "bytes"
            }
        ],
        "name": "setGene",
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
        "name": "plusFreezingTime",
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
            },
            {
                "name": "_time",
                "type": "uint64"
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
            },
            {
                "name": "_gene",
                "type": "bytes"
            }
        ],
        "name": "updateGene",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            },
            {
                "name": "_byteNo",
                "type": "uint256"
            }
        ],
        "name": "getUnicornGenByte",
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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
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
        "name": "unicorns",
        "outputs": [
            {
                "name": "gene",
                "type": "bytes"
            },
            {
                "name": "birthTime",
                "type": "uint64"
            },
            {
                "name": "freezingEndTime",
                "type": "uint64"
            },
            {
                "name": "freezingTourEndTime",
                "type": "uint64"
            },
            {
                "name": "name",
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
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
                "name": "_claimant",
                "type": "address"
            },
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "owns",
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
        "constant": false,
        "inputs": [
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "approveForGeneLab",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "unicornsOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256[]"
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
                "name": "_time",
                "type": "uint64"
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
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "transfer",
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
        "name": "takeOwnership",
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
        "name": "clearApprovalForGeneLab",
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
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "marketTransfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "unicornBreeding",
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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "isTourUnfreezed",
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
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "isUnfreezed",
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
        "constant": false,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "createUnicorn",
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
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_unicornId",
                "type": "uint256"
            }
        ],
        "name": "allowance",
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
                "name": "_unicornId",
                "type": "uint256"
            },
            {
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "setName",
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
                "name": "_unicornManagementAddress",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "fallback"
    },
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
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
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
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "unicornId",
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
                "name": "unicornId",
                "type": "uint256"
            }
        ],
        "name": "UnicornGeneSet",
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
        "name": "UnicornGeneUpdate",
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
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "UnicornFreezingTimeSet",
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
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "UnicornTourFreezingTimeSet",
        "type": "event"
    }
];

// Define the br_contract ABI and Address
var br_contract = new web3.eth.Contract(br_abi, br_addr);
var bb_contract = new web3.eth.Contract(bb_abi, bb_addr);
var ut_contract = new web3.eth.Contract(ut_abi, ut_addr);

web3.eth.accounts.wallet.add(process.env.OWNER_KEY);


br_contract.events.CreateUnicorn()
    .on('data', function (event) {
        // console.log(event);
        // var childId = web3.utils.toBN(event.returnValues.unicornId);
        // var parent1Id = web3.utils.toBN(event.returnValues.parent1);
        // var parent2Id = web3.utils.toBN(event.returnValues.parent2);

        var childId = parseInt(event.returnValues.unicornId);
        var parent1Id = parseInt(event.returnValues.parent1);
        var parent2Id = parseInt(event.returnValues.parent2);

        console.log('Request gen for: ' + childId.toString());
        var request_data;
        var url;
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

                publishUnicornEvent('unicorn.creation', {
                    time: +new Date(),
                    unicornId: childId,
                    parent1UnicornId: parent1Id,
                    parent2UnicornId: parent2Id,
                    owner: event.returnValues.owner,
                    gene: body.chain
                })
                const data = bb_contract.methods.setGeneManual(childId, body.chain).encodeABI();
                web3.eth.getTransactionCount(web3.eth.accounts.wallet[0].address, 'pending')
                    .then((nonce) => {
                        console.log(nonce);
                        web3.eth.sendTransaction(
                            {
                                from: 0, //account index in wallet
                                to: bb_addr,
                                value: 0,
                                gas: 1500000,
                                gasPrice: 20000000000, //20 gwei
                                data,
                                nonce
                            })
                            // .on('transactionHash', function (hash) {
                            //     //...
                            // })
                            .on('receipt', function (receipt) {
                                // console.log(receipt);
                                publishUnicornEvent('unicorn.geneset', {
                                    time: +new Date(),
                                    unicornId: childId,
                                    gene: body.chain
                                })
                            })
                            // .on('confirmation', function (confirmationNumber, receipt) {
                            //     //будет эмитится при каждом следующем подтверждении от нод, т.е. много раз
                            //     publishUnicornEvent('unicorn.geneconfirm', {
                            //         time: +new Date(),
                            //         unicornId: childId,
                            //         // gene: body.chain
                            //     })
                            // })
                            .on('error', console.error);
                    })
            } else {
                console.log('error: ' + response.statusCode);
                // console.log(body);
            }
        })

    })
    .on('changed', function (event) {
        // remove event from local database
        console.warn('REMOVED', event);
    })
    .on('error', console.error);



br_contract.events.HybridizationAccept()
    .on('data', function (event) {
        var childId = parseInt(event.returnValues.newUnicornId);
        var parent1Id = parseInt(event.returnValues.firstUnicornId);
        var parent2Id = parseInt(event.returnValues.secondUnicornId);

        publishUnicornEvent('unicorn.hybridization', {
            time: +new Date(),
            unicornId: childId,
            parent1UnicornId: parent1Id,
            parent2UnicornId: parent2Id,
        })
    })
    .on('changed', function (event) {
        // remove event from local database
        console.warn('REMOVED', event);
    })
    .on('error', console.error);



ut_contract.events.Transfer()
    .on('data', function (event) {
        var unicornId = parseInt(event.returnValues.unicornId);
        // console.log(event.returnValues)
        console.log('Transfer ' + unicornId.toString() + ' from: ' + event.returnValues.from + ' to ' + event.returnValues.to);

        publishUnicornEvent('unicorn.transfer', {
            time: +new Date(),
            unicornId,
            from:event.returnValues.from,
            to:event.returnValues.to
        })

    })
    .on('changed', function (event) {
        // remove event from local database
        console.warn('REMOVED', event);
    })
    .on('error', console.error);


function publishUnicornEvent(event, data) {
    redis_pub.publish("unicorn-node-dev",
        {
            event,
            data
        });
    io.emit(event, data);
}
