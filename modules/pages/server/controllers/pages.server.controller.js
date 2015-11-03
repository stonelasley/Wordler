'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Page = mongoose.model('Page'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a page
 */
exports.create = function (req, res) {
  var page = new Page(req.body);
  page.user = req.user;

  page.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(page);
    }
  });
};

/**
 * Show the current page
 */
exports.read = function (req, res) {
  res.json(req.page);
};

/**
 * Update a page
 */
exports.update = function (req, res) {
  var page = req.page;

  page.url = req.body.url;
  page.note = req.body.note;

  page.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(page);
    }
  });
};

/**
 * Delete an page
 */
exports.delete = function (req, res) {
  var page = req.page;

  page.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(page);
    }
  });
};

/**
 * List of Pages
 */
exports.list = function (req, res) {
  Page.find().sort('-created').populate('user', 'displayName').exec(function (err, pages) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(pages);
    }
  });
};

/**
 * Page middleware
 */
exports.pageByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Page is invalid'
    });
  }

  Page.findById(id).populate('user', 'displayName').exec(function (err, page) {
    if (err) {
      return next(err);
    } else if (!page) {
      return res.status(404).send({
        message: 'No page with that identifier has been found'
      });
    }
    req.page = page;
    next();
  });
};

