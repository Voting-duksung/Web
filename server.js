// 메인 서버
var express = require('express');
var app = express();
var path = process.cwd();

//app과 연동되는 라우터
var appRouter = require( path + '/routes/appRouter');
app.use('/app', appRouter);

// web과 연동되는 라우터
var webRouter = require( path + '/routes/webRouter');
app.use('/web', webRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
  console.log('새로운 서버eth server start: 8080');

});
