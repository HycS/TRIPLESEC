var express = require('express');
var app = express();
var viewrouter = require('./viewrouter/main')(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
    console.log("Express server has started on port 3000")
})
app.use(express.static('public'));