const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err) {
    console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function(req, res) {
    let articles = Article.find({}, function(err, articles){
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            }); 
        }
    });    
});

// Add Route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title: 'Add Articles'
    });
});

// Add Submit POST Route
app.post('/articles/add', function(req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Update Submit POST Route
app.post('/articles/edit/:id', function(req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Delete Article
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err) {
        if(err){
            console.log(err);
        }

        res.send('Success');
    });
});

// Get Single Article
app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article){
        res.render('article', {
            article: article
        });
    });
});


// Load Edit Form
app.get('/article/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article){
        res.render('edit_article', {
            article: article
        });
    });
});

// Start Server
app.listen('3000', function() {
    console.log('Server started on port 3000')
});