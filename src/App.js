import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import './App.scss';
import initialData from './initialData';
import Column from './Column';

const Container = styled.div`
    display: flex;
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;

class App extends React.Component {

  state = initialData;

  onDragStart = () => {
    document.body.style.color = 'orange';
  } 

  onDragUpdate = (update) => {
    const { destination } = update;
    const opacity = destination
    ? destination.index / Object.keys(this.state.tasks).length
    : 0;
    document.body.style.backgroundColor = `rgba( 153, 141, 217, ${opacity})`;
  }


  onDragEnd = result => {

    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';
    
    // reorder our column

    console.log(result);
    const { destination, source, draggableId } = result;

    // no destination
    if (!destination) {
      return;
    }

    // no move
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    let newState = {};

    if (
      destination.droppableId === source.droppableId &&
      destination.index !== source.index
    ) {
      const column = this.state.columns[source.droppableId];

      const newTaskIds = Array.from(column.taskIds);
  
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
  
      const newColumn = {
        ...column,
        taskIds: newTaskIds
      };
  
      newState = {
        ...this.state,
        columns: {
          ...this.state.columns,     
           [newColumn.id]: newColumn,
        },
      };
    }

    if (
      destination.droppableId !== source.droppableId
    ) {
      const sourceColumn = this.state.columns[source.droppableId];
      const destinationColumn = this.state.columns[destination.droppableId];

      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      const destinationTaskIds = Array.from(destinationColumn.taskIds);

      sourceTaskIds.splice(source.index, 1);
      destinationTaskIds.splice(destination.index, 0, draggableId);


      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds
      }

      const newDestinationColumn = {
        ...destinationColumn,
        taskIds: destinationTaskIds
      }

      newState = {
        ...this.state,
        columns: {
          ...this.state.columns,     
          [newSourceColumn.id]: newSourceColumn,
          [newDestinationColumn.id]: newDestinationColumn
        },
      };
    }

    this.setState(newState);
  };

  render() {

    const { columnOrder, columns, tasks } = this.state;

    return (
      <DragDropContext 
        onDragEnd={this.onDragEnd} 
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        >
        <Container>
        {
          columnOrder.map(columnId => {
            const _column = columns[columnId];
            const _tasks = _column.taskIds.map(taskId => tasks[taskId]);

            return <Column key={_column.id} column={_column} tasks={_tasks}/>
          })
        }
        </Container>
      </DragDropContext>
    );
  }
}

export default App;

/*
// onDragStart
const start = {
    draggableId: 'task-1',
    type: 'TYPE'
    source: {
        droppableId: 'column-1',
        index: 0,
    }
}

//onDragUpdate
const update= {
    ...start,
    destination: {
        droppableId: 'column-1',
        index: 1,
    }
};

// onDragEnd
const result - {
    ...update,
    reason: 'DROP',
}
*/
