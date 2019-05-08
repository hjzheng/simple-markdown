import React from 'react';
import styled from 'styled-components';
import './App.scss';

const Container = styled.div`
  border: 1px solid red;
  witdh: 500px;
  margin: 10px;
`

// React.createContext({globalValue: 'globalValue'})  返回一个组件，参数为默认值

const GlobalContext = React.createContext({
  globalValue: 'globalValue'
});

function inject(Context, selector) {
  return function Wrapper(WrapperComponent) {
    return class ContextComponet extends React.Component {
      render() {
        return (
          <Context.Consumer>
            {
              data => (
                <WrapperComponent 
                  {...this.props} 
                  {...(selector ? selector(data) : data)}
                />
              )
            }
          </Context.Consumer>
        )
      }
    }
  }
}

class App extends React.Component {

  // 注意 clickHandler 必须在 state 声明之前，如果需要把 state 作为整个状态传入 GlobalContext value 中
  clickHandler = () => {
    this.setState({globalValue: 'globalValue changed'});
  }

  state = {
    globalValue: 'globalValue',
    clickHandler: this.clickHandler
  }

  render() {
    return (
      <GlobalContext.Provider value={this.state}>
        <Container className="App">
          <LayerOne clickHandler={this.clickHandler}/>
        </Container>
      </GlobalContext.Provider>
    );
  }
}

function LayerOne(props) {
  return (
    <Container className="LayerOne">
        <div>
          <button onClick={props.clickHandler}>Change global value</button>
        </div>
        <LayerTwo />
    </Container>
  );
}


/*

static contextType = GlobalContext;
必须在有状态组件中使用

*/
class LayerTwo extends React.Component {
  
  static contextType = GlobalContext;

  render() {
    return (
      <Container className="LayerOne">
          {this.context.globalValue}
          <LayerThree />
      </Container>
    );
  }
}



/*

GlobalContext.Consumer

可在无状态组件中使用

*/
function LayerThree() {
  return (
    <Container className="LayerThree">
      <GlobalContext.Consumer>
        {({globalValue, clickHandler}) => {
          return (
            <div>
              {globalValue}
              <button onClick={clickHandler}>Change global value</button>
            </div>
          )
        }}
      </GlobalContext.Consumer>
      <LayerFour />
    </Container>
  );
}

@inject(GlobalContext)
class LayerFour extends React.Component {
  render() {
    return (
      <Container className="LayerFour">
        {this.props.globalValue}
      </Container>
    );
  }
}

export default App;
