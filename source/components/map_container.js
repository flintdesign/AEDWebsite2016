import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Map, TileLayer, Marker, GeoJson } from 'react-leaflet';
import { divIcon } from 'leaflet';
import config from '../config';
import { pluralize, getNextGeography, flatten } from '../utils/convenience_funcs';
import { getCoordData } from '../utils/geo_funcs';
import geoMeta from '../geometa';

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

  componentWillMount() {
    const self = this;
    const { currentGeography, currentGeographyId } = this.props;
    const nextGeo = getNextGeography(this.props.currentGeography);
    fetch(`${config.apiBaseURL}/${currentGeography}/${currentGeographyId}/${pluralize(nextGeo)}`)
      .then(r => r.json())
      .then(d => d.map(c => c.id))
      .then(ids => {
        ids.map(id => fetch(`${config.apiBaseURL}/${nextGeo}/${id}/geojson_map`)
          .then(r => r.json())
          .then(d => self.setGeoJSON(d, id)));
      });
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    this.setState({ zoomLevel: e.target._zoom });
  }

  setGeoJSON(data, id) {
    const self = this;
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
        id: id,
        type: data.type,
        coordinates: coords,
        center: coordData.center,
        bounds: bounds
      };
    } else {
      obj = { ...data,
        id: id,
        center: coordData.center,
        bounds: bounds
      };
    }
    const dataObjs = self.state.geoJSONData;
    dataObjs.push(obj);
    return self.setState({ geoJSONData: dataObjs });
  }


  getLabelFontSize() {
    // 16px is base font size, and it should gradually increase
    // as the map zooms in.
    return 16 + (2 * Math.abs(4 - this.state.zoomLevel));
  }

  handleClick(e) {
    this.setState({ bounds: e.target.options.bounds });
    this.props.router.push(e.target.options.href);
  }

  render() {
    const geoJSONObjs = [];
    const labels = [];
    if (this.state.geoJSONData) {
      const self = this;
      const nextGeo = getNextGeography(this.props.currentGeography);
      const gMeta = geoMeta[pluralize(nextGeo)];
      this.state.geoJSONData.map(datum => {
        geoJSONObjs.push(
          <GeoJson
            key={datum.id}
            href={gMeta[datum.id].href}
            data={datum}
            className={gMeta[datum.id].className}
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
                  ${gMeta[datum.id].title}</h1>`
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
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(MapContainer);
