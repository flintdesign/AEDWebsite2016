import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Map, TileLayer, Marker, GeoJson } from 'react-leaflet';
import { divIcon } from 'leaflet';
import config from '../config';
import { getCoordData, getLabelPosition } from '../utils/geo_funcs';
import keys from 'lodash.keys';
import {
  flatten,
  slugify,
  getNextGeography
} from '../utils/convenience_funcs';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.getLabelFontSize = this.getLabelFontSize.bind(this);
    this.state = {
      geoJSONData: [],
      geoJSONObjs: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.subGeographyData) return;
    this.setState({
      geoJSONData: nextProps.subGeographyData.map(this.setGeoJSON),
    });
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    this.setState({ zoomLevel: e.target._zoom });
  }

  setGeoJSON(data) {
    let obj = {};
    const coords = data.coordinates.map(flatten);
    const coordData = getCoordData(coords);

    if (coords.length > 1) {
      obj = {
        ...data,
        id: data.id,
        name: data.name,
        type: data.type,
        coordinates: coords,
        center: coordData.center,
        bounds: coordData.bounds
      };
    } else {
      obj = { ...data,
        id: data.id,
        center: coordData.center,
        bounds: coordData.bounds,
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
    const href = e.target.options.href;
    const currentPath = this.props.location.pathname;
    let newPath = '';
    if (location.pathname.indexOf(href) > -1) { return; }
    // Check to see if we are already at the input zone level,
    // if so replace the last segment with the new input zone segment
    // else add the new href to the end of the path
    if (this.props.location.pathname.split('/').length === 5) {
      const lastSegment = currentPath.substr(currentPath.lastIndexOf('/'));
      newPath = currentPath.replace(lastSegment, href);
    } else {
      newPath = currentPath + href;
    }
    this.props.router.push(newPath);
    this.props.cancelSearch();
  }


  render() {
    const geoJSONObjs = [];
    const labels = [];

    const rangeMarkup = keys(this.props.ranges).map(key => {
      let className = `range_geojson ${key}_geojson`;
      className += this.props.ui[key] ? ' show' : ' hide';
      return this.props.ranges[key].map((k, i) =>
        <GeoJson
          key={`range-${i}-${this.props.ui[key]}`}
          data={k}
          className={className}
        />
      );
    });

    if (this.state.geoJSONData) {
      const self = this;
      this.state.geoJSONData.map(datum => {
        let geoJSONClassName = slugify(datum.name || '');

        if (self.props.currentGeography === 'region') {
          geoJSONClassName =
            `${self.props.currentGeography}-${self.props.currentGeographyId}__country`;
        }

        if (self.props.currentGeography === 'country' && datum.region) {
          geoJSONClassName = `region-${slugify(datum.region)}__stratum`;
        }

        if (datum.coordinates && self.props.currentGeography === 'continent') {
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
              position={getLabelPosition(datum)}
              name={datum.name}
              icon={icon}
            />
          );
        }

        geoJSONObjs.push(
          <GeoJson
            key={`${datum.id}_${slugify(datum.name || '')}`}
            href={`/${slugify(datum.name)}`}
            data={datum}
            className={geoJSONClassName}
            onClick={self.handleClick}
            center={datum.center}
            bounds={datum.bounds}
          />
        );
        return datum;
      });
    }

    /* eslint max-len: [0] */
    const tileURL = `${config.mapboxURL}/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxAccessToken}`;

    return (
      <Map
        bounds={this.props.bounds}
        minZoom={4}
        maxBounds={config.maxMapBounds}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
        onClick={this.props.cancelSearch}
      >
        <TileLayer
          url={tileURL}
        />
        {rangeMarkup}
        {geoJSONObjs}
        {labels}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  currentGeography: PropTypes.string,
  currentGeographyId: PropTypes.string,
  subGeographyData: PropTypes.array,
  year: PropTypes.string.isRequired,
  cancelSearch: PropTypes.func,
  bounds: PropTypes.array,
  ui: PropTypes.object.isRequired,
  ranges: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

export default withRouter(MapContainer);
