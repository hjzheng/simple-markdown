import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
`;
const Title = styled.h2`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
    min-width: 300px;
    min-height: 300px;
    background-color: ${props => (props.isDraggingOver ? "skyblue" : "white")};
`;

class Column extends React.Component {
    render() {

        const { column, tasks } = this.props;

        return (
            <Container>
                <Title>{column.title}</Title>
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <TaskList ref={provided.innerRef} 
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>
        )
    }
}

export default Column;

/*
//Droppable
const droppableSnapshot = {
  isDraggingOver: true,
  draggingOverWith: "task-1"
};
*/