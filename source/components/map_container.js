import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Map, TileLayer, Marker, GeoJson } from 'react-leaflet';
import { divIcon } from 'leaflet';
import config from '../config';
import { getNextGeography, flatten, slugify } from '../utils/convenience_funcs';
import { getCoordData } from '../utils/geo_funcs';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.getLabelFontSize = this.getLabelFontSize.bind(this);
    this.state = {
      bounds: config.maxMapBounds,
      mapCenter: [0, 0],
      scrolled: 0,
      geoJSONData: [],
      zoomLevel: 4
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ geoJSONData: nextProps.subGeographyData.map(this.setGeoJSON) });
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    this.setState({ zoomLevel: e.target._zoom });
  }

  setGeoJSON(data) {
    let obj = {};
    const coords = data.coordinates.map(flatten);
    const coordData = getCoordData(coords);
    const bounds = [[
      coordData.minLat,
      coordData.minLong,
    ], [
      coordData.maxLat,
      coordData.maxLong,
    ]];

    if (coords.length > 1) {
      obj = {
        id: data.id,
        name: data.name,
        type: data.type,
        coordinates: coords,
        center: coordData.center,
        bounds: bounds
      };
    } else {
      obj = { ...data,
        id: data.id,
        center: coordData.center,
        bounds: bounds,
      };
    }
    return obj;
  }


  getLabelFontSize() {
    // 16px is base font size, and it should gradually increase
    // as the map zooms in.
    return 16 + (2 * Math.abs(4 - this.state.zoomLevel));
  }

  handleClick(e) {
    this.setState({ bounds: e.target.options.bounds });
    // Add `this.props.location.pathname` for relative navigation
    this.props.router.push(this.props.location.pathname + e.target.options.href);
  }

  render() {
    const geoJSONObjs = [];
    const labels = [];
    if (this.state.geoJSONData) {
      const self = this;
      this.state.geoJSONData.map(datum => {
        geoJSONObjs.push(
          <GeoJson
            key={`${datum.id}_${slugify(datum.name || '')}`}
            href={`/${datum.iso_code ? datum.iso_code : datum.id}`}
            data={datum}
            className={slugify(datum.name || '')}
            onClick={self.handleClick}
            center={datum.center}
            bounds={datum.bounds}
          />
        );
        if (datum.coordinates) {
          const icon = divIcon({
            className: 'leaflet-marker-icon',
            html: `<h1 style="font-size:${self.getLabelFontSize()}px"
                  class="leaflet-marker-icon__label
                  ${getNextGeography(self.props.currentGeography)}-${datum.id}">
                  ${datum.name}</h1>`
          });
          labels.push(
            <Marker
              key={datum.id}
              position={datum.center}
              icon={icon}
            />
          );
        }
        return datum;
      });
    }

    return (
      <Map
        bounds={this.state.bounds}
        zoom={this.state.zoomLevel}
        minZoom={3}
        maxBounds={config.maxMapBounds}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
      >
        <TileLayer
          url={`${config.mapboxURL}/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxAccessToken}`}
        />
        {geoJSONObjs}
        {labels}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  currentGeography: PropTypes.string.isRequired,
  currentGeographyId: PropTypes.string,
  subGeographyData: PropTypes.array,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(MapContainer);
