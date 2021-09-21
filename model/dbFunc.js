// 데이터베이스를 이용하는 함수들입니다.

var path = process.cwd();
var db = require( path + '/config/database');
db.connect();
console.log("dbFunc.js 실행됨");

// 1. 선거장을 생성합니다. db에 선거장 정보를 입력합니다.
module.exports.insertPlaceInfo = function(placeid, isStarted, info, result) {
    var placeID = parseInt(placeid);

    var sql = 'INSERT INTO placeinfo (name, start_regist_period, end_regist_period, votedate, contents, start_vote_time, end_vote_time, placeid, isStarted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params = [info[0], info[1], info[2], info[3], info[4], info[5], info[6], placeID, isStarted];

    db.query(sql, params, function(err, res){
        if(!err) {
            console.log("insertplaceinfo success");
            result("<h1>선거장이 등록되었습니다.....</h1>");

        } else {
            console.log("insertplaceinfo err : " + err);
            result("선거장 등록이 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
    })
};

// 2. 예비 후보자를 생성합니다. db에 예비 선거장 정보를 입력합니다.
module.exports.insertyetCandidateinfo = function(wantvote, info, result) {

    var wantvote = parseInt(wantvote);
    var statue = 0;


    var sql = 'INSERT INTO yetcandidateinfo (candidateid, name, campname, slogan, departure, state, promise, colleage, wantvote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var params = [info[1], info[2], info[3], info[4], info[5], statue, info[6], info[7], wantvote];

    db.query(sql, params, function(err, res){
        if(!err) {
            console.log("insertyetCandidateinfo success");
            result("<h1>예비 후보자가 등록되었습니다…..</h1>");

        } else {
            console.log("insertyetCandidateinfo err : " + err);
            result("예비 후보자 등록이 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
    })
}


//후보자를 등록합니다.
module.exports.insertCandidateInfo = function(candidateid, name, campname, slogan, departure, promise, colleage, placeid, result){
    var candidateid = candidateid;
    var name = name;
    var campname = campname;
    var slogan = slogan;
    var departure = departure;
    var promise = promise;
    var state = 1;
    var colleage = colleage;
    var placeid = placeid;
    var wantvote = placeid;
    var candidateresult = 0;

    var sql;
    var params;

    sql = 'INSERT INTO candidateinfo(candidateid, name, campname, slogan, departure, state, promise, colleage, wantvote, candidateresult) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    params = [candidateid, name, campname, slogan, departure, state, promise, colleage, wantvote, candidateresult];
        db.query(sql, params, function(err, res){
            if(!err) {
                console.log("insert success");

                var sql1='UPDATE yetcandidateinfo SET state=1 WHERE candidateid=?';
                var params1=[candidateid]
                db.query(sql1, params1, function(err, res){
                    if(!err){
                        result(null, res);
                    } else {
                        result(err, null);
                    }
                })

            } else {
                console.log(err + "if err 여기여기");
            }
        })
}


// 후보자를 사퇴시킵니다.
module.exports.updateCandidateState = function(candidateid, result){
    var sql = 'UPDATE candidateinfo SET state=3 WHERE candidateid=?'
    var params = [candidateid]
    db.query(sql, params, function(err, res){
        if(!err){
            result(null, res);
        } else {
            result(err, null);
        }
    })
}

// placeid에 해당하는 등록된 후보자 리스트를 출력합니다.
module.exports.selectBookedCandidateList = function(placeid, result) {
    var sql = 'SELECT * FROM candidateinfo WHERE placeid=?'
    var params = [placeid];
    db.query(sql, params, function(err, res){
        if(!err) {
            result(null, res);
        } else {
            result(err, null);
        }
    })
}

// placeid에 해당하는 placeinfo를 가져옵니다.
module.exports.searchPlaceInfo = function(placeid, result) {
    var sql = 'SELECT * FROM placeinfo WHERE placeid=?';
    var params = [placeid]
    db.query(sql, params, function(err, res){
        if(!err) {
            result(null, res);
        } else {
            result(err, null);
            console.log("에러?");
        }
    })
}

// db에서 후보자의 정보를 가져옵니다.
module.exports.searchCandidateInfo = function(placeid, candidateid, result) {
    var sql = 'SELECT * FROM candidateinfo WHERE wantvote=? AND candidateid=?';
    var params = [placeid, candidateid]

    db.query(sql, params, function(err, res) {
        if(!err) {
            result(null, res)
        } else {
            result(err, null)
        }
    })
}

module.exports.updateIsStarted = function(placeid, isStarted, result) {
    var sql = 'UPDATE placeinfo SET isStarted=? WHERE placeid=?;';

    var params = [isStarted, placeid];
    db.query(sql, params, function(err, res){
        if(!err) {
            result(null, res);
        } else {
            result(err, null);
        }
    })
}

//db의 미등록 후보자 정보를 불러옵니다.
module.exports.selectCandidateList = function(placeid, result){
    var wantvote = placeid;
    // var sql = 'SELECT u.user_login, u.user_email, u.user_registered, SUBSTRING_INDEX(group_concat(m.meta_value), \',\', -1) AS \'wantVote\', SUBSTRING_INDEX(group_concat(m.meta_value), \',\', 1) AS \'name\', u.state FROM wp_users u JOIN wp_usermeta m ON u.ID = m.user_id WHERE m.meta_key= "wantVote" OR m.meta_key= "first_name" GROUP BY user_login HAVING SUBSTRING_INDEX(group_concat(m.meta_value), \',\', -1)=?';
    var sql = 'SELECT candidateid, name, campname, slogan, departure, state, promise, colleage, wantvote  FROM yetcandidateinfo WHERE wantvote=?'
    var params = [wantvote]
    db.query(sql, params, function(err, res){
        if(!err){
            result(null, res);
        }else{
            result(err, null);
        }
    })
}

module.exports.updateCounting = function(placeid, candidateid, counting, result) {
    var sql = 'UPDATE candidateinfo SET candidateresult=? WHERE wantvote=? AND candidateid=?'
    var params = [counting, placeid, candidateid];
    db.query(sql, params, function(err, res){
        if(!err){
            sql = 'SELECT * FROM candidateinfo WHERE wantvote=? AND candidateid=?';
            params = [placeid, candidateid]
            db.query(sql, params, function(_err, _res){
                if(!_err){
                    result(null, _res)
                } else {
                    result(_err, null)
                }
            })
        } else {
            result(err, null);
        }
    })
}

// 인증 검사
module.exports.isAuth = function(token, result){
    var sql = 'SELECT isAction FROM auth WHERE token=?';
    var params = [token];
    db.query(sql, params, function(err, res){
        if(!err){
            var numRows = res.length;

            if(numRows > 0){
                result(null, "인증되었습니다.");
            } else {
                result("잘못된 토큰입니다.", null);
            }
        } else {
            result("잘못된 토큰입니다.", null);
        }
    })
}

module.exports.isAction = function(token, result){
    var sql = 'SELECT isAction FROM auth WHERE token=?';
    var params = [token];
    db.query(sql, params, function(err, res){
        if(!err){
            var numRows = res.length;

            if(numRows > 0 && res[0].isAction==0){
                result(null, "투표");
            } else {
                result("이미 투표를 진행했습니다.", null);
            }
        } else {
            result("잘못된 토큰입니다.", null);
        }
    })
}

// 투표 후 isAction 1로 변경
module.exports.setAuth = function(token, result){
    var sql = 'UPDATE auth SET isAction=1 where token=?';
    var params = [token];
    db.query(sql, params, function(err, res){
        if(!err){
            result(null, res);
        } else {
            result(err, null);
        }
    })
}

// DB에 등록된 후보자 가져오기
module.exports.checkCandidate = function(placeid, result){
    var sql = 'select count(name) as candiNum from candidateinfo where wantvote=?';
    var params = [placeid];
    db.query(sql, params, function(err, res){
        if(!err){
            result(null, res);
        } else {
            result(err, null);
        }
    })
}

// 진짜 후보자로 등록 시 예비후보자 데이터 삭제
module.exports.deleteYetCandidate = function(candidateid, result){
    console.log("candi"+candidateid);
    var sql = 'delete from yetcandidateinfo where candidateid=?';
    var params = [candidateid];
    db.query(sql, params, function(err, res){
        if(!err){
            result(null, res);
        } else {
            result(err, null);
        }
    })
}