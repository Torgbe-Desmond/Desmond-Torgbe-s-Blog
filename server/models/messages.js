const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const MessageSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read:{
    type:Boolean,
    default:false
  }
},
{timestamps:true},
);

module.exports = mongoose.model('Message', MessageSchema);