const BN = require('bn.js');
const { TickMath } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { printTransaction } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { initCetusSDK } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519')
require('isomorphic-fetch')
const { Transaction } = require('@mysten/sui/transactions');
const { SuiClient, getFullnodeUrl } = require('@mysten/sui/client');
const { ADMIN_PKEY, BONDING_CONTRACT } = require('../config')

const client = new SuiClient({ url: getFullnodeUrl('testnet') });
let adminKeypair = Ed25519Keypair.fromSecretKey(ADMIN_PKEY);


const getBalance = async (address, coinType) => {
    return await client.getBalance({
        owner: address,
        coinType: coinType,
    });
}


const startMigrate = async () => {
    const tx = new Transaction();

    const cuverVersion = 1
    const cuverObjectId = 1
    const memeVersion = 1
    const memeObjectId = 1

    const adminObjectId = ""
    const adminDegestId = ""
    const adminVersion = ""

    const coinTypeA = ""
    const coinTypeB = ""

    const curveConfig = tx.sharedObjectRef({
        initialSharedVersion: cuverVersion,
        mutable: true,
        objectId: cuverObjectId,
    });

    const memeConfig = tx.sharedObjectRef({
        initialSharedVersion: memeVersion,
        mutable: true,
        objectId: memeObjectId
    });

    const adminCap = tx.objectRef({
        objectId: adminObjectId,
        digest: adminDegestId,
        version: adminVersion
    })

    const receipt = ""
    const newCurveId = ""

    const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
    
    tx.moveCall({
        target: `${BONDING_CONTRACT}::meme::start_migrate`,
        arguments: [adminCap, memeConfig, curveConfig],
    });

    // tx.moveCall({
    //     target: `${BONDING_CONTRACT}::meme::delete_or_return`,
    //     arguments: [],
    // });

    
    // tx.moveCall({
    //     target: `${BONDING_CONTRACT}::meme::delete_or_return`,
    //     arguments: [],
    // });

    
    // tx.moveCall({
    //     target: `${BONDING_CONTRACT}::meme::complete_migrate`,
    //     arguments: [],
    // });

    const result = await client.signAndExecuteTransaction({
        signer: adminKeypair,
        transaction: tx,
        options: {
            showRawEffects: true,
            showEffects: true,
            showObjectChanges: true,
        },
    });

    console.log("result: ", JSON.stringify(result?.objectChanges, null, 2));
    console.log("status: ", JSON.stringify(result?.effects?.status, null, 2));
} 

const createPool = async () => {
  try{

    const sdk = initCetusSDK({ network: 'testnet' })
  
    console.log("creatPoolTransactionPayload ", adminKeypair.toSuiAddress())
    sdk.senderAddress = adminKeypair.toSuiAddress()
    // sdk.fullClient.getAllCoins({owner: ""})
  
    const payload = await sdk.Pool.createPoolTransactionPayload({
      tick_spacing: 200,
      initialize_sqrt_price: '5830951894846676784',
      uri: '',
      fix_amount_a: true,
      amount_a: '10',
      amount_b: '1',
      coinTypeA: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC',
      coinTypeB: '0x5f2bb14a10471d73d31dd2aea0fa2c1e65e05d70b94dd1f62a11023c8c41149e::horse::HORSE',
      slippage: 0.005,
      metadata_a: '0x5a2d9b8a2cbea39a2ce6186a31031496dd02b3b3eef59b7962bd3e2f6ddd988f',
      metadata_b: '0xc8dfad5dbe1fe99a5119c36919f8d47bdbe637d80d9c143a1e1d564f259fed7f',
      tick_lower: -440000,
      tick_upper: 440000,
    })
  
    const cPrice = TickMath.sqrtPriceX64ToPrice(new BN('5830951894846676784'), 9, 6)
    console.log('🚀🚀🚀 ~ file: pool.test.ts:168 ~ test ~ cPrice:', cPrice.toString())
    printTransaction(payload)
    // const transferTxn = await sdk.fullClient.devInspectTransactionBlock({
    //   transactionBlock: payload,
    //   sender: buildTestAccount().getPublicKey().toSuiAddress(),
    // })
    const transferTxn = await sdk.fullClient.sendTransaction(adminKeypair, payload)
    console.log('doCreatPool: ', transferTxn)
  
    console.log('🚀🚀🚀 ~ file: pool.test.ts:168 ~ test ~ transferTxn:', transferTxn)
  }catch(err) {
    console.log(err)
  }
} 

createPool()

module.exports = {
    createPool,
    startMigrate
};