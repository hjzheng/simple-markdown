import React from 'react';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/lib/less/index.less';
import './App.scss';

const dataList = [
  { id: 1, name: 'a', email: 'a@email.com', avartar: '...' },
  { id: 2, name: 'b', email: 'b@email.com', avartar: '...' },
  { id: 3, name: 'c', email: 'c@email.com', avartar: '...' }
];

const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props}>
    <img src={rowData[dataKey]} width="50" />
  </Cell>
);


class App extends React.Component {

  
  render() {
  
    return (
      <div className="App">
        React 学习练习模板代码
        <Table data={dataList}>
          <Column width={100} sort fixed resizable>
            <HeaderCell>ID</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={100} sort resizable>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column width={100} sort resizable>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column width={100} resizable>
            <HeaderCell>Avartar</HeaderCell>
            <ImageCell dataKey="avartar" />
          </Column>
        </Table>;
      </div>
    );
  }
}

export default App;
