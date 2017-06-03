var express = require('express');
const bodyparser = require('body-parser');
const api = require('../src/api.js');

var app = express();
var viewrouter = require('./viewrouter/main')(app);
let port = process.env.PORT || 3000;
let router = express.Router();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/api/v1/', router);

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));

router.get('/', function (req, res) {
  res.json({ message: "Welcome to TRIPLE SEC API Service!" });
});

app.listen(port, function () {
  console.log('Example app listening on port', port)
});

router.route('/course')

    .post(function(req, res) {
        //req.params.courseName;
        //req.query;
        //req.body;
        console.log("data received");
        console.log(req.body);
        console.log(req.body.courseName);
        let isSuccess = true;

        api.addCourseSet(req.body.courseName, parseInt(req.body.startDate, 10), parseInt(req.body.endDate, 10), req.body.courseType, function(err, id) {
            if (err) {
                isSuccess = false;
            }
            else {
                for(let i = 0; i < req.body.courseUnit.length; i++) {
                    api.addCourseUnit(id, req.body.courseUnit[i].unitIndex, req.body.courseUnit[i].placeID, req.body.courseUnit[i].unitDate, function(err) {
                        if (err) {
                            isSuccess = false;
                        }
                    });
                }
                if(isSuccess == true) {
                    res.status(200).json({ "courseID": id, message: "SUCCESS" });
                }
                else {
                    res.status(400).json({ message: "FAIL" });
                }
            }
        });

        //res.send();
        //res.status();
    });

router.route('/course/:courseID')

    .delete(function(req, res) {
        const id = parseInt(req.params.courseID, 10);
        if (!id) {
            return res.status(400).json({error: 'Incorrect ID'});
        }
    });

router.route('/keyword/:keyword')

    .get(function (req, res) {
        const keyword = req.params.keyword;
        const place_type = req.query.category;
        api.getRecommendKeyword(keyword, place_type, function (err, result) {
            if (err) {
                res.status(400).json({ message: "FAIL" });
            }
            else {
                let resultJSON = [];
                for (let i = 0;i < result.length; i++) {
                    resultJSON.push({id_place: result[i].id_place, place_name: result[i].place_name});
                }
                res.status(200).json(resultJSON);
            }
        });
    });

router.route('/placesList')

    .get(function (req, res) {
        api.getPlacesList(function (err, result) {
            if (err) {
                res.status(400).json({ message: "FAIL" });
            }
            else {
                let resultJSON = [];
                let id_place = 0;
                let place_count = 0;

                for (let i = 0;i < result.length; i++) {
                    if (id_place != result[i].id_place) {
                        id_place = result[i].id_place;

                        resultJSON.push({ id_place: result[i].id_place, place_name: { }, place_type: result[i].place_type, phone: result[i].phone, place_address: {}, place_description: {}, place_url: result[i].place_url, latitude: result[i].latitude, longitude: result[i].longitude });
                        resultJSON[place_count].place_name[result[i].id_locale] = result[i].place_name;
                        resultJSON[place_count].place_address[result[i].id_locale] = result[i].place_address;
                        resultJSON[place_count].place_description[result[i].id_locale] = result[i].place_description;

                        place_count += 1;
                    }
                    else {
                        resultJSON[place_count-1].place_name[result[i].id_locale] = result[i].place_name;
                        resultJSON[place_count-1].place_address[result[i].id_locale] = result[i].place_address;
                        resultJSON[place_count-1].place_description[result[i].id_locale] = result[i].place_description;
                    }
                }
                res.status(200).json(resultJSON);
            }
        });
    });
app.use(express.static('public'));
