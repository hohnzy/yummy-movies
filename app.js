// NPMs Setup
// ==========
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Movie       = require("./models/movie"),
    Comment     = require("./models/comment"),
    request     = require("request");
var seedDB      = require("./seeds");
var apiKey      = "9bc479d8ac3a59bbb142c3dde7cc42cb";

//seedDB();


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/yummy_movies");

// ROUTES
// ======

// Homepage GET
app.get("/", function(req, res) {
    res.render("homepage");
});

// Search GET
app.get("/movies/search", function(req, res) {
    var query = req.query.search;
    var page = req.query.page;
    var url = "http://api.themoviedb.org/3/search/movie?query=" + query + "&api_key=" + apiKey + "&page=" + page;
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("search", {data: data, query: query, page: page});
        }
    });
});

// Searched Movie Detail GET
app.get("/movies/search/:movieDetail", function(req, res) {
    var query = req.query.id;
    var url = "http://api.themoviedb.org/3/movie/" + query + "?api_key=" + apiKey;
    var video = "http://api.themoviedb.org/3/movie/" + query + "/videos?api_key=" + apiKey;
    
    request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            request(video, function(error, response, body2) {
                if (!error && response.statusCode == 200) {
                    var videoData = JSON.parse(body2);
                    res.render("searchedMovieDetail", {data: data, videoData: videoData});
                }
            });
        }
    });
    
});

// Movies list GET
app.get("/movies", function(req, res) {
    Movie.find({}, function(err, allMovies) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("movies", {movies_db: allMovies});
        }
    });
});

// Movies add new movie POST
app.post("/movies", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var year = req.body.year;
    var description = req.body.description;
    var url = req.body.name;
    var urlChanged = url.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-").toLowerCase();
    //urlChanged = urlChanged.replace(/\s/g, "-");
    var newMovie = {
        name: name, image: image, year: year, description: description, url: urlChanged
    };
    Movie.create(newMovie, function(err, newlyCreatedMovie) {
        if (err) {
            res.redirect("back");
        }
        else {
            res.redirect("/movies");
        }
    });
});

// Add movie - page-form GET
app.get("/movies/add", function(req, res) {
    res.render("addMovie");
});

// Movie Detail GET
app.get("/movies/:url", function(req, res) {
    Movie.findOne({"url": req.params.url}).populate("comments").exec(function(err, foundMovie) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("movieDetail", {movieDetail_db: foundMovie});
        }
    });
});

// Add comment to a movie POST
app.post("/movies/:url/comments", function(req, res) {
    Movie.findOne({"url": req.params.url}, function(err, foundMovie) {
        if (err) {
            console.log(err);
        }
        else {
            var text = req.body.text;
            var author = "hohnzy";
            var date = Date();
            var newComment = {
                text: text, author: author, date: date
            };
            Comment.create(newComment, function(err, newlyCreatedComment) {
                if (err) {
                    console.log(err);
                } else {
                    foundMovie.comments.push(newlyCreatedComment);
                    foundMovie.save();
                    res.redirect("back");
                }
            });
        }
    });
});    
    
// Listen    
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Yummy Movies started!");
});