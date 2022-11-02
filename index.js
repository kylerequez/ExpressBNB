// Initial imports
const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const route = require(path.join(__dirname, "/src/routes/route"));

const port = 1337;

// Initial settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Uses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// MongoDB connect
const mongoPort = 27017;
const appName = "expressBNB";
mongoose.connect(`mongodb://localhost:${mongoPort}/${appName}`)
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Route folder
app.use('/', route);