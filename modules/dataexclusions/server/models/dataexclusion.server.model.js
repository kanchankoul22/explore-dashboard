'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Dataexclusion Schema
 */
var DataexclusionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Dataexclusion name',
    trim: true
  },
  type: { // types [vendor, cusine, food_characteristics, delivery_timing etc]
    type: String,
    default: '',
    required: 'Please fill Datafilter type',
    trim: true
  },
  data_filter: {
    type: String,
    default: '',
    required: 'Please fill Datafilter data filter',
    trim: true
  },
  isGlobal: {
    type: Boolean,
    default: '',
    required: 'Please fill Datafilter is Global',
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

mongoose.model('Dataexclusion', DataexclusionSchema);
