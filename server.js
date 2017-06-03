var express = require('express');
var app = express();
var viewrouter = require('./viewrouter/main')(app);
let port = process.env.PORT || 3000;
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

var server = app.listen(port, function(){

    console.log("Express server has started on port 3000")

})
app.use(express.static('public'));