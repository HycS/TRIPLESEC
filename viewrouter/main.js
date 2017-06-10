module.exports = function(app)
{
     app.get('/',function(req,res){
        res.render('main.html')
     });
     app.get('/calendar.html',function(req,res){
        res.render('calendar.html');
    });
     app.get('/map.html',function(req,res){
        res.render('map.html');
    });
     app.get('/result.html',function(req,res){
        res.render('result.html');
    });
     app.get('/main.html',function(req,res){
        res.render('main.html');
    });
}