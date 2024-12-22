const { TickMath } = require('@cetusprotocol/cetus-sui-clmm-sdk');
const  BN = require('bn.js');
const {
  SdkEnv,
  USDT_USDC_POOL_10,
  buildSdk,
  buildTestAccount,
  buildTestPool,
} = require('./data/init_test_data');
require('isomorphic-fetch')
const { printTransaction } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { ADMIN_PKEY } = require('../config');

let sendKeypair = Ed25519Keypair.fromSecretKey(ADMIN_PKEY);

const sdk = buildSdk(SdkEnv.mainnet)

const position =async () => {
  sendKeypair = buildTestAccount()
  sdk.senderAddress = sendKeypair.getPublicKey().toSuiAddress()
  
  const pool = await buildTestPool(sdk, USDT_USDC_POOL_10)
  const lowerTick = TickMath.getPrevInitializableTickIndex(
    new BN(pool.current_tick_index).toNumber(),
    new BN(pool.tickSpacing).toNumber()
  )
  const upperTick = TickMath.getNextInitializableTickIndex(
    new BN(pool.current_tick_index).toNumber(),
    new BN(pool.tickSpacing).toNumber()
  )

  const openPositionTransactionPayload = sdk.Position.openPositionTransactionPayload({
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB,
    tick_lower: lowerTick.toString(),
    tick_upper: upperTick.toString(),
    pool_id: pool.poolAddress,
  })

  printTransaction(openPositionTransactionPayload)

  const transferTxn = await sdk.fullClient.sendTransaction(sendKeypair, openPositionTransactionPayload)
  console.log('open position: ', JSON.stringify(transferTxn, null, 2))
}

position()
