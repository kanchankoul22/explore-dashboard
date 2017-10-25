'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collection Schema
 */
var CollectionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Collection name',
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

mongoose.model('Collection', CollectionSchema);
