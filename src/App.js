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
  // 我一般倾向于把节点中的代码给移出来，保持jsx代码的可读性，比如
  /*
  const onDelete = () => {

  }
  ...
  <i onClick={onDelete} ... />
  */
  // 如果箭头函数体只有一行，可以不用换行，以及不用大括号，比如
  // <li onClick={() => switchNodeBook(id)} />
  return (
    <li key={id} // 这个key属性应该是重构带来的，其实可以不要
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
          <LinesEllipsis  // 以前我没用过这个库，学习到了：）
            text={body}
            maxLine='6'
            ellipsis='...'
            trimRight
          />
        </div>
      </div>
      <div className="note-footer">
        {formatDate(datetime)}
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

    // 这里功能没问题，但是语句意图不明确
    // 可以使用 Array#find 找出那个note, 然后更新
    // 这样后面的 saveNote 直接用找到的note即可。
    //
    // map用于执行数据转换，一般不更改原来元素
    // filter用于过滤出需要的元素，返回是个列表
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
    // 这里result是个Promise，可以直接使用async/await来减少缩进
    // 因为我看其他函数中用到了， async/await 不仅仅用于异步加载数据，只要Promise接口都可以使用
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
    // 这个生命周期已废弃了
    // https://reactjs.org/docs/react-component.html?utm_source=caibaojian.com#unsafe_componentwillupdate
    // 当前场景可以在 componentDidMount 中挂接 onbeforeunload 事件来完成
    // 不过不建议把所有state都序列化到 localStorage中， 那样可能会有些问题：
    // 1. 数据不同步，和db.json中的数据如果不一致会有问题
    // 2. 如果后续在state中加不能序列化的字段，如循环引用等
    // 3. state中可能有大量的列表数据，直接序列化会把storage撑满
    //
    // 建议只保存 "用户操作的状态数据"，这些数据db.json中是没有的，比如
    // 1. 未保存的输入
    // 2. 当前选中的日志 id 等
    //
    // 在React中，我们最常用的生命周期函数很少，主要有
    // 1. componentDidMount
    // 2. componentWillUnmount
    //
    // 3. shouldComponentUpdate
    // 4. componentDidUpdate
    //
    // 如果用到其他的函数，那么就要仔细思考，是否哪里有问题。
    window.localStorage.setItem('note', JSON.stringify(nextState));
  }


  render() {
    const { currentNote, notebooks, currentNotebookId, notes } = this.state;

    // 可使用 Array#find 代替
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
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
