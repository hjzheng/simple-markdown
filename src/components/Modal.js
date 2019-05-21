import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';  
import cx from 'classnames';
import './Modal.scss';

const Modal = ({
    title,
    className,
    children,
    visible = false, 
    buttons =  [
        {text: 'OK', isPrimary: true, type: 'Ok'},
        {text: 'Cancel', type: 'Cancel'}
    ],
    onRequestClose, 
    onOk = () => {},
    onCancel = () => {}
}) => {

    const onButtonClick = (type) => {
        type === 'Ok' ? onOk() : onCancel();
    }

    useEffect(() => {

        const keydownhandler = e => {
            if (e.keyCode === 27) {
                onRequestClose();
            }
        }

        window.addEventListener('keydown', keydownhandler);
        
        return () => {
            window.removeEventListener('keydown', keydownhandler);
        }
    })

    const mask = ReactDOM.createPortal(<div className="modal-backdrop fade show" />, document.body)

    return (
        <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={300}>
            { visible ? 
            <div className={className}>
                <div className="modal" tabIndex="-1" role="dialog" style={{display: 'block'}}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{ title }</h5>
                            <button onClick={onRequestClose} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            { children }
                        </div>
                        <div className="modal-footer">
                            {
                                buttons.map((btn, index) => {
                                    return ( 
                                        <button 
                                            key={index} 
                                            type="button" 
                                            className={cx("btn", btn.isPrimary ? 'btn-primary' : 'btn-secondary')} 
                                            onClick={() => onButtonClick(btn.type)}
                                            data-dismiss="modal">
                                                {btn.text}
                                        </button>)
                                })
                            }
                        </div>
                        </div>
                    </div>
                </div>
                {mask}
            </div> : 
            null
            }
        </ReactCSSTransitionGroup>
    );
}


/**
 *  render props
 *  */

// class VisibleState extends React.Component {
//     state = {
//         visible: false
//     }

//     setVisible = (visible, callback) => {
//         this.setState(()=>{
//             return {visible}
//         }, () => {
//             callback && callback();
//         });
//     }

//     componentDidMount() {
//         this.setVisible(true);
//     }

//     getProps() {
//         return {
//             visible: this.state.visible,
//             setVisible: this.setVisible
//         };
//     }

//     render() {
//         return this.props.children(this.getProps())
//     }
// }

/**
 * use hooks
 */

// const ModalWithState = ({
//     title, 
//     children, 
//     onOk = () => {}, 
//     onCancel = () => {}, 
//     onRequestClose = () => {}
// }) => {
//     const [visible, setVisible] = useState(false);
//     useEffect(() => {
//         setVisible(true);
//     }, [visible])

//     const requestClose = () => {
//         onRequestClose && onRequestClose();
//         setVisible(false);
//     }
        
//     const handleOk = () => {
//         onOk();
//         requestClose();
//     }
        
//     const handleCancel = () => {
//         onCancel();
//         this.onRequestClose();
//     }

//     return (
//         <Modal
//             title={title}
//             visible={visible}
//             onRequestClose={requestClose}
//             onOk={handleOk}
//             onCancel={handleCancel}
//         >
//             { children }
//         </Modal> 
//     );
// }

/**
 * hooks and render props
 * 
 * collection props, should be design
 */

const VisibleState = (props) => {

    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        setVisible(true);
    }, [visible])

    // collection props
    const getProps = ({onOk, onCancel, ...props}) => {
        return {
            onOk: () => {
                setVisible(false);
                onOk && onOk();
            },
            onCancel: () => {
                setVisible(false);
                onCancel && onCancel();
            },
            visible,
            ...props
        };
    }

    return props.children({getProps})
}

const confirmDOM = document.createElement('div');
document.body.appendChild(confirmDOM);


Modal.Confirm = ({title, message, onOk, onCancel}) => { 

    function unmount() {
        setTimeout(() => {
          ReactDOM.unmountComponentAtNode(confirmDOM);
        }, 0);
    }

    const requestClose = () => {
        unmount();
    }

    ReactDOM.render(
        <VisibleState>
            { 
                ({getProps}) => (
                    <Modal 
                        {...getProps({
                            onOk: () => {
                                onOk && onOk()
                                requestClose();
                            },
                            onCancel: () => {
                                onCancel && onCancel();
                                requestClose();
                            },
                            title,
                            onRequestClose: requestClose
                        })}
                        > 
                        {message}
                    </Modal>
                )
            }
        </VisibleState>, confirmDOM
    );

}

export default Modal;
