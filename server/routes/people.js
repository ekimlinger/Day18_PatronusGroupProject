var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');

var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_DB';
}

router.get("/people", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to access people_table")
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't read anything from your people_table, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM people_table');
      query.on('row', function(row){
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ', err);
        res.status(500).send(err);
      });
    }
  });
});

router.post("/people", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to post to people DB")
  console.log(req.body);
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't write anything to your db, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('INSERT INTO people_table (first_name, last_name) VALUES ($1, $2) '
                + 'RETURNING id, first_name, last_name', [req.body.first_name, req.body.last_name]);
      query.on('row', function(row){
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
    }
  });
});


//************* CURRENTLY WORKING ON PUT ROUTE *****************//

router.put("/people", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to add patronus to person")
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't write anything to your db, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query(
                    'UPDATE people_table'
                    +'SET patronus_key = ($1) '
                    +'WHERE id = ($2);'
                    +'SELECT * FROM people_table WHERE id = ($2);',
                    [req.body.patronus_key, req.body.person_id]);
      query.on('row', function(row){
        done();
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' , err);
        res.status(500).send(err);
      });
      query.on('end', function(end){
        done();
        res.send(result);
      });
    }
  });
});



// Save the best for last...
module.exports = router;
