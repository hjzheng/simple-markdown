import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';
import './Modal.scss';

class Modal extends React.Component {

    static propTypes = {
        visible: PropTypes.bool,
        buttons: PropTypes.arrayOf(PropTypes.shape(
            {
                text: PropTypes.string.isRequired,
                type: PropTypes.string,
                isPrimary: PropTypes.bool
            }
        )),
        onRequestClose: PropTypes.func.isRequired,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        visible: false,
        buttons: [
            {text: 'OK', isPrimary: true, type: 'Ok'},
            {text: 'Cancel', type: 'Cancel'}
        ],
        onOk: () => {},
        onCancel: () => {}
    }

    componentDidMount() {

        const keydownhandler = e => {
            if (e.keyCode === 27) {
                this.props.onRequestClose();
            }
        }

        window.addEventListener('keydown', keydownhandler);

        this.clear = () => {
            window.removeEventListener('keydown', keydownhandler);
        }
    }

    componentWillUnmount() {
        this.clear();
    }

    onButtonClick = (type) => {
        this.props[`on${type}`]();
    }

    render() {

        const { title, className, visible, children, buttons, onRequestClose } = this.props;

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
                                                onClick={() => this.onButtonClick(btn.type)}
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
}


class ModalWithState extends React.Component {

        state = {
            visible: false
        }

        // 这里显示出来，能够让对话框的打开动画正常
        // 借此可以思考`TransitionGroup`的动画原理
        // 是子节点“创建”时，添加class，所以class名称也叫enter
        componentDidMount() {
          this.setState({ visible: true });
        }

        onRequestClose = () => {
            this.props.onRequestClose && this.props.onRequestClose();
            this.setState({visible: false});
        }

        handleOk = () => {
            this.props.onOk && this.props.onOk();
            this.onRequestClose();
        }

        handleCancel = () => {
            this.props.onCancel && this.props.onCancel();
            this.onRequestClose();
        }

        render() {

            const { visible } = this.state;
            const { title, children } = this.props;

            return (
                <Modal
                    title={title}
                    visible={visible}
                    onRequestClose={this.onRequestClose}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    { children }
                </Modal>
            )
        }
    }

Modal.Confirm = ({title, message, onOk, onCancel}) => {

    // 可以尝试重用这个节点？
    // 如果重用的话，应该会发现 再次打开 ModalWithState时会走 update流程, 有助于你更好地理解生命周期
    // 那样的话如果每次都要新的弹出对话框，可以给他传递一个key (key不同，组件会重新构建)
    const confirmDOM = document.createElement('div');

    document.body.appendChild(confirmDOM);


    const requestClose = () => {
      // 移掉container之前还需要调用 [ReactDOM.unmountComponentAtNote()](https://reactjs.org/docs/react-dom.html#unmountcomponentatnode) 做一些清理工作。
      // react的事件等是基于代理的，在这个函数中会清理挂接的事件以及相应的状态数据
        document.body.removeChild(confirmDOM);
    }

    // onOk和onCancel应该直接传递给Modal即可
    const ok = () => {
        onOk && onOk();
    }

    const cancel = () => {
        onCancel && onCancel();
    }

    ReactDOM.render(
        <ModalWithState
            title={title}
            onOk={ok}
            onCancel={cancel}
            onRequestClose={requestClose}
        >
            { message }
        </ModalWithState>, confirmDOM
    );

}

export default Modal;
