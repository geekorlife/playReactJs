const express = require('express');

var router = express.Router();     

// middleware to use for all requests
router.use(function(req, res, next) {
    
    next(); // make sure we don't stop here
});

module.exports = router;