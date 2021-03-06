import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
import './Map.css'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'
const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

class Map extends Component {
  componentDidMount() {
    const map = this.map = window.map = new mapboxgl.Map({
      container: this.refs.map,
      attributionControl: false,
      center: this.props.center || this.props.defaultCenter || [0, 0],
      zoom: this.props.zoom || this.props.defaultZoom || 0,
      bearing: this.props.bearing || 0,
      pitch: this.props.pitch || 0,
      style: this.props.stylesheet || this.props.defaultStylesheet,
      maxZoom: 20
    });

    map.off('tile.error', map.onError);

    map.on('moveend', (e) => {
      if (this.props.onMoveEnd) {
        this.props.onMoveEnd(e);
      }
    });

    map.on('click', (e) => {
      if (this.props.onClick) {
        this.props.onClick(e);
      }

      if (this.props.centerOnClick) {
        map.panTo(e.lngLat);
      }
    })

    if (this.props.initialDirectionsOptions) {
      const options = this.props.initialDirectionsOptions;
      this.directionsPlugin = new MapboxDirections(Object.assign({
        accessToken: mapboxgl.accessToken
      }, options));
      map.addControl(this.directionsPlugin, 'top-left')

      map.once('load', () => {
        this.directionsPlugin.setOrigin(options.from);
        this.directionsPlugin.setDestination(options.to);
        if (options.onRoute) {
          this.directionsPlugin.on('route', options.onRoute);
        }
      })
    }

    this.setState({map: map});
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stylesheet) {
      this.state.map.setStyle(nextProps.stylesheet);
    }

    if (nextProps.center !== this.props.center) {
      this.state.map.setCenter(nextProps.center);
    }

    if (nextProps.zoom !== this.props.zoom) {
      this.state.map.setZoom(nextProps.zoom);
    }
  }

  render() {
    return <div ref='map' className='MapboxMap' />
  }
}

export { Map };
