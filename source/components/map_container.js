import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import {
  Map,
  TileLayer,
  Marker,
  GeoJson,
  ZoomControl,
  LayerGroup
} from 'react-leaflet';
import { divIcon, latLng, popup, Point } from 'leaflet';
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
    this.handleHover = this.handleHover.bind(this);
    this.handleHoverOut = this.handleHoverOut.bind(this);
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
    if (nextProps.selectedInputZone) {
      if (!this.props.selectedInputZone) {
        this.combineAndUpdateBounds(nextProps.selectedInputZone.geometries);
      } else {
        if (nextProps.selectedInputZone.id !== this.props.selectedInputZone.id) {
          const allCoords = nextProps.selectedInputZone.geometries.map(z => z.coordinates);
          const coordData = getCoordData(allCoords.map(flatten));
          this.props.updateBounds(coordData.bounds);
        }
      }
    }
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    this.setState({ zoomLevel: e.target._zoom });
  }

  setGeoJSON(data) {
    let obj = {};
    // temp //
    const coordinates = data.coordinates || data.geometries[0].coordinates;
    const coords = coordinates.map(flatten);
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
        type: data.type,
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

  combineAndUpdateBounds(geometries) {
    const allCoords = geometries.map(z => z.coordinates);
    const coordData = getCoordData(allCoords.map(flatten));
    this.props.updateBounds(coordData.bounds);
  }

  realignMap(timing = 1000, animate = true) {
    const self = this;
    setTimeout(() => {
      self.refs.map.leafletElement.invalidateSize(animate);
    }, timing);
  }

  handleClick(e) {
    if (!this.props.canInput) return;
    if (this.props.sidebarState === 0) this.props.openSidebar();
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
    const href = e.target.options.href;
    this.props.router.replace(href);
    this.props.cancelSearch();
  }

  handleHover(e) {
    const slug = e.target.options.slug;
    const panes = this.refs.map.leafletElement.getPanes();
    const marker = panes.markerPane.getElementsByClassName(slug);
    if (marker && marker.length) {
      marker[0].className += ' active';
    }
  }

  handleHoverOut(e) {
    const slug = e.target.options.slug;
    const panes = this.refs.map.leafletElement.getPanes();
    const marker = panes.markerPane.getElementsByClassName(slug);
    if (marker && marker.length) {
      marker[0].className = marker[0].className.replace(' active', '');
    }
  }

  handleMouseout() {
    this.refs.map.leafletElement.closePopup();
    const panes = this.refs.map.leafletElement.getPanes();
    const overlayPane = panes.overlayPane;
    const items = overlayPane.getElementsByClassName('is-input-zone');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  }

  handleMouseover(e) {
    const target = e.target;
    const {
      center,
      region,
      estimate,
      name,
      confidence
    } = target.options;
    const popupHtml = `<div class='stratum-popup__container'>
      <span class='stratum-popup__estimate-confidence hidden'>
        ${estimate}<em>&nbsp;&plusmn;&nbsp;${confidence}</em>
      </span>
      <span class='stratum-popup__name'>
        ${name}
      </span>
      </div>`;
    const popupPosition = latLng(center[0], center[1]);
    popup({
      minWidth: 150,
      closeButton: false,
      offset: new Point(0, -10),
      autoPan: true,
      autoPanPaddingTopLeft: new Point(20, 100),
      autoPanPaddingBottomRight: new Point(50, 50),
      className: `stratum-popup stratum-popup--${region}`
    })
      .setLatLng(popupPosition)
      .setContent(popupHtml)
      .openOn(this.refs.map.leafletElement);
    const geoType = e.target.options.geoType;
    if (geoType === 'input_zone') {
      const slug = e.target.options.slug;
      const panes = this.refs.map.leafletElement.getPanes();
      const overlayPane = panes.overlayPane;
      const items = overlayPane.getElementsByClassName(slug);
      for (let i = 0; i < items.length; i++) {
        items[i].classList.add('active');
      }
    }
  }

  render() {
    const geoJSONObjs = [];
    const geoJSONBorderObjs = [];
    const labels = [];
    const adjacentGeoJSONObjs = [];
    const selectedStratumObjs = [];
    const selectedInputZoneObjs = [];
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
        if (datum.geoType === 'input_zone') {
          geoJSONClassName = `region-${slugify(datum.region)}__stratum ${slugify(datum.name)} is-input-zone`;
          objectHref = `/${slugify(datum.name)}`;
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
              key={`${datum.id}_${slugify(datum.stratum || '')}`}
              href={objectHref}
              data={datum}
              className={geoJSONClassName}
              onClick={self.handleClick}
              center={datum.center}
              bounds={datum.bounds}
              name={datum.name}
              region={slugify(datum.region)}
              estimate={datum.estimate}
              confidence={formatNumber(datum.lcl95)}
              onMouseOver={self.handleMouseover}
              onMouseOut={self.handleMouseout}
            / >
          );
        } else if (datum.geoType === 'input_zone') {
          const datumCoords = datum.geometries.map(z => z.coordinates);
          const datumCoordData = getCoordData(datumCoords.map(flatten));
          geoJSONObjs.push(
            <GeoJson
              key={`${datum.id}_${slugify(datum.name || '')}`}
              href={objectHref}
              data={datum}
              className={geoJSONClassName}
              onClick={self.handleClick}
              center={datumCoordData.center}
              bounds={datumCoordData.bounds}
              name={datum.name}
              slug={slugify(datum.name)}
              region={slugify(datum.region)}
              estimate={datum.population_estimate}
              confidence={formatNumber(datum.percent_cl)}
              onMouseOver={self.handleMouseover}
              onMouseOut={self.handleMouseout}
              geoType={datum.geoType}
            />
          );
        } else if (datum.geoType === 'region') {
          geoJSONObjs.push(
            <GeoJson
              key={`${datum.id}_${slugify(datum.name || '')}`}
              href={objectHref}
              data={datum}
              className={geoJSONClassName}
              slug={slugify(datum.name)}
              onClick={self.handleClick}
              bounds={datum.bounds}
              onMouseOver={self.handleHover}
              onMouseOut={self.handleHoverOut}
            />
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
      const params = this.props.params;
      const currentPathParts = location.split('/');
      const rootPath = location.replace(currentPathParts[currentPathParts.length - 1], '');
      let adjacentHref = `${rootPath}${slugifiedName}`;
      if (adjacent.geoType === 'country') {
        adjacentHref = `/${params.year}/${adjacent.region}/${slugifiedName}`;
      }
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
      const stratumObjCoords = stratum.coordinates.map(flatten);
      const stratumObjCoordData = getCoordData(stratumObjCoords);
      selectedStratumObjs.push(
        <GeoJson
          key={`/${slugify(stratum.name)}-${stratum.id}`}
          data={stratum}
          className={`region-${slugify(stratum.region)}__stratum active`}
          center={stratumObjCoordData.center}
          bounds={stratumObjCoordData.bounds}
          name={stratum.name}
          region={slugify(stratum.region)}
          estimate={stratum.estimate}
          confidence={formatNumber(stratum.lcl95)}
          onMouseOver={this.handleMouseover}
          onMouseOut={this.handleMouseout}
        />
      );
    }

    if (this.props.selectedInputZone) {
      const zGeo = this.props.selectedInputZone;
      const allCoords = this.props.selectedInputZone.geometries.map(z => z.coordinates);
      const coordData = getCoordData(allCoords.map(flatten));
      if (zGeo) {
        selectedInputZoneObjs.push(
          <LayerGroup key={'/${slugify(zGeo.name)}-${zGeo.id}-input_zone-group'} ref="selectedZoneLayer">
            <GeoJson
              key={`/${slugify(zGeo.name)}-${zGeo.id}-input_zone`}
              data={zGeo}
              className={`region-${slugify(zGeo.region)}__stratum active active-zone`}
              onMouseOver={this.handleMouseover}
              onMouseOut={this.handleMouseout}
              center={coordData.center}
              bounds={coordData.bounds}
              name={zGeo.name}
              region={slugify(zGeo.region)}
              estimate={zGeo.population_estimate}
              confidence={formatNumber(zGeo.percent_cl)}
            />
          </LayerGroup>
        );
      }
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
        {rangeMarkup}
        {geoJSONBorderObjs}
        {this.props.canInput && geoJSONObjs}
        {this.props.canInput && adjacentGeoJSONObjs}
        {this.props.canInput && selectedInputZoneObjs}
        {this.props.canInput && selectedStratumObjs}
        {this.props.canInput && labels}
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
  selectedInputZone: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  sidebarState: PropTypes.number.isRequired
};

export default withRouter(MapContainer);
