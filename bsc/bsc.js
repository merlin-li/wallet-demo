const Web3 = require('web3');
const abi = require('./abi');

// 使用正确的 RPC URL
const BSC_RPC_URL = 'https://bsc-testnet.drpc.org/';
const usdtABI = abi.USDTAbi;
const usdtAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
const web3 = new Web3(new Web3.providers.HttpProvider(BSC_RPC_URL));
const usdtContract = new web3.eth.Contract(usdtABI, usdtAddress);
const fromAddress = '';
const toAddress = '';
const toAddressKey = '';

// 查询 bnb 余额
const fetchBNBBalance = async (address) => {
  const balance = await web3.eth.getBalance(address);
  console.log(`钱包地址：${address}`);
  console.log('余额（Wei）:', balance);
  console.log('余额（BNB）:', web3.utils.fromWei(balance, 'ether'));
};

// 查询 usdt 余额
const fetchUSDTBalance = async (address) => {
  const balance = await usdtContract.methods.balanceOf(address).call();
  console.log('余额（Wei）:', balance);
  console.log('余额（USDT）:', web3.utils.fromWei(balance, 'ether'));
};

// 发送 bnb
const sendBNB = async ({from, to, amount}) => {
  const txCount = await web3.eth.getTransactionCount(from);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 21000;
  const privateKey = toAddressKey;
  const txObj = {
    from,
    to,
    value: web3.utils.toWei(amount.toString()),
    gas: gasLimit,
    gasPrice: gasPrice,
    nonce: txCount
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Transaction hash:${receipt.transactionHash}`);
};

// 发送 usdt
const sendUSDT = async ({from, to, amount}) => {
  const data = usdtContract.methods.transfer(to, web3.utils.toWei(amount.toString())).encodeABI();
  const txCount = await web3.eth.getTransactionCount(from);
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 100000;
  const privateKey = toAddressKey;
  const txObj = {
    from,
    to: usdtAddress,
    data: data,
    gas: gasLimit,
    gasPrice: gasPrice,
    nonce: txCount,
  };
  const signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

  console.log(`Transaction hash:${receipt.transactionHash}`);
};

const main = async () => {
  await fetchBNBBalance(fromAddress);
  await fetchUSDTBalance(fromAddress);
  await sendBNB({ from: toAddress, to: fromAddress, amount: 0.02222 });
  await sendUSDT({ from: toAddress, to: fromAddress, amount: 0.44444 });
};

main();
