const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const Template = require('./../template.js');
const userRoutes = require('./routes/user.js');
const authRoutes = require('./routes/auth.routes.js');
// const devBundle = require('./devBundle');
const path = require('path');

const app = express();
const CURRENT_WORKING_DIR = process.cwd();

// devBundle.compile(app);  // Uncomment if using devBundle

app.get('/', (req, res) => {
  res.status(200).send(Template());
});

app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Register routes
app.use('/', userRoutes);
app.use('/', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "error": `${err.name}: ${err.message}` });
  } else if (err) {
    res.status(400).json({ "error": `${err.name}: ${err.message}` });
    console.log(err);
  }
});

module.exports = app;
