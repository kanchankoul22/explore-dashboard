'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hurdle Schema
 */
var HurdleSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Hurdle name',
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

mongoose.model('Hurdle', HurdleSchema);
