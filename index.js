const { json } = require("express");
require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.render("index", {});
});

app.post("/fetch", (req, res) => {
  // endpoint to get tiles of points
  let data = req.body;
  let lat = data.lat;
  let lon = data.lon;
  lat = Number(lat).toFixed(2);
  lon = Number(lon).toFixed(2);
  // The larger the number, the smaller the zoom level
  let tileDimension = Number(0.25);

  //tileDimension=0.125;
  //tileDimension=0.025;	// default for API
  //tileDimension=0.075;

  const API_KEY = process.env.APIKEY;
  let baseUrl = "https://api.nasa.gov/planetary/earth/imagery?";
  // baseUrl +
  // "lon=" +
  // lon +
  // "&lat=" +
  // lat +
  // "&dim=" +
  // tileDimension +
  // "&api_key=" +
  // API_KEY,

  //generate tiles of map by center point in form
  // center = lon, lat
  let points = [
    {
      name: "topLeft",
      x: lon - tileDimension,
      y: parseFloat(lat) + parseFloat(tileDimension),
    },
    {
      name: "topCenter",
      x: lon,
      y: parseFloat(lat) + parseFloat(tileDimension),
    },
    {
      name: "topRight",
      x: parseFloat(lon) + parseFloat(tileDimension),
      y: parseFloat(lat) + parseFloat(tileDimension),
    },
    {
      name: "centerLeft",
      x: lon,
      y: parseFloat(lat) - parseFloat(tileDimension),
    },
    {
      name: "center",
      x: lon,
      y: lat,
    },
    {
      name: "centerRight",
      x: lon,
      y: parseFloat(lat) + parseFloat(tileDimension),
    },
    {
      name: "bottomLeft",
      x: lon - tileDimension,
      y: parseFloat(lat) - parseFloat(tileDimension),
    },
    {
      name: "bottomCenter",
      x: lon,
      y: parseFloat(lat) - parseFloat(tileDimension),
    },
    {
      name: "bottomRight",
      x: parseFloat(lon) + parseFloat(tileDimension),
      y: parseFloat(lat) - parseFloat(tileDimension),
    },
  ];

  let url = [];

  points.map((point) => {
    url.push(
      `${baseUrl}lon=${point.x}&lat=${point.y}&dim=${tileDimension}&api_key=${API_KEY}`
    );
  });
  console.log(url);

  return res.render("fetch", { data: url });
});

const server = app.listen(3000, () => {
  console.log(`The application started on port ${server.address().port}`);
});
