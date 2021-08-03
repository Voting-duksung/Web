// 메인 서버
var express = require('express');
var app = express();
var path = process.cwd();
var websocket = require('websocket');

// app과 연동되는 라우터
var appRouter = require( path + '/routes/appRouter');
app.use('/app', appRouter);

// web과 연동되는 라우터
var webRouter = require( path + '/routes/webRouter');
app.use('/web', webRouter);

app.listen(9545, function () {
  console.log('eth server start: 9545');
});
