'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Datafilter Schema
 */
var DatafilterSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Datafilter name',
    trim: true
  },
  type: {
    type: String,
    default: '',
    required: 'Please fill Datafilter type',
    trim: true
  },
  criteria: {
    type: String,
    default: '',
    required: 'Please fill Datafilter criteria',
    trim: true
  },
  startTime: {
    type: String,
    default: '',
    required: 'Please fill Datafilter startTime',
    trim: true
  },
  endTime: {
    type: String,
    default: '',
    required: 'Please fill Datafilter EndTime',
    trim: true
  },
  sortBy: {
    type: String,
    default: '',
    required: 'Please fill Datafilter SortBy',
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

// virtualexclusionlist()
// {

// };

mongoose.model('Datafilter', DatafilterSchema);
