/**
 * Created by ogeva on 7/3/2017.
 */
/**
 * Created by ogeva on 7/1/2017.
 */
const express = require('express');
const bunyan = require('bunyan');
const ObjectID = require('mongodb').ObjectID;
const log = bunyan.createLogger({name: "ahem-server"});

let path = require('path'),
  http = require('http'),
  bodyParser = require('body-parser'),
  api = require('./api');

module.exports = {
  startServer: function startServer(properties, db) {

    const app = express();

    app.use(function (req, res, next) {
      req.db = db;
      req.properties = properties;
      next();
    });

// Parsers for POST data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));


// Point static path to dist
    app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
    app.use('/api', api);

// Catch all other routes and return the index file
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    })
    ;

    //error handler
    app.use(function (err, req, res, next) {
      log.error(err);
      res.status(500).send({error: err.message});
    });

    /**
     * Get port from environment and store in Express.
     */
    const port = process.env.PORT || properties.appListenPort || '3000';
    app.set('port', port);

    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port, function () {
      log.info("ad-hoc-mail service started!");
    });

    //delete emails every interval
    setInterval(function () {
      console.log("checking for emails older than " + properties.emailDeleteAge + " seconds");
      db.collection("emails").find({"timestamp": {$lt: (new Date().getTime() - (properties.emailDeleteAge * 1000))}}, {"_id": 1}).toArray(function (err, emailsToDelete) {
        console.log(emailsToDelete.length + " emails with age > " + properties.emailDeleteAge + " seconds where found");
        emailsToDelete.forEach(email => {
          db.collection("accounts").update(
            { "emails.emailId" : email._id },
            {$pull : {"emails" : {"emailId":email._id}}},
            { "multi": true}
            ,function (err, numberRemoved) {
              if(err)
                console.log(err);
              console.log("Removing " + email._id.toString() + " has been removed from " + JSON.parse(numberRemoved).nModified + " accounts.")

            }
          );

          db.collection("emails").remove({"_id": email._id}, function(err, result){
            if (err) {
              console.log(err);
            } else {
              console.log('Delete email', result.result);
            }
          });
        });
      });

      db.collection("accounts").remove({"emails": { $exists: true, $ne: "[]" }}, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Removed empty accounts', result.result );
        }


      });

    }, properties.emailDeleteInterval * 1000);

    log.info("mail server listening");
    return app;
  }

}







