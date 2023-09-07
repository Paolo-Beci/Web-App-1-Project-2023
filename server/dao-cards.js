'use strict';

const db = require('./db');

// This function returns the list of all the possible values for a given property.
exports.getValues = (property) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT DISTINCT ${property} FROM cards`;

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const values = rows.map(row => row[property]);
        resolve(values);
      }
    });
  });
};

// This function returns a list of cards randomly chosen.
exports.getCards = (numCards) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM cards ORDER BY RANDOM() LIMIT ?';

    db.all(sql, [numCards], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const cards = rows.map(row => ({
          id: row.id,
          name:row.name,
          hair: row.hair,
          eyes: row.eyes,
          mustache: row.mustache,
          nose: row.nose,
          hair_style: row.hair_style,
          eyebrows: row.eyebrows,
          glasses: row.glasses,
          hat: row.hat,
          gender: row.gender,
          beard: row.beard,
          age: row.age,
          skin_color: row.skin_color
        }));
        resolve(cards);
      }
    });
  });
};