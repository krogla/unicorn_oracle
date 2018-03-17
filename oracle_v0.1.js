'use strict';
require('dotenv').config()
// Add the web3 node module
var Web3 = require('web3');
var request = require('request');

// Show web3 where it needs to look for the Ethereum node.
// web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/YOUR-API-TOKEN-HERE'));
var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545"));

// The address we want to search by.
const br_addr = process.env.BREEDING_ADDRESS;
const bb_addr = process.env.BLACKBOX_ADDRESS;
//urls to backend (or dummyserver)

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
var br_contract = new web3.eth.Contract(br_abi, br_addr);
var bb_contract = new web3.eth.Contract(bb_abi, bb_addr);

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

                const data = bb_contract.methods.setGeneManual(childId, body.chain).encodeABI();

                web3.eth.sendTransaction(
                    {
                    from: 0, //account index in wallet
                    to: bb_addr,
                    value: 0,
                    gas: 500000,
                    // gasPrice: 5000000000, //5 gwei
                    data: data
                })
                // using the event emitter
                    .on('transactionHash', function (hash) {
                        //...
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt);
                    })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        //...
                    })
                    .on('error', console.error);

            } else {
                console.log('error: ' + response.statusCode);
                console.log(body);
            }
        })

    })
    .on('changed', function (event) {
        // remove event from local database
        console.warn('REMOVED', event);
    })
    .on('error', console.error);

