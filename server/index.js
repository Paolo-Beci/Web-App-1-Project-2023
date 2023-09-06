'use strict';

const PORT = 3000;
var SECRET_ITEM = null;

const express = require('express'); // Server
const morgan = require('morgan');   // Middleware
const cors = require('cors');  

const historyDao = require('./dao-history');
const cardsDao = require('./dao-cards');
const userDao = require('./dao-users');

const app = express();
app.use(morgan('combined'));
app.use(express.json());            // for parsing application/json
// app.use(express.static('public'))  TO DO MABYE LATER FOR CARDS IMAGES

// Configure CORS to allow requests from a specific origin
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // Allow sending cookies, authentication headers, etc.
};
app.use(cors(corsOptions));


/*** Passport ------------------------------- ***/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

passport.use(new LocalStrategy(async function verify(email, password, callback) {
  const user = await userDao.getUser(email, password)
  if(!user)
    return callback(null, false, 'Incorrect email or password');  
    
  return callback(null, user);
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) {
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});

// Creating the session 
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// Defining authentication verification middleware
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {                             
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

/*** Users auth APIs ------------------------------- ***/

// LOG IN
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => { 
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser() in LocalStratecy Verify Fn
          return res.json(req.user);
        });
    })(req, res, next);
});
  
// GET CURRENT USER INFO
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', async (req, res) => {
    if(req.isAuthenticated()) {
        const userServer = await userDao.getUserById(req.user.id);
        // console.log("userServer", userServer)

        console.log("USER SERVER -> id"+userServer.id+ " email"+ userServer.email+ " name"+ userServer.name);
        res.status(200).json({ "id":userServer.id, "email": userServer.email, "name": userServer.name });
    } else
        res.status(401).json({error: 'Not authenticated'});
});
  
// LOG OUT
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
    req.logout(() => {
        res.sendStatus(200);
    });
});

// REGISTER
app.post('/api/register', (req, res) => {

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
  
    const result = userDao.register(email, name, password);
    if (result) {
      res.status(200).json({message: "FUNZIONA"});
    } else {
      res.status(400).json({error: "NON FUNZIONA"});
    }
});


/*** API routes ------------------------------- ***/
// GET VALUES OF PROPERTY
app.get('/api/values', async (req, res) => {
    const property = req.query.property;

    try {
        const result = await cardsDao.getValues(property);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
}) ;

// GET CARDS
app.get('/api/cards', async (req, res) => {
    const difficulty = req.query.difficulty;

    if (difficulty == "easy") {
        // 12 cards
        const numCards = 12;
        try {
            const result = await cardsDao.getCards(numCards);
            if (result.error)
                res.status(404).json(result);
            else
                SECRET_ITEM = result[Math.floor(Math.random() * result.length)];
                res.json(result);
        } catch (err) {
            res.status(500).end();
        }

    } else if (difficulty == "medium") {
        // 24 cards
        const numCards = 24;
        try {
            const result = await cardsDao.getCards(numCards);
            if (result.error)
                res.status(404).json(result);
            else
                SECRET_ITEM = result[Math.floor(Math.random() * result.length)];
                res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    } else if (difficulty == "hard") {
        // 36 cards
        const numCards = 36;
        try {
            const result = await cardsDao.getCards(numCards);
            if (result.error)
                res.status(404).json(result);
            else
                SECRET_ITEM = result[Math.floor(Math.random() * result.length)];
                res.json(result);
        } catch (err) {
            res.status(500).end();
        }
    } else {
        res.send("Difficulty not specified! Try again");
    }
}) ;

// GET CHECK CARD 
app.get('/api/checkCard', async (req, res) => {
    const cardId = req.query.cardId;

    try {
        if (SECRET_ITEM && SECRET_ITEM.id == cardId) {
            res.status(200).json({"result": true});
        } else {
            res.status(200).json({"result": false});
        }
    } catch (err) {
        res.status(500).end();
    }
}) ;

// GET CHECK PROPERTY 
app.get('/api/checkProperty', async (req, res) => {
    const property = req.query.property;
    const value = req.query.value;

    try {
        if (SECRET_ITEM && SECRET_ITEM[property] == value) {
            res.status(200).json({"result": true});
        } else {
            res.status(200).json({"result": false});
        }
    } catch (err) {
        res.status(500).end();
    }
}) ;

// GET HISTORY
app.get('/api/history', isLoggedIn, async (req, res) => {
    try {
        const result = await historyDao.getHistory(req.user.id);
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
}) ;

// POST HISTORY
app.post('/api/history/add', isLoggedIn, async (req, res) => {
    const { difficulty, score } = req.body;
    const userId = req.user.id;

    if (SECRET_ITEM === null) {
        res.status(400).send("SECRET_ITEM not available yet");
        return;
    }

    try {
        const response = await historyDao.postHistory(userId, difficulty, SECRET_ITEM.name, score);
        if (response.error)
            res.status(404).json(response);
        else
            res.send({ success: true }) ;
    } catch (err) {
        res.status(500).send(err).end();
    }
}) ;


/*** LISTEN port ------------------------------ ***/
app.listen(PORT,
    () => { console.log(`Server started on http://localhost:${PORT}/api/`) });