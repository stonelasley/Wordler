'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validators = require('mongoose-validators');

/**
 * Page Schema
 */
var PageSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  url: {
    type: String,
    default: '',
    trim: true,
    required: 'Url cannot be blank',
    validate: validators.isURL({message: "Url must be a valid url such as 'http://www.wordler.com' or 'wordler.com'"})
  },
  note: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Page', PageSchema);
