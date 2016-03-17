//********************************************************//
//********** THE ALL-MIGHTY SERVER/APP.JS ****************//
//********************************************************//

var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var pg = require('pg');
var peopleRouter = require('./routes/people.js');
var patronusRouter = require('./routes/patronus.js');


// Sets up database upon nonexistence
var connectionString;

if(process.env.DATABASE_URL){
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/patronus_DB';
}

//*********** CONNECTS TO DB TO CREATE TABLES ***********//
pg.connect(connectionString, function(err, client,done){
  if (err){
    console.log('Error connecting to the DB, yall: ', err)
  } else{
    var query = client.query(

      //  CREATES patronus_table,
      //          columns:        id, patronus_name

      'CREATE TABLE IF NOT EXISTS patronus_table (' +
      'id SERIAL PRIMARY KEY,'+
      'patronus_name varchar(80) NOT NULL);' +

      //  CREATES people_table,
      //          columns:        id, first_name, last_name, patronus_key

      'CREATE TABLE IF NOT EXISTS people_table (' +
      'id SERIAL PRIMARY KEY,' +
      'first_name varchar(80) NOT NULL,' +
      'last_name varchar(80) NOT NULL,'+
      'patronus_key INTEGER REFERENCES "public"."patronus_table"("id"));');

    query.on('end',function(){
      console.log('Successfully ensured our tables exist, OHHHH YEEEAAAAA!');
    });

    query.on('error', function(){
      console.log('Error creating your tables for you, you should probably do something about that...');
    });
  }
});


// ^^^^Database stuff up there^^^^      //

//******************************************************//



// vvvvvv App stuff down here vvvvvvv   //


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",peopleRouter);
app.use("/",patronusRouter);

app.set("port",(process.env.PORT || 5000));

app.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname,"./public/", file));
});

app.listen(app.get("port"),function(){
  console.log("Listening on port: ", app.get("port"));
});

module.exports = app;
