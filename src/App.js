import React, { Component } from 'react';
import { Map } from './Map';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      style: {
        version: 8,
        sources: {},
        layers: []
      }
    };
  }

  componentDidMount() {
    fetch(`https://api.mapbox.com/styles/v1/${process.env.REACT_APP_BASE_STYLE}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
      .then((resp) => resp.json())
      .then((json) => { this.setState({ style: json }) })
      .catch((error) => console.error(error))
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>TITLE</h2>
        </div>
        <div className='App-main'>
          <Map stylesheet={this.state.style} />
        </div>
      </div>
    );
  }
}

export default App;
