import axios from 'axios';

export const loadNotebooks = async() => {
    const notebooksResponse = await axios.get('http://localhost:3000/notebooks')
    // 我们在使用const和let时，如果后面没有对变量重新赋值，优先使用const。
    // 当函数语句较多时，区分const和let在可读性方面优势会明显，因为let需要给予更多的关注（要找找哪里有修改）
    // 在ES6 块作用域 那一节中有讲到这个点，不过你的ES6基本功很好，估计只有经验总结部分对你有帮助。
    let notebooks = notebooksResponse.data || [];
    return notebooks;
}

// 问个问题？
// 你们目前前端团队的的代码缩进是使用4个空格吗？
// 因为我看到几个文件中的代码缩进不一致，比如`App.js`中的代码缩进是2个空格，这个文件中是4个空格。
// 目前前端项目中（包括开源的）用2个空格缩进的比较多
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
