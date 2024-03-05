/// import libraries
const ethers = require('ethers');
const OpenSeaSDK = require('opensea-js').OpenSeaSDK;
const Chain = require('opensea-js').Chain;
const AlchemyProvider = require('ethers').AlchemyProvider;
const { Web3 } = require("web3");
require("dotenv").config();

const web3 = new Web3(process.env.ALCHEMY_API_KEY_SEPOLIA);
const PRIVKEY = process.env.PRIVATE_KEY;
const SENDER = web3.eth.accounts.privateKeyToAccount(PRIVKEY);
const MODEL_ID = 0;
const PROMPT_ABI = [
    {
      "inputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "_aiOracle",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "expected",
          "type": "address"
        },
        {
          "internalType": "contract IAIOracle",
          "name": "found",
          "type": "address"
        }
      ],
      "name": "UnauthorizedCallbackSource",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "promptRequest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "input",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "output",
          "type": "string"
        }
      ],
      "name": "promptsUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "aiOracle",
      "outputs": [
        {
          "internalType": "contract IAIOracle",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "calculateAIResult",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "prompt",
          "type": "string"
        }
      ],
      "name": "getAIResult",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "prompts",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "modelId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "input",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "output",
          "type": "bytes"
        }
      ],
      "name": "storeAIResult",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];
const PROMPT_ADDRESS = "0x5d6963003Ad172Fd1D2A2fD18bB3967eA7Aef1a2"
const PROMPT = new web3.eth.Contract(PROMPT_ABI, PROMPT_ADDRESS);
const provider = new AlchemyProvider("homestead", process.env.ALCHEMY_API_KEY_MAINNET);
const walletWithProvider = new ethers.Wallet(PRIVKEY, provider);
const openseaSDK = new OpenSeaSDK(walletWithProvider, {
    chain: Chain.Mainnet,
    apiKey: process.env.OPENSEA_API_KEY,
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function calculateAIResult(_prompt, _value) {
    const data = await PROMPT.methods.calculateAIResult(MODEL_ID, _prompt).encodeABI();
    const tx = await web3.eth.accounts.signTransaction(
        {
          to: PROMPT_ADDRESS,
          value: _value,
          maxPriorityFeePerGas: 300000000,
          maxFeePerGas: 300000000,
          data: data,
          nonce: await web3.eth.getTransactionCount(SENDER.address),
        },
        SENDER.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(receipt);
}

async function makeoffer(_tokenId, _tokenAddress, _offerAmount){
    const accountAddress = walletWithProvider.address;
    const offer = await openseaSDK.createOffer({
        asset: {
          _tokenId,
          _tokenAddress,
        },
        accountAddress,
        _offerAmount,
      });
    console.log("Successfully created an offer with orderHash:", offer.orderHash);
}

async function main() {
    const prompt = process.argv[2];
    const targetNFT_tokenID = process.argv[3];
    const targetNFT = process.argv[4];
    const targetProfit = process.argv[5];
    console.log("[+] sending out transaction requests to OAO...");
    await calculateAIResult(prompt, web3.utils.toWei("0", "ether"));
    console.log("[+] start calculating AI result...");
    await delay(111666);
    const result = await PROMPT.methods.getAIResult(MODEL_ID, prompt).call();
    console.log('[+]AI Analysing Result:', result);
    const match = result.match(/(\d+\.\d+)\sETH/);
    const estimatedValue = match ? parseFloat(match[1]) : null;
    const adjustmentFactor = 1 - parseFloat(targetProfit)/100
    const bidValue = estimatedValue * adjustmentFactor;
    console.log(`"Bid value of NFT ${targetNFT} should be ${bidValue}"`);
    await makeoffer(targetNFT_tokenID, targetNFT, bidValue);
}
main();