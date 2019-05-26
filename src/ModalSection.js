import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "./components/Modal";

const Confirm = Modal.Confirm;

class ModalSection extends React.Component {
  state = {
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  showConfirm = () => {
    Confirm({
      title: "Confirm",
      message: "Confirm Message",
      onOk: () => {
        console.log("OK");
      },
      onCancel: () => {
        console.log("Cancel");
      }
    });
  };

  onRequestClose = () => {
    this.setState({ visible: false });
  };

  onOk = () => {
    this.onRequestClose();
  };

  onCancel = () => {
    this.onRequestClose();
  };

  render() {
    return (
      <div>
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            type="button"
            onClick={this.showModal}
            className="btn btn-secondary"
          >
            show Modal
          </button>
          <button
            type="button"
            onClick={this.showConfirm}
            className="btn btn-secondary"
          >
            show Confirm
          </button>
        </div>
        <Modal
          className={"myClassName"}
          title={"Basic Modal"}
          visible={this.state.visible}
          onRequestClose={this.onRequestClose}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <ul>
            <li>生命周期</li>
            <li>Portal</li>
          </ul>
        </Modal>
      </div>
    );
  }
}

export default ModalSection;
