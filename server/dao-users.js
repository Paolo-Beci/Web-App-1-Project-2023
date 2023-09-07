'use strict';

const db = require('./db');
const crypto = require('crypto');

// This function returns user's information given its id.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id=?';

    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        const user = { id: row.id, email: row.email, name: row.name }
        resolve(user);
      }
    });
  });
};

// This function is used at log-in time to verify username and password.
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email=?';

    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.id, email: row.email, name: row.name };

        console.log(row.name, password, row.salt, row.hash);

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

// This function is used to hash the password using the specified salt.
function hashPassword(pass, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pass, salt, 32, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        reject(err);
      } else {
        console.log("Hashed password:", hashedPassword);
        resolve(hashedPassword);
      }
    });
  });
}

// This function is used to register a new user.
exports.register = (email, name,  pass) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (email, name, hash, salt) VALUES (?, ?, ?, ?)';
    const salt = crypto.randomBytes(16);
    let password;

    hashPassword(pass, salt)
      .then((hashedPassword) => {
        password = hashedPassword
        console.log('New user:', email, name, password, hashedPassword);
        
        db.run(sql, [email, name, password, salt], (err, row) => {
          if (err) {
            reject(err);
          }
          else if (row === undefined) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      })
      .catch((err) => {
        console.error('Error hashing password:', err);
      });
  })
};
