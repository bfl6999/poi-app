const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  userUid: { type: String, required: false },
  comment: { type: String, required: true, maxlength: 1000 },
  stars: { type: Number, required: true, min: 0, max: 5 },
  location: {
    lat: Number,
    lng: Number,
  },
  geo: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },

  imageUrl: String,
  source: {
    type: String,
    enum: ['form', 'foursquare'],
    default: 'form'
},
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
},
  createdAt: { type: Date, default: Date.now },
});

const poiSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  dateAdded: { type: Date, default: Date.now },
  imageUrl: String,
  insertedBy: { type: String, required: true }, 
  source: {
  type: String,
  enum: ['form', 'foursquare'],
  default: 'form'
},
  coordinates: {
    lat: Number,
    lng: Number,
  },
  rating : Number,
  geo: {
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [lng, lat]
    required: true
  }
},
  comments: [commentSchema]
});

module.exports = mongoose.model('POI', poiSchema);