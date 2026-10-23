/*=====================================
            ELEMENTS
=====================================*/
const newNoteBtn = document.getElementById("newNoteBtn");
const notesList = document.getElementById("notesList");
const titleInput = document.getElementById("noteTitle");
const bodyInput = document.getElementById("noteBody");
const createdDate = document.getElementById("createdDate");
const modifiedDate = document.getElementById("modifiedDate");
const saveStatus = document.getElementById("saveStatus");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const currentCategory = document.getElementById("currentCategory");
const searchInput = document.getElementById("searchInput");
const deleteBtn = document.getElementById("deleteBtn");
const categoryButtons = document.querySelectorAll(".category-btn");
const sidebarCategories = document.querySelectorAll(".categories li");

/*=====================================
            DATA & STATE
=====================================*/
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let selectedNote = null;
let activeFilter = "All"; // Fixed: Initialized before renderNotes runs

/*=====================================
        SAVE TO LOCAL STORAGE
=====================================*/
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

/*=====================================
        FORMAT DATE
=====================================*/
function formatDate(date) {
    if (!date) return "-";
    const now = new Date();
    const old = new Date(date);
    const seconds = Math.floor((now - old) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + " min ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + " hour ago";
    if (seconds < 172800) return "Yesterday";
    
    return old.toLocaleDateString();
}

/*=====================================
        CREATE NOTE
=====================================*/
function createNote() {
    const note = {
        id: Date.now(),
        title: "Untitled",
        body: "",
        category: "Personal",
        created: new Date(),
        modified: new Date()
    };

    notes.unshift(note);
    selectedNote = note.id;
    
    saveNotes();
    updateCategoryCounts();
    openNote(note.id);
    
    titleInput.focus();
    titleInput.select();
}

/*=====================================
        RENDER NOTES (CONSOLIDATED)
=====================================*/
function renderNotes() {
    notesList.innerHTML = "";

    // 1. Filter by Sidebar Category
    let filtered = notes;
    if (activeFilter !== "All") {
        filtered = filtered.filter(note => note.category === activeFilter);
    }

    // 2. Filter by Search Query
    const search = searchInput.value.toLowerCase();
    filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(search) || 
        note.body.toLowerCase().includes(search)
    );

    // Empty state logic
    if (filtered.length === 0) {
        notesList.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-note-sticky"></i>
            <h2>No Notes Found</h2>
            <p>Try creating a note or matching another keyword.</p>
        </div>`;
        return;
    }

    // Build the list
    filtered.forEach(note => {
        const card = document.createElement("div");
        card.className = "note-card";
        if (note.id === selectedNote) {
            card.classList.add("active");
        }

        card.innerHTML = `
            <h3 class="note-title">${note.title}</h3>
            <p class="note-preview">${note.body || "Start writing your private note..."}</p>
            <div class="note-footer">
                <span class="badge ${note.category.toLowerCase()}">${note.category}</span>
                <span class="note-date">${formatDate(note.modified)}</span>
            </div>
        `;

        card.onclick = () => openNote(note.id);
        notesList.appendChild(card);
    });
}

/*=====================================
        OPEN NOTE
=====================================*/
function openNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    selectedNote = id;
    titleInput.value = note.title;
    bodyInput.value = note.body;
    createdDate.textContent = "Created: " + formatDate(note.created);
    modifiedDate.textContent = "Modified: " + formatDate(note.modified);
    currentCategory.textContent = note.category;

    // Highlight the matching category button in the editor panel
    categoryButtons.forEach(btn => {
        if (btn.dataset.category === note.category) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    renderNotes();
    updateCounters();
}

/*=====================================
        UPDATE COUNTERS
=====================================*/
function updateCounters() {
    const text = bodyInput.value;
    charCount.textContent = text.length + " Characters";

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = words + " Words";
}

/*=====================================
        UPDATE NOTE
=====================================*/
function updateCurrentNote() {
    const note = notes.find(n => n.id === selectedNote);
    if (!note) return;

    note.title = titleInput.value || "Untitled";
    note.body = bodyInput.value;
    note.modified = new Date();

    modifiedDate.textContent = "Modified: " + formatDate(note.modified);
    saveStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    // Keep the newest modified note on top
    notes.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    saveNotes();
    renderNotes();
    updateCategoryCounts();
    updateCounters();

    setTimeout(() => {
        saveStatus.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
    }, 400);
}

/*=====================================
        UPDATE CATEGORY COUNTS
=====================================*/
function updateCategoryCounts() {
    const countAllEl = document.getElementById("count-all");
    if (countAllEl) countAllEl.textContent = notes.length;

    const categories = ["Personal", "Work", "Finance", "Health", "Ideas", "Other"];
    categories.forEach(category => {
        const total = notes.filter(note => note.category === category).length;
        const el = document.getElementById("count-" + category.toLowerCase());
        if (el) el.textContent = total;
    });
}

/*=====================================
        DELETE NOTE
=====================================*/
function deleteCurrentNote() {
    if (selectedNote === null) return;
    if (!confirm("Delete this note?")) return;

    notes = notes.filter(note => note.id !== selectedNote);
    saveNotes();

    if (notes.length) {
        selectedNote = notes[0].id;
        openNote(selectedNote);
    } else {
        selectedNote = null;
        clearEditor();
        renderNotes();
    }
    updateCategoryCounts();
}

function clearEditor() {
    titleInput.value = "";
    bodyInput.value = "";
    createdDate.textContent = "Created: -";
    modifiedDate.textContent = "Modified: -";
    currentCategory.textContent = "-";
    wordCount.textContent = "0 Words";
    charCount.textContent = "0 Characters";
}

/*=====================================
        EVENTS SETUP
=====================================*/
newNoteBtn.addEventListener("click", createNote);
titleInput.addEventListener("input", updateCurrentNote);
bodyInput.addEventListener("input", updateCurrentNote);
deleteBtn.addEventListener("click", deleteCurrentNote);
searchInput.addEventListener("input", renderNotes);

// Editor Top Row: Change Note Category
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        const note = notes.find(n => n.id === selectedNote);
        if (!note) return;

        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        note.category = button.dataset.category;
        currentCategory.textContent = note.category;
        note.modified = new Date();

        saveNotes();
        renderNotes();
        updateCategoryCounts();
    });
});

// Sidebar: Filter Notes View List
sidebarCategories.forEach(item => {
    item.addEventListener("click", () => {
        sidebarCategories.forEach(c => c.classList.remove("active"));
        item.classList.add("active");
        activeFilter = item.dataset.category || "All";
        renderNotes();
    });
});

/*=====================================
        KEYBOARD SHORTCUTS
=====================================*/
document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        createNote();
    }
    if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveNotes();
    }
});

/*=====================================
        INITIALIZE APP STATE
=====================================*/
updateCategoryCounts();
if (notes.length > 0) {
    openNote(notes[0].id);
} else {
    clearEditor();
    renderNotes();
}

const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {
    // Turn your notes array into formatted text
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 4));
    
    // Create a temporary hidden download link
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "midnight_vault_notes.json");
    
    // Trigger the download prompt
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});