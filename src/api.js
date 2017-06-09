//file: api.js

!function() {
  if (typeof module !== "undefined") {
    module.exports = {
      mysql: mysql,
      connectionPool: connectionPool,
      sendSingleQuery: sendSingleQuery,
      addCourseSet: addCourseSet,
      addCourseUnit: addCourseUnit,
      getCourseInfo: getCourseInfo,
      getRecommendKeyword: getRecommendKeyword,
      getPlacesList: getPlacesList,
      getRecommendPassList
    };
  }
}();

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

var async = require('async');
var mysql = require('mysql');

var connectionPool = mysql.createPool({
  connectionLimit : process.env.DB_CONNECTION_LIMIT,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE,
  dateStrings     : 'date'
});

function sendSingleQuery(query, callback) {
  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error, result) {
      if (error) {
        callback(error, false);
      }
      else {
        callback(null, result);
      }
    });
    connection.release();
  });
}

function addCourseSet(courseName, startDate, endDate, courseType, callback) {

  let query = 'INSERT INTO course_set(course_name, start_date, end_date, course_type) VALUES (?, ?, ?, ?)';
  let value = [courseName, startDate, endDate, courseType];
  let courseID;

  query = mysql.format(query, value);

  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error, result) {
      if (error) {
        callback(error, false);
      }
      else {
        connection.query('select LAST_INSERT_ID() as id_course', function (error, result) {
          if (error) {
            callback(error, false);
          }
          else {
            callback(null, result[0].id_course);
          }
        });
      }
    });
    connection.release();
  });
}

function addCourseUnit(courseID, unitIndex, placeID, unitDate, callback) {
    let query = 'INSERT INTO course_unit(id_course, id_place, unit_index, unit_date) VALUES (?, ?, ?, ?)';
  let value = [courseID, placeID, unitIndex, unitDate];

  query = mysql.format(query, value);
  console.log(query);

  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error, result) {
      if (error) {
        callback(error);
      }
      else {
        callback(null);
      }
    });
    connection.release();
  });
}

function getCourseInfo(courseID, callback) {
  let firstQuery = 'SELECT * FROM course_set WHERE id_course = ?';
  let secondQuery = 'SELECT * FROM course_unit WHERE id_course = ? ORDER BY unit_index';
  let resultJSON = new Object();
  sendSingleQuery( mysql.format(firstQuery, courseID), function (error, result) {
    if (error) {
      callback(error, null);
    }
    else {
       resultJSON = ({ courseName: result[0].course_name, startDate: result[0].start_date, endDate: result[0].end_date, courseType: result[0].course_type, courseUnit: [] });
       sendSingleQuery( mysql.format(secondQuery, courseID), function (error2, result2) {
         if (error2) {
           callback(error2, null);
         }
         else {
           for(let i = 0; i < result2.length; i++) {
             resultJSON.courseUnit.push({unitIndex: result2[i].unit_index, placeID: result2[i].id_place, unitDate: result2[i].unit_date});
           }
           callback(null, resultJSON);
         }
       });
    }
  });
}

//패스 ID의 배열 값을 받아 각 패스에 대한 정보를 JSON 형태로 제공
function getPassInfoList(passIDList, callback) {
  let firstQuery = 'select pi.id_pass, t1.id_locale, t1.tx_translation as pass_name, t2.tx_translation as pass_description, pi.pass_url, pi.pass_price, pi.pass_validity_type, pi.pass_validity_period, pi.pass_region from pass_info pi inner join translation t1 on t1.id_i18n = pi.i18n_pass_name inner join translation t2 on t2.id_i18n = pi.i18n_pass_description inner join locale l on l.id_locale = t1.id_locale and l.id_locale = t2.id_locale where pi.id_pass = ?';
  let query = '';
  let resultJSON = [];
  let id_pass = 0;
  let pass_count = 0;

  for(let i = 0; i < passIDList.length; i++) {
    if(i == 0) {
      continue;
    }
    else {
      firstQuery = firstQuery.concat(" or pi.id_pass = ?")
    }
  }

  query = mysql.format(firstQuery, passIDList);

  sendSingleQuery( query, function (error, result) {
    console.log("[getPassInfoList]", query);
    if (error) {
      callback(error, null);
    }
    else {
      for(let i = 0; i < result.length; i++) {
        if (id_pass != result[i].id_pass) {
          id_pass = result[i].id_pass;

          resultJSON.push(
            {
              passID: result[i].id_pass, 
              passName: {}, 
              passDescription: {}, 
              passURL: result[i].pass_url, 
              passPrice: result[i].pass_price, 
              passValidityType: result[i].pass_validity_type, 
              passValidityPeriod: result[i].pass_validity_period, 
              passRegion: result[i].pass_region
            }
          );
          resultJSON[pass_count].passName[result[i].id_locale] = result[i].pass_name;
          resultJSON[pass_count].passDescription[result[i].id_locale] = result[i].pass_description;

          pass_count += 1;
        }
        else {
          resultJSON[pass_count-1].passName[result[i].id_locale] = result[i].pass_name;
          resultJSON[pass_count-1].passDescription[result[i].id_locale] = result[i].pass_description;
        }

      }
      callback(null, resultJSON);
    }
  });
}


function getRecommendKeyword(keyword, placeType, callback) {
  let query;
  let value;
  if (placeType == null) {
      query = 'select p.id_place, t.tx_translation as place_name from place p inner join translation t on t.id_i18n = p.i18n_place_name inner join locale l on l.id_locale = t.id_locale where t.tx_translation like ? limit 3';
      value = ['%'+keyword+'%'];
  }
  else {
    query = 'select p.id_place, t.tx_translation as place_name from place p inner join translation t on t.id_i18n = p.i18n_place_name inner join locale l on l.id_locale = t.id_locale where t.tx_translation like ? and place_type=? limit 3';
    value = ['%'+keyword+'%', placeType];
  }

  query = mysql.format(query, value);

  console.log(query);

  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error, result) {
      if (error) {
        callback(error, false);
      }
      else {
        callback(null, result);
      }
      connection.release();
    });
  });
}

function getPlacesList(callback) {
  let query = "select p.id_place, l.id_locale, t1.tx_translation as place_name, p.place_type, p.phone, t2.tx_translation as place_address, t3.tx_translation as place_description, p.place_url, p.latitude, p.longitude from place p inner join translation t1 on t1.id_i18n = p.i18n_place_name inner join translation t2 on t2.id_i18n = p.i18n_place_address inner join translation t3 on t3.id_i18n = p.i18n_place_description inner join locale l on l.id_locale = t1.id_locale and l.id_locale = t2.id_locale and l.id_locale = t3.id_locale order by id_place asc";

  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error, result) {
      console.log(query);
      if (error) {
        callback(error, false);
      }
      else {
        callback(null, result);
      }
      connection.release();
    });
  });
}

function getRecommendPassList(courseID, callback) {

  let tasks = [
    async.apply(getVisitPlaceList, courseID),
    getRecommendPass,
    getPassInfoList
  ];

  async.waterfall(tasks, function (err, result) {
    if (err) {
      console.log('err');
    }
    else {
      console.log('done');
      callback(null, result);
    }
  });
}

function getVisitPlaceList(courseID, callback) {
  let firstQuery = mysql.format('SELECT * FROM course_unit WHERE id_course = ? ORDER BY unit_index', courseID);
  let visitPlaceArray = new Array();
  connectionPool.getConnection(function(error, connection) {
    connection.query(firstQuery, function (error, result) {
      console.log("[getVisitPlaceList]",firstQuery);
      if (error) {
        callback(error, false);
        return;
      }
      else {
        for(let i = 0; i < result.length; i++) {
          visitPlaceArray.push(result[i].id_place);
        }
        callback(null, visitPlaceArray);
      }
      connection.release();
    });
  });
}

function getRecommendPass(data, callback) {
  let passIDList = new Array();
  let query = "select pi.id_pass from pass_info pi inner join transportation_under_pass tup on pi.id_pass = tup.id_pass where tup.id_transportation in ";
  let subquery = "";
  let visitPlaceArray = data;
  
  for(let i = 0; i < (visitPlaceArray.length - 1); i++) {
    if( i == 0) {
      subquery = "(select dm.id_transportation from direction d inner join direction_method dm on dm.id_direction = d.id_direction where d.id_place_departure = ? and d.id_place_destination = ?)";
    }
    else {
      subquery = " or (select dm.id_transportation from direction d inner join direction_method dm on dm.id_direction = d.id_direction where d.id_place_departure = ? and d.id_place_destination = ?)";
    }
    query = query.concat( mysql.format(subquery, [visitPlaceArray[i], visitPlaceArray[i+1]]) );
  }

  query = query.concat(" group by id_pass");

  connectionPool.getConnection(function(error, connection) {
    connection.query(query, function (error2, result2) {
      console.log(query);
      if (error2) {
        console.log("fail");
        callback(error2, null);
        return;
      }
      else {
        for(let i = 0; i < result2.length; i++) {
          console.log("result: ", result2[i].id_pass);
          passIDList.push(result2[i].id_pass);
        }
        console.log("[getRecommendPass]", passIDList);
        callback(null, passIDList);
      }
      connection.release();
    });
  });
}