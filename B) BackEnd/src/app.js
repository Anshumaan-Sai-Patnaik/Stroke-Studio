const express = require('express');
const session = require("express-session");
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'..', '..', 'A) FrontEnd', 'Markup(HTML)'));

app.use(express.static(path.join(__dirname,'..','..','A) FrontEnd')));
app.use(express.static(path.join(__dirname,'..','..','Uploads')));

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false
}));
app.use('/', require('./routes'));

module.exports = app;
