import React, { Component } from 'react'
import { Map } from './Map.js'
import createDirectionsStyle from './directions_style'

class Directions extends Component {
  render () {
    return (
      <Map
        defaultStylesheet={this.props.baseStyle}
        initialDirectionsOptions={{
          from: this.props.defaultFrom,
          to: this.props.defaultTo,
          styles: createDirectionsStyle(`#${this.props.color}`),
          onRoute: (e) => console.log('route', e)
        }}
      />
    )
  }
}

export { Directions }
