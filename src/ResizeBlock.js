import React from 'react';
import styled, { css } from 'styled-components';
import { Subject, fromEvent } from 'rxjs';

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

    componentDidMount() {
        let rect = null;

        this.rightTopResizeHandler$.pipe(
            map(event => event.nativeEvent),
            tap(() => {
                rect = this.blockRef.current.getBoundingClientRect();
            }),
            map(event => ({
                event,
                rect: {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                }
            })),
            concatMap(({event, rect}) => 
                fromEvent(window, 'mousemove').pipe(
                    throttleTime(50),
                    map(moveEvent => {
                        return {
                            width: moveEvent.pageX - event.pageX + rect.width,
                            height: - moveEvent.pageY + event.pageY + rect.height,
                            top: moveEvent.pageY,
                            left: moveEvent.pageX
                        };
                    }),
                    takeUntil(fromEvent(window, 'mouseup')),
                    finalize(() => {
                        console.log('移动结束')
                    })
            ))
        ).subscribe(({width, height, top}) => {
            this.blockRef.current.style.width = width + 'px';
            this.blockRef.current.style.height = height + 'px';
            this.blockRef.current.style.top = top + 'px';
            // this.blockRef.current.style.left = top + 'px';
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