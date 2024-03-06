# AI_NFT_BOT
## Overview

Users create a prompt contains the information about the NFT collections and target NFT and provide the NFT contract address. Then the AI_NFT_BOT will help you analyze the best bid price and automaticly make the offer on opensea.

### Quick Start

```sh
git clone https://github.com/cong2480/AI_NFT_bot.git
cd AI_NFT_bot && npm install
cp .env.example .env && vim .env 
npm run test -- "I want to price an NFT collection based on comparable model. I will give you information about this NFT collection. I want you to use floor price as well as the NFT that sales at the floor price as the reference points and use comparable model to valuate the target NFT. You should output a price that you think it's reasonable in one sentence with fixed target price.Information about NFT collection:TOTAL NUMBER: 8888,NUMBER OF TRAITS: 5,FLOOR PRICE: 15.76 ETH,TOP BID: 18.82 ETH,1D CHANGE: 7.12%,7D CHANGE: -4.06%,1D VOLUME: 635.74,7D VOLUME: 4955.29.Information about the NFT that sales at the floor price:Rarity: 5734 / 8888.Last sold at price: 19.14 ETH.The most expensive Trait:percentage among collection: 15%, NFT with this trait has a floor price with 19.849 ETH, last sold at 20.99 ETH, 8 hours ago.Information about the target NFT: Total Rarity: 2061 / 8888. The most expensive Trait: percentage among collection: 2%, NFT with this trait has a floor price with 24.5 ETH, last sold at 24.00 ETH, 5 days ago." "Target_NFT_TokenId" "Target_NFT_Address" "Target_profit" 
```
