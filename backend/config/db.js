const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Creates a database file in your backend folder
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('SQL Database Error:', err.message);
    } else {
        console.log('SQL Database Connected (SQLite).');
        
        // Create the users table if it doesn't exist yet
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`);
    }
});

module.exports = db;