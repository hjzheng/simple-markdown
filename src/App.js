import React from 'react';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';
import contextMenuController from './ContextMenuController';
import Block from './Block';
import ResizeBlock from './ResizeBlock';

const Container = styled.div`
  border: 1px solid red;
  height: calc(100vh - 2px);
  overflow: hidden;
`

class App extends React.Component {

  onContextMenu = (e) => {
    e.preventDefault();
    contextMenuController.show({
      actions: [
        { name: '刷新', handler: () => {} },
        { name: '测试', handler: () => {} }
      ],
      left: e.clientX,
      top: e.clientY
      }
    );
  }

  render() {
    return (
      <Container onContextMenu={this.onContextMenu}>
        <Block />
        <ResizeBlock />
        <ContextMenu controller={contextMenuController}/>
      </Container>
    );
  }
}

export default App;
