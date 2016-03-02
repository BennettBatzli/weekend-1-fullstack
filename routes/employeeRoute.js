var express = require('express');
var router = express.Router();
var pg = require('pg');

if(process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/employee_app';
}

router.post('/', function(req, res) {
  var addPerson = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    id: req.body.id,
    job_title: req.body.job_title,
    salary: req.body.salary
  };

  pg.connect(connectionString, function(err, client) {
    client.query("INSERT INTO employees (first_name, last_name, id, job_title, salary) VALUES ($1, $2, $3, $4, $5)",
      [addPerson.first_name, addPerson.last_name, addPerson.id, addPerson.job_title, addPerson.salary],
      function (err, result) {
        if(err) {
          console.log("Error inserting data: ", err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });
});

router.get('/', function(req, res) {
  var results = [];
  pg.connect(connectionString, function (err, client, done) {
    var query = client.query('SELECT * FROM employees');
    console.log('queries are fun' + query);

    // Stream results back one row at a time
    query.on('row', function (row) {
      results.push(row);
    });

    // close connection
    query.on('end', function () {
      done();
      return res.json(results);
    });

    if (err) {
      console.log(err);
    }
  });
  console.log("these are" +results);
});

router.delete('/', function(req, res){
    console.log('request body::', req.body);
    var deleteID = {id: req.body.id };

    pg.connect(connectionString, function(err, client) {
      client.query('DELETE FROM employees WHERE id = $1',
        [deleteID.id],
        function (err, result) {
          if(err) {
            console.log("Error inserting data: ", err);
            res.send(false);
          } else {
            res.send(result);
          }
        });
    });

});

module.exports = router;
