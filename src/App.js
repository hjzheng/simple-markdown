import React from 'react';
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import 'rsuite-table/lib/less/index.less';
import './App.scss';

const dataList = [
  { id: 1, name: 'a', email: 'a@email.com', avartar: '...' },
  { id: 2, name: 'b', email: 'b@email.com', avartar: '...' },
  { id: 3, name: 'c', email: 'c@email.com', avartar: '...' }
];

class EditCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      value: ''
    }
  }

  setEditing = (e) => {

    e.stopPropagation();

    const { rowData, dataKey } = this.props;
    this.setState(
      {
        editing: true,
        value: rowData[dataKey]
      }
    );
  }

  save = (e) => {
    e.stopPropagation();

    const { rowData, dataKey } = this.props;

    this.props.onValueChange(this.state.value, rowData, dataKey);

    this.setState({editing: false});
  }

  cancel = (e) => {
    e.stopPropagation();

    this.setState({editing: false});
  }

  onChange = (e) => {
    this.setState({value: e.target.value});
  }

  render() {
    
    const { rowData, dataKey, onValueChange, ...props} = this.props;

    return (
      <Cell {...props} onClick={this.setEditing}>
        { 
          this.state.editing === true ? 
          <div>
            <input 
              ref={this.inputRef} 
              value={this.state.value} 
              onChange={this.onChange} />
              <button onClick={this.save}>Save</button>
              <button onClick={this.cancel}>Cancel</button>
          </div> : 
          rowData[dataKey]
        }
      </Cell>
    )
  }
}

const ImageCell = ({ rowData, dataKey, ...props }) => (
  <Cell {...props}>
    <img src={rowData[dataKey]} alt="Avartar" width="50" />
  </Cell>
);

class App extends React.Component {

  state = {
    dataList: dataList,
    columns: [
      {
        label: 'ID',
        dataKey: 'id'
      },
      {
        label: 'Name',
        dataKey: 'name'
      },
      {
        label: 'Email',
        dataKey: 'email'
      },
      {
        label: 'Avartar',
        dataKey: 'avartar'
      }
    ]
  }

  onChange = (newValue, rowData, dataKey) => {

    const dataList = this.state.dataList.map(data => {
      if(data.id === rowData.id) {
        data[dataKey] = newValue
      }
      return data;
    })
    this.setState({dataList});
  }

  renderCell(dataKey) {
    switch (dataKey) {
        case 'name':
          return <EditCell dataKey={dataKey} onValueChange={this.onChange}/>
        case 'avartar':
          return <ImageCell dataKey={dataKey} />
        default:
          return <Cell dataKey={dataKey} />
    }
  }

  renderColumn(label, dataKey) {
    return (
      <Column width={300} sort fixed resizable>
        <HeaderCell>{label}</HeaderCell>
        {
          this.renderCell(dataKey)
        }
      </Column>
    );
  }
  
  render() {

    const { dataList, columns } = this.state;
  
    return (
      <div className="App">
        <Table data={dataList}>
          {
            columns.map(({label, dataKey}) => this.renderColumn(label, dataKey))
          }
        </Table>
      </div>
    );
  }
}

export default App;
