var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString;



if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_DB';
}

pg.connect(connectionString, function(err, client,done){
  if (err){
    console.log('Error connecting to the DB, yall: ', err)
  } else{
    var query = client.query('CREATE TABLE IF NOT EXISTS people_table (' +
      'id SERIAL PRIMARY KEY,' +
      'name varchar(80) NOT NULL);' +
      'CREATE TABLE IF NOT EXISTS patronus_table (' +
      'id SERIAL PRIMARY KEY,'+
      'patronus_name varchar(80) NOT NULL);');
    query.on('end',function(){
      console.log('Successfully ensured our tables exist, OHHHH YEEEAAAAA!');
    });
    query.on('error', function(){
      console.log('Error creating your tables for you, you should probably do something about that...');
    });
  }
});
// ^^^^Database stuff up there^^^^


// vvvvvv App stuff down there vvvvvvv


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("port",(process.env.PORT || 5000));

app.post("/people", function(req,res){
  //not exactly sure what this will do
  console.log("Attempting to post to people DB")
  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      console.log("Hey man, we couldn't write anything to your db, sorry :(");
      res.status(500).send(err);
    }else{
      var result = [];

      var query = client.query('INSERT INTO people_table (name) VALUES ($1) '
                + 'RETURNING id, name', [req.body.name]);
      query.on('row', function(row){
        result.push(row);
      });
      query.on('error', function(err){
        done();
        console.log('Error running query: ' err);
        res.status(500).send(err);
      });
    }
  });
});

app.get("/people", function(req,res){
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
        console.log('Error running query: ' err);
        res.status(500).send(err);
      });
    }
  });
});

//patronus
app.post("/patronus", function(req,res){
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
        console.log('Error running query: ' err);
        res.status(500).send(err);
      });
    }
  });
});

app.get("/patronus", function(req,res){
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
        console.log('Error running query: ' err);
        res.status(500).send(err);
      });
    }
  });
});



app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"./public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});
