const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/likes';
const user_id = 1234;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.locals.currentUser = user_id;
    next();
})

app.get("/", (req, res) => {
    res.send("Home Page");
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("index", {campgrounds})
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", async(req, res) => {
    const camp = await Campground.create(req.body);
    res.redirect(`/campgrounds/${camp.id}`);
})

app.get("/campgrounds/:id", async(req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render("show", {camp});
})

app.get("/campgrounds/:id/likes", async(req, res) => {
    const camp = await Campground.findById(req.params.id);
    // Handle Like
    if(!camp.likes.includes(user_id)) {
        camp.likes.push(user_id);
        await camp.save();
        res.send({
            message: "Like the campground successfully",
            totalLikes: camp.likes.length
        });
    } else {
        let idx = camp.likes.indexOf(user_id);
        camp.likes.splice(idx, 1);
        await camp.save();
        res.send({
            message: "Unlike the campground successfully",
            totalLikes: camp.likes.length
        });
    }
})

app.listen(8000, () => {
    console.log("Server running!");
})