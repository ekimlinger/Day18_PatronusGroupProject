var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/patronus", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to access patronus_table")
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't read anything from your db, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('SELECT * FROM patronus_table');
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

//patronus
router.post("/patronus", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to write to DB")
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't write anything to your db, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('INSERT INTO patronus (name) VALUES ($1) '
                + 'RETURNING id, name', [req.body.name]);
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


// Save the best for last...
module.exports = router;
