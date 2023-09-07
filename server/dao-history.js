'use strict';

const db = require('./db');
const dayjs = require("dayjs");

// This function returns the list of all history entries for a given user.
exports.getHistory = (user) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM history WHERE userId = ? ORDER BY date DESC, strftime('%H:%M:%S', date) ASC`; 

    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
      } else {
          const history = rows.map(row => ({
              userId: row.userId,
              date: dayjs(row.date),
              difficulty: row.difficulty,
              secretItem: row.secretItem,
              score: row.score
          }));
          resolve(history);
      }
    });
  });
};

// This function adds a new history entry for a given user.
exports.postHistory = (userId, difficulty, secretItem, score) => {
  const date = dayjs().format("YYYY-MM-DD HH:mm");

  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO history (userId, date, difficulty, secretItem, score) VALUES(?, ?, ?, ?, ?)';

    db.run(sql, [userId, date, difficulty, secretItem, score], function (err) {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};