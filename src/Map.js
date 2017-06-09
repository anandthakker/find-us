import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

class Map extends Component {
  componentDidMount() {
    const map = window.map = new mapboxgl.Map({
      container: this.refs.map,
      attributionControl: false,
      center: this.props.center || [0, 0],
      zoom: this.props.zoom || 0,
      bearing: this.props.bearing || 0,
      pitch: this.props.pitch || 0,
      style: this.props.stylesheet,
      maxZoom: 20
    });

    map.off('tile.error', map.onError);

    this.setState({map: map});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stylesheet) {
      this.state.map.setStyle(nextProps.stylesheet)
    }
  }

  render() {
    return <div id='map' ref='map' className='MapboxMap' />
  }
}

export { Map };
