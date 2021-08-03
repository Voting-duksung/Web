// 블록체인 설정

var Web3 = require('web3');
var solc = require('solc');//contract compile
var fs = require('fs'); //file system
var path = require('path');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));

// web3의 위치를 지정하는 함수입니다.
// web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
//로컬 공급자의 rpc 서버에 연결해서 공급자의 정보를 가져오고 대입해라

// var code = fs.readFileSync('./BVC.sol').toString();

var code = fs.readFileSync('./BVC.sol','utf-8');

let compiledCode = solc.compile(code,1);
// + compiledCode
var abiDefinition = '';
var bytecode;

// for (let BVC in compiledCode.contracts) {
//     // sol파일의 abi 값입니다.//컴파일 결과물에서 abi가져옴
//     abiDefinition = JSON.parse(compiledCode.contracts[':BVC'].interface);
//     bytecode = compiledCode.contracts[':BVC'].bytecode;
// }

// sol파일의 abi 값입니다.
var abiDefinition = JSON.parse(compiledCode.contracts[':BVC'].interface);
var bytecode = compiledCode.contracts[':BVC'].bytecode;

// eth를 지불할 eth지갑을 선택합니다.
web3.eth.defaultAccount = web3.eth.accounts[0];
// sol파일의 컨트랙트 주소입니다.
var contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4';
// 컨트랙트를 연결합니다.
var contract = web3.eth.contract(abiDefinition);
var BVC = contract.at(contractAddress);//.at을 통해 실제 내용을 채워서 컨트랙트를 객체화

module.exports = BVC;