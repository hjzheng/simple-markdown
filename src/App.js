import React from 'react';
import marked from 'marked';
import classNames from 'classnames';
import LinesEllipsis from 'react-lines-ellipsis';
import uniqueId from 'lodash.uniqueid';
import { popupConfirm, formatDate } from './util';
import { loadNote, loadNotebooks, loadNotes, addNote, saveNote, removeNote} from './Api';
import 'github-markdown-css';
import './App.scss';

// TODO 待重构
const Notebook = ({ id, name, currentNotebookId, switchNoteBook, deleteNotebook }) => {
  return (
    <li key={id} 
        onClick={(e) => {
            switchNoteBook(id);
        }}
        className={classNames('notebook', {'selected': currentNotebookId === id})}>
      <i className="iconfont icon-book" />
      {name}
      <i onClick={(e) => {
        e.stopPropagation();
        deleteNotebook(id);
      }}
      className="iconfont icon-icon_trashcan trashcan" />
    </li>
  );
}

const Note = ({id, title, body, datetime, currentNoteId, switchNote, deleteNote}) => {
  return (
    <li className="note" onClick={() => {
        switchNote(id);
    }}>
      <div className={classNames('box', {'selected': currentNoteId === id})}>
        <div className="note-title">
          {title}
        </div>
        <div className="note-content">
          <LinesEllipsis 
            text={body}
            maxLine='6'
            ellipsis='...'
            trimRight
          />
        </div>
      </div>
      <div className="note-footer">
        { formatDate(datetime)}
        <i onClick={(e) => {
          e.stopPropagation();
          deleteNote(id);
        }} className="iconfont icon-icon_trashcan trashcan" />
      </div>
    </li>
  );
}

const MarkdownEditor = ({note, handleChange}) => {

  const html = marked(note.body || '');

  return (
    <div className="editor-panel">
      <div className="header">
        <i className="iconfont icon-book1" />默认笔记本
      </div>
      <div className="body">
        <div className="note-title">
          <input value={note.title} onChange={(e) => {
              handleChange(e, 'title');
            }
          }/>
        </div>
        <div className="note-content">
          <textarea className="editor" value={note.body} onChange={(e) => {
              handleChange(e, 'body');
            }
          }/>
          <div className="preview markdown-body" dangerouslySetInnerHTML={{__html: html}} />
        </div>
      </div>
    </div>
  );
}

class App extends React.Component {

  textareaRef = React.createRef();

  state = {
    notebooks: [],
    currentNotebookId: 0,
    notes: [],
    currentNote: {
      body: '', title: ''
    }
  }

  handleChange = (e, key) => {
    const { value } = e.target;
    const { notes, currentNote } = this.state;
    const newNotes = notes.map(note => {
      if (note.id === currentNote.id) {
        note[key] = value
      } 
      return note;
    });
    this.setState({currentNote: {...currentNote, [key]: e.target.value}, notes: newNotes});
    saveNote(newNotes.filter(n => n.id === currentNote.id)[0]);
  }

  deleteNotebook = (notebookId) => {
    const result = popupConfirm('你确定要删除该笔记本?');
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
    const result = popupConfirm('你确定要删除该笔记?');

    result.then((res) => {
      if(res.value) {
        const {notes} = this.state;
        const nNotes = notes.filter(n => n.id !== noteId)
        this.setState({notes: nNotes});
        if (nNotes[0]) {
          this.setState({currentNote: nNotes[0]});
        } else {
          this.setState({currentNote: {title: '', body: ''}});
        }
        removeNote(noteId);
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
    this.setState({notes: [newNote, ...notes], currentNote: newNote});

    addNote(newNote);
  }

  switchNoteBook = async (currentNotebookId) => {
    const notes = await loadNotes(currentNotebookId);
    this.setState({currentNotebookId, notes});
    let currentNoteId = notes[0] && notes[0].id;
    if (currentNoteId) {
      this.switchNote(currentNoteId);
    } else {
      this.setState({notes: [], currentNote: {
        body: '', title: ''
      }});
    }
  }

  switchNote = async (currentNoteId) => {
    const note = await loadNote(currentNoteId);
    this.setState({currentNote: note});
  }

  async componentDidMount() {
    let preState = window.localStorage.getItem('note');
    if (preState) {
      this.setState(JSON.parse(preState));
    } else {
      const notebooks = await loadNotebooks();
      let currentNotebookId = notebooks[0] && notebooks[0].id;
      this.setState({notebooks, currentNotebookId});
      const notes = await loadNotes(currentNotebookId);
      let currentNoteId = notes[0] && notes[0].id;
      this.setState({notes, currentNoteId});
      const note = await loadNote(currentNoteId);
      this.setState({currentNote: note});
    }
  }

  componentWillUpdate(nextProps, nextState){
    window.localStorage.setItem('note', JSON.stringify(nextState));
  }


  render() {
    const { currentNote, notebooks, currentNotebookId, notes } = this.state;

    const currentNotebook = notebooks.filter(n => n.id === currentNotebookId)[0];

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
                    <Notebook key={notebook.id} 
                    { ...notebook } 
                    currentNotebookId={currentNotebookId} 
                    switchNoteBook={this.switchNoteBook} 
                    deleteNotebook={this.deleteNotebook} />
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
                  <Note key={note.id} 
                    {... note}
                    currentNoteId={currentNote.id} 
                    switchNote={this.switchNote} 
                    deleteNote={this.deleteNote}
                  />
                );
              })
            }
          </ul>
        </div>
        <MarkdownEditor note={currentNote} handleChange={this.handleChange} />    
      </div>
    );
  }
}

export default App;
