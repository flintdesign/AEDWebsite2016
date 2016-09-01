import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import {
  Map,
  TileLayer,
  Marker,
  GeoJson,
  // LayerGroup,
  ZoomControl,
  // Popup
} from 'react-leaflet';
import { divIcon, latLng, popup } from 'leaflet';
import config from '../config';
import { getCoordData, getLabelPosition } from '../utils/geo_funcs';
import { formatNumber } from '../utils/format_utils.js';
import keys from 'lodash.keys';
import {
  flatten,
  slugify,
  getNextGeography,
  replaceURLPart
} from '../utils/convenience_funcs';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleAdjacentClick = this.handleAdjacentClick.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.getLabelFontSize = this.getLabelFontSize.bind(this);
    this.state = {
      geoJSONData: [],
      geoJSONObjs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarState !== this.props.sidebarState) {
      this.realignMap();
    }
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

  realignMap(timing = 500, animate = true) {
    const self = this;
    setTimeout(() => {
      self.refs.map.leafletElement.invalidateSize(animate);
    }, timing);
  }

  handleClick(e) {
    if (!this.props.canInput) return;
    if (this.props.sidebarState === 0) {
      this.props.openSidebar();
    }
    this.refs.map.leafletElement.closePopup();
    const href = e.target.options.href;
    const currentPath = this.props.location.pathname;
    const newPath = replaceURLPart(currentPath, href);
    if (location.pathname.indexOf(href) > -1) { return; }
    this.props.router.push(newPath);
    this.props.cancelSearch();
  }

  handleAdjacentClick(e) {
    if (!this.props.canInput) return;
    // this.props.updateBounds(e.target.options.bounds);
    const href = e.target.options.href;
    this.props.router.replace(href);
    this.props.cancelSearch();
  }

  handleMouseout() {
    this.refs.map.leafletElement.closePopup();
  }

  handleMouseover(e) {
    const target = e.target;
    const {
      center,
      bounds,
      region,
      estimate,
      name,
      confidence
    } = target.options;
    const popupHtml = `<div class='stratum-popup__container'>
      <span class='stratum-popup__estimate-confidence'>
        ${estimate}<em>&nbsp;&plusmn;&nbsp;${confidence}</em>
      </span>
      <span class='stratum-popup__name'>
        ${name}
      </span>
      </div>`;
    popup({
      minWidth: 150,
      closeButton: false,
      autoPan: false,
      className: `stratum-popup stratum-popup--${region}`
    })
      .setLatLng(latLng(bounds[1][0], center[1]))
      .setContent(popupHtml)
      .openOn(this.refs.map.leafletElement);
  }

  render() {
    const geoJSONObjs = [];
    const geoJSONBorderObjs = [];
    const labels = [];
    const stratumLabels = [];
    const adjacentGeoJSONObjs = [];
    const selectedStratumObjs = [];
    // const popUps = [];
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
        if (datum.geoType === 'region' && datum.coordinates && self.props.routeGeography === 'continent' && self.props.currentGeography === 'continent') {
          const icon = divIcon({
            className: `leaflet-marker-icon ${slugify(datum.name)}`,
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
            />
          );
        }
        if (datum.geoType === 'stratum') {
          geoJSONObjs.push(
            <GeoJson
              key={`${datum.id}_${slugify(datum.name || '')}`}
              href={objectHref}
              data={datum}
              className={geoJSONClassName}
              onClick={self.handleClick}
              center={datum.center}
              bounds={datum.bounds}
              name={datum.name}
              region={slugify(datum.region)}
              estimate={formatNumber(datum.estimate)}
              confidence={formatNumber(datum.lcl95)}
              onMouseOver={self.handleMouseover}
              onMouseOut={self.handleMouseout}
            / >
          );
        } else {
          geoJSONObjs.push(
            <GeoJson
              key={`${datum.id}_${slugify(datum.name || '')}`}
              href={objectHref}
              data={datum}
              className={geoJSONClassName}
              onClick={self.handleClick}
              bounds={datum.bounds}
            />
          );
        }
        return datum;
      });
    }

    this.props.adjacentData.map(adjacent => {
      const slugifiedName = slugify(adjacent.name);
      const location = this.props.location.pathname;
      const currentPathParts = location.split('/');
      const rootPath = location.replace(currentPathParts[currentPathParts.length - 1], '');
      const adjacentHref = `${rootPath}${slugifiedName}`;
      let adjacentClass = `adjacent ${adjacent.geoType} adjacent--${slugifiedName}`;
      if (adjacent.region) {
        adjacentClass += ` adjacent--${adjacent.region}`;
      }
      if (slugifiedName !== currentPathParts[currentPathParts.length - 1]
        && slugifiedName !== currentPathParts[currentPathParts.length - 2]
        && slugifiedName !== 'north-africa' && slugifiedName !== 'sudan') {
        adjacentGeoJSONObjs.push(
          <GeoJson
            key={`${adjacent.id}_${slugifiedName}`}
            onClick={this.handleAdjacentClick}
            href={adjacentHref}
            data={adjacent}
            className={adjacentClass}
            bounds={adjacent.bounds}
          />
        );
      }
      return adjacent;
    });

    if (this.props.selectedStratum) {
      const stratum = this.props.selectedStratum;
      selectedStratumObjs.push(
        <GeoJson
          key={`/${slugify(stratum.name)}-${stratum.id}`}
          data={stratum}
          className={`region-${slugify(stratum.region)}__stratum active`}
        />
      );
    }

    if (this.props.border.coordinates && !this.props.loading && this.props.canInput) {
      let borderClass = '';
      if (this.props.params.region) {
        borderClass += `region--${this.props.params.region}`;
      }
      geoJSONBorderObjs.push(
        <GeoJson
          key={`border_${this.props.currentGeographyId}`}
          data={this.props.border}
          className={`border border--${this.props.currentGeographyId} border--${this.props.currentGeography} ${borderClass}`}
        />
      );
    }
    /* eslint max-len: [0] */
    const tileURL = `${config.mapboxURL}/tiles/256/{z}/{x}/{y}?access_token=${config.mapboxAccessToken}`;
    return (
      <Map
        bounds={this.props.bounds}
        minZoom={4}
        maxZoom={9}
        onZoomEnd={this.onZoomEnd}
        onClick={this.props.cancelSearch}
        ref="map"
        zoomControl={false}
      >
        <TileLayer url={tileURL} />
        <ZoomControl position={'bottomright'} />
        {this.props.canInput && rangeMarkup}
        {this.props.canInput && geoJSONBorderObjs}
        {this.props.canInput && geoJSONObjs}
        {this.props.canInput && adjacentGeoJSONObjs}
        {this.props.canInput && selectedStratumObjs}
        {this.props.canInput && labels}
        {stratumLabels}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  currentGeography: PropTypes.string,
  routeGeography: PropTypes.string,
  currentGeographyId: PropTypes.string,
  routeGeographyId: PropTypes.string,
  parentGeographyData: PropTypes.array,
  subGeographyData: PropTypes.array,
  adjacentData: PropTypes.array,
  year: PropTypes.string.isRequired,
  openSidebar: PropTypes.func,
  cancelSearch: PropTypes.func,
  updateBounds: PropTypes.func,
  bounds: PropTypes.array,
  border: PropTypes.object,
  loading: PropTypes.bool,
  canInput: PropTypes.bool,
  params: PropTypes.object,
  ui: PropTypes.object.isRequired,
  ranges: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  selectedStratum: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  sidebarState: PropTypes.number.isRequired
};

export default withRouter(MapContainer);
