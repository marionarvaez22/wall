var express = require("express");
var app = express();
var session = require('express-session');
var Path = require('path');
var BodyParser = require('body-parser');

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.use(BodyParser.json({limit: '50mb'}));
app.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/assets', express.static(Path.join(__dirname, "/assets")));

app.use(session({secret: 'wallingrocks'}));

/* VIEW ROUTES */
const AllRoutes = require("./routes/all.routes");

app.use("/", AllRoutes);

app.listen(8000, () => {
 console.log("Server running on port 8000");
});