import React from 'react';
import { Map } from './Map.js'
import { Link } from 'react-router-dom'
import { ChromePicker } from 'react-color'

function styleWithMarker(baseStyle, markerLocation, markerColor) {
  const result = Object.assign({}, baseStyle);
  result.sources = Object.assign({}, baseStyle.sources);
  result.layers = [].concat(baseStyle.layers);
  if (markerLocation) {
    result.sources['marker'] = {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [markerLocation.lng, markerLocation.lat]
        }
      }
    };
    result.layers.push({
      id: 'marker',
      source: 'marker',
      type: 'circle',
      paint: {
        'circle-color': markerColor,
        'circle-radius': 10
      }
    })
  }
  return result;
}

const CreateEmbed = (props) => (
  <div>
    <div className='grid grid--gut6'>
      <div className='col col--4 col--offl3 flex-parent flex-parent--column'>
        <div className='txt-h4 flex-child'>Location:</div>
        <div className='relative flex-child--grow'>
          <Map
            stylesheet={styleWithMarker(props.baseStyle, props.embedLocation, props.embedColor)}
            defaultCenter={props.embedLocation || props.defaultCenter}
            defaultZoom={props.embedZoom || props.defaultZoom}
            centerOnClick
            onClick={props.onClick}
            onMoveEnd={props.onMoveEnd}
          />
        </div>
      </div>
      <div className='col col--2'>
        <div className='txt-h4'>Brand Color:</div>
        <ChromePicker
          color={props.embedColor}
          onChangeComplete={props.onColor}
        />
      </div>
    </div>
    {props.embedLocation ? (<div className='grid grid--gut6'>
      <div className='col col--6 col--offl3 align-l'>
        <p>Copy and paste the following HTML to add this map to your site:</p>
        <pre>
{`<img src="https://api.mapbox.com/styles/v1/${process.env.REACT_APP_BASE_STYLE}/static/pin-s-marker+${props.embedColor.slice(1)}(${props.embedLocation.lng},${props.embedLocation.lat})/${props.embedLocation.lng},${props.embedLocation.lat},${props.embedZoom}/475x250@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}" alt='' />`}
        </pre>
        <div className='txt-h4'>Preview:</div>
        <div>
          <img style={{width: 475, height: 250}} src={`https://api.mapbox.com/styles/v1/${process.env.REACT_APP_BASE_STYLE}/static/pin-s-marker+${props.embedColor.slice(1)}(${props.embedLocation.lng},${props.embedLocation.lat})/${props.embedLocation.lng},${props.embedLocation.lat},${props.embedZoom}/475x250@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} alt='' />
          <div className='link'>
            <Link to={`/to/${props.embedLocation.lng}/${props.embedLocation.lat}`}>Get Directions &rarr;</Link>
          </div>
        </div>
      </div>
    </div>) : ''}
  </div>
)

export { CreateEmbed }
