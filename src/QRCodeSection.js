import React from "react";
import QRCode from "./components/QRCode";

class QRCodeSection extends React.Component {
  state = {
    url: "http://www.163.com"
  };

  change = e => {
    this.setState({ url: e.target.value });
  };

  render() {
    const { url } = this.state;
    return (
      <div>
        <input value={url} onChange={this.change} />
        <QRCode url={url} />
      </div>
    );
  }
}

export default QRCodeSection;
