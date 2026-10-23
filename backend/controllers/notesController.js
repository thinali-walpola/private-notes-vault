const Note = require("../models/noteModel");

// GET ALL

async function getNotes(req,res){

    const notes = await Note.getAllNotes();

    res.json(notes);

}

// GET ONE

async function getNote(req,res){

    const note = await Note.getNoteById(req.params.id);

    if(!note){

        return res.status(404).json({

            message:"Note not found"

        });

    }

    res.json(note);

}

// CREATE

async function addNote(req,res){

    const note={

        title:req.body.title,

        body:req.body.body,

        category:req.body.category,

        created_at:new Date().toISOString(),

        updated_at:new Date().toISOString()

    };

    await Note.createNote(note);

    res.status(201).json({

        message:"Note Created"

    });

}

// UPDATE

async function editNote(req,res){

    const note={

        title:req.body.title,

        body:req.body.body,

        category:req.body.category,

        updated_at:new Date().toISOString()

    };

    await Note.updateNote(req.params.id,note);

    res.json({

        message:"Note Updated"

    });

}

// DELETE

async function removeNote(req,res){

    await Note.deleteNote(req.params.id);

    res.json({

        message:"Note Deleted"

    });

}

module.exports={

    getNotes,

    getNote,

    addNote,

    editNote,

    removeNote

};