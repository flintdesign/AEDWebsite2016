import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import {
  Map,
  TileLayer,
  Marker,
  GeoJson,
  // Popup
} from 'react-leaflet';
import { divIcon } from 'leaflet';
import config from '../config';
import { getCoordData, getLabelPosition } from '../utils/geo_funcs';
import keys from 'lodash.keys';
import {
  flatten,
  slugify,
  getNextGeography,
  replaceURLPart
} from '../utils/convenience_funcs';
import {
  CHANGE_MAP,
} from '../actions/app_actions';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
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
    return 14 + (2 * Math.abs(4 - this.state.zoomLevel));
  }

  getRangeMarkup(ranges, ui) {
    return keys(ranges).map(key => {
      let className = `range_geojson ${key}_geojson`;
      className += ui[key] ? ' show' : ' hide';
      return ranges[key].map((k, i) =>
        <GeoJson
          key={`range-${i}-${ui[key]}`}
          data={k}
          className={className}
        />
      );
    });
  }

  handleClick(e) {
    if (!this.props.canInput) return;
    const href = e.target.options.href;
    const currentPath = this.props.location.pathname;
    const newPath = replaceURLPart(currentPath, href);
    if (location.pathname.indexOf(href) > -1) { return; }
    this.props.router.push(newPath);
    this.props.cancelSearch();
    this.props.dispatch({ type: CHANGE_MAP, data: 'test' });
  }

  handleMouseout(e) {
    e.target.closePopup();
  }

  handleMouseover(e) {
    e.target.openPopup();
  }

  render() {
    const geoJSONObjs = [];
    // const geoJSONBorderObjs = [];
    const labels = [];
    const rangeMarkup = this.getRangeMarkup(this.props.ranges, this.props.ui);
    if (this.state.geoJSONData) {
      const self = this;
      this.state.geoJSONData.map(datum => {
        let geoJSONClassName = slugify(datum.name || '');
        let objectHref = `/${slugify(datum.name)}`;

        if (self.props.routeGeography === 'region') {
          geoJSONClassName =
            `region-${self.props.routeGeographyId}__country`;
        }

        if (self.props.routeGeography === 'country' && datum.region) {
          geoJSONClassName = `region-${slugify(datum.region)}__stratum`;
          objectHref = `/${slugify(datum.name)}-${datum.id}`;
        }

        if (datum.coordinates && self.props.routeGeography === 'continent' && self.props.currentGeography === 'continent') {
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
              href={objectHref}
              onClick={self.handleClick}
              onMouseOver={self.handleMouseover}
              onMouseOut={self.handleMouseout}
            />
          );
        }
        geoJSONObjs.push(
          <GeoJson
            key={`${datum.id}_${slugify(datum.name || '')}`}
            href={objectHref}
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
    // if (this.props.border.coordinates && !this.props.loading) {
    //   geoJSONBorderObjs.push(
    //     <GeoJson
    //       key={`border_${this.props.currentGeographyId}`}
    //       data={this.props.border}
    //       className={`border border--${this.props.currentGeographyId} border--${this.props.currentGeography}`}
    //     />
    //   );
    // }
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
  routeGeography: PropTypes.string,
  currentGeographyId: PropTypes.string,
  routeGeographyId: PropTypes.string,
  subGeographyData: PropTypes.array,
  year: PropTypes.string.isRequired,
  cancelSearch: PropTypes.func,
  bounds: PropTypes.array,
  // border: PropTypes.object,
  loading: PropTypes.bool,
  canInput: PropTypes.bool,
  params: PropTypes.object,
  ui: PropTypes.object.isRequired,
  ranges: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  selectedStratum: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default withRouter(MapContainer);
