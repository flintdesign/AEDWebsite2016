import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Map, TileLayer, Marker, GeoJson } from 'react-leaflet';
import { divIcon } from 'leaflet';
import config from '../config';
import { getCoordData } from '../utils/geo_funcs';
import find from 'lodash.find';
import keys from 'lodash.keys';
import filter from 'lodash.filter';
import flattenDeep from 'lodash.flattendeep';
import {
  getNextGeography,
  flatten,
  slugify,
  replaceURLPart,
  pluralize,
  //geoTypeFromHref
} from '../utils/convenience_funcs';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.getLabelFontSize = this.getLabelFontSize.bind(this);
    this.keyify = this.keyify.bind(this);
    this.state = {
      bounds: config.maxMapBounds,
      mapCenter: [0, 0],
      scrolled: 0,
      geoJSONData: [],
      zoomLevel: 4,
      geoJSONObjs: {
        regions: [],
        countries: [],
        strata: []
      }
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
    //this.props.openSidebar();
    this.setState({ bounds: e.target.options.bounds });
    this.props.router.push(e.target.options.href);
    // TODO: If a region was clicked, clear all countries and strata and redraw.
    // The clearSubGeoData() call below isn't working because it treats strata
    // in one region as countries of another region if you click on another
    // region. (╯°□°）╯︵ ┻━┻)
    //if (geoTypeFromHref(e) === 'region') {
      //this.clearSubGeoData();
    //}
  }

  clearSubGeoData() {
    const self = this;
    const regionsOnly = filter(self.state.geoJSONData, datum => datum.geoType === 'region');
    self.setState({
      geoJSONData: regionsOnly,
      geoJSONObjs: {
        regions: self.state.geoJSONObjs.regions,
        countries: [],
        strata: []
      }
    });
  }

  objInStateGeoJSONs(obj) {
    const arrays = flattenDeep(keys(this.state.geoJSONObjs).map(k => this.state.geoJSONObjs[k]));
    const key = this.keyify(obj);
    const found = find(arrays.map(val => val.key === key));
    return typeof found !== 'undefined';
  }


  keyify(datum) {
    return `${datum.id}_${slugify(datum.name || '')}`;
  }

  render() {
    const labels = [];
    if (this.state.geoJSONData) {
      const self = this;
      this.state.geoJSONData.map(datum => {
        let geoJSONClassName = slugify(datum.name || '');
        if (self.props.currentGeography === 'region') {
          geoJSONClassName =
            `${self.props.currentGeography}-${self.props.currentGeographyId}-country`;
        }
        const key = self.keyify(datum);
        const href = replaceURLPart(self.props.location.pathname, slugify(datum.name));
        if (!self.objInStateGeoJSONs(datum)) {
          self.state.geoJSONObjs[pluralize(getNextGeography(self.props.currentGeography))].push(
            <GeoJson
              key={key}
              href={href}
              data={datum}
              className={geoJSONClassName}
              onClick={self.handleClick}
              center={datum.center}
              bounds={datum.bounds}
            />
          );
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
              position={datum.center}
              icon={icon}
            />
          );
        }
        return datum;
      });
    }

    const geoJSONObjsForRender = flattenDeep(keys(this.state.geoJSONObjs)
      .map(k => this.state.geoJSONObjs[k]));

    return (
      <Map
        bounds={this.state.bounds}
        zoom={this.state.zoomLevel}
        minZoom={4}
        maxBounds={config.maxMapBounds}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
      >
        <TileLayer
          url={`${config.mapboxURL}/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxAccessToken}`}
        />
        {geoJSONObjsForRender}
        {labels}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  currentGeography: PropTypes.string.isRequired,
  currentGeographyId: PropTypes.string,
  subGeographyData: PropTypes.array,
  year: PropTypes.string.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object.isRequired,
  openSidebar: PropTypes.func.isRequired
};

export default withRouter(MapContainer);
