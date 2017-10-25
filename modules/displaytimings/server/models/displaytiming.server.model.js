'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Displaytiming Schema
 */
var DisplaytimingSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Displaytiming name',
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

mongoose.model('Displaytiming', DisplaytimingSchema);
