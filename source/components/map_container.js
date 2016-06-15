import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { Map, TileLayer, Marker, GeoJson } from 'react-leaflet';
import { divIcon, getZoom } from 'leaflet';

class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.africaMaxBounds = this.africaMaxBounds.bind(this);
    this.getAverage = this.getAverage.bind(this);
    this.getLabelFontSize = this.getLabelFontSize.bind(this);
    this.state = {
      markerPosition: [0, 0],
      scrolled: 0,
      geoJSONData: [],
      zoomLevel: 4
    };
  }

  componentWillMount() {
    const self = this;
    const regionIds = [2, 3, 5];
    const headers = {
      Authorization: `Basic ${btoa('pachyderm:cop17')}`
    };
    // const regionIds = [2, 3, 5, 6];
    // regionIds.map(id => fetch(`http://staging.elephantdatabase.org/api/region/${id}/geojson_map`, { headers })
    regionIds.map(id => fetch(`/region/${id}/geojson_map.json`, { headers })
      .then(r => r.json())
      .then(d => self.setGeoJSON(d, id)));
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    this.setState({ zoomLevel: e.target._zoom });
  }

  setGeoJSON(data, id) {
    const self = this;
    let obj = {};
    if (data.coordinates.length > 1) {
      obj = {
        id,
        type: data.type,
        coordinates: data.coordinates.map(self.flatten)
      };
    } else {
      obj = Object.assign(data, { id });
    }
    const dataObjs = self.state.geoJSONData;
    dataObjs.push(obj);
    return self.setState({ geoJSONData: dataObjs });
  }

  getCenter(coords) {
    const lats = [];
    const longs = [];
    const self = this;
    let max = 0;
    // Iterate through the coords property of the geoJSON to find
    // the longest array. Some geoJSON objs can contain a deeply
    // nested array of coordinates if, for example, it's a country
    // that contains several islands off its coast.
    for (let i = 0; i < coords.length; i++) {
      if (coords[i].length > max) {
        max = coords[i];
      }
    }
    const iterable = max[0];
    for (let j = 0; j < iterable.length; j++) {
      lats.push(iterable[j][1]); longs.push(iterable[j][0]);
    }
    return [this.getAverage(lats), this.getAverage(longs)];
  }

  getAverage(ary) {
    return ary.reduce((prev, current) => prev + current) / ary.length;
  }

  getLabelFontSize() {
    // 16px is base font size, and it should gradually increase
    // as the map zooms in.
    return 16 + (2 * Math.abs(4 - this.state.zoomLevel));
  }

  africaMaxBounds() {
    return [
      [38.5730952, -20.8207639],
      [-40.7265232, 65.6147961]
    ];
  }

  flatten(ary) {
    ary.reduce((a, b) => a.concat(b));
    return ary;
  }

  handleClick(e) {
    this.props.router.push(e.target.options.href);
  }

  regionMeta() {
    return {
      2: {
        className: 'central-africa',
        title: 'Central Africa',
        color: '#60D085',
        href: '/2013/central-africa'
      },
      3: {
        className: 'eastern-africa',
        title: 'Eastern Africa',
        color: '#6FD4F2',
        href: '/2013/eastern-africa'
      },
      5: {
        className: 'west-africa',
        title: 'West Africa',
        color: '#9DDC52',
        href: '/2013/west-africa'
      },
      6: {
        className: 'southern-africa',
        title: 'Southern Africa',
        color: '#75E7D1',
        href: '/2013/southern-africa'
      }
    };
  }

  render() {
    /* eslint no-unused-vars: [0] */
    // const center = this.getCenter(this.state.data.coordinates);
    const geoJSONObjs = [];
    const labels = [];
    if (this.state.geoJSONData) {
      const self = this;
      this.state.geoJSONData.map((d) => {
        geoJSONObjs.push(
          <GeoJson
            key={d.id}
            href={self.regionMeta()[d.id].href}
            data={d}
            className={self.regionMeta()[d.id].className}
            onClick={self.handleClick}
          />
        );
        if (d.coordinates) {
          const coords = self.flatten(d.coordinates);
          const center = self.getCenter(coords);
          const icon = divIcon({
            className: 'leaflet-marker-icon',
            html: `<h1 style="font-size:${self.getLabelFontSize()}px"
                  class="leaflet-marker-icon__label">${self.regionMeta()[d.id].title}</h1>`
          });
          labels.push(
            <Marker
              key={d.id}
              position={center}
              icon={icon}
            />
          );
        }
        return d;
      });
    }

    return (
      <Map
        center={this.state.markerPosition}
        zoom={this.state.zoomLevel}
        minZoom={4}
        maxBounds={this.africaMaxBounds()}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/simmonsjenna/cioyjrwve0022bfnjvnq4syt9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2ltbW9uc2plbm5hIiwiYSI6ImNpb3lqcTR5OTAxdXZ1b204YTJ2NDU1YnkifQ.bkB3-GvA42q9QdG4n_7Onw"
        />
        {geoJSONObjs}
        {labels}
      </Map>
    );
  }
}

MapContainer.propTypes = {
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(MapContainer);
