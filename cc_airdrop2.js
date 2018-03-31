'use strict';
require('dotenv').config()
// Add the web3 node module
let Web3 = require('web3');
// const fs = require('fs');
// Show the Hash in the console.
console.log('AirDropper by KRogLA');

// Show web3 where it needs to look for the Ethereum node.
const web3 = new Web3(new Web3.providers.WebsocketProvider("ws://127.0.0.1:8546"));
// The address we want to search by.
const cc_addr = "0x06012c8cf97bead5deae237070f9587f8e7a266d";
//urls to backend (or dummyserver)


// Define the br_contract ABI
const cc_abi = [
    {
    "constant": true,
    "inputs": [{"name": "_interfaceID", "type": "bytes4"}],
    "name": "supportsInterface",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "cfoAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_tokenId", "type": "uint256"}, {"name": "_preferredTransport", "type": "string"}],
    "name": "tokenMetadata",
    "outputs": [{"name": "infoUrl", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "promoCreatedCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_tokenId", "type": "uint256"}],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "ceoAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "GEN0_STARTING_PRICE",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_address", "type": "address"}],
    "name": "setSiringAuctionAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "pregnantKitties",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_kittyId", "type": "uint256"}],
    "name": "isPregnant",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "GEN0_AUCTION_DURATION",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "siringAuction",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_tokenId", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_address", "type": "address"}],
    "name": "setGeneScienceAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_newCEO", "type": "address"}],
    "name": "setCEO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_newCOO", "type": "address"}],
    "name": "setCOO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_kittyId", "type": "uint256"}, {"name": "_startingPrice", "type": "uint256"}, {
        "name": "_endingPrice",
        "type": "uint256"
    }, {"name": "_duration", "type": "uint256"}],
    "name": "createSaleAuction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "sireAllowedToAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_matronId", "type": "uint256"}, {"name": "_sireId", "type": "uint256"}],
    "name": "canBreedWith",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "kittyIndexToApproved",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_kittyId", "type": "uint256"}, {"name": "_startingPrice", "type": "uint256"}, {
        "name": "_endingPrice",
        "type": "uint256"
    }, {"name": "_duration", "type": "uint256"}],
    "name": "createSiringAuction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "val", "type": "uint256"}],
    "name": "setAutoBirthFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_addr", "type": "address"}, {"name": "_sireId", "type": "uint256"}],
    "name": "approveSiring",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_newCFO", "type": "address"}],
    "name": "setCFO",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_genes", "type": "uint256"}, {"name": "_owner", "type": "address"}],
    "name": "createPromoKitty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "secs", "type": "uint256"}],
    "name": "setSecondsPerBlock",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "paused",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "withdrawBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "owner", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "GEN0_CREATION_LIMIT",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "newContractAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_address", "type": "address"}],
    "name": "setSaleAuctionAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "count", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_v2Address", "type": "address"}],
    "name": "setNewAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "secondsPerBlock",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {"constant": false, "inputs": [], "name": "pause", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "tokensOfOwner",
    "outputs": [{"name": "ownerTokens", "type": "uint256[]"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_matronId", "type": "uint256"}],
    "name": "giveBirth",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "withdrawAuctionBalances",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "cooldowns",
    "outputs": [{"name": "", "type": "uint32"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "uint256"}],
    "name": "kittyIndexToOwner",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_tokenId", "type": "uint256"}],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "cooAddress",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "autoBirthFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "erc721Metadata",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_genes", "type": "uint256"}],
    "name": "createGen0Auction",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_kittyId", "type": "uint256"}],
    "name": "isReadyToBreed",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "PROMO_CREATION_LIMIT",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_contractAddress", "type": "address"}],
    "name": "setMetadataAddress",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "saleAuction",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "_id", "type": "uint256"}],
    "name": "getKitty",
    "outputs": [{"name": "isGestating", "type": "bool"}, {"name": "isReady", "type": "bool"}, {
        "name": "cooldownIndex",
        "type": "uint256"
    }, {"name": "nextActionAt", "type": "uint256"}, {"name": "siringWithId", "type": "uint256"}, {"name": "birthTime", "type": "uint256"}, {
        "name": "matronId",
        "type": "uint256"
    }, {"name": "sireId", "type": "uint256"}, {"name": "generation", "type": "uint256"}, {"name": "genes", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_sireId", "type": "uint256"}, {"name": "_matronId", "type": "uint256"}],
    "name": "bidOnSiringAuction",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "gen0CreatedCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "geneScience",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "_matronId", "type": "uint256"}, {"name": "_sireId", "type": "uint256"}],
    "name": "breedWithAuto",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "owner", "type": "address"}, {"indexed": false, "name": "matronId", "type": "uint256"}, {
        "indexed": false,
        "name": "sireId",
        "type": "uint256"
    }, {"indexed": false, "name": "cooldownEndBlock", "type": "uint256"}],
    "name": "Pregnant",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "from", "type": "address"}, {"indexed": false, "name": "to", "type": "address"}, {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    }],
    "name": "Transfer",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "owner", "type": "address"}, {"indexed": false, "name": "approved", "type": "address"}, {
        "indexed": false,
        "name": "tokenId",
        "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "owner", "type": "address"}, {"indexed": false, "name": "kittyId", "type": "uint256"}, {
        "indexed": false,
        "name": "matronId",
        "type": "uint256"
    }, {"indexed": false, "name": "sireId", "type": "uint256"}, {"indexed": false, "name": "genes", "type": "uint256"}],
    "name": "Birth",
    "type": "event"
}, {"anonymous": false, "inputs": [{"indexed": false, "name": "newContract", "type": "address"}], "name": "ContractUpgrade", "type": "event"}];

// Define the br_contract ABI and Address
const cc_contract = new web3.eth.Contract(cc_abi, cc_addr);

// web3.eth.accounts.wallet.add(process.env.OWNER_KEY);


const MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    if (err) { return console.dir(err) }
    // console.log("We are connected");
    const db = client.db('ccairdrop');
    let holders = db.collection('holders');



    (async () => {
        let r;
        r = await holders.remove({});
        console.log(r.modifiedCount)
        r = await holders.createIndex(
            {address: 1},
            {unique: true}
        );

        r = await holders.updateMany({}, {$set : {candy:0,contract:false}}, {upsert:false})
        console.log(r.modifiedCount)

        let total
        try {
            total = (await cc_contract.methods.totalSupply().call());
        } catch (e) {
            console.error(e);
            return
        }
        console.log(total);
        for (let holder, count, code, contracts=0, i = 1; i <= total; i++) {
            process.stdout.write("Read " + i + ' (' + Math.floor(i * 100 / total) + "%), contracts:"+ contracts+ "\r");
            try {
                holder = (await cc_contract.methods.ownerOf(i).call());
                if (holder.length === 42) { //address length
                    holder = web3.utils.toChecksumAddress(holder);
                    code = (await web3.eth.getCode(holder));
                    if (code !== '0x') {
                        contracts++
                    }
                    count = (await cc_contract.methods.balanceOf(holder).call());
                    holders.updateOne({address: holder},
                        {$set: {count: parseInt(count), candy: 0, contract: code !== '0x'}}, {
                        upsert: true
                    }, function (err, result) {
                        if (err && (!err.hasOwnProperty('code') || err.code != 11000)) {
                            console.log(err, result)
                        }
                    })
                }
            } catch (e) {
                console.error(e);
            }
        }
        process.exit();
    })();

});
