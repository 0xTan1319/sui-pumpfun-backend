const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } = require("@metaplex-foundation/js");
const fs = require("fs");
const config = require('../config');
const { nftData } = require("./data/nft");
const { v4: uuidv4 } = require('uuid'); 

const connection = new Connection(config.RPC_URL, {commitment:"confirmed",confirmTransactionInitialTimeout:120000})

const WALLET = Keypair.fromSecretKey(new Uint8Array([49,251,166,180,139,60,89,212,224,109,127,91,197,44,191,191,37,100,65,226,9,255,18,131,158,131,211,145,226,93,73,240,165,78,79,85,126,22,136,240,122,252,140,93,112,65,3,62,98,199,251,219,57,166,141,108,39,130,0,7,110,194,31,195]));
const METAPLEX = Metaplex.make(connection)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: config.RPC_URL,
        timeout: 60000,
    }));

const uploadJSON = async (data) => {
    console.log(`Uploading JSON`);
    try{
        const jsonMetaplexFile = toMetaplexFile(Buffer.from(JSON.stringify(nftData(data)), 'utf8'), uuidv4());
        const jsonUri = await METAPLEX.storage().upload(jsonMetaplexFile);
        return { success: true, uri:jsonUri};
    }catch(err){
        console.log(err)
        return { success: false, err};
    }   
}

const uploadImage = async(filePath) => {
    try{
        console.log(`Uploading Image`);
        const imgBuffer = fs.readFileSync(`${filePath}`);
        const imgMetaplexFile = toMetaplexFile(imgBuffer, uuidv4());
        const uri = await METAPLEX.storage().upload(imgMetaplexFile);
        console.log(`Image URI`, uri);
        return { success: true, uri}
    }catch(err){
        console.log(err)
        return { success: false, err}
    }
}

module.exports = {
    uploadImage, uploadJSON
};