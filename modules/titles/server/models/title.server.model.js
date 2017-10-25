'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Title Schema
 */
var TitleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Title name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Title', TitleSchema);
