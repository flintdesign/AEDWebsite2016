import React, { Component } from 'react';
import { Map, TileLayer, Marker, getCenter, GeoJson } from 'react-leaflet';
import { divIcon, getZoom } from 'leaflet';

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.africaMaxBounds = this.africaMaxBounds.bind(this);
    this.state = {
      markerPosition: [0, 0],
      scrolled: 0,
      geoJSONData: []
    };
  }

  componentWillMount() {
    const self = this;
    const regionIds = [2, 3, 5];
    //const regionIds = [2, 3, 5, 6];
    regionIds.map(id => fetch(`/region/${id}/geojson_map.json`)
      .then(r => r.json())
      .then(d => {
        let obj = {};
        if (d.coordinates.length > 1) {
          obj = {
            id,
            type: d.type,
            coordinates: d.coordinates.map(self.flatten)
          };
        } else {
          obj = Object.assign(d, { id });
        }
        const dataObjs = self.state.geoJSONData;
        dataObjs.push(obj);
        return self.setState({ geoJSONData: dataObjs });
      })
    );
  }

  onZoomEnd(e) {
    /* eslint no-underscore-dangle: [0] */
    // e.target._zoom
  }

  getCenter(coords) {
    const lats = [];
    const longs = [];
    const data = coords[0][0];
    if (!data) {
      return [];
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i][1] && data[i][0]) {
        lats.push(data[i][1]); longs.push(data[i][0]);
      }
    }
    lats.sort((a, b) => a - b);
    longs.sort((a, b) => a - b);
    return [lats[lats.length / 2], longs[longs.length / 2]];
  }

  flatten(ary) {
    ary.reduce((a, b) => a.concat(b));
    return ary;
  }


  handleClick(e) {
    window.location = e.target.options.href;
  }

  africaMaxBounds() {
    return [
      [38.5730952, -20.8207639],
      [-40.7265232, 65.6147961]
    ];
  }

  regionMeta() {
    return {
      2: {
        className: 'central-africa',
        title: 'Central Africa',
        color: '#60D085'
      },
      3: {
        className: 'eastern-africa',
        title: 'Eastern Africa',
        color: '#6FD4F2'
      },
      5: {
        className: 'west-africa',
        title: 'West Africa',
        color: '#9DDC52'
      },
      6: {
        className: 'southern-africa',
        title: 'Southern Africa',
        color: '#75E7D1'
      }
    };
  }

  render() {
    /* eslint no-unused-vars: [0] */
    // const center = this.getCenter(this.state.data.coordinates);
    const icon = divIcon({
      className: 'leaflet-marker-icon',
      html: '<h1 class="leaflet-marker-icon__label">Hi, Jenna! Custom text</h1>'
    });
    let geoJSONObjs = [];
    if (this.state.geoJSONData) {
      const self = this;
      geoJSONObjs = this.state.geoJSONData.map((d) => <GeoJson
        key={d.id}
        href="http://google.com"
        data={d}
        className={self.regionMeta()[d.id].className}
      />);
    }
    return (
      <Map
        center={this.state.markerPosition}
        zoom={4}
        minZoom={4}
        maxBounds={this.africaMaxBounds()}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
      >
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {geoJSONObjs}
      </Map>
    );
  }
}
