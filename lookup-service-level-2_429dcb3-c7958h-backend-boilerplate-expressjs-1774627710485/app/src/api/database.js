const sqlite3 = require("sqlite3").verbose();

// create database 
const db = new sqlite3.Database("creditData.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      return console.error(err.message)
    } 
    else {
    console.log("Connected to SQLite database");
  }}
);

// create table for caching data 
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS credit_data ( 
    ssn TEXT PRIMARY KEY,
    personalData TEXT
  )`);
});

// search through database by ssn. If ssn exists, return it, otherwise return null.  
function getCreditDataCached(ssn) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT personalData FROM credit_data WHERE ssn = ?",
      [ssn],
      (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(JSON.parse(row.personalData));
      }
    );
  });
}

// save credit data to database 
function saveToCache(ssn, personalData) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO credit_data (ssn, personalData) VALUES (?, ?)",
            [ssn, JSON.stringify(personalData)],
            (err) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

module.exports = { getCreditDataCached, saveToCache }
