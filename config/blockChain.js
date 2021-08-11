// 블록체인 설정
var Web3 = require('web3');
var solc = require('solc');//contract compile
var fs = require('fs'); //file system
var path = require('path');
var web3 = new Web3(new Web3.providers.HttpProvider('http://3.36.172.204:8545'));

var code = fs.readFileSync('./BVC.sol','utf-8');

console.log('transaction...compiling contract -컴파일링 된다');
let compiledCode = solc.compile(code,1);
console.log('done!!' );
var abiDefinition = '';
var bytecode;

// sol파일의 abi 값입니다.
var abiDefinition = JSON.parse(compiledCode.contracts[':BVC'].interface);
var bytecode = compiledCode.contracts[':BVC'].bytecode;
console.log(abiDefinition);

// eth를 지불할 eth지갑을 선택합니다.
web3.eth.defaultAccount = web3.eth.accounts[0];
// 앱에서 유권자 확인할 때 blockchain.js를 호출해라....
// 유권자 디비에서 플래그를 넣어두어 

// router.get('/account', function(req, res){
//     web3.eth.defaultAccount = web3.eth.accounts[0];
// });


// sol파일의 컨트랙트 주소입니다.
var contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
// 컨트랙트를 연결합니다.
var contract = web3.eth.contract(abiDefinition);
var BVC = contract.at(contractAddress);//.at을 통해 실제 내용을 채워서 컨트랙트를 객체화

module.exports = BVC;