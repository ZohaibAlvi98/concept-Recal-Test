const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
   },
   name: {
    type: String,
    required: true
   },
   description: String,
   image: String,
   startDate: {
    type: Date
   },
   techStacks: {
    type: String,
    enum: ['MERN', 'MEAN','PHP','DOTNET'],
    default: 'MERN',
   },
   status: {
    type: String,
    enum: ['current','archived', 'completed'],
    default: 'current'
   },
   repoLink: String,
   liveUrl: String,
   createdt:{
    type:Date,
    default: Date.now
}
});

module.exports = mongoose.model('Project', ProjectSchema);
