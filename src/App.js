import React from 'react';
import marked from 'marked';
import classNames from 'classnames';
import LinesEllipsis from 'react-lines-ellipsis';
import uniqueId from 'lodash.uniqueid';
import Swal from 'sweetalert2'
import axios from 'axios';
import 'github-markdown-css';
import './App.scss';

// TODO 重构

class App extends React.Component {

  textareaRef = React.createRef();

  state = {
    notebooks: [],
    currentNotebookId: 0,
    notes: [],
    currentNoteId: 0,
    body: '',
    title: '',
  }

  handleChange = (e, key) => {
    const { value } = e.target;
    const { notes, currentNoteId } = this.state;
    const newNotes = notes.map(note => {
      if (note.id === currentNoteId) {
        note[key] = value
      } 
      return note;
    });
    this.setState({[key]: e.target.value, note: newNotes});
    this.saveNote(newNotes.filter(n => n.id === currentNoteId)[0]);
  }

  popupConfirm(message) {
    return Swal.fire({
      title: '?',
      text: message,
      type: 'info',
      confirmButtonText: 'OK',
      showCancelButton: true,
      showCloseButton: true
    })
  }

  deleteNotebook = (notebookId) => {
    const result = this.popupConfirm('你确定要删除该笔记本?');
    result.then((res) => {
      if(res.value) {
        const {notebooks} = this.state;
        const nNotebooks = notebooks.filter(n => n.id !== notebookId)
        this.setState({notebooks: nNotebooks});
        let currentNotebookId = nNotebooks[0] && nNotebooks[0].id;
        this.switchNoteBook(currentNotebookId);
      }
    })
  }

  deleteNote = (noteId) => {
    const result = this.popupConfirm('你确定要删除该笔记?');

    result.then((res) => {
      if(res.value) {
        const {notes} = this.state;
        const nNotes = notes.filter(n => n.id !== noteId)
        this.setState({notes: nNotes});
        if (nNotes[0]) {
          this.setState({currentNoteId: nNotes[0].id || 0, title: nNotes[0].title|| '', body: nNotes[0].body|| ''});
        } else {
          this.setState({currentNoteId: 0, title: '', body: ''});
        }
        this.removeNote(noteId);
      }
    })
  }

  addNote = () => {
    const {notes, currentNotebookId} = this.state;
    const id = uniqueId();
    const newNote = {
      id,
      title: '新建笔记', 
      body:'', 
      datetime: (new Date()).toISOString(),
      bookId: currentNotebookId 
    };
    this.setState({notes: [newNote, ...notes], currentNoteId: id, title: '新建笔记', body: ''});

    this.newNote(newNote);
  }

  switchNoteBook = async (currentNotebookId) => {
    const notes = await this.loadNotes(currentNotebookId);
    this.setState({currentNotebookId, notes});
    let currentNoteId = notes[0] && notes[0].id;
    if (currentNoteId) {
      this.switchNote(currentNoteId);
    } else {
      this.setState({notes: [], body: '', title: ''});
    }
  }

  switchNote = async (currentNoteId) => {
    const note = await this.loadNote(currentNoteId);
    this.setState({currentNoteId, body: note.body, title: note.title});
  }

  async loadNotebooks() {
    const notebooksResponse = await axios.get('http://localhost:3000/notebooks')
    let notebooks = notebooksResponse.data || [];
    return notebooks;
  }

  async loadNotes(currentNotebookId) {
    const notesResponse = await axios.get(`http://localhost:3000/notes?bookId=${currentNotebookId}`)
    let notes = notesResponse.data || [];
    return notes;
  }

  async removeNotebook() {

  }

  async removeNote(id) {
    if(id) {
      await axios.delete(`http://localhost:3000/notes/${id}`, { "Content-Type": "application/json" });
    }
  }

  async newNote(note) {
      await axios.post(`http://localhost:3000/notes`, note, { "Content-Type": "application/json" });
  }

  async saveNote(note) {
    if(note && note.id) {
      await axios.put(`http://localhost:3000/notes/${note.id}`, note, { "Content-Type": "application/json" });
    }
  }

  async loadNote(currentNoteId) {
    const noteResponse = await axios.get(` http://localhost:3000/notes/${currentNoteId}`)
    let note = noteResponse.data || [];
    return note;
  }

  async componentDidMount() {
    let preState = window.localStorage.getItem('note');
    if (preState) {
      this.setState(JSON.parse(preState));
    } else {
      const notebooks = await this.loadNotebooks();
      let currentNotebookId = notebooks[0] && notebooks[0].id;
      this.setState({notebooks, currentNotebookId});
      const notes = await this.loadNotes(currentNotebookId);
      let currentNoteId = notes[0] && notes[0].id;
      this.setState({notes, currentNoteId});
      const note = await this.loadNote(currentNoteId);
      this.setState({body: note.body, title: note.title});
    }
  }

  componentWillUpdate(nextProps, nextState){
    window.localStorage.setItem('note', JSON.stringify(nextState));
  }


  render() {
    const { title, body, notebooks, currentNotebookId, notes, currentNoteId } = this.state;
    const html = marked(body);

    return (
      <div className="app">
        <div className="sidebar">
          <div className="header">
            <div className="button" onClick={this.addNote}>
              <i className="iconfont icon-icon_roundadd_fill" />新建笔记
            </div>
          </div>
          <div className="body">
            <div className="title">
              <i className="iconfont icon-books" />
              笔记本
            </div>
            <ul className="notebook-list">
              { 
                notebooks.map(notebook => {
                  return (
                    <li key={notebook.id} 
                        onClick={(e) => {
                            this.switchNoteBook(notebook.id);
                        }}
                        className={classNames('notebook', {'selected': currentNotebookId === notebook.id})}>
                      <i className="iconfont icon-book" />
                      {notebook.name}
                      <i onClick={(e) => {
                        e.stopPropagation();
                        this.deleteNotebook(notebook.id);
                      }}
                      className="iconfont icon-icon_trashcan trashcan" />
                    </li>
                  );
                }) 
              }
            </ul>
          </div>
        </div>
        <div className="note-panel">
          <div className="header">
            读书笔记
          </div>
          <ul className="note-list">
            {
              notes.map(note => {
                return (
                  <li key={note.id} className="note" onClick={() => {
                      this.switchNote(note.id);
                  }}>
                    <div className={classNames('box', {'selected': currentNoteId === note.id})}>
                      <div className="note-title">
                        {note.title}
                      </div>
                      <div className="note-content">
                        <LinesEllipsis 
                          text={note.body}
                          maxLine='6'
                          ellipsis='...'
                          trimRight
                          basedOn='letters'
                        />
                      </div>
                    </div>
                    <div className="note-footer">
                      {note.datetime}
                      <i onClick={(e) => {
                        e.stopPropagation();
                        this.deleteNote(note.id);
                      }} className="iconfont icon-icon_trashcan trashcan" />
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="editor-panel">
          <div className="header">
            <i className="iconfont icon-book1" />默认笔记本
          </div>
          <div className="body">
            <div className="note-title">
              <input value={title} onChange={(e) => {
                  this.handleChange(e, 'title');
                }
              }/>
            </div>
            <div className="note-content">
              <textarea className="editor" value={body} onChange={(e) => {
                  this.handleChange(e, 'body');
                }
              }/>
              <div className="preview" dangerouslySetInnerHTML={{__html: html}} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
