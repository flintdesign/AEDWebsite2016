import React, { Component } from 'react';
import { Map, TileLayer, Marker, getCenter, GeoJson } from 'react-leaflet';
import { divIcon, getZoom } from 'leaflet';

export default class MapContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.getCenter = this.getCenter.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
    this.state = {
      markerPosition: [0, 0],
      scrolled: 0,
      data: {
        coordinates: [[]]
      }
    };
  }

  componentWillMount() {
    const self = this;
    fetch('/flat/map.json')
      .then(r => r.json())
      .then(d => self.setState({ data: d }));
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

  handleClick(e) {
    window.location = e.target.options.href;
  }

  render() {
    /* eslint no-unused-vars: [0] */
    const center = this.getCenter(this.state.data.coordinates);
    const icon = divIcon({
      className: 'my-div-icon',
      html: '<h1 class="leaflet-marker-icon__label">Hi, Jenna! Custom text</h1>'
    });
    return (
      <Map
        center={this.state.markerPosition}
        zoom={5}
        minZoom={4}
        maxBounds={[[38.5730952, -20.8207639], [-40.7265232, 65.6147961]]}
        maxZoom={12}
        onZoomEnd={this.onZoomEnd}
      >
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <GeoJson
          href="http://google.com"
          data={this.state.data}
          onClick={this.handleClick}
        />
        <Marker
          position={center}
          icon={icon}
        />
      </Map>
    );
  }
}
