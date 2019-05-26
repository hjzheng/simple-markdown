import React from "react";
import QRCodeUtil from "qrcode";

class QRCode extends React.Component {
  state = { imgUrl: null };

  generateQR = async text => {
    try {
      const imgUrl = await QRCodeUtil.toDataURL(text);
      this.setState({ imgUrl });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this.generateQR(this.props.url);
  }

  // 等于 React.PureComponent;
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.url !== nextProps.url || this.state.url !== nextState.imgUrl
    );
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.url !== prevProps.url) {
      this.generateQR(this.props.url);
    }
  }

  render() {
    const { imgUrl } = this.state;
    return imgUrl ? <img src={imgUrl} alt="qrcode" /> : null;
  }
}

export default QRCode;
