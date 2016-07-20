var Movie           = require("./models/movie");
var Comment         = require("./models/comment");


var data = [
    {
        name: "Pulp Fiction",
        image: "http://image.tmdb.org/t/p/w500/dM2w364MScsjFf8pfMbaWUcWrR.jpg",
        year: 1994,
        description: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
        url: "pulp-fiction"
    },
    {
        name: "The Lord of the Rings: The Fellowship of the Ring",
        image: "http://image.tmdb.org/t/p/w500/bxVxZb5O9OxCO0oRUNdCnpy9NST.jpg",
        year: 2001,
        description: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.",
        url: "the-lord-of-the-rings-the-fellowship-of-the-ring"
    },
    {
        name: "Blade Runner",
        image: "http://image.tmdb.org/t/p/w500/p64TtbZGCElxQHpAMWmDHkWJlH2.jpg",
        year: 1982,
        description: "In the smog-choked dystopian Los Angeles of 2019, blade runner Rick Deckard is called out of retirement to kill a quartet of replicants who have escaped to Earth seeking their creator for a way to extend their short life spans.",
        url: "blade-runner"
    },
    {
        name: "Star Trek",
        image: "http://image.tmdb.org/t/p/w500/xPihqTMhCh6b8DHYzE61jrIiNMS.jpg",
        year: 1994,
        description: "The fate of the galaxy rests in the hands of bitter rivals. One, James Kirk, is a delinquent, thrill-seeking Iowa farm boy. The other, Spock, a Vulcan, was raised in a logic-based society that rejects all emotion. As fiery instinct clashes with calm reason, their unlikely but powerful partnership is the only thing capable of leading their crew through unimaginable danger, boldly going where no one has gone before. The human adventure has begun again.",
        url: "star-trek"
    }
];

function seedDB() {
    // Clear Movie DB
    Comment.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Comments removed");
        }
    });
    Movie.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Movies removed");
            // Add default movies to Movie DB
            data.forEach(function(seed) {
                Movie.create(seed, function(err, movie) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Default movies added");
                        // Add some default comments
                        Comment.create({
                            text: "This movie is great!",
                            author: "hohnzy",
                            date: Date()
                        }, function(err, comment) {
                            if (err) {
                                console.log("ERROR - " + err);
                            }
                            else {
                                movie.comments.push(comment);
                                movie.save();
                                console.log("New comment added");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;