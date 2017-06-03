module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('main.html')
     });
     app.get('/test.html',function(req,res){
        res.render('test.html');
    });
    app.get('/map.html',function(req,res){
        res.render('map.html');
    });
 }