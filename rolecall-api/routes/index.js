var express = require('express');
var router = express.Router();

/* GET Healthcheck of the server to see if it's running */
router.get('/', function(req, res, next) {
  res.send({
    status: "OK",
    message: "Hello from Rolecall API"
  })
});

module.exports = router;
