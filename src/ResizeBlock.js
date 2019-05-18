import React from 'react';
import styled, { css } from 'styled-components';
import { Subject, fromEvent, merge } from 'rxjs';
import { untilDestroyed } from './untilDestoryed';

import {
    concatMap,
    map,
    takeUntil,
    throttleTime,
    finalize,
    tap
} from 'rxjs/operators';

const ResizeBlockContainer = styled.div`
    border: 1px solid red;
    color: #fff;
    height: 300px;
    width: 300px;
    left: 100px;
    top: 30px;
    position: relative;
`

const ResizeHandler = styled.div`
    border: 2px solid red;
    border-radius: 10px;
    color: #fff;
    height: 10px;
    width: 10px;
    position: absolute;
    ${
        props => props.type === 'rightTop' && css`
        right: -5px;
        top: -5px;`
    }
    ${
        props => props.type === 'leftTop' && css`
        left: -5px;
        top: -5px;`
    }
    ${
        props => props.type === 'leftBottom' && css`
        left: -5px;
        bottom: -5px;`
    }
    ${
        props => props.type === 'rightBottom' && css`
        right: -5px;
        bottom: -5px;`
    }
`

class ResizeBlock extends React.Component {

    constructor(props) {
        super(props);
        this.blockRef = React.createRef();
    }

    leftTopResizeHandler$ = new Subject();
    rightTopResizeHandler$ = new Subject();
    leftBottomResizeHandler$ = new Subject();
    rightBottomResizeHandler$ = new Subject(); 

    handleResize = (diffX, diffY, type, rect) => {

        const minimum_size = 50;

        let { top, left, width, height } = rect

        let res = {};
    
        switch (type) {
          case 'rightTop': {
            res = {
              ...res,
              top: top + diffY,
              height: height - diffY,
              width: width + diffX
            }
            break
          }
          case 'leftTop':
            res = {
              ...res,
              height: height - diffY,
              width: width - diffX,
              left: left + diffX,
              top: top + diffY
            }
            break
          case 'leftBottom':
            res = { 
                ...res, 
                left: left + diffX,
                height:  height + diffY,
                width: width - diffX
            }
            break
          case 'rightBottom': {
            res = {
              ...res,
              width: width + diffX,
              height: height + diffY
            }
            break
          }
          default:
            break
        }

        return res;
    }    

    componentDidMount() {
        let rect = null;

        merge(
            this.leftTopResizeHandler$.pipe(
              map((event) => ({
                event: event.nativeEvent,
                type: 'leftTop'
              }))
            ),
            this.rightTopResizeHandler$.pipe(
              map((event) => ({
                event: event.nativeEvent,
                type: 'rightTop'
              }))
            ),
            this.leftBottomResizeHandler$.pipe(
              map((event) => ({
                event: event.nativeEvent,
                type: 'leftBottom'
              }))
            ),
            this.rightBottomResizeHandler$.pipe(
              map((event) => ({
                event: event.nativeEvent,
                type: 'rightBottom'
              }))
            )
          ).pipe(
            tap(() => {
                rect = this.blockRef.current.getBoundingClientRect();
                console.log(rect);
            }),
            untilDestroyed(this),
            map(({event, type}) => ({
                event,
                type,
                rect
            })),
            concatMap(({event, type, rect}) => 
                fromEvent(window, 'mousemove').pipe(
                    throttleTime(50),
                    map(moveEvent => {
                        return {
                            distX: moveEvent.pageX - event.pageX,
                            distY: moveEvent.pageY - event.pageY,
                            type,
                            rect
                        };
                    }),
                    map(({distX, distY, type, rect}) => (this.handleResize(distX, distY, type, rect))),
                    takeUntil(fromEvent(window, 'mouseup')),
                    finalize(() => {
                        console.log('移动结束')
                    })
            ))
        ).subscribe(({top, left, width, height}) => {
            this.blockRef.current.style.width = width + 'px';
            this.blockRef.current.style.height = height + 'px';
            this.blockRef.current.style.top = top + 'px';
            this.blockRef.current.style.left = left + 'px';
        })
    }

    onMouseDown(e, type) {
        switch (type) {
            case 'leftTop':
                this.leftTopResizeHandler$.next(e);
            break;
            case 'rightTop':
                this.rightTopResizeHandler$.next(e);
            break;
            case 'leftBottom':
                this.leftBottomResizeHandler$.next(e);
            break;
            case 'rightBottom':
                this.rightBottomResizeHandler$.next(e);
            break;
            default:
                console.log('hehe');
        }
    }

    render() {
        return (
            <ResizeBlockContainer ref={this.blockRef}>
                <ResizeHandler type="rightTop" 
                    onMouseDown={(e) => this.onMouseDown(e, "rightTop")} />
                <ResizeHandler type="leftTop" 
                    onMouseDown={(e) => this.onMouseDown(e, "leftTop")} />
                <ResizeHandler type="leftBottom" 
                    onMouseDown={(e) => this.onMouseDown(e, "leftBottom")} />
                <ResizeHandler type="rightBottom" 
                    onMouseDown={(e) => this.onMouseDown(e, "rightBottom")} />
            </ResizeBlockContainer>
        )
    }
}

export default ResizeBlock;