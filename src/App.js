import React from 'react';
import marked from 'marked';
import 'github-markdown-css';
import './App.scss';

const IconButton = ({icon, onClick}) => {
  return (
    <i className={`iconfont ${icon}`} onClick={onClick} />
  );
}


class App extends React.Component {

  textareaRef = React.createRef();

  state = {
    markdown: ''
  }

  onChangeHandler = (e) => {
    const { value } = e.target;
    this.setState({
      markdown: value
    });

    localStorage.setItem('markdownValue', value);
  }

  makeBolder = () => {
    const {selectionStart, selectionEnd} = this.textareaRef.current;
    const markdown = this.state.markdown;
    let newMarkdown = markdown.substring(0, selectionStart) + 
                      '**' +
                      markdown.substring(selectionStart, selectionEnd) +
                      '**' +
                      markdown.substring(selectionEnd);

    this.setState({markdown: newMarkdown});                  
  }

  makeItalic = () => {

  }

  makeCode = () => {

  }

  componentDidMount() {
    const markdown = localStorage.getItem('markdownValue');
    if (markdown) {
      this.setState({markdown});
    }
  }

  render() {
    const { markdown } = this.state;
    const html = marked(markdown);

    return (
      <div className="App">
        <div className="markdown">
          <div className="toolbar">
            <IconButton icon={'icon-bold'} onClick={this.makeBolder} />
            <IconButton icon={'icon-italic'} onClick={this.makeItalic} />
            <IconButton icon={'icon-code'} onClick={this.makeCode} />
          </div>
          <div className="body">
            <div className="editor">
              <textarea className="textarea" 
                value={this.state.markdown}
                onChange={(e) => {
                  this.onChangeHandler(e);
                }}
                ref={this.textareaRef} />
            </div>
            <div className="preview markdown-body" dangerouslySetInnerHTML={{__html: html}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
