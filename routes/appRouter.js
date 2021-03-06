// 앱과 연동하는 라우터입니다.
// output으로 json이 출력되어야 합니다.
var async = require('async');
var express = require('express');
var router = express.Router();
var path = process.cwd();
console.log("appRouter 사용");
var blockFunc = require( path + '/model/blockFunc' );
var dbFunc = require( path + '/model/dbFunc' );
var FH = require( path + '/model/funcHandling');
var view = require( path + '/view/json' );

//블록체인
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://3.36.172.204:8545'));
// var count;

// 1. 선거가 시작 중인 선거장
router.get('/getStartedPlace', function(req, res){
    blockFunc.placeLength(function(err, length){
        if(!err){
            blockFunc.extractArr(0, 0, length, function(err, result){
                var outcome = [];

                if(!err) {
                    result.map(function (item, index) {
                        outcome.push(FH.handlingClosureAdd(0, item["placeid"], null, null, null));
                    })

                    async.series(outcome, function(err, resEnd){
                        if (!err){
                            var startedOutcom = [];

                            if(!err) {
                                resEnd.map(function (item, index){
                                    item.map(function(_item, _index){
                                        if(_item["isStarted"] == 1){
                                            startedOutcom.push(FH.handlingClosureAdd(1, null, item, null, null));
                                        }
                                    })
                                })
                            }

                            async.series(startedOutcom, function(err, finish){
                                view.jsonParsing(200, "success", finish, function(jsonData){
                                    res.json(jsonData);
                                })
                            })
                        } else {
                            view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                                res.json(jsonData);
                            })
                        }
                    })
                } else {
                    view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                        res.json(jsonData);
                    })
                }
            })
        } else {
            view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                res.json(jsonData);
            })
        }
    })
})

// 2. 선거가 종료된 선거장
router.get('/getEndedPlace', function(req, res){
    blockFunc.placeLength(function(err, length){
        if(!err){
            blockFunc.extractArr(0, 0, length, function(err, result){
                var outcome = [];

                if(!err) {
                    result.map(function (item, index) {
                        outcome.push(FH.handlingClosureAdd(0, item["placeid"], null, null, null));
                    })

                    async.series(outcome, function(err, resEnd){
                        if (!err){
                            var startedOutcom = [];

                            if(!err) {
                                resEnd.map(function (item, index){
                                    item.map(function(_item, _index){
                                        if(_item["isStarted"] == 3){
                                            startedOutcom.push(FH.handlingClosureAdd(1, null, item, null, null));
                                        }
                                    })
                                })
                            }

                            async.series(startedOutcom, function(err, finish){
                                view.jsonParsing(200, "success", finish, function(jsonData){
                                    res.json(jsonData);
                                })
                            })
                        } else {
                            view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                                res.json(jsonData);
                            })
                        }
                    })
                } else {
                    view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                        res.json(jsonData);
                    })
                }
            })
        } else {
            view.jsonParsing(400, "등록된 투표장을 확인할 수 없습니다.", "", function(jsonData){
                res.json(jsonData);
            })
        }
    })
})

// 4. 입력한 선거장의 모든 후보자를 볼 수 있습니다.
router.get('/getBookedCandidate', function(req, res){
    var placeid = req.param('placeid');

    blockFunc.candidateLength(function(err, length){
        if(!err){
            blockFunc.extractArr(1, placeid, length, function(_err, _result){
                if(!_err) {
                    var outcomeBooked = []

                    _result.map(function (item, index) {
                        if(item == null) {
                            outcomeBooked.push(FH.handlingClosureAdd(2, placeid, null, null, null));
                        } else {
                            outcomeBooked.push(FH.handlingClosureAdd(2, placeid, null, item["CandidateID"], null));
                        }
                    })

                    async.series(outcomeBooked, function(err1, resEnd1){
                        view.jsonParsing(200, "success", resEnd1, function(jsonData){
                            res.json(jsonData);
                        })
                    })

                } else {
                    view.jsonParsing(400, "등록된 후보자를 확인할 수 없습니다.", "", function(jsonData){
                        res.json(jsonData);
                    })
                }
            })
        } else {
            view.jsonParsing(400, "등록된 후보자를 확인할 수 없습니다.", "", function(jsonData){
                res.json(jsonData);
            })
        }
    })
})

// 5. 투표권을 행사합니다.
router.get('/setVote', function(req, res){
    var placeid = parseInt(req.param('placeid'));
    var candidateid = parseInt(req.param('candidateid'));
    var UserNumber = parseInt(req.param('UserNumber'));
    

    blockFunc.getCheckVoted(placeid, UserNumber, function(err, resd){
        if(!resd){
            blockFunc.setVote(placeid, candidateid, UserNumber, function(_err, _res) {
                if(!_err) {
                    view.jsonParsing(200, "success", _res, function(jsonData){
                        console.log("투표 성공");
                        res.json(jsonData);
                        console.log(jsonData);
                    })
                } else {
                    view.jsonParsing(400, "투표를 진행할 수 없습니다.", "", function(jsonData){
                        res.json(jsonData);
                    })
                }
            });
        } else {
            view.jsonParsing(401, "이미 투표권을 행사하셨습니다.", "", function(jsonData){
                console.log("이미 했대");
                res.json(jsonData)
            })
        }
    })
});

// 6. 개표합니다.
router.get('/getCounting', function(req, res){
    var placeid = req.param('placeid');

    blockFunc.candidateLength(function(err, length){
        if(!err){
            blockFunc.extractArr(2, placeid, length, function(_err, _result){
                if(!_err) {
                    var outcomeBooked = []

                    _result.map(function (item, index) {
                        if(item == null) {
                            outcomeBooked.push(FH.handlingClosureAdd(3, placeid, null, null, null));
                        } else {
                            outcomeBooked.push(FH.handlingClosureAdd(3, placeid, null, item["candidateid"], item["voteCount"]));
                        }
                    })

                    async.series(outcomeBooked, function(err1, resEnd1){
                        view.jsonParsing(200, "success", resEnd1, function(jsonData){
                            res.json(jsonData);
                        })
                    })

                } else {
                    view.jsonParsing(400, "개표 결과를 볼 수 없습니다.", "", function(jsonData){
                        res.json(jsonData);
                    })
                }
            })
        } else {
            view.jsonParsing(400, "개표 결과를 볼 수 없습니다.", "", function(jsonData){
                res.json(jsonData);
            })
        }
    })
});

// 7. 인증
router.get('/isAuth', function(req, res){
    var token = parseInt(req.param('token'));

    dbFunc.isAuth(token, function(err, result){
        if(!err){
            view.jsonParsing(200, result, "", function(jsonData){
                res.json(jsonData);
            })
        } else {
            view.jsonParsing(400, err, "", function (jsonData) {
                res.json(jsonData);
            })
        }
    })
})

// 8. 투표여부
router.get('/isAction', function(req, res){
    var token = parseInt(req.param('token'));

    dbFunc.isAction(token, function(err, result){
        if(!err){
            view.jsonParsing(200, result, "", function(jsonData){
                res.json(jsonData);
            })
        } else {
            view.jsonParsing(400, err, "", function (jsonData) {
                res.json(jsonData);
            })
        }
    })
})

router.get('/setAuth', function(req, res){
    var token = req.param('token');

    dbFunc.setAuth(token, function(err, result){
        if(!err){
            // 투표 완료
            console.log(result);
        } else {
            // 실패
            console.log(err);
        }
    })
});

//9. 계정 나눠주기
router.get('/account', function(req, res, next){
    var Userid = req.param('Userid');
    // var Userid = req.params.Userid;
    web3.eth.defaultAccount = web3.eth.accounts[Userid];

    const result = {
        code: 0,
        message: 'success'
      };
      res.send(result);

});

//9. 10개 계정 가져오기
router.get('/getAccount', function(req, res, next){
    var accounts = new Array();
    

    for(var i=0;i<10;i++){
        var account = new Object();
        account.data = web3.eth.defaultAccount = web3.eth.accounts[i];
        // accounts.push(account);
        accounts[i] = account;
    }

    const result = {
        code: 0,
        message: 'success',
        accounts : accounts
      };
      
      res.json(result);

    // res.json(accounts);

});


module.exports = router;
