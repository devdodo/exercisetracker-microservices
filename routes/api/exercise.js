const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');

// @desc GET /
// @route /
router.get('/', (req, res) => {
    res.sendFile('index.html');
});

// @desc POST new user
// @route /api/exercise/new-user
router.post('/api/exercise/new-user', (req, res) => {
    const username = req.body.username;
    const newUser = new User({username: username});

    // MongoDB query
    User.find({username: username}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                // Save user to database
                newUser.save().then(response => res.json(response)).catch(err => console.error(err));
            }else{
                res.json({"result": "This username is registered"});
            }
        }
    });
});


// @desc GET all users
// @route /api/exercise/user
router.get('/api/exercise/users', (req, res) => {

    // MongoDB query
    User.find({}, {"_id": 1, "username": 1}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                res.json({"result": "No data in database"});
            }else{
                res.json(result);
            }
        }
    });
});

// @desc POST new user
// @route /api/exercise/add
router.post('/api/exercise/add', (req, res) => {
  console.log(req.body);
    var {userId, description, duration, date } = req.body;
    var dateString;
    // MongoDB query

    if(date === "" || !date ){
      var dateInput = new Date();
      dateString = dateInput.toDateString();
      console.log(dateString + "this is the first");
    }else{
      console.log(date);
      var dateInput = new Date(date);
      if(dateInput.toDateString() === "Invalid Date"){
        return res.json("Invalid Date!");
      }else{
        var dateInput = new Date(date);
        dateString = dateInput.toDateString();
        console.log(dateString + "this is invalid block");
      }
    }

    User.find({"_id": userId}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                res.json({"result": "No data in database"});
            }else{
                const username = result[0].username;
                Exercise.findOneAndUpdate({"_id": userId}, {"_id": userId, "username": username, $inc: {"count": 1}, $push: { "log": [{"description": description, "duration": duration, "date": dateString}]} }, {"upsert": true }, (err, response) => {
                    if(err) {
                        return console.error(err);
                    }else{
                      duration = parseInt(duration);
                      var result = { _id: userId, username, date: dateString, duration, description};
                      res.json(result);
                    }
                }); 
            }
        }
    });
    
});

// @desc GET user log
// @route /api/exercise/log
router.get('/api/exercise/log', (req, res) => {
    const userId = req.query.userId;
    const fromDate = req.query.from;
    const toDate = req.query.to;
    const limitValue = parseInt(req.query.limit);

    console.log(userId, fromDate, toDate, limitValue);
    
    // MongoDB query
    if(!fromDate && !toDate && !limitValue){
      Exercise.find({"_id": userId}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                res.json({"result": "No data in database"});
            }else{
                var {_id, count, log, username} = result[0];
                res.json({_id, username, count, log });
                console.log('this just got hit');
            }
        }
    });
    }else if(fromDate && toDate){
      
      var firstDate = new Date(fromDate);
      var secondDate = new Date(toDate);
      firstDate = firstDate.toDateString();
      secondDate = secondDate.toDateString();
      
      var logArray = [];

      Exercise.find({"_id": userId}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                res.json({"result": "No data in database"});
            }else{
                var {_id, log, username} = result[0];
                var count = 0;
                var fromTime = new Date(fromDate);
                var toTime = new Date(toDate);
                fromTime = fromTime.getTime();
                toTime = toTime.getTime();

                console.log(log);
                for(var i = 0; i < log.length; i++){
                  var dateCompare = log[i].date;
                  var newDate = new Date(dateCompare);
                  dateCompare = dateCompare.getTime();

                  if(fromTime < dateCompare || dateCompare < toTime){
                    logArray.push(log[i]);
                    count++;
                  }                  
                }
                console.log(logArray);
                res.json({_id, username, "from": firstDate, "to": secondDate, count: count, log: logArray});
            }
        }
      });
      console.log('now search for exercise with all parameters provided');
    }else if(limitValue){
      Exercise.find({"_id": userId}, (err, result) => {
        if(err) {
            return console.error(err);
        }else{
            if(result.length === 0){
                res.json({"result": "No data in database"});
            }else{
                var {_id, count, log, username} = result[0];
                var logArray = [];

                for(var i = 0; i < limitValue; i++){
                  logArray.push(log[i]);
                }
                console.log(logArray);
                res.json({_id, username, count: limitValue, log: logArray});
            }
        }
      });
    }

});


module.exports = router;