import React from 'react';
import ModalSection from './ModalSection';
import QRCodeSection from './QRCodeSection';
import './App.scss';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <ModalSection />
        <QRCodeSection />
      </div>
    );
  }
}

export default App;
