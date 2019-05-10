import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react'
import { fromEventPattern } from 'rxjs'
import { untilDestroyed } from './untilDestoryed';

const ContextMenuContainer = styled.ul`
    border: 1px solid #000;
    padding: 0 5px;
    margin: 0;
    position: absolute;
    list-style: none;

    li {
        border-bottom: 1px solid red;
        line-height: 28px;
        padding: 0;
        margin: 0; 
    }

    li:last-child {
        border-bottom: 1px solid transparent;
    }
`

/*
props:

controller: {
    left: number,
    top: number,
    visible: boolean
    hide: () => void
    actions: Array<{name: string | React。ReactNode, handler?:() => void}>
}
 */

class ContextMenu extends React.Component {

    constructor(props) {
        super(props);
        this.contextMenuRef = React.createRef()
    }

    componentDidMount() {
        fromEventPattern(
            (handler) => document.addEventListener('click', handler, true),
            (handler) => document.removeEventListener('click', handler, true)
        )
        .pipe(untilDestroyed(this))
        .subscribe(e => {
            const current = this.contextMenuRef.current;
            if (current && current.contains(e.target)) {
                return
            }
            this.props.controller.hide();
        });
    }

    handleMenuClick = (e, action) => {
        e.stopPropagation();
        action.handler && action.handler();
        this.props.controller.hide();
    }

    render() {
        const { visible, left, top, actions } = this.props.controller

        const renderContextMenu = () => {
            return (
                <ContextMenuContainer 
                    style={{left, top}}
                    ref={this.contextMenuRef}>
                    {
                        actions.map((action, index) => (
                            <li  
                                key={index}
                                onClick={e => this.handleMenuClick(e, action)}>
                                {action.name}
                            </li>
                        ))
                    }
                </ContextMenuContainer>
            );
        };

        return visible ? 
            ReactDOM.createPortal(renderContextMenu(), document.body) : 
            null;
    }
}

export default observer(ContextMenu);