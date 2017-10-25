'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Criterion Schema
 */
var CriterionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Criterion name',
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

mongoose.model('Criterion', CriterionSchema);
