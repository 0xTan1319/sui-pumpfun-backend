const { CoinAssist } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { Transaction } = require('@mysten/sui/transactions')
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519')
const { getObjectPreviousTransactionDigest } = require('@cetusprotocol/cetus-sui-clmm-sdk')
const { SDK } = require('./init_mainnet_sdk')
const { TestnetSDK } = require('./init_testnet_sdk')

const PositionObjectID = '0x7cea8359f50318d88026d702462df7ce9d96a5b12f3efe9dce6d6450fba779a0'
const PoolObjectID = '0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630'
const USDT_USDC_POOL_10 = '0x40c2dd0a9395b1f15a477f0e368c55651b837fd27765395a9412ab07fc75971c'

async function mintAll(sdk, sendKeypair, faucet, funName) {
  const objects = await sdk.fullClient.getObject({ id: faucet.package_id, options: { showPreviousTransaction: true } })
  const previousTx = getObjectPreviousTransactionDigest(objects)
  console.log('previousTx', previousTx)
  if (previousTx) {
    const txResult = await sdk.Pool.getSuiTransactionResponse(previousTx)

    if (txResult) {
      const faucetCoins = CoinAssist.getFaucetCoins(txResult)
      console.log('faucetCoins: ', faucetCoins)

      const tx = new Transaction()

      faucetCoins.forEach((coin) => {
        tx.moveCall({
          target: `${faucet.published_at}::${coin.transactionModule}::${funName}`,
          typeArguments: [],
          arguments: [tx.object(coin.suplyID)],
        })
      })

      const result = await sdk.fullClient.sendTransaction(sendKeypair, tx)
      console.log('result: ', result)
    }
  }
}

const SdkEnv = {
  mainnet: 'mainnet',
  testnet: 'testnet',
}
let currSdkEnv = SdkEnv.mainnet

function buildSdk(sdkEnv = currSdkEnv) {
  currSdkEnv = sdkEnv
  switch (currSdkEnv) {
    case SdkEnv.mainnet:
      return SDK
    case SdkEnv.testnet:
      return TestnetSDK
    default:
      throw Error('not match SdkEnv')
  }
}

async function buildTestPool(sdk, poolObjectId) {
  const pool = await sdk.Pool.getPool(poolObjectId)
  console.log('buildPool: ', pool)
  return pool
}

async function buildTestPosition(sdk, posObjectId) {
  const position = await sdk.Position.getSimplePosition(posObjectId)
  console.log('buildTestPosition: ', position)
  return position
}

function buildTestAccount() {
  const mnemonics = 'change prison cube paddle nice basic dirt drum upper army middle panic'
  // const mnemonics =
  //   'drum arch mouse dilemma voyage reason man prefer cook turn naive spin beyond pave horn setup banner friend among pledge charge describe popular machine'
  const testAccountObject = Ed25519Keypair.deriveKeypair(mnemonics)
  // console.log(' Address: ', testAccountObject.getPublicKey().toSuiAddress())

  return testAccountObject
}

function buildTestAccountNew() {
  const mnemonics =
    'crush eye huge happy buzz start flag skate birth casino invite can aim type shift rare surprise window script census actual jazz argue pattern'
  const testAccountObject = Ed25519Keypair.deriveKeypair(mnemonics)
  return testAccountObject
}

const TestnetCoin = {
  USDC : '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdc::USDC',
  USDT : '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::usdt::USDT',
  ETH : '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::eth::ETH',
  AFR : '0x8ed60050f9c887864991b674cfc4b435be8e20e3e5a9970f7249794bd1319963::aifrens::AIFRENS',
  CETUS : '0x26b3bc67befc214058ca78ea9a2690298d731a2d4309485ec3d40198063c4abc::cetus::CETUS',
  SUI : '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  HASUI : "0xac2afb455cbcdc2ff1a2e9bbb8aa4ccb4506a544b08c740886892a5cdf92f472::hasui::HASUI",
}

const MainnetCoin = {
  USDC : '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
  USDT : '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN',
  ETH : '0xaf8cd5edc19c4512f4259f0bee101a40d41ebed738ade5874359610ef8eeced5::coin::COIN',
  SUI : '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  CETUS : '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS',
  NAVX : '0xa99b8952d4f7d947ea77fe0ecdcc9e5fc0bcab2841d6e2a5aa00c3044e5544b5::navx::NAVX',
}

module.exports = {
  MainnetCoin,
  TestnetCoin,
  buildTestAccountNew,
  buildTestAccount,
  buildTestPool,
  buildSdk,
  mintAll,
};
