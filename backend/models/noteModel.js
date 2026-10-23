const connectDB = require("../config/db");

// Get all notes
async function getAllNotes() {
    const db = await connectDB();
    return db.all(
        "SELECT * FROM notes ORDER BY datetime(updated_at) DESC"
    );
}

// Get one note
async function getNoteById(id) {
    const db = await connectDB();

    return db.get(
        "SELECT * FROM notes WHERE id = ?",
        [id]
    );
}

// Create note
async function createNote(note) {
    const db = await connectDB();

    return db.run(
        `
        INSERT INTO notes
        (title, body, category, created_at, updated_at)

        VALUES(?,?,?,?,?)
        `,
        [
            note.title,
            note.body,
            note.category,
            note.created_at,
            note.updated_at
        ]
    );
}

// Update note
async function updateNote(id, note) {
    const db = await connectDB();

    return db.run(
        `
        UPDATE notes
        SET

        title=?,
        body=?,
        category=?,
        updated_at=?

        WHERE id=?
        `,
        [
            note.title,
            note.body,
            note.category,
            note.updated_at,
            id
        ]
    );
}

// Delete note
async function deleteNote(id) {

    const db = await connectDB();

    return db.run(
        "DELETE FROM notes WHERE id=?",
        [id]
    );

}

module.exports = {

    getAllNotes,

    getNoteById,

    createNote,

    updateNote,

    deleteNote

};