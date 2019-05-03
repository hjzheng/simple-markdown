import axios from 'axios';

export const loadNotebooks = async() => {
    const notebooksResponse = await axios.get('http://localhost:3000/notebooks')
    let notebooks = notebooksResponse.data || [];
    return notebooks;
}

export const loadNotes = async(currentNotebookId) => {
    const notesResponse = await axios.get(`http://localhost:3000/notes?bookId=${currentNotebookId}`)
    let notes = notesResponse.data || [];
    return notes;
}

export const removeNotebook = async () => {

}

export const removeNote = async (id) => {
    if(id) {
        await axios.delete(`http://localhost:3000/notes/${id}`, { "Content-Type": "application/json" });
    }
}

export const addNote = async (note) => {
    await axios.post(`http://localhost:3000/notes`, note, { "Content-Type": "application/json" });
}

export const saveNote = async (note) => {
    if(note && note.id) {
        await axios.put(`http://localhost:3000/notes/${note.id}`, note, { "Content-Type": "application/json" });
    }
}

export const loadNote = async(currentNoteId) => {
    const noteResponse = await axios.get(` http://localhost:3000/notes/${currentNoteId}`)
    let note = noteResponse.data || [];
    return note;
}