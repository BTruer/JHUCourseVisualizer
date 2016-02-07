var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var api = require('./api.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
    res.sendFile('index.html');
});

app.get('/schools', function(req, res, next) {
    api.schools(function(data) {
        res.json(data);
    });
});

app.get('/:school/departments', function(req, res, next) {
	api.departments(req.params.school, function(data) {
        res.json(data);
    });
});

app.get('/:school/:department/classes', function(req, res, next) {
	api.classes(req.params.school, req.params.department, function(data) {
        res.json(data);
    });
});

app.get('/:schoolCode/:departmentCode/:courseCode/:sectionCode', function(req, res, next) {
    api.prerequisites(req.params.schoolCode, req.params.departmentCode, req.params.courseCode, req.params.sectionCode, function(data) {
        res.json(data);
    });
});

app.listen(3000);
