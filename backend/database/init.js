const connectDB = require("../config/db");

async function initializeDatabase() {

    const db = await connectDB();

    await db.exec(`

        CREATE TABLE IF NOT EXISTS notes(

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            title TEXT NOT NULL,

            body TEXT,

            category TEXT,

            created_at TEXT,

            updated_at TEXT

        );

    `);

    console.log("Database initialized.");

}

initializeDatabase();