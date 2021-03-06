const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models');
require('dotenv').config();
const PORT = process.env.PORT || 7000;
const app = express();
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(
  'mongodb://@ds115244.mlab.com:15244/unit18populater' ||
    'mongodb://localhost/unit18Populater',
  {
    useNewUrlParser: true,
    auth: { user: process.env.DBUSER, password: process.env.DBPASSWORD }
  }
);
//test

app.get('/scrape', function(req, res) {
  console.log('scraped!');
  axios.get('https://www.ctvnews.ca/canada/').then(function(response) {
    var $ = cheerio.load(response.data);
    // console.log(response.data);

    $('h2.teaserTitle').each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children('a')
        .text();
      result.link = $(this)
        .children('a')
        .attr('href');
      result.saved = false;

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    console.log('finished forEach article (GET /scrape)');

    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

app.get('/articles', function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get('/articles/:id', function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate('note')
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post('/articles/:id', function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post('/saveArticle/:id', function(req, res) {
  console.log(req.param.id);

  db.Article.findOneAndUpdate(
    { _id: req.params.id },
    { saved: true },
    { new: true },
    (err, response) => {
      if (err) res.send(err);
      res.send(response);
    }
  );
});

app.get('/getSavedArticles', (req, res) => {
  db.Article.find({ saved: true })
    .then(dbArticle => {
      res.json(dbArticle);
    })
    .catch(error => {
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log('App running on port ' + PORT + '!');
});
