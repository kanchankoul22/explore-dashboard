'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Collectionexclusionlist Schema
 */
var CollectionexclusionlistSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Collectionexclusionlist name',
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

mongoose.model('Collectionexclusionlist', CollectionexclusionlistSchema);
