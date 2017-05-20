//file: api.js

!function() {
  if (typeof module !== "undefined") {
    module.exports = {
      mysql: mysql,
      connectionPool: connectionPool,
      addCourseSet: addCourseSet
    };
  }
}();

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

var mysql = require('mysql');
var options = require('./options');

var connectionPool = mysql.createPool({
  connectionLimit : process.env.DB_CONNECTION_LIMIT || options.dbConfig.connectionLimit,
  host            : process.env.DB_HOST || options.dbConfig.host,
  user            : process.env.DB_USER || options.dbConfig.user,
  password        : process.env.DB_PASSWORD || options.dbConfig.password,
  database        : process.env.DB_DATABASE || options.dbConfig.database
});

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