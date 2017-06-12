import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom'
import { CreateEmbed } from './CreateEmbed'
import { Directions } from './Directions'

import './App.css';

const Loading = ({message}) => (
  <div className='p24'>
    {message ? <div className='prose'>{message}</div> : ''}
    <div className='mt12 loading'></div>
  </div>
)

class App extends Component {
  constructor() {
    super();
    const initialLocation = localStorage.getItem('userLocation') ?
      JSON.parse(localStorage.getItem('userLocation')) : undefined;

    this.state = {
      baseStyle: undefined,
      userLocation: initialLocation,
      embedLocation: undefined,
      embedZoom: initialLocation ? 15.5 : undefined,
      embedColor: '#4264FB'
    };
  }

  setEmbedLocation(lnglat) {
    this.setState({embedLocation: lnglat});
  }

  setEmbedZoom(z) {
    this.setState({embedZoom: z});
  }

  setEmbedColor(hex) {
    this.setState({embedColor: hex});
  }

  componentDidMount() {
    // Fetch the style JSON for our base style
    fetch(`https://api.mapbox.com/styles/v1/${process.env.REACT_APP_BASE_STYLE}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
      .then((resp) => resp.json())
      .then((json) => { this.setState({ baseStyle: json }) })
      .catch((error) => console.error(error))

    // Get user's current location
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [ position.coords.longitude, position.coords.latitude ];
        localStorage.setItem('userLocation', JSON.stringify(coords));
        this.setState({
          userLocation: coords,
          embedZoom: 15.5
        });
      },
      (error) => {
        console.error(error);
        this.setState({userLocation: [0, 0]})
      },
      { enableHighAccuracy: true });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className='App-main'>
            <Route exact path='/create'
              render={() =>
                (this.state.userLocation && this.state.baseStyle) ?
                <CreateEmbed
                  baseStyle={this.state.baseStyle}
                  defaultCenter={this.state.userLocation}
                  defaultZoom={this.state.embedZoom || 0}
                  embedColor={this.state.embedColor}
                  embedLocation={this.state.embedLocation}
                  embedZoom={this.state.embedZoom}
                  onClick={e => this.setEmbedLocation(e.lngLat)}
                  onMoveEnd={e => this.setEmbedZoom(e.target.getZoom())}
                  onColor={e => this.setEmbedColor(e.hex)}
                /> :
                <Loading message='Finding your current location' />
              }
            />
            <Route path='/to/:lon/:lat/:color'
              render={({match}) => {
                console.log(match)
                return (this.state.userLocation && this.state.baseStyle) ?
                <Directions
                  baseStyle={this.state.baseStyle}
                  defaultFrom={this.state.userLocation}
                  defaultTo={[match.params.lon, match.params.lat].map(Number)}
                  color={match.params.color}
                /> :
                <Loading message='Finding your current location' />
              }
              }
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
