const express = require("express");

const router = express.Router();

const {

    getNotes,

    getNote,

    addNote,

    editNote,

    removeNote

} = require("../controllers/notesController");

router.get("/", getNotes);

router.get("/:id", getNote);

router.post("/", addNote);

router.put("/:id", editNote);

router.delete("/:id", removeNote);

module.exports = router;