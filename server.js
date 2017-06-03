var express = require('express');
const bodyparser = require('body-parser');
var viewrouter = require('./viewrouter/main')(app);
var app = express();
let port = process.env.PORT || 3000;


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


router.get('/', function (req, res) {
    res.json({
        message: "Welcome to TRIPLE SEC API Service!"
    });
});

app.listen(port, function () {
    console.log('Example app listening on port', port)
});

app.use(express.static('public'));
