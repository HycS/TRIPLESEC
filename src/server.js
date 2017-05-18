const express = require('express');
const bodyparser = require('body-parser');
const api = require('../src/api.js');

const app = express();

let port = process.env.PORT || 3000;

let router = express.Router();

app.use('/api/v1/', router);
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));

router.get('/', function (req, res) {
  res.json({ message: "Welcome to TRIPLE SEC API Service!" });
})

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

        api.addCourseSet(req.body.courseName, parseInt(req.body.startDate, 10), parseInt(req.body.endDate, 10), req.body.courseType, function(err, id) {
            if (err) {
            }
            else {
                res.status(200).json({ "courseID": id, message: "SUCCESS" });
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