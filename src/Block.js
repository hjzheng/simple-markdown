import React from 'react';
import styled from 'styled-components';
import { Subject, fromEvent } from 'rxjs';

import {
  concatMap,
  filter,
  map,
  takeUntil,
  throttleTime,
  finalize,
  tap
} from 'rxjs/operators';

const BlockContainer = styled.div`
  border: 1px solid red;
  color: #fff;
  background: red;
  height: 100px;
  width: 100px;
  left: 100px;
  top: 30px;
  position: absolute;
`

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.movableBlock = React.createRef();
    }

    drag$ = new Subject();

    get movable() {
        return true;
    }

    get position() {
        const {left, top} = this.movableBlock.current.getBoundingClientRect();
        return {
          left,
          top
        }
    }
    
    set position({left, top}) {
        this.movableBlock.current.style.left = `${left}px`;
        this.movableBlock.current.style.top = `${top}px`;
    }

    onDragStart = (e) => {
        e.persist();
        this.drag$.next(e);
    }
    
    componentDidMount() {
        this.drag$.pipe(
            filter(() => this.movable),
            tap(() => {
              console.log('开始移动')
            }),
            map(event => ({
              event,
              ...this.position
            })),
            concatMap(({event, left, top}) => 
              fromEvent(window, 'mousemove').pipe(
                throttleTime(50),
                map((moveEvent) => {
                  return {
                      left: moveEvent.clientX - event.clientX + left,
                      top: moveEvent.clientY - event.clientY + top
                  }
                }),
                takeUntil(fromEvent(window, 'mouseup')),
                finalize(() => {
                  console.log('移动结束')
                })
            ))
        ).subscribe(position => {
            console.log(position);
            this.position = position;
        });
    }
    
      
    render() {
        return (
            <BlockContainer ref={this.movableBlock}
                onDragStart={(e) => e.preventDefault()}
                onMouseDown={this.onDragStart}>
                rxjs test
            </BlockContainer>
        )
    }
} 

export default Block;