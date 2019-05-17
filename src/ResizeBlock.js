import React from 'react';
import styled, { css } from 'styled-components';
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

    leftTopResizeHandler$ = new Subject();
    rightTopResizeHandler$ = new Subject();
    leftBottomResizeHandler$ = new Subject();
    rightBottomResizeHandler$ = new Subject();  

    componentDidMount() {
        
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
            <ResizeBlockContainer>
                <ResizeHandler type="rightTop" onMouseDown={(e) => this.onMouseDown(e, "rightTop")}></ResizeHandler>
                <ResizeHandler type="leftTop" onMouseDown={(e) => this.onMouseDown(e, "leftTop")}></ResizeHandler>
                <ResizeHandler type="leftBottom" onMouseDown={(e) => this.onMouseDown(e, "leftBottom")}></ResizeHandler>
                <ResizeHandler type="rightBottom" onMouseDown={(e) => this.onMouseDown(e, "rightBottom")}></ResizeHandler>
            </ResizeBlockContainer>
        )
    }
}

export default ResizeBlock;