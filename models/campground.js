const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    title: String,
    likes: [Number]
})

module.exports = mongoose.model("Campground", campgroundSchema);