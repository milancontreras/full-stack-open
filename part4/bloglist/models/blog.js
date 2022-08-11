const mongoose = require('mongoose')
require('dotenv').config()

// const url = process.env.MONGODB_URI

// console.log('conecting to', url)

// mongoose.connect(url)
//   .then(() => {
//     console.log('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB: ', error.message)
//   })

  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

  module.exports = mongoose.model('Blog', blogSchema)