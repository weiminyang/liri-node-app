require("dotenv").config();
var moment = require("moment");
var fs = require("fs");
var axios = require("axios");
var Spotify = require("node-spotify-api");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var findConcert = function(band) {
  var artist = "dido";
  if(band!==""){

      artist = band;
  }
  spotify
    .request(
      "https://rest.bandsintown.com/artists/" +
        artist +
        "/events?app_id=codingbootcamp"
    )
    .then(function(data) {
      console.log(data[0].venue.name);
      console.log(data[0].venue.city);
      var a = moment(data[0].datetime).format("MM-DD-YYYY");
      console.log(a);
    })
    .catch(function(err) {
      console.error("Error occurred: " + err);
    });
};

var findSong = function(song) {
  var songName = "The Sign Ace of Base";
  if (song !== "") {
    songName = song;
  }
  spotify
    .search({ type: "track", query: songName })
    .then(function(response) {
      console.log(response.tracks.items[0].album.artists[0].name);
      console.log(response.tracks.items[0].name);
      console.log(response.tracks.items[0].preview_url);
      console.log(response.tracks.items[0].album.name);
    })
    .catch(function(err) {
      console.log(err);
    });
};

var findMovie = function(movie) {
  var movieName = "Mr. Nobody";
  if (movie !== "") {
    movieName = movie;
  }

  axios
    .get(
      "https://www.omdbapi.com/?t=" +
        movieName +
        "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      console.log(response.data.Title);
      console.log(response.data.Released);
      console.log(response.data.imdbRating);
      console.log(response.data.Ratings[1].Value);
      console.log(response.data.Country);
      console.log(response.data.Language);
      console.log(response.data.Plot);
      console.log(response.data.Actors);
    })
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
};

var doTextSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    var condition = dataArr[0];
    var item = dataArr[1];
    if (condition === "concert-this") {
      findConcert(item);
    }
    if (condition === "spotify-this-song") {
      findSong(item);
    }
    if (condition === "movie-this") {
      findMovie(item);
    }
  });
};

var liri = function() {
  var condition = process.argv[2];
  var item = process.argv.slice(3).join(" ");
  if (condition === "concert-this") {
    findConcert(item);
  }
  if (condition === "spotify-this-song") {
    findSong(item);
  }
  if (condition === "movie-this") {
    findMovie(item);
  }
  if (condition === "do-what-it-says") {
    doTextSays();
  }
};
liri();
