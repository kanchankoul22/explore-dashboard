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
  title: {
    type: String,
    default: '',
    required: 'Please fill Collection name',
    trim: true
  },
  imageWidth: {
    type: Number,
    default: '',
    required: 'Please fill image width name',
    trim: true
  },
  imageHeight: {
    type: Number,
    default: '',
    required: 'Please fill image height name',
    trim: true
  },
  key:{
    type: String,
    default: '',
    required: 'Please fill key name',
    trim: true
  },
  priority: {
    type: Number,
    required: 'Please fill priority name',
    trim: true
  },
  product_dimension_config: {
    type: String,
    default: '',
    required: 'Please fill dimension configuration',
    trim: true
  },
  data_filter: {
    type: Array,
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
