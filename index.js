var express = require("express");
var mysql = require("mysql");
var cors = require("cors");
var app = express();

app.use(function(req, res, next) {
  res.locals.connection = mysql.createConnection({
    host: "ec2-54-193-71-144.us-west-1.compute.amazonaws.com", //put you db host
    user: "root",
    password: "",
    database: "duarte"
  });
  res.locals.connection.connect();
  next();
});

app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);

app.get("/", function(req, res) {
  res.locals.connection.query("SELECT * FROM sujetos;", function(
    error,
    results,
    fields
  ) {
    if (results.length > 0) {
      res.jsonp({
        status: 200,
        userStatus: "Accept",
        users: results
      });
    }
    //console.log(results);
  });
});

app.get("/api/:identificador", function(req, res) {
  res.locals.connection.query(
    "SELECT nombre, apeidos, telefono FROM sujetos WHERE identificador= " +
      req.params.identificador +
      ";",
    function(error, results, fields) {
      if (results.length > 0) {
        res.jsonp({
          status: 200,
          error: null,
          userStatus: "Accept",
          user: results
        });
      } else {
        res.jsonp({ status: 200, error: null, userStatus: "Reject" });
      }
      if (error) throw error;
    }
  );
});

app.listen(3000, () => {
  console.log("Escuchando por el puerto 3000");
});
