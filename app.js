var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
const config = require('./config/config')
var app = express();

app.options('*', cors());
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./routes/routes')(app)
var server = app.listen(config.port, () => console.log(`Server Started at port 4000`))
app.set('server', server);
module.exports = app;